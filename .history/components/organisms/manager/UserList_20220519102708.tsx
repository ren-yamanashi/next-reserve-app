import * as React from "react";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { blue, teal } from "@mui/material/colors";
import { ToastContainer } from "react-toastify";
//import my File
import { useSelectUser_query } from "../../../hooks/firebase/user/useUserList";
import { Tooltip } from "@mui/material";
import { useStaffList } from "../../../hooks/firebase/user/useUserList";
import { useCreateShift } from "../../../hooks/firebase/manager/useCreateShift";
import { useSelectReserve } from "../../../hooks/useSelectReserve";
import { useLoading } from "../../../hooks/useLoading";
import { useHandle } from "../../../hooks/useHandle";
import { useAuth } from "../../../hooks/firebase/useUserAuth";
import CreateShiftModal from "../../templates/Modal/CreateShift_manager";
import CreateStaff from "./CreateStaff";
import Title from "../../atoms/Text/PrimaryTitle";
import AlertComponent from "../../atoms/Alert/Alert";
import Loading from "../../atoms/loading/loadingComponent";

// スタッフ一覧（シフト登録）
export default function UsersList() {
  const { user } = useAuth();
  const { open, handleOpen1, handleClose1 } = useHandle();
  const { createShift } = useCreateShift();
  const { handleChangeTime, rsvData, selectTeacher } = useSelectReserve();
  const { usersList, deleteTeacher } = useStaffList();
  const { user_query } = useSelectUser_query();
  const { loading } = useLoading();
  return (
    <>
      <React.Fragment>
        {loading == true ? (
          <Loading />
        ) : (
          <>
            {!user ? (
              <>
                <AlertComponent>ログインしてください</AlertComponent>
              </>
            ) : (
              <>
                <Box ml={3}>
                  <Title>スタッフ一覧</Title>
                </Box>
                <Box display="flex" flexWrap="wrap">
                  {!usersList || usersList.length == 0 ? (
                    <AlertComponent>スタッフを追加してください</AlertComponent>
                  ) : (
                    usersList.map((index) => (
                      <>
                        <Box
                          mb={3}
                          display="flex"
                          justifyContent="center"
                          mx="auto"
                        >
                          <Grid item xs={6} sm={4} lg={4} md={5}>
                            <Box
                              mb={3}
                              display="flex"
                              justifyContent="center"
                              mx="auto"
                            >
                              <CardContent
                                style={{
                                  borderRadius: "7px",
                                  borderStyle: "solid",
                                  borderWidth: "2px",
                                  margin: "auto",
                                  height: 250,
                                }}
                              >
                                <Grid item xs={6} sm={8} lg={3} md={8}>
                                  <Box
                                    sx={{
                                      justifyContent: "center",
                                      textAlign: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <CardMedia
                                      component="img"
                                      sx={{
                                        width: 200,
                                        height: 120,
                                        borderRadius: "10%",
                                        justifyContent: "center",
                                        textAlign: "center",
                                        alignItems: "center",
                                      }}
                                      image={index.staffImageURL}
                                      alt="Icon"
                                    />
                                  </Box>
                                </Grid>
                                <Box display="flex" justifyContent="center">
                                  <IconButton
                                    onClick={() => {
                                      handleOpen1();
                                      selectTeacher(index);
                                    }}
                                  >
                                    <PersonAddAltIcon
                                      sx={{ color: blue[500], m: "auto" }}
                                    />
                                    <Box my="auto" ml={2}>
                                      <Typography
                                        fontSize={15}
                                        sx={{ color: blue[500] }}
                                      >
                                        シフト登録
                                      </Typography>
                                    </Box>
                                  </IconButton>
                                </Box>
                                <Box display="flex" margin="auto">
                                  <Typography
                                    sx={{ fontSize: 15, mx: "auto", mt: 1.5 }}
                                  >
                                    {`氏名 : ${index.userName}`}
                                  </Typography>
                                  <Tooltip title="ユーザーを削除" arrow>
                                    <IconButton
                                      onClick={(e) =>
                                        deleteTeacher(e, index.id)
                                      }
                                    >
                                      <DeleteIcon
                                        sx={{
                                          fontSize: 30,
                                          color: teal[500],
                                          alignItems: "center",
                                          my: "auto",
                                        }}
                                      />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </CardContent>
                            </Box>
                          </Grid>
                        </Box>
                      </>
                    ))
                  )}
                </Box>
                <CreateStaff />
              </>
            )}
          </>
        )}
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
              user_query?.companyId,
              1
            );
            handleClose1();
          }}
        />
      </React.Fragment>
      <ToastContainer />
    </>
  );
}
