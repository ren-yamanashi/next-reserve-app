import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Input } from "@mui/material";
import { Button } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { createMedia } from "@artsy/fresnel";
import { useTeacher } from "../../../hooks/user/useUserList";
// inFile
import { UploadImage } from "../../../hooks/user/useUpload";
import CardComponent from "../../atoms/CardComponent2";
import PrimaryBtn from "../../atoms/Button/PrimaryButton";
import FieldTx from "../../atoms/Text/TextField";
import Title from "../../atoms/Title";
import AlertComponent from "../../atoms/Alert/Alert";
import Error from "../../atoms/Alert/Error";
import { useRouter } from "next/router";
import { useAlert } from "../../../hooks/alert/useAlert";
// Create Media
const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    sm: 0,
    md: 600,
    lg: 1000,
    xl: 1200,
  },
});
export default function UploadFile() {
  console.log("プロフィール確認");
  const [name, setName] = useState<string>("");
  const { usersList, userName, loadTeacher } = useTeacher();
  const {
    file,
    sending,
    loading,
    err,
    handleChange,
    uploadFiles,
    changeDisplayName,
  } = UploadImage();
  const router = useRouter();
  return (
    <>
      <MediaContextProvider>
        <React.Fragment>
          <Media at="sm">
            <Box textAlign="center">
              <Title>プロフィール</Title>
            </Box>
          </Media>
          <Box textAlign="center">
            <Box mb={3}>
              <Grid xs={12} sm={20} md={20}>
                <CardComponent>
                  {usersList &&
                    usersList.map((item) =>
                      item.userName !== null ? (
                        <Typography sx={{ fontSize: 20, mx: "auto" }}>
                          {`氏名: ${item.userName}`}
                        </Typography>
                      ) : (
                        <Typography
                          sx={{ fontSize: 20, mx: "auto", color: "red" }}
                        >
                          {`氏名を入力してください`}
                        </Typography>
                      )
                    )}
                  <Box component="form" noValidate>
                    <Box display="flex" alignItems="right" mx="5%">
                      <Grid xs={20} sm={20} md={20}>
                        <FieldTx
                          style={{ mx: "auto" }}
                          label={"名前を変更"}
                          changeEv={(e) => setName(e.target.value)}
                        />
                      </Grid>
                      {loading && loading == true ? (
                        <Grid xs={6} sm={4} md={1}>
                          <PrimaryBtn
                            click={() => loadTeacher()}
                            style={{ my: 3, ml: 2 }}
                            buttonText={"確認"}
                          />
                        </Grid>
                      ) : (
                        <Grid xs={6} sm={4} md={1}>
                          <PrimaryBtn
                            click={(e) => changeDisplayName(e, name)}
                            style={{ my: 3, ml: 2 }}
                            buttonText={"更新"}
                          />
                        </Grid>
                      )}
                    </Box>
                  </Box>
                </CardComponent>
              </Grid>
            </Box>
            <Box mb={3}>
              <Grid xs={12} sm={20} md={20}>
                <CardComponent>
                  <Box textAlign="center">
                    <Typography sx={{ fontSize: 20, mx: "auto" }}>
                      {`メールアドレス: ${userName && userName.email}`}
                    </Typography>
                  </Box>
                </CardComponent>
              </Grid>
            </Box>
          </Box>
          <Box textAlign="center" mb={3}>
            <Grid xs={12} sm={20} md={20}>
              <CardComponent>
                <Grid item xs={12} sm={14} lg={20} md={20}>
                  <CardMedia
                    component="img"
                    sx={{
                      borderRadius: "10%",
                      width: "90%",
                      margin: "auto",
                    }}
                    image={userName && userName.photoURL}
                    alt="Icon"
                  />
                </Grid>
                <Box
                  component="form"
                  noValidate
                  onSubmit={(e) => uploadFiles(e)}
                  m="center"
                >
                  <Button variant="contained" sx={{ mt: 3, mb: 2, mx: "auto" }}>
                    {file == undefined ? "画像を選択" : file?.name}
                    <Input
                      sx={{
                        opacity: 0,
                        appearance: "none",
                        position: "absolute",
                      }}
                      type="file"
                      onChange={handleChange}
                    />
                  </Button>
                  <Box>
                    {sending == false ? (
                      <Button
                        onClick={() => router.reload()}
                        sx={{ mb: 2, ml: 1 }}
                      >
                        リロードして確認
                      </Button>
                    ) : (
                      <Button type="submit" sx={{ mb: 1, ml: 1 }}>
                        ダウンロード
                      </Button>
                    )}
                  </Box>
                </Box>
              </CardComponent>
            </Grid>
          </Box>
          {err == true && (
            <AlertComponent>アップロード中が失敗しました</AlertComponent>
          )}
          {errMsg && errMsg == true && (
            <Error>ユーザ情報の取得に失敗しました</Error>
          )}
        </React.Fragment>
        <ToastContainer />
      </MediaContextProvider>
    </>
  );
}
