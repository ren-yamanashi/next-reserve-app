import {
  collection,
  getFirestore,
  orderBy,
  query,
  where,
  deleteDoc,
  getDocs,
  startAt,
  endAt,
  doc,
  Timestamp,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import dayjs from "dayjs";
import { blue, teal } from "@mui/material/colors";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { browser } from "process";
import Modal from "@mui/material/Modal";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import React, { FormEvent, useEffect, useState } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import Link from "next/link";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import "moment/locale/ja"; // 日本語ローカライズ
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import Table from "@mui/material/Table";
import IconButton from "@mui/material/IconButton";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { TextField } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import { createMedia } from "@artsy/fresnel";
import format from "date-fns/format";
import DateFnsUtils from "@date-io/date-fns";

//内部インポート
import { useAuth } from "../../hooks/useUserAuth";
import { FreeList } from "../../models/FreeList";
import Title from "../atoms/Title";
import Header from "../templates/Header";
import { useRouter } from "next/router";
import { ja } from "date-fns/locale";

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    sm: 0,
    md: 600,
    lg: 990,
    xl: 1200,
  },
});

class ExtendedUtils extends DateFnsUtils {
  getCalendarHeaderText(date) {
    return format(date, "yyyy MMM", { locale: this.locale });
  }
  getDatePickerHeaderText(date) {
    return format(date, "MMMd日", { locale: this.locale });
  }
}

const day = new Date();
const y = day.getFullYear();
const m = day.getMonth();
const d = day.getDate();
let xxx = new Date(y, m, d, 12, 0, 0);
console.log(xxx);
//日付をTimeStamp型にして返す
const timestamp = (datetimeStr: any) => {
  return Timestamp.fromDate(new Date(datetimeStr));
};
//Modalのスタイル
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 370,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

