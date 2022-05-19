//import notIn File
import * as React from "react";
import {
  collection,
  query,
  where,
  getDocs,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
//import in File
import { FreeList } from "../../../models/FreeList";
import { useAuth } from "../useUserAuth";
import { db, timestamp } from "../useFirebase";
import { useSelectUser_query } from "../user/useUserList";
import { useRouter } from "next/router";
import { Query } from "../../../models/router_query";
import { useDate } from "../../date/useDate";
import { useLoading } from "../../useLoading";

export const useSchedule = () => {
  const router = useRouter();
  const pageQuery = router.query as Query
  const { user } = useAuth();
  const { user_query } = useSelectUser_query();
  const {newDateTime} = useDate();
  const {startLoading,completeLoading} = useLoading();
  // ここはオブジェクトにしない　※array.push()で上書きされるため
  const [rsv1, setRsv1] = React.useState<FreeList[]>([]);
  const [rsv2, setRsv2] = React.useState<FreeList[]>([]);
  const [rsv3, setRsv3] = React.useState<FreeList[]>([]);
  const [rsv4, setRsv4] = React.useState<FreeList[]>([]);
  const [rsv5, setRsv5] = React.useState<FreeList[]>([]);
  const [rsv6, setRsv6] = React.useState<FreeList[]>([]);
  const [rsv7, setRsv7] = React.useState<FreeList[]>([]);
  const [rsv8, setRsv8] = React.useState<FreeList[]>([]);
  const [rsv9, setRsv9] = React.useState<FreeList[]>([]);
  const [rsv10, setRsv10] = React.useState<FreeList[]>([]);
  const [rsv11, setRsv11] = React.useState<FreeList[]>([]);
  const [rsv12, setRsv12] = React.useState<FreeList[]>([]);
  const [rsv13, setRsv13] = React.useState<FreeList[]>([]);
  const [rsv14, setRsv14] = React.useState<FreeList[]>([]);
  const [rsv15, setRsv15] = React.useState<FreeList[]>([]);
  const [rsv16, setRsv16] = React.useState<FreeList[]>([]);
  const [rsv17, setRsv17] = React.useState<FreeList[]>([]);
  const [rsv18, setRsv18] = React.useState<FreeList[]>([]);
  const [rsv19, setRsv19] = React.useState<FreeList[]>([]);
  const [rsv20, setRsv20] = React.useState<FreeList[]>([]);
  const [rsv21, setRsv21] = React.useState<FreeList[]>([]);
  const [rsv22, setRsv22] = React.useState<FreeList[]>([]);
  const [rsv23, setRsv23] = React.useState<FreeList[]>([]);
  const [rsv24, setRsv24] = React.useState<FreeList[]>([]);
  const rsvArr = [];
  const baseQuery = (dateTime, companyId) => {
    return query(
      collection(db, "FreeSpace"),
      where("companyId", "==", companyId),
      where("date", "==", timestamp(dateTime))
    );
  };
  const baseLoading = (
    snapshot: QuerySnapshot<DocumentData>,
    number: number
  ) => {
    const gotFreeList = snapshot.docs.map((doc) => {
      const free = doc.data() as FreeList;
      free.id = doc.id;
      return free;
    });
    number == 1 && setRsv1(gotFreeList);
    number == 2 && setRsv2(gotFreeList);
    number == 3 && setRsv3(gotFreeList);
    number == 4 && setRsv4(gotFreeList);
    number == 5 && setRsv5(gotFreeList);
    number == 6 && setRsv6(gotFreeList);
    number == 7 && setRsv7(gotFreeList);
    number == 8 && setRsv8(gotFreeList);
    number == 9 && setRsv9(gotFreeList);
    number == 10 && setRsv10(gotFreeList);
    number == 11 && setRsv11(gotFreeList);
    number == 12 && setRsv12(gotFreeList);
    number == 13 && setRsv13(gotFreeList);
    number == 14 && setRsv14(gotFreeList);
    number == 15 && setRsv15(gotFreeList);
    number == 16 && setRsv16(gotFreeList);
    number == 17 && setRsv17(gotFreeList);
    number == 18 && setRsv18(gotFreeList);
    number == 19 && setRsv19(gotFreeList);
    number == 20 && setRsv20(gotFreeList);
    number == 21 && setRsv21(gotFreeList);
    number == 22 && setRsv22(gotFreeList);
    number == 23 && setRsv23(gotFreeList);
    number == 24 && setRsv24(gotFreeList);
  };
  const loadScheduleAll = async (newDate, companyId) => {
    const loadSchedule1 = async () => {
      const snapshot = await getDocs(
        query(baseQuery(newDate, companyId), where("time", "==", 1))
      );
      baseLoading(snapshot, 1);
    };
    const loadSchedule2 = async () => {
      const snapshot = await getDocs(
        query(baseQuery(newDate, companyId), where("time", "==", 2))
      );
      baseLoading(snapshot, 2);
    };
    const loadSchedule3 = async () => {
      const snapshot = await getDocs(
        query(baseQuery(newDate, companyId), where("time", "==", 3))
      );
      baseLoading(snapshot, 3);
    };
    const loadSchedule4 = async () => {
      const snapshot = await getDocs(
        query(baseQuery(newDate, companyId), where("time", "==", 4))
      );
      baseLoading(snapshot, 4);
    };
    const loadSchedule5 = async () => {
      const snapshot = await getDocs(
        query(baseQuery(newDate, companyId), where("time", "==", 5))
      );
      baseLoading(snapshot, 5);
    };
    const loadSchedule6 = async () => {
      const snapshot = await getDocs(
        query(baseQuery(newDate, companyId), where("time", "==", 6))
      );
      baseLoading(snapshot, 6);
    };
    const loadSchedule7 = async () => {
      const snapshot = await getDocs(
        query(baseQuery(newDate, companyId), where("time", "==", 7))
      );
      baseLoading(snapshot, 7);
    };
    const loadSchedule8 = async () => {
      const snapshot = await getDocs(
        query(baseQuery(newDate, companyId), where("time", "==", 8))
      );
      baseLoading(snapshot, 8);
    };
    const loadSchedule9 = async () => {
      const snapshot = await getDocs(
        query(baseQuery(newDate, companyId), where("time", "==", 9))
      );
      baseLoading(snapshot, 9);
    };
    const loadSchedule10 = async () => {
      const snapshot = await getDocs(
        query(baseQuery(newDate, companyId), where("time", "==", 10))
      );
      baseLoading(snapshot, 10);
    };
    const loadSchedule11 = async () => {
      const snapshot = await getDocs(
        query(baseQuery(newDate, companyId), where("time", "==", 11))
      );
      baseLoading(snapshot, 11);
    };
    const loadSchedule12 = async () => {
      const snapshot = await getDocs(
        query(baseQuery(newDate, companyId), where("time", "==", 12))
      );
      baseLoading(snapshot, 12);
    };
    const loadSchedule13 = async () => {
      const snapshot = await getDocs(
        query(baseQuery(newDate, companyId), where("time", "==", 13))
      );
      baseLoading(snapshot, 13);
    };
    const loadSchedule14 = async () => {
      const snapshot = await getDocs(
        query(baseQuery(newDate, companyId), where("time", "==", 14))
      );
      baseLoading(snapshot, 14);
    };
    const loadSchedule15 = async () => {
      const snapshot = await getDocs(
        query(baseQuery(newDate, companyId), where("time", "==", 15))
      );
      baseLoading(snapshot, 15);
    };
    const loadSchedule16 = async () => {
      const snapshot = await getDocs(
        query(baseQuery(newDate, companyId), where("time", "==", 16))
      );
      baseLoading(snapshot, 16);
    };
    const loadSchedule17 = async () => {
      const snapshot = await getDocs(
        query(baseQuery(newDate, companyId), where("time", "==", 17))
      );
      baseLoading(snapshot, 17);
    };
    const loadSchedule18 = async () => {
      const snapshot = await getDocs(
        query(baseQuery(newDate, companyId), where("time", "==", 18))
      );
      baseLoading(snapshot, 18);
    };
    const loadSchedule19 = async () => {
      const snapshot = await getDocs(
        query(baseQuery(newDate, companyId), where("time", "==", 19))
      );
      baseLoading(snapshot, 19);
    };
    const loadSchedule20 = async () => {
      const snapshot = await getDocs(
        query(baseQuery(newDate, companyId), where("time", "==", 20))
      );
      baseLoading(snapshot, 20);
    };
    const loadSchedule21 = async () => {
      const snapshot = await getDocs(
        query(baseQuery(newDate, companyId), where("time", "==", 21))
      );
      baseLoading(snapshot, 21);
    };
    const loadSchedule22 = async () => {
      const snapshot = await getDocs(
        query(baseQuery(newDate, companyId), where("time", "==", 22))
      );
      baseLoading(snapshot, 22);
    };
    const loadSchedule23 = async () => {
      const snapshot = await getDocs(
        query(baseQuery(newDate, companyId), where("time", "==", 23))
      );
      baseLoading(snapshot, 23);
    };
    const loadSchedule24 = async () => {
      const snapshot = await getDocs(
        query(baseQuery(newDate, companyId), where("time", "==", 24))
      );
      baseLoading(snapshot, 24);
    };
    loadSchedule1();
    loadSchedule2();
    loadSchedule3();
    loadSchedule4();
    loadSchedule5();
    loadSchedule6();
    loadSchedule7();
    loadSchedule8();
    loadSchedule9();
    loadSchedule10();
    loadSchedule11();
    loadSchedule12();
    loadSchedule13();
    loadSchedule14();
    loadSchedule15();
    loadSchedule16();
    loadSchedule17();
    loadSchedule18();
    loadSchedule19();
    loadSchedule20();
    loadSchedule21();
    loadSchedule22();
    loadSchedule23();
    loadSchedule24();
  };
  {
    user_query?.times.map((time) => {
      rsvArr.push(
        time == 1
          ? rsv1
          : time == 2
          ?rsv2
          : time == 3
          ?rsv3
          : time == 4
          ?rsv4
          : time == 5
          ?rsv5
          : time == 6
          ?rsv6
          : time == 7
          ?rsv7
          : time == 8
          ?rsv8
          : time == 9
          ?rsv9
          : time == 10
          ?rsv10
          : time == 11
          ?rsv11
          : time == 12
          ?rsv12
          : time == 13
          ?rsv13
          : time == 14
          ?rsv14
          : time == 15
          ?rsv15
          : time == 16
          ?rsv16
          : time == 17
          ?rsv17
          : time == 18
          ?rsv18
          : time == 19
          ?rsv19
          : time == 20
          ?rsv20
          : time == 21
          ?rsv21
          : time == 22
          ?rsv22
          : time == 23
          ?rsv23
          : time == 24 && rsv24
      );
    });
  }
  React.useEffect(() => {
    if(pageQuery == null ){
      return;
    }
    if(user == undefined) {
      return
    }
    startLoading();
    loadScheduleAll(newDateTime, pageQuery?.id).then(() => {
      setTimeout(() => completeLoading(),500);
    });
  }, [pageQuery?.id]);
  return { loadScheduleAll, rsvArr };
};
