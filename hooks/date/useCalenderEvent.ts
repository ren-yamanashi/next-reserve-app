import * as React  from "react";
import { useReservesAll } from "../firebase/manager/useReserves";
import dayjs from "dayjs";


// AllEvent
export const useCalenderEvent = () => {
	const { reserve } = useReservesAll();
	const formats = {
		dateFormat: "D",
		dayFormat: "D(ddd)",
		monthHeaderFormat: "YYYY/MM",
		dayHeaderFormat: "MM/DD(ddd)",
		dayRangeHeaderFormat: "YYYY/MM",
	  };
	const setEvent =
    reserve &&
    reserve.map((e) => {
      return {
        id: e.id,
        title: `${e.time}:00~ ${e.person}`,
        start: new Date(e.date.toDate().setHours(e.time)), 
        end: new Date(e.date.toDate().setHours(e.time + 1)),
        staff: e.staff,
        person: e.person,
        date: e.date,
        time:e.time,
        email:e.email,
        phoneNumber:e.phoneNumber,
        reserver:e.reserver
      };
    });
	return { setEvent,formats };
};