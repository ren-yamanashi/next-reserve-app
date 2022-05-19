import * as React from "react";
import dayjs from "dayjs";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import { ToastContainer } from "react-toastify";
// import my File
import { useReserves_Today } from "../../../hooks/firebase/manager/useReserves";
import { useChancelRsv } from "../../../hooks/firebase/manager/useReserves";
import { useSelectReserve } from "../../../hooks/useSelectReserve";
import { useLoading } from "../../../hooks/useLoading";
import { useHandle } from "../../../hooks/useHandle";
import { useAuth } from "../../../hooks/firebase/useUserAuth";
import RsvModal from "../../templates/Modal/RsvModal";
import Title from "../../atoms/Text/PrimaryTitle";
import AlertComponent from "../../atoms/Alert/Alert";
import Loading from "../../atoms/loading/loadingComponent";

// 今日の予約
const YoyakuListToday = () => {
  const { selectRsv, rsvData } = useSelectReserve();
  const { loading } = useLoading();
  const { reserve } = useReserves_Today();
  const { chancelRsv } = useChancelRsv();
  const { open, handleClose1, handleOpen1 } = useHandle();
  const { user } = useAuth();
  return (
    <React.Fragment>
      {!user ? (
        <AlertComponent>ログインしてください</AlertComponent>
      ) : (
        <>
          <Box>
            <CardContent
              style={{
                width: "95%",
                borderRadius: "7px",
                borderStyle: "solid",
                borderWidth: "2px",
                borderColor: "#4689FF",
                margin: "auto",
              }}
            >
              <Box>
                <Box display="flex" mb={3} ml={3}>
                  <Title>本日の予約</Title>
                </Box>
                <Grid item sm={20}>
                  <Table size="small">
                    <TableHead style={{ backgroundColor: "#FFFFDD" }}>
                      <TableRow>
                        <TableCell style={{ fontWeight: 600 }}>
                          担当者名
                        </TableCell>
                        <TableCell style={{ fontWeight: 600 }}>
                          顧客名
                        </TableCell>
                        <TableCell style={{ fontWeight: 600 }}>
                          予約日時
                        </TableCell>
                        <TableCell style={{ fontWeight: 600 }}>時間</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {!reserve || reserve.length == 0 ? (
                        <AlertComponent>本日の予約はありません</AlertComponent>
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
                                    handleOpen1();
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
                </Grid>
              </Box>
            </CardContent>
          </Box>
        </>
      )}
      <RsvModal
        open={open.open1}
        handleClose={handleClose1}
        date={rsvData.date}
        teacher={rsvData.teacher}
        student={rsvData.rsvStudent}
        phoneNumber={rsvData.phoneNumber}
        email={rsvData.email}
        reserver={rsvData.reserver}
        chancelRsv={(e) => {
          chancelRsv(e, rsvData.id);
          handleClose1();
        }}
      />
      <ToastContainer />
    </React.Fragment>
  );
};

export default YoyakuListToday;
