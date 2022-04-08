import { atom,useRecoilState, useResetRecoilState } from 'recoil'
import {
	collection,
	getFirestore,
	doc,
	getDoc,
  } from "firebase/firestore";
  import { Users } from "../../../models/Users";
  import { useAuth } from '../../useUserAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
type Query = {
	id: string;
};
const initialUser:Users = null 
export const userState = atom({
	key:"user",
	default:initialUser
})

export function useSelectUser() {
	const {user} = useAuth()
	const [teacherName,setTeacherName] = useRecoilState(userState)
    const router = useRouter();
    const query_ = router.query as Query;
	function getCollections () {
		const db = getFirestore();
			return {
				db,
				userCollection: collection(db, "users"),
			};
	}
	async function loadSelectUser() {
		if (query_.id === undefined) {
			return;
		  }
		  const { userCollection } = getCollections();
		  const userDoc = await getDoc(doc(userCollection, query_.id));
		  if (!userDoc.exists()) {
			return;
		  }
		  const gotUser = userDoc.data() as Users;
		  gotUser.id = userDoc.id;
		  setTeacherName(gotUser);
	}
	useEffect(() => {
		if (!process.browser) {
			return;
		}
		if (user === null) {
			return;
		}
		loadSelectUser()
	},[process.browser,user])
	return {teacherName}
}


