import * as React from "react";
import {
	collection,
	doc,
	query,
	where,
	orderBy,
	getDocs,
	QuerySnapshot,
	DocumentData,
	updateDoc,
	serverTimestamp,
  } from "firebase/firestore";
//import in File 
import { FreeList } from '../../../models/FreeList';
import { useAlert } from '../../useAlert';
import {db,timestamp} from "../useFirebase";
import { Query } from '../../../models/router_query';
import { useRouter } from 'next/router';
import { useLoading } from '../../useLoading';
import { useAuth } from "../useUserAuth";

// create date at timestamp set 12:00
const day = new Date();
const y = day.getFullYear();
const m = day.getMonth();
const d = day.getDate();
let today = new Date(y, m, d, 12, 0, 0);
let today7 = new Date(y, m, d + 7, 12, 0, 0);

/** ========================
 * @returns 基盤作成
 * ========================*/
export const useReserves = () => {
	const [reserve,setReserve] = React.useState<FreeList[]>([])
	const baseQuery = (companyId) => {
		return query (
			collection(db, "FreeSpace"),
			where("reserved", "==", true),
			where("companyId","==",companyId),
		)
	};
	const baseLoading = (snapshot:QuerySnapshot<DocumentData>) => {
		const gotRsv = snapshot.docs.map((doc) => {
			const reserve = doc.data() as FreeList
			reserve.id = doc.id
			return reserve
		})
		setReserve(gotRsv)
	};
	return {baseQuery,baseLoading,reserve}
}
/** =======================
 * @returns 全ての予約
 * =======================*/
export const useReservesAll = () => {
	const {baseQuery,baseLoading,reserve} = useReserves();
	const {startLoading,completeLoading} = useLoading();
	const {showErrorMessage} = useAlert()
	const {user} = useAuth();
	const router = useRouter();
	const pageQuery = router.query as Query
	const loadRsvAll = async(companyId) =>  {
		if(user == undefined) {
			showErrorMessage("ログインしてください")
		} else {
			try {
				const snapshot = await getDocs(query(baseQuery(companyId),orderBy("time","asc")))
				baseLoading(snapshot)
			} catch (error) {
				console.error(error);
				showErrorMessage("読み取りに失敗しました")
			}
		}
	}
	React.useEffect(() => {
		if(user == undefined) {
			return
		}
		if(pageQuery?.id == undefined) {
			return
		};
		startLoading();
		loadRsvAll(pageQuery?.id).then(() => {
			setTimeout(() => completeLoading(),500)
		})
	},[pageQuery?.id])
	return {reserve,loadRsvAll}
}

/** ==========================
 * @returns 今日の予約
 * ==========================*/
export const useReserves_Today = () => {
	const {baseQuery,baseLoading,reserve} = useReserves();
	const {startLoading,completeLoading} = useLoading();
	const {showErrorMessage} = useAlert()
	const {user} = useAuth();
	const router = useRouter();
	const pageQuery = router.query as Query
    const loadRsv = async(companyId) => {
		if(user == undefined) {
			showErrorMessage("ログインしてください")
		} else {
			try {
				const snapshot = await getDocs(query(
					baseQuery(companyId),
					where("date","==",timestamp(today)),
					orderBy("time", "asc")
				));
				baseLoading(snapshot);
			} catch (error) {
				console.error(error);
				showErrorMessage("読み取りに失敗しました")
			}
		}
	}
	React.useEffect(() => {
		if(pageQuery?.id == undefined) {
			return
		};
		if(user == undefined) {
			return
		}
		startLoading();
		loadRsv(pageQuery?.id).then(() => {
			setTimeout(() => completeLoading(),500);
		});
	},[pageQuery?.id])
	return {reserve,loadRsv}
}
/** ==========================
 * @returns 1週間の予約
 * ==========================*/
export const useReserves_Week = () => {
	const {baseQuery,baseLoading,reserve} = useReserves();
	const {showErrorMessage} = useAlert()
	const {startLoading,completeLoading} = useLoading();
	const {user} = useAuth();
	const router = useRouter();
	const pageQuery = router.query as Query
	const loadRsv = async(companyId) => {
		if(user == undefined) {
			showErrorMessage("ログインしてください")
		} else {
			try {
				const snapshot = await getDocs(query(
					baseQuery(companyId),
					where("date",">=",timestamp(today)),
					where("date","<=",timestamp(today7)),
					orderBy("date", "asc"),
					orderBy("time", "asc")
				))
				baseLoading(snapshot);
			} catch (error) {
				console.error(error);
				showErrorMessage("読み取りに失敗しました");
			}
		}
	}
	React.useEffect(() => {
		if(pageQuery?.id == undefined) {
			return
		};
		startLoading();
		loadRsv(pageQuery?.id).then(() => {
			setTimeout(() => completeLoading(),500);
		});
	},[pageQuery?.id])
	return {reserve,loadRsv}
}

/** ==========================
 * @returns 予約登録
 * ==========================*/
export const useGetReserves = () => {
	const {user} = useAuth();
	const {baseQuery} = useReserves();
	const {showErrorMessage,showSuccessMessage} = useAlert()
	const router = useRouter();
	const getReserves = async(
		e:any,
		date:any,
		time:number,
		person:string,
		id:string,
		email:string,
		phoneNumber:number | string,
		reserver:string,
		companyId:string | number,
		userId:string,
	) => {
		e.preventDefault();
		if(user == undefined) {
			showErrorMessage("ログインしてください")
		} else {
			try {
				const snapshot = await getDocs(query(
					baseQuery(companyId),
					where("date","==",date),
					where("time","==",time),
					where("person","==",person)
				))
				if(snapshot.empty) {
					await updateDoc(doc(db, "FreeSpace", id), {
						person,
						reserved: true,
						reserverUid: userId,
						reserveAt: serverTimestamp(),
						email,
						phoneNumber,
						reserver,
					}).then(() => {
						showSuccessMessage("予約登録に成功しました")
						setTimeout(() => router.reload(),500); 
					})
				} else {
					showErrorMessage("既に同時間で予約済みです")
				}
			} catch (error) {
				console.error(error);
				showErrorMessage("読み取りに失敗しました")
			}
		}
	}
	return { getReserves }
}

/** ================================
 * @returns 予約キャンセル
 * ================================*/
export const useChancelRsv = () => {
	const {user} = useAuth();
	const {showErrorMessage,showSuccessMessage} = useAlert()
	const router = useRouter();
    const chancelRsv = async(e: any,id:string) =>{
		e.stopPropagation();
		if(user == undefined) {
			showErrorMessage("ログインしてください")
		} else {
			try {
				await updateDoc(doc(db, "FreeSpace", id), {
					reserved: false,
					person: "",
					reserverUid: "",
					reserver:"",
					chancelAt:serverTimestamp(),
				}).then(() => {
					showSuccessMessage("予約をキャンセルしました");
					setTimeout(() => router.reload(),500); 
				})
			} catch (error) {
				showErrorMessage("読み取りに失敗しました")
				console.error(error);
			}
		}
	}
	return {chancelRsv}
}
