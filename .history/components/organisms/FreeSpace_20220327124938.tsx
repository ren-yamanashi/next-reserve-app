import { getFirestore, Timestamp } from "firebase/firestore";
import dayjs from "dayjs";
import { blue, teal, grey } from "@mui/material/colors";
import Modal from "@mui/material/Modal";
import Tooltip from "@mui/material/Tooltip";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import IconButton from "@mui/material/IconButton";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import { ToastContainer } from "react-toastify";
import { createMedia } from "@artsy/fresnel";
import SearchIcon from "@mui/icons-material/Search";
//内部インポート
import { useAuth } from "../../hooks/useUserAuth";
import { useSelectStudent } from "../../hooks/teacher/getReserves/useSelectStudent";
import { useHandle } from "../../hooks/handle/useHandle";
import { useDeleteShift } from "../../hooks/teacher/deleteShift/useDeleteShift";
import { useGetReserves } from "../../hooks/teacher/getReserves/useGetReserves";
import { useUserList, useSearchStudent } from "../../hooks/user/useUserList";
import {
  useFreeSpace_Today,
  useFreeSpace_newValue,
} from "../../hooks/teacher/reserves/useFreeSpace";
import SearchStudentModal from "../templates/Modal/SearchStudentModal";
import Modals from "../atoms/Modal";
import DeleteShiftButton from "../atoms/Button/DeleteButton";
import AlertComponent from "../atoms/Alert";
import TitleComponent from "../atoms/Text/Title";
import PrimaryBtn from "../atoms/Button/PrimaryButton";
import FieldTx from "../atoms/Text/TextField";
import GetRsvModal from "../templates/Modal/GetReserveModal";
import DateRangePicker from "../atoms/Date/Date ";
// Create Media
const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    sm: 0,
    md: 600,
    lg: 990,
    xl: 1200,
  },
});
export default function FreeSpace() {
  console.log("予約登録");
  const db = getFirestore();
  const { freeSpaces, err } = useFreeSpace_Today();
  const { studentName, studentNum } = useSelectStudent();
  const {
    handleOpen,
    handleOpen2,
    handleClose2,
    handleClose,
    handleOpen3,
    handleOpen4,
    handleClose4,
  } = useHandle();
  const { loadFreeSpace_newValue, error } = useFreeSpace_newValue();
  const { deleteShift } = useDeleteShift();
  const { loadSearchStudent } = useSearchStudent();
  const { usersList } = useUserList();
  const { loadGetReserves } = useGetReserves();
  const { user } = useAuth();
  const [open, setOpen] = useState(false); //予約登録確認モーダル用
  const [open2, setOpen2] = useState(false); //生徒検索モーダル用
  const [value, setValue] = useState<Date | null>(new Date());
  const [student, setStudent] = useState("");
  const [studentId, setStudentId] = useState("");
  const [rsvDate, setRsvDate] = useState("");
  const [rsvTime, setRsvTime] = useState<number>();
  const [rsvId, setRsvId] = useState("");
  const day = new Date(value);
  const y = day.getFullYear();
  const m = day.getMonth();
  const d = day.getDate();
  let date = new Date(y, m, d, 12, 0, 0);
  const timestamp = (datetimeStr: any) => {
    return Timestamp.fromDate(new Date(datetimeStr));
  };
  return (
    <>
      <React.Fragment>
        <MediaContextProvider>
          <DateRangePicker
            value={value}
            changeDate={(newValue) => {
              setValue(newValue);
              const day = new Date(newValue);
              const y = day.getFullYear();
              const m = day.getMonth();
              const d = day.getDate();
              let date = new Date(y, m, d, 12, 0, 0);
              loadFreeSpace_newValue(date);
            }}
          />
          {/* Res PC */}
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
                {freeSpaces &&
                  freeSpaces.map((freeList) => (
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
                          <PrimaryBtn
                            click={() => {
                              handleOpen();
                              setRsvTime(freeList.time);
                              setRsvId(freeList.id);
                              setRsvDate(
                                `${dayjs(freeList.date.toDate()).format(
                                  "YYYY/MM/DD "
                                )} ${freeList.time}:00~`
                              );
                            }}
                            buttonText={"登録"}
                            style={{ mt: 2.5, mb: 2, ml: 1 }}
                          />
                        </Tooltip>
                        <DeleteShiftButton
                          onClickEvent={(e) =>
                            deleteShift(
                              e,
                              loadFreeSpace_newValue(date),
                              freeList.id
                            )
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Media>
          {/* Res Mobile */}
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
                  {freeSpaces &&
                    freeSpaces.map((freeList) => (
                      <TableRow key={freeList.id}>
                        <TableCell sx={{ fontSize: "13px" }}>
                          <Box ml={3}>
                            {dayjs(freeList.date.toDate()).format(
                              "YYYY/MM/DD "
                            )}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: "13px" }}>
                          <Box ml={3}>{`${freeList.time}:00`}</Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: "13px" }}>
                          <Tooltip title={`予約する:${freeList.teacher}`} arrow>
                            <PrimaryBtn
                              style={{
                                mt: 2.5,
                                mb: 2,
                                ml: 1,
                                fontSize: "10px",
                              }}
                              click={() => {
                                handleOpen();
                                setRsvTime(freeList.time);
                                setRsvId(freeList.id);
                                setRsvDate(
                                  `${dayjs(freeList.date.toDate()).format(
                                    "YYYY/MM/DD "
                                  )} ${freeList.time}:00~`
                                );
                              }}
                              buttonText={"登録"}
                            />
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
          </Media>
          {err && err == true ? (
            <AlertComponent>
              予約可能なレッスンが見つかりませんでした
            </AlertComponent>
          ) : (
            error &&
            error == true && (
              <AlertComponent>
                予約可能なレッスンが見つかりませんでした
              </AlertComponent>
            )
          )}
          {/* 予約登録 */}
          <GetRsvModal
            date={rsvDate}
            teacher={user && user.displayName}
            student={studentName}
            clickEv={async (e) => {
              try {
                await loadGetReserves(
                  e,
                  timestamp(date),
                  rsvTime,
                  studentName,
                  rsvId,
                  studentNum,
                  handleClose2()
                );
              } catch (error) {
                handleClose2();
              } finally {
                loadFreeSpace_newValue(date);
              }
            }}
          />
          {/* 生徒検索 */}
          <SearchStudentModal
            changeEvent={(e) => setStudent(e.target.value)}
            searchStudent={() => {
              loadSearchStudent(student);
            }}
            users={usersList && usersList}
          />
        </MediaContextProvider>
      </React.Fragment>
      <ToastContainer />
    </>
  );
}
