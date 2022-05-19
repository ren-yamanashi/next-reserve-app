import React, { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import { ToastContainer } from "react-toastify";
// import my File
import { useLogin } from "../../../hooks/firebase/user/useSign";
import Header2 from "../../templates/Header/Header3";
import ResetPass from "../../atoms/Sign/ResetPassword";
import Login from "../../atoms/Sign/Login";
import LoginButton from "../../atoms/Sign/LoginButton";
import Footer from "../Footer/Footer";
import Title_15 from "../../atoms/Text/Title_15";

//OK
const LoginPage_Manager = () => {
  const theme = createTheme();
  const { loginStore } = useLogin();
  const [data, setData] = useState({ email: "", password: "" });
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
              onSubmit={(e) => loginStore(e, data.email, data.password)}
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
                      Email : pinokionigg@icloud.com
                      <br />
                      Password : 123456789
                    </>
                  }
                  style={{
                    mb: 1,
                    mt: 1,
                    textAlign: "center",
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
                <Divider />
                <ResetPass />
              </Box>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
      <ToastContainer />
      <Footer />
    </>
  );
};
export default LoginPage_Manager;
