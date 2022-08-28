import * as React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import LockIcon from "@mui/icons-material/Lock";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Input } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
// import my File
import Modals from "../../atoms/Modal/Modal2";
import Title_15 from "../../atoms/Text/Title_15";
import { UploadImage } from "../../../hooks/firebase/user/useUpload";
import { useRouter } from "next/router";
import { useSelectUser_query } from "../../../hooks/firebase/user/useUserList";
import { useSignOut } from "../../../hooks/firebase/user/useSign";
import { useLoading } from "../../../hooks/useLoading";

const SetStaffDataModal = (props) => {
  const { user_query } = useSelectUser_query();
  const { loading } = useLoading();
  const { loadSingOut } = useSignOut();
  const router = useRouter();
  const theme = createTheme();
  const inputRef = React.useRef(null);
  const { file, handleChange, url, uploadStoreImage, changeStaffData } =
    UploadImage();
  const [data, setData] = React.useState({
    name: "",
    error: false,
  });
  return (
    <>
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Modals>
          <ThemeProvider theme={theme}>
            <Container maxWidth="lg">
              <CssBaseline />
              <Box
                sx={{
                  my: 8,
                  mx: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                  <LockIcon />
                </Avatar>
                <Typography component="h1" variant="h5" fontFamily="Georgia">
                  スタッフ情報登録
                </Typography>
                <Box
                  component="form"
                  noValidate
                  onSubmit={(e) => {
                    changeStaffData(
                      e,
                      props.queryID,
                      data.name,
                      url,
                      user_query?.times,
                      "staff"
                    ).then(() => {
                      loadSingOut().then(() =>
                        setTimeout(() => router.push("/login/store/"), 1000)
                      );
                    });
                  }}
                  sx={{ mt: 1 }}
                >
                  <Box display={"flex"} width={500}>
                    <Box
                      width={"40%"}
                      display={"flow-root"}
                      my={"auto"}
                      justifyContent={"center"}
                    >
                      <Title_15 fontSize={15} textTitle={"スタッフ名"} />
                    </Box>
                    <Box width={"60%"}>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="name"
                        label="スタッフ名"
                        id="outlined-basic"
                        helperText={inputRef?.current?.validationMessage}
                        onChange={(e) => {
                          setData({ ...data, name: e.target.value });
                        }}
                      />
                    </Box>
                  </Box>
                  {/* <Box display={"flex"} width={500} mb={3}>
                    <Box
                      width={"40%"}
                      display={"flow-root"}
                      my={"auto"}
                      justifyContent={"center"}
                    >
                      <Box display={"flow-root"}>
                        <Title_15 fontSize={15} textTitle={"店舗画像"} />
                        <Title_15
                          fontSize={10}
                          textTitle={"※アイコンとして表示されます"}
                        />
                      </Box>
                    </Box>
                    <Box width={"60%"}>
                      <Box display={"flex"} justifyContent={"center"}>
                        <Button variant="contained" sx={{ mt: 2, mx: "auto" }}>
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
                      </Box>
                      <Box display={"flex"} justifyContent={"center"}>
                        {loading == true ? (
                          <Button sx={{ fontSize: 12 }}>
                            ダウンロード中...
                          </Button>
                        ) : (
                          <Button
                            onClick={(e) => uploadStoreImage(e)}
                            sx={{ fontSize: 12 }}
                          >
                            ダウンロード
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Box> */}
                  <Box textAlign="center">
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{
                        mt: 5,
                        mb: 4,
                        alignItems: "center",
                        fontFamily: "Georgia",
                      }}
                    >
                      登録
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Container>
          </ThemeProvider>
        </Modals>
      </Modal>
    </>
  );
};

export default SetStaffDataModal;
