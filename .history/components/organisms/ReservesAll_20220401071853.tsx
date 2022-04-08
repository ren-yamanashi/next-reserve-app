import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import FilterListIcon from "@mui/icons-material/FilterList";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { blue, grey, teal } from "@mui/material/colors";
import "moment/locale/ja"; // 日本語ローカライズ
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import SnackbarContent from "@mui/material/SnackbarContent";
import { ToastContainer } from "react-toastify";
import Typography from "@mui/material/Typography";
//内部インポート
import SelectTeacherModal from "../templates/Modal/SelectTeacherModal";
import SelectStudentModal_manager from "../templates/Modal/SelectStudentModal_manager";
import RsvModal from "../templates/Modal/RsvModal";
import { useUserList } from "../../hooks/user/useUserList";
import { useAuth } from "../../hooks/useUserAuth";
import { FreeList } from "../../models/FreeList";
import { Users } from "../../models/Users";
import { useTeacherList, useStudentsList } from "../../hooks/user/useUserList";
import { useHandle } from "../../hooks/handle/useHandle";
import {
  useReserves_Week,
  useReserves_student,
} from "../../hooks/manager/useReserves";
import { useDeleteShift } from "../../hooks/manager/delete/useDeleteRsv";
import { useReserves_teacher } from "../../hooks/manager/useReserves";
import AlertComponent from "../atoms/Alert";

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
//Itemのスタイル
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  backgroundColor: "#FFFFDD",
}));
const Item2 = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
//予約一覧ページ　予約済みフラグ(reserved)が true のみ表示　※管理者のみこのページへの遷移が可能
export default function ReservesAll() {
  console.log("1週間の予約（管理者）");
  const { handleOpen7, handleOpen5, handleOpen4 } = useHandle();
  const { error4 } = useReserves_teacher();
  const { loadSearchStudentsList } = useStudentsList();
  const { usersList } = useTeacherList();
  const { chancelRsv } = useDeleteShift();
  const { rsv, error2, loadRsv } = useReserves_Week();
  const { loadRsvStudent, error3 } = useReserves_student();
  const { loadUsers } = useUserList();
  const [rsvDate, setRsvDate] = useState("");
  const [teacher, setTeacher] = useState("");
  const [student, setStudent] = useState("");
  const [rsvId, setRsvId] = useState("");

  return (
    <React.Fragment>
      <Table size="small" sx={{ mt: 5 }}>
        <TableHead style={{ backgroundColor: "#FFFFDD" }}>
          <TableRow>
            <TableCell style={{ fontWeight: 600 }}>
              <Box>
                講師名
                <IconButton onClick={handleOpen7}>
                  <FilterListIcon />
                </IconButton>
                <IconButton onClick={loadRsv}>
                  <RestartAltIcon />
                </IconButton>
              </Box>
            </TableCell>
            <TableCell style={{ fontWeight: 600 }}>
              <Box>
                生徒名
                <IconButton onClick={handleOpen5}>
                  <FilterListIcon />
                </IconButton>
                <IconButton onClick={loadRsv}>
                  <RestartAltIcon />
                </IconButton>
                <SelectStudentModal_manager />
              </Box>
            </TableCell>
            <TableCell style={{ fontWeight: 600 }}>
              <Box>予約日時</Box>
            </TableCell>
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
                <TableCell>
                  {`${rsv.time}:00`}
                  <Tooltip title="詳細確認・キャンセル" arrow>
                    <IconButton
                      onClick={() => {
                        handleOpen4();
                        setRsvId(rsv.id);
                        setStudent(rsv.student);
                        setTeacher(rsv.teacher);
                        setRsvDate(
                          `${dayjs(rsv.date.toDate()).format("YYYY/MM/DD ")} ${
                            rsv.time
                          }:00~`
                        );
                      }}
                    >
                      <EditIcon sx={{ color: "teal", ml: 3 }} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {/* モーダル　予約内容詳細 */}
      <RsvModal
        date={rsvDate}
        teacher={teacher}
        student={student}
        chancelRsv={(e) => chancelRsv(e, rsvId, loadRsv())}
      />

      {/* Select Teacher */}
      <SelectTeacherModal users={usersList && usersList} />
      {error2 && error2 == true ? (
        <AlertComponent>予約は見つかりませんでした</AlertComponent>
      ) : error3 && error3 == true ? (
        <AlertComponent>予約は見つかりませんでした</AlertComponent>
      ) : (
        error4 &&
        error4 == true && (
          <AlertComponent>予約は見つかりませんでした</AlertComponent>
        )
      )}
      <ToastContainer />
    </React.Fragment>
  );
}
