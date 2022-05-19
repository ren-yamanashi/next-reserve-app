import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { ToastContainer } from "react-toastify";
//import my File
import DateRangePicker from "../../atoms/Date/Date ";
import Loading from "../../atoms/loading/loadingComponent";
import AlertComponent from "../../atoms/Alert/Alert";
import GetRsvModal from "../../templates/Modal/GetReserveModal";
import CreateShiftModal from "../../templates/Modal/CreateShift_manager";
import RsvModal from "../../templates/Modal/RsvModal";
import TableCellComponent from "../../atoms/TableCell/TableCell";
import TableCellComponent2 from "../../atoms/TableCell/TableCell2";
import TableCellComponent3 from "../../atoms/TableCell/TableCell3";
import SearchStudentModal from "../../templates/Modal/SearchStudentModal";
import GetRsv_OK_Cancel from "../../atoms/andMore.../GetRsv_OKCancel2";
import { useAuth } from "../../../hooks/firebase/useUserAuth";
import { useGetReserves } from "../../../hooks/firebase/manager/useReserves";
import { useCreateShift } from "../../../hooks/firebase/manager/useCreateShift";
import { useChancelRsv } from "../../../hooks/firebase/manager/useReserves";
import { useDate } from "../../../hooks/date/useDate";
import { useSelectReserve } from "../../../hooks/useSelectReserve";
import { useSelectUser_query } from "../../../hooks/firebase/user/useUserList";
import { useSchedule } from "../../../hooks/firebase/teacher/useSchedule";
import { useLoading } from "../../../hooks/useLoading";
import { useHandle } from "../../../hooks/useHandle";

const SelectDayAll = () => {
  const { user } = useAuth();
  const { user_query } = useSelectUser_query();
  const { loadScheduleAll, rsvArr } = useSchedule();
  const { startLoading, completeLoading, loading } = useLoading();
  const { chancelRsv } = useChancelRsv();
  const { getReserves } = useGetReserves();
  const { createShift } = useCreateShift();
  const { dateValue, newDateTime, chgDate } = useDate();
  const {
    rsvData,
    selectRsv,
    selectStudent,
    setEmail,
    handleChangeTime,
    setPhoneNumber,
  } = useSelectReserve();
  const {
    open,
    handleOpen1,
    handleOpen2,
    handleOpen3,
    handleOpen4,
    handleClose1,
    handleClose2,
    handleClose3,
    handleClose4,
  } = useHandle();
  // ローディング関数
  const loadSchedules = (newDate) => {
    startLoading();
    loadScheduleAll(newDate).then(() =>
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
                  changeDate={(newValue) => loadSchedules(chgDate(newValue))}
                />
                <GetRsv_OK_Cancel />
                <Table size="small" sx={{ my: 2 }}>
                  <TableHead style={{ backgroundColor: "#FFFFDD" }}>
                    <TableRow>
                      {user_query?.times.map((item) => (
                        <>
                          <TableCell
                            style={{ fontWeight: 600 }}
                          >{`${item}:00`}</TableCell>
                        </>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow key={rsvArr.length}>
                      {rsvArr.map((index) => (
                        <>
                          {index.error == true && (
                            <TableCellComponent click={handleOpen1} />
                          )}
                          {index.rsv &&
                            index.rsv.map((value) =>
                              value.person !== "" ? (
                                <TableCellComponent2
                                  teacher={value.staff}
                                  student={value.person}
                                  date={value.date}
                                  time={value.time}
                                  id={value.id}
                                  click={() => {
                                    handleOpen4();
                                    selectRsv(value);
                                  }}
                                />
                              ) : (
                                // 予約登録
                                <TableCellComponent3
                                  date={value.date}
                                  time={value.time}
                                  id={value.id}
                                  click={() => {
                                    handleOpen2();
                                    selectRsv(value);
                                  }}
                                />
                              )
                            )}
                        </>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </>
            )}
          </>
        )}
        {/* シフト登録 */}
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
        {/* 予約登録確認　*/}
        <GetRsvModal
          open={open.open3}
          handleClose={handleClose3}
          date={rsvData.date}
          teacher={user && user.displayName}
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
              "講師登録",
              user_query?.companyId,
              user?.uid
            )
          }
        />
        {/* 予約者入力 */}
        <SearchStudentModal
          open={open.open2}
          handleClose={handleClose2}
          loadOpen={() => handleOpen3()}
          changeEvent={(e) => selectStudent(e)}
          changeEmail={(e) => setEmail(e)}
          changePhoneNumber={(e) => setPhoneNumber(e)}
        />
        {/* 予約内容詳細 */}
        <RsvModal
          open={open.open4}
          handleClose={handleClose4}
          date={rsvData.date}
          teacher={user && user.displayName}
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

export default SelectDayAll;