//提出済みシフト一覧ページ　※このページから予約登録画面に遷移できる
//予約済みフラグ(reserved)が false のみ抽出
//シフト提出IDとユーザーIDが一致するシフトのみ抽出　※displayName　に「管理者」が入っている場合は、その限りではない
export default function FreeSpace() {
  const [freeLists, setFreeLists] = useState<FreeList[]>([]);
  const [sortTeacher, setSortTeacher] = useState<string>("");
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [test, setTest] = useState<string>("");
  const [test2, setTest2] = useState<string>("");
  const [err, setErr] = useState<boolean>(false);
  const [err2, setErr2] = useState<boolean>(false);
  const router = useRouter();
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);
  const [value, setValue] = useState<Date | null>(new Date());
  const [student, setStudent] = useState("");
  const day = new Date(value);
  const y = day.getFullYear();
  const m = day.getMonth();
  const d = day.getDate();
  let xxx = new Date(y, m, d, 12, 0, 0);
  const day2 = new Date();
  const y2 = day2.getFullYear();
  const m2 = day2.getMonth();
  const d2 = day2.getDate();
  let xxx2 = new Date(y2, m2, d2, 12, 0, 0);

  useEffect(() => {
    if (!process.browser) {
      return;
    }
    if (user === null) {
      return;
    }
    /**========
     * Firebaseからデータを取得
     *========*/
    async function loadFree() {
      const u = user;
      const db = getFirestore();
      const q = query(
        collection(db, "FreeSpace"),
        where("senderUid", "==", user.uid),
        where("reserved", "==", false),
        where("date", "==", timestamp(xxx2)),
        orderBy("time", "asc")
      );
      const snapshot = await getDocs(q);
      //FreeList一覧の展開
      const gotFreeList = snapshot.docs.map((doc) => {
        const free = doc.data() as FreeList;
        free.id = doc.id;
        return free;
      });
      setFreeLists(gotFreeList);
      if (snapshot.empty) {
        setErr(true);
      }
    }
    loadFree();
  }, [process, browser, user]);

  /**=========
   * 予約登録
   *========*/
  async function onSubmit(id: string, e: FormEvent<HTMLFormElement>) {
    const db = getFirestore();
    const q = query(
      collection(db, "FreeSpace"),
      where("reserved", "==", false),
      where("date", ">=", timestamp(xxx2)),
      orderBy("date", "asc"),
      orderBy("time", "asc")
    );
    e.preventDefault();
    await updateDoc(doc(db, "FreeSpace", id), {
      student: student,
      reserved: true,
      reserverUid: user.uid,
      reserveAt: serverTimestamp(),
    });
    toast.success("予約を登録しました", {
      position: "bottom-left",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    const snapshot = await getDocs(q);
    const gotReservers = snapshot.docs.map((doc) => {
      const reserve = doc.data() as FreeList;
      reserve.id = doc.id;
      return reserve;
    });
    setFreeLists(gotReservers);
  }

  return (
    <>
      <React.Fragment>
        <MediaContextProvider>
          <Box m={3} display="flex" alignItems="center">
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              utils={ExtendedUtils}
              locale={ja}
            >
              <DatePicker
                label="日付を選択"
                value={value}
                onChange={async (newValue) => {
                  setValue(newValue);
                  const day = new Date(newValue);
                  const y = day.getFullYear();
                  const m = day.getMonth();
                  const d = day.getDate();
                  let xxx = new Date(y, m, d, 12, 0, 0);
                  setErr(false);
                  const db = getFirestore();
                  const q = query(
                    collection(db, "FreeSpace"),
                    where("senderUid", "==", user.uid),
                    where("reserved", "==", false),
                    where("date", "==", timestamp(xxx)),
                    orderBy("time", "asc")
                  );
                  const snapshot = await getDocs(q);
                  if (snapshot.empty) {
                    setErr(true);
                  }
                  const gotReservers = snapshot.docs.map((doc) => {
                    const reserve = doc.data() as FreeList;
                    reserve.id = doc.id;
                    return reserve;
                  });
                  setFreeLists(gotReservers);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>
          <Media greaterThan="sm">
            <Table size="small">
              <TableHead style={{ backgroundColor: "#FFFFDD" }}>
                <TableRow>
                  <TableCell style={{ fontWeight: 600 }}>
                    <Box ml={3}>講師名</Box>
                  </TableCell>
                  <TableCell style={{ fontWeight: 600 }}>
                    <Box ml={3}>日付</Box>
                  </TableCell>
                  <TableCell style={{ fontWeight: 600 }}>
                    <Box ml={3}>時間</Box>
                  </TableCell>
                  <TableCell style={{ fontWeight: 600 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {freeLists.map((freeList) => (
                  <TableRow key={freeList.id}>
                    <TableCell>
                      <Box ml={3}>{freeList.teacher}</Box>
                    </TableCell>
                    <TableCell>
                      <Box ml={3}>
                        {dayjs(freeList.date.toDate()).format("YYYY/MM/DD ")}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box ml={3}>{`${freeList.time}:00`}</Box>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={`予約する:${freeList.teacher}`} arrow>
                        <Button
                          type="submit"
                          variant="contained"
                          sx={{ mt: 3, mb: 2, ml: 3 }}
                          onClick={() =>
                            router.push(`/reserve/add/${freeList.id}`)
                          }
                        >
                          登録
                        </Button>
                      </Tooltip>
                      <Tooltip
                        title={
                          err2 == true
                            ? "もう一度クリックしてください"
                            : "シフトを閉じる"
                        }
                        arrow
                      >
                        <IconButton
                          onClick={async () => {
                            const db = getFirestore();
                            setErr2(false);
                            try {
                              await deleteDoc(
                                doc(db, "FreeSpace", freeList.id)
                              );
                            } catch {
                              setErr2(true);
                            }
                            const q = query(
                              collection(db, "FreeSpace"),
                              where("senderUid", "==", user.uid),
                              where("reserved", "==", false),
                              where("date", "==", timestamp(xxx)),
                              orderBy("time", "asc")
                            );
                            const snapshot = await getDocs(q);
                            if (snapshot.empty) {
                              setErr(true);
                            }
                            const gotShift = snapshot.docs.map((doc) => {
                              const shift = doc.data() as FreeList;
                              shift.id = doc.id;
                              return shift;
                            });
                            setFreeLists(gotShift);
                          }}
                        >
                          <DeleteIcon
                            sx={{
                              fontSize: 30,
                              color: teal[500],
                              mt: 3,
                              mb: 2,
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Media>

          {/* スマホレスポンス */}
          <Media at="sm">
            <Box width="100%">
              <Table size="small">
                <TableHead style={{ backgroundColor: "#FFFFDD" }}>
                  <TableRow>
                    <TableCell style={{ fontWeight: 600, fontSize: "13px" }}>
                      <Box ml={3}>日付</Box>
                    </TableCell>
                    <TableCell style={{ fontWeight: 600, fontSize: "13px" }}>
                      <Box ml={3}>時間</Box>
                    </TableCell>
                    <TableCell style={{ fontWeight: 600, fontSize: "13px" }} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {freeLists.map((freeList) => (
                    <TableRow key={freeList.id}>
                      <TableCell sx={{ fontSize: "13px" }}>
                        <Box ml={3}>
                          {dayjs(freeList.date.toDate()).format("YYYY/MM/DD ")}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontSize: "13px" }}>
                        <Box ml={3}>{`${freeList.time}:00`}</Box>
                      </TableCell>
                      <TableCell sx={{ fontSize: "13px" }}>
                        <Tooltip title={`予約する:${freeList.teacher}`} arrow>
                          <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 2.5, mb: 2, ml: 1, fontSize: "10px" }}
                            onClick={() =>
                              router.push(`/reserve/add/${freeList.id}`)
                            }
                          >
                            登録
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Media>
          {err == true && (
            <Grid xs={12} sm={15}>
              <Alert
                variant="filled"
                severity="info"
                sx={{ m: 3, textAlign: "center" }}
              >
                予約可能なレッスンが見つかりませんでした
              </Alert>
            </Grid>
          )}
          <Modal
            open={open2}
            onClose={handleClose2}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Box alignItems="top" m={0}>
                <IconButton onClick={handleClose2}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box
                textAlign="center"
                component="form"
                onSubmit={(e) => onSubmit(freeList.id, e)}
              >
                <Title>生徒名を入力して予約</Title>
                <Box width="30vw" display="flex">
                  <TextField
                    margin="normal"
                    required
                    id="studentName"
                    name="studentName"
                    sx={{ width: "80%" }}
                    label="生徒名"
                    autoComplete="studentName"
                    variant="standard"
                    onChange={(e) => setStudent(e.target.value)}
                  />
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2, mx: 3 }}
                >
                  確定
                </Button>
                <Button
                  type="submit"
                  onClick={handleClose2}
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    mx: 3,
                    bgcolor: teal[500],
                    "&:hover": { bgcolor: "#2E8B57" },
                  }}
                >
                  戻る
                </Button>
              </Box>
            </Box>
          </Modal>
        </MediaContextProvider>
      </React.Fragment>
      <ToastContainer />
    </>
  );
}
