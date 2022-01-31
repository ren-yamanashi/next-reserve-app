import {
  collection,
  doc,
  getDoc,
  getFirestore,
  Timestamp,
} from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, FormEvent } from "react";
//内部インポート
import { User } from "../../models/User";
import Reserve from "../../components/organisms/Reserves";
import Header from "../../components/templates/Header";
import { useAuth } from "../../hooks/useUserAuth";
import ReservesAll from "../../components/organisms/ReservesAll";

type Query = {
  uid: string;
};

export default function ReservePage() {
  const [user2, setUser] = useState<User>();
  const router = useRouter();
  const { user } = useAuth();
  const [test, setTest] = useState<string>("");
  const query = router.query as Query;

  useEffect(() => {
    if (query.uid === undefined) {
      return;
    }
    //Firebase からユーザーを取り出す
    async function loadUser() {
      const u = user;
      setTest(u.displayName);
      console.log(test);
      const db = getFirestore();
      const ref = doc(collection(db, "users"), query.uid);
      const UserDoc = await getDoc(ref);
      if (!UserDoc.exists()) {
        return;
      }
      const gotUser = UserDoc.data() as User;
      gotUser.uid = UserDoc.id;
      setUser(gotUser);
    }
    loadUser();
  }, [query.uid]);
  return (
    <>
      <Header />
      {test.indexOf("管理者") !== -1 ? <ReservesAll /> : <Reserve />}
    </>
  );
}
