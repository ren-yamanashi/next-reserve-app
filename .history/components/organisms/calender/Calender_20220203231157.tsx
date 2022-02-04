import {
  collection,
  getFirestore,
  orderBy,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { browser } from "process";
import React, { useState, Component, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment, { now } from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Box from "@mui/material/Box";
import Toolbar from "react-big-calendar";
import Button from "@mui/material/Button";
//内部インポート
import Header from "../../templates/Header";
import { FreeList } from "../../../models/FreeList";
import { useAuth } from "../../../hooks/useUserAuth";
import { toDate } from "date-fns/esm";
import Title from "../../atoms/Title";
import { useRouter } from "next/router";
import events from "../../../hooks/useEvents";

moment.locale("ja");

export default function Calendar1() {
  const db = getFirestore();
  const [freeLists, setFreeLists] = useState<FreeList[]>([]);
  const [eventsData, setEventsData] = useState(events);
  const [test, setTest] = useState<string>("");
  const { user } = useAuth();
  const localizer = momentLocalizer(moment);
  const router = useRouter();
  const formats = {
    dateFormat: "D日",
    dayFormat: "D(ddd)日",
    monthHeaderFormat: "YYYY年M月",
    dayHeaderFormat: "M月D日(ddd)",
    dayRangeHeaderFormat: "YYYY年M月",
  };

  useEffect(() => {
    if (!process.browser) {
      return;
    }
    if (user === null) {
      return;
    }
    async function loadFree() {
      const u = user;
      setTest(u.displayName);
      const q = query(
        collection(db, "FreeSpace"),
        where("senderUid", "==", user.uid),
        where("reserved", "==", true),
        orderBy("time")
      );
      const snapshot = await getDocs(q);
      //FreeList一覧の展開
      const gotFreeList = snapshot.docs.map((doc) => {
        const free = doc.data() as FreeList;
        free.id = doc.id;
        return free;
      });
      setFreeLists(gotFreeList);
    }
    loadFree();
  }, [process, browser, user]);
  // const handleSelect = ({ start, end }) => {
  //   const title = window.prompt("New Event name");
  //   if (title)
  //     setEventsData([
  //       ...eventsData,
  //       {
  //         start,
  //         end,
  //         title,
  //         id: null,
  //       },
  //     ]);
  // };
  const setEvent = freeLists.map((e) => {
    // console.log(e.date);
    return {
      id: e.id,
      title: e.student,
      start: new Date(e.date.toDate().setHours(e.time)), //これだとできる
      // start:new Date (e.date), //これだとエラーになる ※dateはタイムスタンプ型
      end: new Date(e.date.toDate().setHours(e.time + 1)),
    };
  });
  // const setEvent2 = [
  //   {
  //     id: 1,
  //     title: "今日",
  //     start: new Date(new Date().setHours(new Date().getHours() - 3)),
  //     end: new Date(new Date().setHours(new Date().getHours() + 3)),
  //   },
  //   {
  //     id: 2,
  //     title: "テストイベント",
  //     start: new Date(),
  //     end: new Date(),
  //   },
  // ];

  return (
    <>
      <React.Fragment>
        <Box ml={5} mb={3}>
          <Title>予約カレンダー</Title>
        </Box>
        {test.indexOf("管理者") !== -1 && (
          <Box ml={3}>
            <Button onClick={() => router.push(`/shift/all/${user.uid}`)}>
              予約登録一覧を見る
            </Button>
          </Box>
        )}
        <Box m={5}>
          <Calendar
            views={["day", "week", "month"]}
            selectable
            localizer={localizer}
            defaultDate={new Date()}
            defaultView="month"
            events={setEvent}
            style={{ height: "90vh" }}
            onSelectEvent={(event) => router.push(`/reserve/edit/${event.id}`)}
            formats={formats}
            // onSelectSlot={handleSelect}
          />
        </Box>
      </React.Fragment>
    </>
  );
}
