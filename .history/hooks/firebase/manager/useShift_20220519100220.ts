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
	deleteDoc,
  } from "firebase/firestore";
//import in File 
import { FreeList } from '../../../models/FreeList';
import { useDate } from '../../date/useDate';
import {useAlert} from "../../useAlert";
import { timestamp,db } from "../useFirebase"; 
import { Query } from '../../../models/router_query';
import { useRouter } from 'next/router';
import { useLoading } from '../../useLoading';
import {useAuth} from "../useUserAuth"


/** =========================
 * @returns 基盤作成
 * =========================*/
export const useFreeSpace = () => {
	const [freeSpaces,setFreeSpaces] = React.useState<FreeList[]>([])
	const baseQuery = (companyId) => {
		return query (
			collection(db, "FreeSpace"),
			where("companyId","==",companyId),
		)
	}
	const baseLoading = (snapshot:QuerySnapshot<DocumentData>) => {
		const gotFreeSpace = snapshot.docs.map((doc) => {
			const freeSpace = doc.data() as FreeList
			freeSpace.id = doc.id
			return freeSpace
		})
		setFreeSpaces(gotFreeSpace)
	}
	return {baseQuery,baseLoading,freeSpaces}
}

/** =============================
 * @returns 指定日のシフト
 * =============================*/
export const useFreeSpace_newValue = () => {
	const user = useAuth()
	const router = useRouter();
	const pageQuery = router.query as Query;
	const {baseQuery,baseLoading,freeSpaces} = useFreeSpace();
	const {showErrorMessage} = useAlert()
	const {newDateTime} = useDate();
	const {startLoading,completeLoading} = useLoading();
	const loadFreeSpace_newValue = async(date,companyId) => {
		if(user == undefined) {
			showErrorMessage("ログインしてください")
		} else {
			try {
				const snapshot = await getDocs(query(
					baseQuery(companyId),
					where("date", "==", timestamp(date)),
					orderBy("time", "asc")
				)) 
				baseLoading(snapshot)
			} catch (error) {
				console.error(error);
				showErrorMessage("読み取りに失敗しました")
			}
		}
	}
	React.useEffect(() => {
		if(pageQuery?.id == undefined) {
			return;
		}
		if(user == undefined) {
			return;
		}
		startLoading();
		loadFreeSpace_newValue(newDateTime,pageQuery?.id).then(() => {
			setTimeout(() => completeLoading(),500);
		})
	},[pageQuery?.id]);
	return {freeSpaces,loadFreeSpace_newValue}
}

/** =============================
 * @returns 指定日の予約可能シフト
 * =============================*/
export const useShiftList_newDate = () => {
	const router = useRouter();
	const pageQuery = router.query as Query
	const user = useAuth()
	const {baseQuery,baseLoading,freeSpaces} = useFreeSpace();
	const {showErrorMessage} = useAlert()
	const {startLoading,completeLoading} = useLoading();
	const {newDateTime} = useDate();
	const loadShift = async (date,companyId)  => {
		if(user == undefined) {
			showErrorMessage("ログインしてください")
		} else {
			try {
			const snapshot = await getDocs(query(
				baseQuery(companyId),
				where("reserved", "==", false),
				where("date", "==", timestamp(date)),
				orderBy("time", "asc")
			));
			baseLoading(snapshot)
		} catch (error) {
			console.error(error);
			showErrorMessage("読み取りに失敗しました");
		}
		}
		
	}
	React.useEffect(() => {
		if(pageQuery?.id == undefined) {
			return;
		}
		if(user == undefined) {
			return;
		}
		startLoading();
		loadShift(newDateTime,pageQuery?.id).then(() => {
			setTimeout(() => completeLoading(),500);
		})
	},[pageQuery?.id]);
	return {freeSpaces,loadShift}
}

/** ============================
 * @returns FreeSpaceドキュメント削除
 * ============================*/
export const useDeleteFreeSpace = () => {
	const {showErrorMessage,showSuccessMessage} = useAlert();
	const router = useRouter();
	const deleteShift = async (e:any,id:string) => {
		e.stopPropagation();
		try {
			await deleteDoc(doc(db, "FreeSpace", id))
			showSuccessMessage("シフトを削除しました");
			setTimeout(() => router.reload(),500);
		} catch (error) {
			console.error(error);
			showErrorMessage("読み取りに失敗しました");
		}
	}
	return {deleteShift}
}