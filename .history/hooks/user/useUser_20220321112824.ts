//import notIn File
import { getAuth, onAuthStateChanged,sendPasswordResetEmail, signInAnonymously } from 'firebase/auth'
import { atom,useRecoilState } from 'recoil'
import { useEffect, useState } from 'react'
import {
	getFirestore,
	collection,
	doc,
	getDoc,
	setDoc,
	Timestamp,
	query,
	where,
	orderBy,
	getDocs,
	QuerySnapshot,
	DocumentData,
	limit,
  } from "firebase/firestore";
//import in File 
import { User } from '../../models/User';
import { FreeList } from '../../models/FreeList';
import { useAuth } from '../useUserAuth';
import {CreateQuery} from '../useQuery';
import { browser } from 'process';
import { Users } from '../../models/Users';

//create state use atom
const initialUser : Users[] = []
const initialError : boolean = false
export const userState = atom({
	key:"user",
	default:initialUser,
})
export const errState = atom({
	key:"error",
	default:initialError,
})
// getFireStore 
const db = getFirestore()

/**===================================
 * @returns Create Base hooks
 *===================================*/
export function useUser() {
	const [usersList,setUsersList] = useRecoilState(userState)
	/**====================
	 * @returns Create Base Query
	 *====================*/
	function baseQuery() {
		return query (
			collection(db, "users"),
			where("role", "==", "student"),
		)
	}
	/**=====================
	 * * @returns Create Base Loading
	 *====================*/
	function baseLoading(snapshot:QuerySnapshot<DocumentData>) {
		const gotUsers = snapshot.docs.map((doc) => {
			const us = doc.data() as Users
			us.id = doc.id
			return us
		})
		setUsersList(gotUsers)
	}
	return {baseQuery,baseLoading,usersList}
}

export function useUsersList() {
	const [usersList,setUsersList] = useRecoilState(userState)
	async function loadUsersList() {
		const q = query(
		  collection(db, "users"),
		  where("role", "==", "student"),
		  limit(10)
		);
		const snapshot = await getDocs(q);
		const gotUser = snapshot.docs.map((doc) => {
		  const user = doc.data() as Users;
		  user.id = doc.id;
		  return user;
		});
		setUsersList(gotUser);
	}
	return{usersList,loadUsersList}
}