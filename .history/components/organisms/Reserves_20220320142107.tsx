import {
  collection,
  getFirestore,
  orderBy,
  query,
  Timestamp,
  where,
  getDocs,
  startAt,
  endAt,
} from "firebase/firestore";
import { browser } from "process";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import IconButton from "@mui/material/IconButton";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import FilterListIcon from "@mui/icons-material/FilterList";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import { TextField } from "@mui/material";

import { createMedia } from "@artsy/fresnel";
import { Router, useRouter } from "next/router";
//内部インポート
import { useAuth } from "../../hooks/useUserAuth";
import {
  useReserves_Today,
  useReserves_Week,
  useReserves_student,
} from "../../hooks/teacher/reserves/useReserves";
import { FreeList } from "../../models/FreeList";
import ModalComponent from "../atoms/Modal";
import Alert from "../atoms/Alert";

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    sm: 0,
    md: 600,
    lg: 990,
    xl: 1200,
  },
});

//予約一覧ページ　予約済みフラグ(reserved)が true のみ表示
//シフト提出者IDとユーザーIDが一致する予約のみ表示
export default function Reserves() {
  const db = getFirestore();
  const { rsv, error, loadRsv } = useReserves_Week();
  const { loadRsvStudent } = useReserves_student();
  const [reserves, setReserves] = useState<FreeList[]>([]);
  const { user } = useAuth();
  const router = useRouter();
  const [open3, setOpen3] = useState(false);
  const [sortStudent, setSortStudent] = useState<string>("");
  const handleOpen3 = () => setOpen3(true);
  const handleClose3 = () => setOpen3(false);
  const day = new Date();
  const y = day.getFullYear();
  const m = day.getMonth();
  const d = day.getDate();
  let xxx = new Date(y, m, d, 12, 0, 0);
  let xxx7 = new Date(y, m, d + 7, 12, 0, 0);
  //日付をTimeStamp型にして返す
  const timestamp = (datetimeStr: any) => {
    return Timestamp.fromDate(new Date(datetimeStr));
  };

  //入力された生徒名 & 週目と曜日と時間で並び替え
  // const filterStudent = async () => {
  //   const q = query(
  //     collection(db, "FreeSpace"),
  //     where("senderUid", "==", user.uid),
  //     where("student", "==", sortStudent),
  //     where("reserved", "==", true),
  //     orderBy("time", "asc"),
  //     orderBy("date"),
  //     startAt(timestamp(xxx)),
  //     endAt(timestamp(xxx7))
  //   );
  //   const snapshot = await getDocs(q);
  //   if (snapshot.empty) {
  //     return;
  //   }
  //   const gotReservers = snapshot.docs.map((doc) => {
  //     const reserve = doc.data() as FreeList;
  //     reserve.id = doc.id;
  //     return reserve;
  //   });
  //   setReserves(gotReservers);
  // };
  return (
    <React.Fragment>
      <MediaContextProvider>
        <Media greaterThan="sm">
          <>
            <Table size="small">
              <TableHead style={{ backgroundColor: "#FFFFDD" }}>
                <TableRow>
                  <TableCell style={{ fontWeight: 600 }}>講師名</TableCell>
                  <TableCell style={{ fontWeight: 600 }}>
                    <Box>
                      生徒名
                      <IconButton onClick={handleOpen3}>
                        <FilterListIcon />
                      </IconButton>
                      <IconButton onClick={loadRsv}>
                        <RestartAltIcon />
                      </IconButton>
                      {/* Modal Search　By Student Name */}
                      <Modal
                        open={open3}
                        onClose={handleClose3}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <ModalComponent>
                          <Box alignItems="top">
                            <IconButton onClick={handleClose3}>
                              <CloseIcon />
                            </IconButton>
                          </Box>
                          <Box textAlign="center">
                            <TextField
                              margin="normal"
                              required
                              id="sortTeacher"
                              label="生徒名で絞り込み"
                              name="sortStudent"
                              autoComplete="sortStudent"
                              autoFocus
                              onChange={(e) => setSortStudent(e.target.value)}
                            />
                            <Button
                              type="submit"
                              onClick={() => {
                                loadRsvStudent(sortStudent);
                                handleClose3();
                              }}
                              variant="contained"
                              sx={{ mt: 3, mb: 2, ml: 3 }}
                            >
                              決定
                            </Button>
                          </Box>
                        </ModalComponent>
                      </Modal>
                    </Box>
                  </TableCell>
                  <TableCell style={{ fontWeight: 600 }}>予約日時</TableCell>
                  <TableCell style={{ fontWeight: 600 }}>時間</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rsv &&
                  rsv.map((rsv) => (
                    <TableRow key={rsv.id}>
                      <TableCell>{rsv.teacher}</TableCell>
                      <TableCell>{rsv.student}</TableCell>
                      <TableCell>
                        {dayjs(rsv.date.toDate()).format("YYYY/MM/DD ")}
                      </TableCell>
                      <TableCell>{`${rsv.time}:00`}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {error && error && <Alert>予約が見つかりませんでした</Alert>}
          </>
        </Media>
        {/* スマホレスポンシブ */}
        <Media at="sm">
          <>
            <Table size="small">
              <TableHead style={{ backgroundColor: "#FFFFDD" }}>
                <TableRow>
                  <TableCell style={{ fontWeight: 600, fontSize: "13px" }}>
                    生徒名
                  </TableCell>
                  <TableCell style={{ fontWeight: 600, fontSize: "13px" }}>
                    予約日時
                  </TableCell>
                  <TableCell style={{ fontWeight: 600, fontSize: "13px" }}>
                    時間
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reserves.map((rsv) => (
                  <TableRow key={rsv.id}>
                    <TableCell sx={{ fontSize: "10px" }}>
                      {rsv.student}
                    </TableCell>
                    <TableCell sx={{ fontSize: "10px" }}>
                      {dayjs(rsv.date.toDate()).format("YYYY/MM/DD ")}
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: "10px" }}
                    >{`${rsv.time}:00`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {error && error == true && (
              <Alert>予約が見つかりませんでした</Alert>
            )}
          </>
        </Media>
      </MediaContextProvider>
    </React.Fragment>
  );
}
