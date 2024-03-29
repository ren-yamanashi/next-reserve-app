import Grid from "@mui/material/Grid";
import React from "react";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { teal } from "@mui/material/colors";
import { useRouter } from "next/router";
// import my File
import { useStaffList } from "../../../hooks/firebase/user/useUserList";
import PrimaryBtn from "../../atoms/Button/PrimaryButton";

const YoyakuTeacherAtManager = () => {
  const { usersList } = useStaffList();
  const router = useRouter();
  return (
    <>
      <React.Fragment>
        <Box display="flex" flexWrap="wrap">
          {usersList &&
            usersList.map((index) => (
              <>
                <Box mb={2} display="flex" justifyContent="center" mx="auto">
                  <Grid item xs={6} sm={4} lg={4} md={5}>
                    <Box
                      mb={2}
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
                          maxHeight: 300,
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
                                width: 150,
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
                        <Box display="flex" margin="auto">
                          <Typography
                            sx={{ fontSize: 15, mt: 2, mb: 1, mx: "auto" }}
                          >
                            {`担当者名 : ${index.userName}`}
                          </Typography>
                        </Box>
                        <Box display="flex" margin="auto">
                          <PrimaryBtn
                            click={() => router.push(`/teachers/${index.id}`)}
                            style={{
                              bgcolor: teal[500],
                              "&:hover": { bgcolor: "#2E8B57" },
                              fontSize: 10,
                              width: 140,
                              margin: "auto",
                            }}
                            buttonText={"選択"}
                          />
                        </Box>
                      </CardContent>
                    </Box>
                  </Grid>
                </Box>
              </>
            ))}
        </Box>
      </React.Fragment>
    </>
  );
};

export default YoyakuTeacherAtManager;
