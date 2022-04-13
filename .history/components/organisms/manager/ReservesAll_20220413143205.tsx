import React, { useState } from "react";
import dayjs from "dayjs";
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
import Box from "@mui/material/Box";
import { ToastContainer } from "react-toastify";
// import my File
import AlertComponent from "../../atoms/Alert/Alert";
import SelectTeacherModal from "../../templates/Modal/SelectTeacherModal";
import SelectStudentModal_manager from "../../templates/Modal/SelectStudentModal_manager";
import RsvModal from "../../templates/Modal/RsvModal";
import { useTeacherList } from "../../../hooks/user/useUserList";
import { useHandle } from "../../../hooks/handle/useHandle";
import { useDeleteShift } from "../../../hooks/firebase/manager/delete/useDeleteRsv";
import { useReserves_Week } from "../../../hooks/firebase/manager/useReserves";

const ReservesAll = () => {
  console.log("1週間の予約（管理者）");
  const { handleOpen7, handleOpen5, handleOpen4 } = useHandle();
  const { usersList } = useTeacherList();
  const { chancelRsv } = useDeleteShift();
  const { rsv_week, error2, loadRsv } = useReserves_Week();
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
          {rsv_week &&
            rsv_week.map((rsv) => (
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
      {error2 && error2 == true && (
        <AlertComponent>予約は見つかりませんでした</AlertComponent>
      )}
      <ToastContainer />
    </React.Fragment>
  );
};

export default ReservesAll;
