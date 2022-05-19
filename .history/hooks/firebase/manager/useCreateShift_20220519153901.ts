import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { useDate } from "../../date/useDate";
import { useAlert  } from "../../useAlert";
import { timestamp,db } from "../useFirebase"; 
import { useRouter } from "next/router";
import { useAuth } from "../useUserAuth";
// シフト登録
export const useCreateShift = () => {
	const router = useRouter();
	const {user} = useAuth()
	const {showErrorMessage,showSuccessMessage} = useAlert()
	const {newDateTime} = useDate();
	const createShift = async(e,staffName,time,id,companyId,load?) => {
		const q = query(
			collection(db,"FreeSpace"),
			where("companyId","==",companyId),
			where("staff","==",staffName),
			where("time","==",time),
			where("date","==",timestamp(newDateTime))
		)
		const snapshot = await getDocs(q);
		if(user == null) {
			showErrorMessage("ログインしてください");
		} else {
			if(snapshot.empty) {
			e.preventDefault();
			try {
				await addDoc(collection(db,"FreeSpace"),{
					staff: staffName,
					senderUid: id,
					person: "",
					date: timestamp(newDateTime),
					reserved: false,
					time:time,
					createAt: serverTimestamp(),
					companyId
				});
				showSuccessMessage("シフトを登録しました");
				load !== 1 && setTimeout(() => router.reload(),500);
			} catch (error) {
				console.log(error);
				showErrorMessage("読み取りに失敗しました");
			};
		} else {
			showErrorMessage("既に同時間で提出済みです");
		};
		}
		
	};
	return {createShift};
}