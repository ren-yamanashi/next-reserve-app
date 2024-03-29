import React, { useState, FC } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import { ToastContainer } from "react-toastify";

import { useAuth } from "../../../hooks/useUserAuth";
import Header2 from "../../../components/templates/Header3";
import { useLogin } from "../../../hooks/user/useUserList";
import { useAlert } from "../../../hooks/alert/useAlert";
import ResetPass from "../../../components/templates/Sign/ResetPassword";
import Login from "../../../components/templates/Sign/Login";
import LoginButton from "../../../components/templates/Sign/LoginButton";
import Error from "../../../components/atoms/Alert/Error";
import Success from "../../../components/atoms/Alert/Success";

const LoginPage: FC = () => {
  const theme = createTheme();
  const { user } = useAuth();
  const { errMsg, successMsg } = useAlert();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loadLoginUser } = useLogin();
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
            <Login />
            <Box
              component="form"
              noValidate
              onSubmit={(event) =>
                loadLoginUser(
                  event,
                  email,
                  password,
                  `/reserve/${user?.uid}`,
                  "teacher"
                )
              }
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
                <LoginButton />
                <Divider />
                <ResetPass />
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
