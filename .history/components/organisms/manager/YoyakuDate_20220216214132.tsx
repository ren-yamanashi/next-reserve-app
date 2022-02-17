import {
  collection,
  getFirestore,
  orderBy,
  query,
  where,
  getDocs,
  Timestamp,
  deleteDoc,
  doc,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import { browser } from "process";
import Modal from "@mui/material/Modal";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import React, { FormEvent, useEffect, useState } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import { blue, teal, red } from "@mui/material/colors";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import DatePicker from "@mui/lab/DatePicker";
import Button from "@mui/material/Button";
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
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
//内部インポート
import { useAuth } from "../../../hooks/useUserAuth";
import { FreeList } from "../../../models/FreeList";
import Title from "../../atoms/Title";
import { useRouter } from "next/router";

//Modalのスタイル
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

//提出済み全シフト一覧ページ　※このページから予約登録画面に遷移できる
//予約済みフラグ(reserved)が false のみ抽出　※displayNameに「管理者」が入っている場合のみこのページに遷移可能
export default function YoyakuManager() {
  const [freeLists, setFreeLists] = useState<FreeList[]>([]);
  const [sortTeacher, setSortTeacher] = useState<string>("");
  const [sortTime, setSortTime] = useState<number>();
  const [test, setTest] = useState<string>("");
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [err, setErr] = useState<boolean>(false);
  const [err2, setErr2] = useState<boolean>(false);
  const [student, setStudent] = useState("");
  const router = useRouter();
  const handleOpen = () => setOpen(true);
  const handleOpen2 = () => setOpen2(true);
  const handleOpen3 = () => setOpen3(true);
  const handleClose = () => setOpen(false);
  const handleClose2 = () => setOpen2(false);
  const handleClose3 = () => setOpen3(false);
  const initialDate = new Date();
  const [value, setValue] = useState(initialDate);
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
  //日付をTimeStamp型にして返す
  const timestamp = (datetimeStr: any) => {
    return Timestamp.fromDate(new Date(datetimeStr));
  };

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
      const db = getFirestore();
      const q = query(
        collection(db, "FreeSpace"),
        where("reserved", "==", false),
        where("date", "==", timestamp(xxx2)),
        orderBy("time", "asc")
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        setErr(true);
      }
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
  /**========
   * 並び替え
   *=======*/
  //入力された講師名 & 週目と曜日と時間で並び替え
  const filterTeacher = async () => {
    setErr(false);
    const db = getFirestore();
    const q = query(
      collection(db, "FreeSpace"),
      where("reserved", "==", false),
      where("date", "==", timestamp(xxx)),
      where("teacher", "==", sortTeacher),
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
  };
  //リセット
  const filterReset = async () => {
    setErr(false);
    const db = getFirestore();
    const q = query(
      collection(db, "FreeSpace"),
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
  };
  /**=========
   * 予約登録
   *========*/
  const onSubmit = async (id: string, e: any) => {
    setErr(false);
    setOpen(false);
    const db = getFirestore();
    const q = query(
      collection(db, "FreeSpace"),
      where("reserved", "==", false),
      where("date", "==", timestamp(xxx)),
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
    if (snapshot.empty) {
      setErr(true);
    }
    const gotReservers = snapshot.docs.map((doc) => {
      const reserve = doc.data() as FreeList;
      reserve.id = doc.id;
      return reserve;
    });
    setFreeLists(gotReservers);
  };
  /**========
   * シフト削除
   *========*/
  const deleteShift = async (id: string, e: any) => {
    const db = getFirestore();
    const q = query(
      collection(db, "FreeSpace"),
      where("reserved", "==", false),
      where("date", "==", timestamp(xxx)),
      orderBy("time", "asc")
    );
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, "FreeSpace", id));
      const snapshot = await getDocs(q);
      const gotShift = snapshot.docs.map((doc) => {
        const shift = doc.data() as FreeList;
        shift.id = doc.id;
        return shift;
      });
      setFreeLists(gotShift);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <React.Fragment>
        <Box ml={5}>
          <Title>予約登録</Title>
        </Box>
        <Box m={3} display="flex" alignItems="center">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="日付を選択"
              value={value}
              onChange={async (newValue) => {
                setValue(newValue);
                console.log(newValue);
                setErr(false);
                const day3 = new Date(newValue);
                const y3 = day3.getFullYear();
                const m3 = day3.getMonth();
                const d3 = day3.getDate();
                let xxx3 = new Date(y3, m3, d3, 12, 0, 0);
                const db = getFirestore();
                const q = query(
                  collection(db, "FreeSpace"),
                  where("reserved", "==", false),
                  where("date", "==", timestamp(xxx3)),
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
          <Box ml={2}>
            <IconButton
              onClick={async () => {
                const day4 = new Date(value);
                const y4 = day4.getFullYear();
                const m4 = day4.getMonth();
                const d4 = day4.getDate() - 1;
                let xxx4 = new Date(y4, m4, d4, 12, 0, 0);
                console.log(xxx4);
                setErr(false);
                const db = getFirestore();
                const q = query(
                  collection(db, "FreeSpace"),
                  where("reserved", "==", false),
                  where("date", "==", timestamp(xxx4)),
                  orderBy("time", "asc")
                );
                const snapshot = await getDocs(q);
                if (snapshot.empty) {
                  setErr(true);
                }
                const getReservers = snapshot.docs.map((doc) => {
                  const reserve = doc.data() as FreeList;
                  return reserve;
                });
                setFreeLists(getReservers);
                setValue(xxx4);
                console.log(value);
              }}
            >
              <ArrowBackIosIcon />
            </IconButton>
            <IconButton
              onClick={async () => {
                const day4 = new Date(value);
                const y4 = day4.getFullYear();
                const m4 = day4.getMonth();
                const d4 = day4.getDate() + 1;
                let xxx4 = new Date(y4, m4, d4, 12, 0, 0);
                console.log(xxx4);
                setErr(false);
                const db = getFirestore();
                const q = query(
                  collection(db, "FreeSpace"),
                  where("reserved", "==", false),
                  where("date", "==", timestamp(xxx4)),
                  orderBy("time", "asc")
                );
                const snapshot = await getDocs(q);
                if (snapshot.empty) {
                  setErr(true);
                }
                const getReservers = snapshot.docs.map((doc) => {
                  const reserve = doc.data() as FreeList;
                  return reserve;
                });
                setFreeLists(getReservers);
                setValue(xxx4);
                console.log(value);
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </Box>
        <Table size="small">
          <TableHead style={{ backgroundColor: "#FFFFDD" }}>
            <TableRow>
              <TableCell style={{ fontWeight: 600 }}>
                <Box ml={3}>
                  講師名
                  <IconButton onClick={handleOpen}>
                    <FilterListIcon />
                  </IconButton>
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <Box alignItems="top" m={0}>
                        <IconButton onClick={handleClose}>
                          <CloseIcon />
                        </IconButton>
                      </Box>
                      <Box textAlign="center">
                        <TextField
                          margin="normal"
                          required
                          id="sortTeacher"
                          label="講師名で絞り込み"
                          name="sortTeacher"
                          autoComplete="sortTeacher"
                          autoFocus
                          onChange={(e) => setSortTeacher(e.target.value)}
                        />
                        <Button
                          type="submit"
                          onClick={filterTeacher}
                          variant="contained"
                          sx={{ mt: 3, mb: 2, ml: 3 }}
                        >
                          決定
                        </Button>
                      </Box>
                    </Box>
                  </Modal>
                  <IconButton onClick={filterReset}>
                    <RestartAltIcon />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell style={{ fontWeight: 600 }}>
                <Box ml={3}>日付</Box>
              </TableCell>
              <TableCell style={{ fontWeight: 600 }}>
                <Box ml={3}>時間</Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {freeLists.map((freeList) => (
              <TableRow key={freeList.id}>
                <TableCell>
                  <Box ml={3}>{freeList.id}</Box>
                </TableCell>
                <TableCell>
                  <Box ml={3}>
                    {dayjs(freeList.date.toDate()).format("YYYY/MM/DD ")}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex">
                    <Tooltip title={`予約する:${freeList.teacher}`} arrow>
                      <Button
                        variant="contained"
                        sx={{ mt: 3, mb: 2, ml: 3 }}
                        onClick={() =>
                          router.push(`/reserve/add/${freeList.id}`)
                        }
                      >
                        {`${freeList.time}:30`}
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
                          setErr2(false);
                          const db = getFirestore();
                          freeList.id
                            ? deleteDoc(doc(db, "FreeSpace", freeList.id))
                            : setErr2(true);
                          const q = query(
                            collection(db, "FreeSpace"),
                            where("reserved", "==", false),
                            where("date", "==", timestamp(xxx)),
                            orderBy("time", "asc")
                          );
                          const snapshot = await getDocs(q);
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
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {err == true && (
          <Grid xs={12} sm={15}>
            <Alert
              variant="filled"
              severity="info"
              sx={{ m: 3, textAlign: "center" }}
            >
              予約可能なレッスンは見つかりませんでした
            </Alert>
          </Grid>
        )}
      </React.Fragment>
      <ToastContainer />
    </>
  );
}