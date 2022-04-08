import React, { useState, FC } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import { ToastContainer } from "react-toastify";

import { useLogin } from "../../hooks/user/useUserList";
import { useAuth } from "../../hooks/useUserAuth";
import { useAlert } from "../../hooks/alert/useAlert";
import Header2 from "../../components/templates/Header3";
import Success from "../../components/atoms/Alert/Success";
import Error from "../../components/atoms/Alert/Error";
import LoginComponent from "../../components/templates/Sign/Login";

const LoginPage: FC = () => {
  const theme = createTheme();
  const { user } = useAuth();
  const { errMsg, successMsg } = useAlert();
  const { loadLoginUser, loadResetPassword } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <>
      <Header2 />
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
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
            <LoginComponent />
            <Box
              component="form"
              noValidate
              onSubmit={(event) => {
                loadLoginUser(
                  event,
                  email,
                  password,
                  `/home/students/${user.uid}`,
                  "student"
                );
              }}
              sx={{ mt: 1 }}
            >
              <Box sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={(e) => setEmail(e.currentTarget.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.currentTarget.value)}
                />
                <Box textAlign="center">
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 4,
                      width: "30%",
                      alignItems: "center",
                      fontFamily: "Georgia",
                    }}
                  >
                    Login
                  </Button>
                </Box>
                <Divider />
                <Box textAlign="center" mt={1}>
                  <Button onClick={(event) => loadResetPassword(event, email)}>
                    パスワード再発行/ 変更
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
        {errMsg && errMsg == true && (
          <Error>アカウント取得に失敗しました</Error>
        )}
        {errMsg == false && successMsg == true && (
          <Success>ログインしました</Success>
        )}
      </ThemeProvider>
      <ToastContainer />
    </>
  );
};
export default LoginPage;
