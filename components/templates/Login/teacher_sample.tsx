import React, { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import { ToastContainer } from "react-toastify";
// import my File
import Header2 from "../../templates/Header/Header3";
import { useLogin } from "../../../hooks/firebase/user/useSign";
import Login from "../../atoms/Sign/Login";
import LoginButton from "../../atoms/Sign/LoginButton";
import Title_15 from "../../atoms/Text/Title_15";

const LoginPage_Teacher = () => {
  const theme = createTheme();
  const [data, setData] = useState({ email: "", password: "" });
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
                loadLoginUser(event, data.email, data.password)
              }
              sx={{ mt: 1 }}
            >
              <Box sx={{ mt: 1 }}>
                <Title_15
                  fontSize={15}
                  fontWeight={600}
                  textTitle={" 下記内容を入力してログインしてください"}
                  style={{
                    mb: 1,
                    mt: 1,
                    textAlign: "center",
                  }}
                />
                <Title_15
                  fontSize={15}
                  textTitle={
                    <>
                      Email : staff@test.example
                      <br />
                      Password : 123123123
                    </>
                  }
                  style={{
                    mb: 2,
                    mt: 1,
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={(e) =>
                    setData({ ...data, email: e.currentTarget.value })
                  }
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
                  onChange={(e) =>
                    setData({ ...data, password: e.currentTarget.value })
                  }
                />
                <LoginButton />
              </Box>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
      <ToastContainer />
    </>
  );
};
export default LoginPage_Teacher;
