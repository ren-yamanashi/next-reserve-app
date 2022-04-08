import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { atom,useRecoilState } from 'recoil'
import { useEffect } from 'react'
import {
	getFirestore,
	collection,
	doc,
	getDoc,
	setDoc,
} from "firebase/firestore";
// import my File
import { User } from '../models/User';
// Create State Model
export const userState = atom<User | null>({
	key:'user',
	default:null,
})
async function CreateUserIfNotFound(user:User) {
	const db = getFirestore();
	const usersCollection = collection(db,"users")
	const userRef = doc(usersCollection,user.uid)
	const document = await getDoc(userRef)
	if(document.exists()) {
		return
	}
	try {
		await setDoc(userRef,{
			userName:user.displayName,
			email:user.email,
			id:user.uid,
		})
	}catch(error){
		console.error(error);
		window.alert("ユーザー情報の取得に失敗しました")
	}
	
}

export function useAuth() {
	const [user,setUser] = useRecoilState(userState);
	useEffect(() => {
		if(user !== null) {
			return
		}
		const auth = getAuth()
		//認証終了後...
		onAuthStateChanged(auth,function(firebaseUser) {
			if(firebaseUser) {
				const loginUser:User = {
					uid:firebaseUser.uid,
					displayName:firebaseUser.displayName,
					email:firebaseUser.email,
					photoURL:firebaseUser.photoURL
				}
				setUser(loginUser)
				CreateUserIfNotFound(loginUser)
			}else{
				setUser(null)
			}
		})
	},[user])
	return {user}
}
