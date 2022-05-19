import * as React from "react";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { blue } from "@mui/material/colors";
import { ToastContainer } from "react-toastify";
// import my File
import { useStaffList } from "../../../hooks/firebase/user/useUserList";
import { useSelectReserve } from "../../../hooks/useSelectReserve";
import { useDate } from "../../../hooks/date/useDate";
import { useCreateShift } from "../../../hooks/firebase/manager/useCreateShift";
import { useGetReserves } from "../../../hooks/firebase/manager/useReserves";
import { useChancelRsv } from "../../../hooks/firebase/manager/useReserves";
import { useLoading } from "../../../hooks/useLoading";
import { useSchedule } from "../../../hooks/firebase/manager/useSchedule";
import { useSelectUser_query } from "../../../hooks/firebase/user/useUserList";
import { useAuth } from "../../../hooks/firebase/useUserAuth";
import { useHandle } from "../../../hooks/useHandle";
import DateRangePicker from "../../atoms/Date/Date ";
import CreateShiftModal from "../../templates/Modal/CreateShift_manager";
import GetRsvModal from "../../templates/Modal/GetReserveModal";
import SearchStudentModal from "../../templates/Modal/SearchStudentModal";
import RsvModal from "../../templates/Modal/RsvModal";
import TableCellComponent8 from "../../atoms/TableCell/TableCell8";
import GetRsv_OK_Cancel from "../../atoms/andMore.../GetRsv_OK_Cancel3";
import Loading from "../../atoms/loading/loadingComponent";
import AlertComponent from "../../atoms/Alert/Alert";

// スケジュール確認
const ScheduleAll = () => {
  const { user } = useAuth();
  const { user_query } = useSelectUser_query();
  const { startLoading, completeLoading, loading } = useLoading();
  const { chgDate, newDateTime, dateValue } = useDate();
  const { createShift } = useCreateShift();
  const { chancelRsv } = useChancelRsv();
  const { usersList } = useStaffList();
  const { getReserves } = useGetReserves();
  const { loadScheduleAll, rsvArr } = useSchedule();
  const {
    selectRsv,
    selectTeacher,
    setPhoneNumber,
    selectStudent,
    rsvData,
    handleChangeTime,
    setEmail,
  } = useSelectReserve();
  const {
    handleOpen1,
    handleOpen2,
    handleOpen3,
    handleOpen4,
    handleClose1,
    handleClose2,
    handleClose3,
    handleClose4,
    open,
  } = useHandle();
  // ローディング関数
  const loadSchedules = (newDate, companyId) => {
    startLoading();
    loadScheduleAll(newDate, companyId).then(() =>
      setTimeout(() => completeLoading(), 500)
    );
  };
  return (
    <>
      <React.Fragment>
        {loading == true ? (
          <Loading />
        ) : (
          <>
            {!user ? (
              <AlertComponent>ログインしてください</AlertComponent>
            ) : (
              <>
                <DateRangePicker
                  value={dateValue}
                  changeDate={(newValue) => {
                    loadSchedules(chgDate(newValue), user_query?.companyId);
                  }}
                />
                <GetRsv_OK_Cancel />
                <Box overflow="scroll">
                  <Table
                    size="small"
                    sx={{ my: 3, border: "2px", minWidth: "1000px" }}
                  >
                    <TableHead
                      style={{ backgroundColor: "#FFFFDD", border: "3px" }}
                    >
                      <TableRow>
                        <TableCell style={{ fontWeight: 600 }}>
                          {"担当者名"}
                        </TableCell>
                        {user_query?.times.map((time) => (
                          <>
                            <TableCell style={{ fontWeight: 600, width: "8%" }}>
                              {`${time}:00`}
                            </TableCell>
                          </>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {!usersList || usersList.length == 0 ? (
                        <AlertComponent>
                          スタッフを追加してください
                        </AlertComponent>
                      ) : (
                        usersList.map((uu) => (
                          <TableRow key={uu.id}>
                            <Box overflow="scroll">
                              <TableCell
                                style={{ fontWeight: 600, width: 300 }}
                              >
                                <Box display="flex">
                                  <Box
                                    component="img"
                                    sx={{
                                      height: 40,
                                      width: 40,
                                      borderRadius: "50%",
                                    }}
                                    alt={uu.userName}
                                    src={uu.staffImageURL}
                                  />
                                  <Box
                                    sx={{
                                      textAlign: "center",
                                      my: "auto",
                                      ml: 1,
                                      width: 120,
                                      fontSize: "13px",
                                    }}
                                  >
                                    {uu.userName}
                                  </Box>
                                </Box>
                                <ListItem
                                  key="editUser"
                                  onClick={() => {
                                    handleOpen1();
                                    selectTeacher(uu);
                                  }}
                                  sx={{ cursor: "pointer" }}
                                >
                                  <PersonAddAltIcon
                                    sx={{ color: blue[500], mr: 2 }}
                                  />
                                  <Box
                                    sx={{ color: blue[500], fontSize: "13px" }}
                                  >
                                    シフトを登録
                                  </Box>
                                </ListItem>
                              </TableCell>
                            </Box>
                            {rsvArr.map((rsv) => (
                              <>
                                <TableCellComponent8
                                  rsv={rsv && rsv}
                                  teacherName={uu.userName}
                                  clickEvent={() => {
                                    rsv &&
                                      rsv.map((item) => {
                                        uu.userName == item.staff &&
                                          (selectRsv(item),
                                          item.person !== ""
                                            ? handleOpen4()
                                            : handleOpen2());
                                      });
                                  }}
                                />
                              </>
                            ))}
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </Box>
              </>
            )}
          </>
        )}
        {/* モーダル */}
        <CreateShiftModal
          open={open.open1}
          handleClose={handleClose1}
          staffName={rsvData.teacherName}
          time={rsvData.time}
          changeSelect={handleChangeTime}
          createShift={(e) => {
            createShift(
              e,
              rsvData.teacherName,
              rsvData.time,
              rsvData.teacherId,
              user_query?.companyId
            );
            handleClose1();
          }}
        />
        <GetRsvModal
          open={open.open3}
          handleClose={handleClose3}
          date={rsvData.date}
          teacher={rsvData.teacher}
          student={rsvData.student}
          email={rsvData.email}
          phoneNumber={rsvData.phoneNumber}
          clickEv={(e) =>
            getReserves(
              e,
              newDateTime,
              rsvData.rsvTime,
              rsvData.student,
              rsvData.id,
              rsvData.email,
              rsvData.phoneNumber,
              "管理者登録",
              user_query?.companyId,
              user?.uid
            )
          }
        />
        <SearchStudentModal
          changeEvent={(e) => selectStudent(e)}
          changeEmail={(e) => setEmail(e)}
          changePhoneNumber={(e) => setPhoneNumber(e)}
          open={open.open2}
          handleClose={handleClose2}
          loadOpen={() => handleOpen3()}
        />
        <RsvModal
          open={open.open4}
          handleClose={handleClose4}
          date={rsvData.date}
          teacher={rsvData.teacher}
          student={rsvData.rsvStudent}
          email={rsvData.email}
          phoneNumber={rsvData.phoneNumber}
          reserver={rsvData.reserver}
          chancelRsv={(e) => {
            chancelRsv(e, rsvData.id);
            handleClose4();
          }}
        />
      </React.Fragment>
      <ToastContainer />
    </>
  );
};

export default ScheduleAll;
