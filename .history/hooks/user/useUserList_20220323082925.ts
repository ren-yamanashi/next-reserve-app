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
	startAt,
	endAt,
	where,
	orderBy,
	getDocs,
	QuerySnapshot,
	DocumentData,
	limit,
  } from "firebase/firestore";
//import in File 
import { Users } from '../../models/Users';
import { useAuth } from '../useUserAuth';
//create state use atom
const initialFreeSpace : Users[] = []
const initialError : boolean = false
export const SpaceState = atom({
	key:"users",
	default:initialFreeSpace,
})
export const errState = atom({
	key:"error",
	default:initialError,
})
// getFireStore 
const db = getFirestore()

export function useUsers() {
	const [usersList,setUsersList] = useRecoilState(SpaceState)
	function baseQuery() {
		return query (
			collection(db,"users"),
			where("role","==","student"),
		)
	}
	function baseLoading(snapshot:QuerySnapshot<DocumentData>) {
		const gotUsers = snapshot.docs.map((doc) => {
			const students = doc.data() as Users
			students.id = doc.id
			return students
 		})
		 setUsersList(gotUsers)
	}
	return {baseQuery,baseLoading,usersList}
 }

export function useUserList() {
	const {baseQuery,baseLoading,usersList} = useUsers();
	const {user} = useAuth();
	async function loadUsers() {
		const snapshot = await getDocs(query(baseQuery(),limit(8)));
		if(snapshot.empty) {
			return
		}
		baseLoading(snapshot)
	}
	useEffect(() => {
		if (!process.browser) {
		  return;
		}
		if (user === null) {
		  return;
		}
		loadUsers();
	  }, [process.browser, user]);
	return {loadUsers,usersList}
}
export function useSearchStudent() {
	const {baseLoading,baseQuery,usersList} = useUsers();
	async function loadSearchStudent(student) {
		const snapshot = await getDocs(query(baseQuery(),orderBy("userName"),startAt(student),endAt(student + "\uf8ff")));
		if(snapshot.empty) {
			return
		}
		baseLoading(snapshot)
	}
	return{loadSearchStudent,usersList}
}