import * as React from "react";
import dayjs from "dayjs";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import Table from "@mui/material/Table";
import IconButton from "@mui/material/IconButton";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import Typography from "@mui/material/Typography";
import TableRow from "@mui/material/TableRow";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import Box from "@mui/material/Box";
import { blue } from "@mui/material/colors";
import { useRouter } from "next/router";
// import my File
import Title from "../../atoms/Text/PrimaryTitle";
import DateRangePicker from "../../atoms/Date/Date ";
import SelectTeacherModal from "../../templates/Modal/SelectTeacherModal";
import Loading from "../../atoms/loading/loadingComponent";
import AlertComponent from "../../atoms/Alert/Alert";
import { useSelectUser_query } from "../../../hooks/firebase/user/useUserList";
import { useLoading } from "../../../hooks/useLoading";
import { teal } from "@mui/material/colors";
import { useDate } from "../../../hooks/date/useDate";
import { useStaffList } from "../../../hooks/firebase/user/useUserList";
import { useHandle } from "../../../hooks/useHandle";
import { useAuth } from "../../../hooks/firebase/useUserAuth";
import {
  useFreeSpace_newValue,
  useDeleteFreeSpace,
} from "../../../hooks/firebase/manager/useShift";

//　提出シフト一覧
const ShiftsAll = () => {
  const router = useRouter();
  const { usersList } = useStaffList();
  const { loading } = useLoading();
  const { chgDate, dateValue } = useDate();
  const { user_query } = useSelectUser_query();
  const { freeSpaces, loadFreeSpace_newValue } = useFreeSpace_newValue();
  const { deleteShift } = useDeleteFreeSpace();
  const { open, handleOpen1, handleClose1 } = useHandle();
  const { user } = useAuth();
  return (
    <React.Fragment>
      {loading == true ? (
        <Loading />
      ) : (
        <>
          {!user ? (
            <>
              <AlertComponent>シフトの提出はありません</AlertComponent>
            </>
          ) : (
            <>
              <Box ml={3}>
                <Title>提出シフト一覧</Title>
                <Box>
                  <IconButton
                    onClick={() =>
                      router.push(`/${user_query.companyId}/staffs`)
                    }
                  >
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
                  changeDate={(newValue) =>
                    loadFreeSpace_newValue(
                      chgDate(newValue),
                      user_query?.companyId
                    )
                  }
                />
              </Box>
              <Table size="small">
                <TableHead style={{ backgroundColor: "#FFFFDD" }}>
                  <TableRow>
                    <TableCell style={{ fontWeight: 600 }}>
                      <Box>
                        氏名
                        <IconButton onClick={handleOpen1}>
                          <Tooltip title={"担当者別スケジュールを見る"} arrow>
                            <ManageSearchIcon />
                          </Tooltip>
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell style={{ fontWeight: 600 }}>
                      <Box>日時</Box>
                    </TableCell>
                    <TableCell style={{ fontWeight: 600 }}>時間</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>状態</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!freeSpaces || freeSpaces.length == 0 ? (
                    <AlertComponent>シフトの提出はありません</AlertComponent>
                  ) : (
                    freeSpaces?.map((rsv) => (
                      <TableRow key={rsv.id}>
                        <TableCell>{rsv.staff}</TableCell>
                        <TableCell>
                          {dayjs(rsv.date.toDate()).format("YYYY/MM/DD ")}
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" height={35}>
                            {`${rsv.time}:00`}
                            {rsv.reserved == false && (
                              <Tooltip title="シフトを閉じる" arrow>
                                <IconButton
                                  onClick={(e) => deleteShift(e, rsv.id)}
                                >
                                  <DeleteIcon
                                    sx={{
                                      fontSize: 30,
                                      color: teal[500],
                                    }}
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {rsv.student == "" ? "未予約" : "予約済み"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </>
          )}

          {/* 担当者選択モーダル */}
          <SelectTeacherModal
            open={open.open1}
            handleClose={handleClose1}
            users={usersList && usersList}
            queryId={user_query?.companyId}
          />
        </>
      )}
    </React.Fragment>
  );
};

export default ShiftsAll;
