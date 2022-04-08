import Modal from "@mui/material/Modal";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import FilterListIcon from "@mui/icons-material/FilterList";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import Table from "@mui/material/Table";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { blue, grey, teal } from "@mui/material/colors";
import { ToastContainer } from "react-toastify";
import dayjs from "dayjs";
import { createMedia } from "@artsy/fresnel";
//内部インポート
import GetRsvModal from "../../templates/Modal/GetReserveModal";
import AlertComponent from "../../atoms/Alert";
import DateRangePicker from "../../atoms/Date/Date ";
import { useAuth } from "../../../hooks/useUserAuth";
import { useTeacherList } from "../../../hooks/user/useUserList";
import { useSelectUser } from "../../../hooks/user/useUserList";
import { useHandle } from "../../../hooks/handle/useHandle";
import { useGetReserves } from "../../../hooks/teacher/getReserves/useGetReserves";
import {
  useReserves_Date,
  useReserves_dateTime,
} from "../../../hooks/student/useReserves";
import { useDate } from "../../../hooks/date/useDate";
import { useSelectTimeValue } from "../../../hooks/student/deleteRsv/selectTime/useSelectTime";
import PrimaryBtn from "../../atoms/Button/PrimaryButton";
import SelectTimeModal from "../../templates/Modal/SelectTimeModal";
//メディアクエリ設定
const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    sm: 0,
    md: 600,
    lg: 990,
    xl: 1200,
  },
});
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
const style2 = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

//ユーザーリストの作成　名前に管理者があればユーザーの削除が可能。 メアドに @bee が入っていればシフトの登録が可能
export default function UsersList() {
  console.log("日程から探す");
  const { usersList } = useTeacherList();
  const { changeDateValue, newDateTime, dateValue } = useDate();
  const { timeValue } = useSelectTimeValue();
  const { loadGetReserves } = useGetReserves();
  const { handleOpen2, handleClose2, handleOpen6, handleClose6 } = useHandle();
  const { loadSelectUsers } = useSelectUser();
  const { loadRsv_date, rsv2, error2 } = useReserves_Date();
  const { loadRsv_dateTime } = useReserves_dateTime();
  const { user } = useAuth();
  const [sortTime, setSortTime] = useState<number>();
  const [time, setTime] = useState(0);
  const [i, setI] = useState("");
  const [open3, setOpen3] = useState(false);
  const handleOpen3 = () => setOpen3(true);
  const handleClose3 = () => setOpen3(false);
  return (
    <>
      <React.Fragment>
        <MediaContextProvider>
          {/* レスポンシブ 601~ */}
          <Media greaterThan="sm">
            <DateRangePicker
              value={dateValue}
              changeDate={async (newValue) => {
                changeDateValue(newValue);
                const day = new Date(newValue);
                const y = day.getFullYear();
                const m = day.getMonth();
                const d = day.getDate();
                let newDate = new Date(y, m, d, 12, 0, 0);
                loadRsv_date(newDate);
              }}
            />
            <Table size="small">
              <TableHead style={{ backgroundColor: "#FFFFDD" }}>
                <TableRow>
                  <TableCell style={{ fontWeight: 600, width: "30%" }}>
                    <Box ml={3}>講師名</Box>
                  </TableCell>
                  <TableCell style={{ fontWeight: 600, width: "25%" }}>
                    <Box ml={3}>日付</Box>
                  </TableCell>
                  <TableCell style={{ fontWeight: 600, width: "25%" }}>
                    <Box display="flex" ml={1}>
                      <Box mt={1}>時間</Box>
                      <IconButton onClick={handleOpen6}>
                        <FilterListIcon />
                      </IconButton>
                      <Media greaterThan="md">
                        <IconButton onClick={() => loadRsv_date(newDateTime)}>
                          <RestartAltIcon />
                        </IconButton>
                      </Media>
                    </Box>
                  </TableCell>
                  <TableCell style={{ fontWeight: 600 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {rsv2 &&
                  rsv2.map((freeList) => (
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
                        <Box ml={3}>{`${freeList.time}:00`} </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Tooltip title={`予約する:${freeList.teacher}`} arrow>
                            <PrimaryBtn
                              style={{
                                mt: 3,
                                mb: 2,
                                ml: 3,
                                bgcolor: teal[400],
                                color: "white",
                                "&:hover": { bgcolor: teal[500] },
                              }}
                              click={() => {
                                handleOpen2();
                                loadSelectUsers(freeList.senderUid);
                                setTime(freeList.time);
                                setI(freeList.id);
                              }}
                              buttonText={"予約"}
                            />
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Media>
          {/* レスポンシブ　〜600 */}
          <Media at="sm">
            <DateRangePicker
              value={dateValue}
              changeDate={async (newValue) => {
                changeDateValue(newValue);
                const day = new Date(newValue);
                const y = day.getFullYear();
                const m = day.getMonth();
                const d = day.getDate();
                let newDate = new Date(y, m, d, 12, 0, 0);
                loadRsv_date(newDate);
              }}
            />
            <Table size="small">
              <TableHead style={{ backgroundColor: "#FFFFDD" }}>
                <TableRow>
                  <TableCell style={{ fontWeight: 600, width: "35%" }}>
                    <Box fontSize={12}>講師名</Box>
                  </TableCell>
                  <TableCell style={{ fontWeight: 600, width: "30%" }}>
                    <Box fontSize={12}>日付</Box>
                  </TableCell>
                  <TableCell style={{ fontWeight: 600 }}>
                    <Box fontSize={12} ml={1}>
                      時間
                      <IconButton onClick={handleOpen6}>
                        <FilterListIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rsv2 &&
                  rsv2.map((freeList) => (
                    <TableRow key={freeList.id}>
                      <TableCell>
                        <Box fontSize={12}>{freeList.teacher}</Box>
                      </TableCell>
                      <TableCell>
                        <Box fontSize={12}>
                          {dayjs(freeList.date.toDate()).format("YYYY/MM/DD ")}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={`予約する:${freeList.teacher}`} arrow>
                          <PrimaryBtn
                            style={{
                              mt: 3,
                              mb: 2,
                              ml: 3,
                              fontSize: 12,
                              bgcolor: teal[400],
                              color: "white",
                              "&:hover": { bgcolor: teal[500] },
                            }}
                            click={(e) => {
                              handleOpen2();
                              loadSelectUsers(freeList.senderUid);
                              setTime(freeList.time);
                              setI(freeList.id);
                            }}
                            buttonText={`${freeList.time}:00`}
                          />
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Media>
          {/* 予約登録 */}
          <GetRsvModal
            date={`${
              newDateTime.getMonth() + 1
            }/${newDateTime.getDate()} ${time}:00 ~ ${time + 1}:00`}
            teacher={usersList && usersList.map((user) => user.userName)}
            student={user && user.displayName}
            clickEv={(e) =>
              loadGetReserves(
                e,
                newDateTime,
                time,
                user && user.displayName,
                i,
                user && user.uid,
                handleClose2()
              )
            }
          />
          {/* 時間選択 */}
          <SelectTimeModal
            clickSelect={() => {
              loadRsv_dateTime(timeValue), handleClose6();
            }}
          />
          {/* エラー表示 */}
          {error2 && error2 == true && (
            <AlertComponent>
              予約可能なレッスンは見つかりませんでした
            </AlertComponent>
          )}
        </MediaContextProvider>
      </React.Fragment>
      <ToastContainer />
    </>
  );
}
