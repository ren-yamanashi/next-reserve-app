import * as React from "react";
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
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
// import my File
import AlertComponent from "../../atoms/Alert/Alert";
import SelectTeacherModal from "../../templates/Modal/SelectTeacherModal";
import Loading from "../../atoms/loading/loadingComponent";
import RsvModal from "../../templates/Modal/RsvModal";
import { useStaffList } from "../../../hooks/firebase/user/useUserList";
import { useSelectReserve } from "../../../hooks/useSelectReserve";
import { useLoading } from "../../../hooks/useLoading";
import { useHandle } from "../../../hooks/useHandle";
import { useAuth } from "../../../hooks/firebase/useUserAuth";
import { Query } from "../../../models/router_query";
import {
  useReserves_Week,
  useChancelRsv,
} from "../../../hooks/firebase/manager/useReserves";

// 1週間の予約
const ReservesAll = () => {
  const router = useRouter();
  const query = router.query as Query;
  const { rsvData, selectRsv } = useSelectReserve();
  const { usersList } = useStaffList();
  const { user } = useAuth();
  const { chancelRsv } = useChancelRsv();
  const { reserve } = useReserves_Week();
  const { loading } = useLoading();
  const { handleOpen1, handleOpen2, handleClose1, handleClose2, open } =
    useHandle();
  return (
    <React.Fragment>
      {loading == true ? (
        <Loading />
      ) : (
        <>
          <Table size="small" sx={{ mt: 5 }}>
            <TableHead style={{ backgroundColor: "#FFFFDD" }}>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>
                  <Box>
                    担当者名
                    <IconButton onClick={handleOpen1}>
                      <FilterListIcon />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell style={{ fontWeight: 600 }}>
                  <Box>顧客名</Box>
                </TableCell>
                <TableCell style={{ fontWeight: 600 }}>
                  <Box>予約日時</Box>
                </TableCell>
                <TableCell style={{ fontWeight: 600 }}>時間</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!reserve || reserve.length == 0 ? (
                <AlertComponent>予約は見つかりませんでした</AlertComponent>
              ) : (
                reserve.map((rsv) => (
                  <TableRow key={rsv.id}>
                    <TableCell>{rsv.staff}</TableCell>
                    <TableCell>{rsv.person}</TableCell>
                    <TableCell>
                      {dayjs(rsv.date.toDate()).format("YYYY/MM/DD ")}
                    </TableCell>
                    <TableCell>
                      {`${rsv.time}:00`}
                      <Tooltip title="詳細確認・キャンセル" arrow>
                        <IconButton
                          onClick={() => {
                            handleOpen2();
                            selectRsv(rsv);
                          }}
                        >
                          <EditIcon sx={{ color: "teal", ml: 3 }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </>
      )}
      {/* モーダル　予約内容詳細 */}
      <RsvModal
        open={open.open2}
        handleClose={handleClose2}
        date={rsvData.date}
        teacher={rsvData.teacher}
        student={rsvData.rsvStudent}
        email={rsvData.email}
        phoneNumber={rsvData.phoneNumber}
        reserver={rsvData.reserver}
        chancelRsv={(e) => {
          chancelRsv(e, rsvData.id);
          handleClose2();
        }}
      />
      {/* 講師選択 */}
      <SelectTeacherModal
        open={open.open1}
        handleClose={handleClose1}
        users={usersList && usersList}
      />
      <ToastContainer />
    </React.Fragment>
  );
};

export default ReservesAll;
