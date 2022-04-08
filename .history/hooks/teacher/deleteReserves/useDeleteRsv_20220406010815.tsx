import * as React from "react";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { atom, useRecoilState } from "recoil";
//import in File
import { useDate } from "../../date/useDate";
import { useSchedule } from "../reserves/useReserves";

const initialError: boolean = false;
export const errState = atom({
  key: "error",
  default: initialError,
});
/**==========================
 * @returns Create hooks
 *==========================*/
export function useDeleteShift() {
  const db = getFirestore();
  const [deleteShiftError, setDeleteShiftError] = useRecoilState(errState);
  const { dateValue } = useDate();
  const {
    loadSchedule,
    loadSchedule10,
    loadSchedule11,
    loadSchedule12,
    loadSchedule13,
    loadSchedule14,
    loadSchedule15,
    loadSchedule16,
    loadSchedule17,
    loadSchedule18,
  } = useSchedule();
  const day = new Date(dateValue);
  const y = day.getFullYear();
  const m = day.getMonth();
  const d = day.getDate();
  let newDate = new Date(y, m, d, 12, 0, 0);
  async function chancelRsv(e: any, number, loads) {
    e.stopPropagation();
    setDeleteShiftError(false);
    try {
      await updateDoc(doc(db, "FreeSpace", number), {
        reserved: false,
        student: "",
        reserverUid: "",
      }).then(() => {
        toast.success("キャンセルしました", {
          position: "bottom-left",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        loads;
      });
    } catch (error) {
      console.log(error);
      setDeleteShiftError(true);
    } finally {
      loadSchedule(newDate);
      loadSchedule10(newDate);
      loadSchedule11(newDate);
      loadSchedule12(newDate);
      loadSchedule13(newDate);
      loadSchedule14(newDate);
      loadSchedule15(newDate);
      loadSchedule16(newDate);
      loadSchedule17(newDate);
      loadSchedule18(newDate);
    }
  }
  return { chancelRsv, deleteShiftError };
}
