import * as React from "react";
import dayjs from "dayjs";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { createMedia } from "@artsy/fresnel";
import { blue } from "@mui/material/colors";
import { ToastContainer } from "react-toastify";
//import myFile
import Title from "../../atoms/Text/PrimaryTitle";
import DateRangePicker from "../../atoms/Date/Date ";
import DeleteButton from "../../atoms/Button/DeleteButton";
import AlertComponent from "../../atoms/Alert/Alert";
import Loading from "../../atoms/loading/loadingComponent";
import CreateShiftModal from "../../templates/Modal/CreateShift_manager";
import { useShiftList_newDate } from "../../../hooks/firebase/teacher/useFreeSpace";
import { useDate } from "../../../hooks/date/useDate";
import { useSelectUser_query } from "../../../hooks/firebase/user/useUserList";
import { useDeleteFreeSpace } from "../../../hooks/firebase/manager/useShift";
import { useSelectReserve } from "../../../hooks/useSelectReserve";
import { useCreateShift } from "../../../hooks/firebase/manager/useCreateShift";
import { useLoading } from "../../../hooks/useLoading";
import { useHandle } from "../../../hooks/useHandle";
import { useAuth } from "../../../hooks/firebase/useUserAuth";
// Create Media
const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    sm: 0,
    md: 450,
    lg: 990,
    xl: 1200,
  },
});
// シフト確認
const Shifts = () => {
  const { open, handleClose1, handleOpen1 } = useHandle();
  const { loading, startLoading, completeLoading } = useLoading();
  const { createShift } = useCreateShift();
  const { loadFreeSpace_newValue, freeSpaces } = useShiftList_newDate();
  const { dateValue, chgDate } = useDate();
  const { deleteShift } = useDeleteFreeSpace();
  const { user_query } = useSelectUser_query();
  const { handleChangeTime, rsvData } = useSelectReserve();
  const { user } = useAuth();
  // ローディング関数
  const loadShifts = (newDate) => {
    startLoading();
    loadFreeSpace_newValue(newDate).then(() => {
      setTimeout(() => completeLoading(), 500);
    });
  };
  return (
    <React.Fragment>
      {loading == true ? (
        <Loading />
      ) : (
        <MediaContextProvider>
          {!user ? (
            <AlertComponent>ログインしてください</AlertComponent>
          ) : (
            <>
              <Box ml={3}>
                <Title>提出シフト一覧</Title>
                <Box>
                  <IconButton onClick={handleOpen1}>
                    <PersonAddAltIcon sx={{ color: blue[500], mr: 2 }} />
                    <Box my="auto">
                      <Typography fontSize={14} sx={{ color: blue[500] }}>
                        シフト登録
                      </Typography>
                    </Box>
                  </IconButton>
                </Box>
                <DateRangePicker
                  value={dateValue}
                  changeDate={(newValue) => loadShifts(chgDate(newValue))}
                />
              </Box>
              <Table size="small">
                <TableHead style={{ backgroundColor: "#FFFFDD" }}>
                  <TableRow>
                    <TableCell style={{ fontWeight: 600 }}>担当者名</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>日時</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>時間</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>状態</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!freeSpaces || freeSpaces.length == 0 ? (
                    <AlertComponent>シフトの提出はありません</AlertComponent>
                  ) : (
                    freeSpaces.map((rsv) => (
                      <TableRow key={rsv.id}>
                        <TableCell style={{ height: 50 }}>
                          {rsv.staff}
                        </TableCell>
                        <TableCell>
                          {dayjs(rsv.date.toDate()).format("YYYY/MM/DD ")}
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" height={35}>
                            {`${rsv.time}:00`}
                            <Media greaterThan="sm">
                              {rsv.reserved == false && (
                                <DeleteButton
                                  onClickEvent={(e) => deleteShift(e, rsv.id)}
                                />
                              )}
                            </Media>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {rsv.person === "" ? "未予約" : "予約済み"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </>
          )}
          <CreateShiftModal
            open={open.open1}
            handleClose={handleClose1}
            staffName={user_query?.userName}
            time={rsvData.time}
            changeSelect={handleChangeTime}
            createShift={(e) => {
              createShift(
                e,
                user_query?.userName,
                rsvData.time,
                user_query?.id,
                user_query.companyId
              );
              handleClose1();
            }}
          />
        </MediaContextProvider>
      )}
      <ToastContainer />
    </React.Fragment>
  );
};

export default Shifts;
