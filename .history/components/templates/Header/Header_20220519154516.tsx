import React, { useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FormControl from "@mui/material/FormControl";
import { useRouter } from "next/router";
import { createMedia } from "@artsy/fresnel";
//import my File
import { useAuth } from "../../../hooks/firebase/useUserAuth";
import { useSignOut } from "../../../hooks/firebase/user/useSign";
import { blue, grey, teal } from "@mui/material/colors";
import InputLabelComponent2 from "../../atoms/Header/InputLabel/InputLabel_white";
import SelectComponent from "../../atoms/Header/Select";
import RsvButton from "../../atoms/Header/Button/RsvButton2";
import MenuItemComponent from "../../atoms/Header/MenuItem";
import Main from "../../atoms/Header/Main";
import AppBar from "../../atoms/Header/AppBar/AppBar2";
import DrawerHeader from "../../atoms/Header/Drawer/DrawerHeader";
import HomeButton_Blue from "../../atoms/Header/Button/HomeButton2";
import ShiftButton_Blue from "../../atoms/Header/Button/ShiftButton2";
const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    sm: 0,
    md: 450,
    lg: 990,
    xl: 1200,
  },
});

const drawerWidth = 210;

const Header = () => {
  const theme = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { loadSingOut } = useSignOut();
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      <MediaContextProvider>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar>
            <Media greaterThan="sm">
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerOpen}
                  sx={{ ...(open && { display: "none" }), mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
                <>
                  <FormControl
                    variant="standard"
                    sx={{ m: 1, minWidth: 120, color: "white" }}
                  >
                    <InputLabelComponent2>
                      {!user ? "Anonymous" : user.displayName}
                    </InputLabelComponent2>
                    <SelectComponent>
                      {!user ? (
                        <>
                          <MenuItemComponent
                            clickEvent={() =>
                              loadSingOut().then(() => router.push("/"))
                            }
                            buttonText={"トップへ戻る"}
                            style={{ display: "block", width: "100%" }}
                          />
                        </>
                      ) : (
                        <>
                          <MenuItemComponent
                            clickEvent={() => router.push("/staff/profile/")}
                            buttonText={"アカウント情報編集"}
                            style={{ display: "block", width: "100%" }}
                          />
                          <MenuItemComponent
                            clickEvent={() =>
                              loadSingOut().then(() =>
                                router.push("/login/staff/")
                              )
                            }
                            buttonText={"ログアウト"}
                            style={{ display: "block", width: "100%" }}
                          />
                        </>
                      )}
                    </SelectComponent>
                  </FormControl>
                </>
              </Toolbar>
            </Media>
            {/* Media Mobile */}
            <Media at="sm">
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerOpen}
                  sx={{ ...(open && { display: "none" }) }}
                >
                  <MenuIcon />
                </IconButton>
                <>
                  <FormControl
                    variant="standard"
                    sx={{
                      ml: 2,
                      mb: 1,
                      minWidth: 90,
                      color: "#0288d1",
                      textAlign: "right",
                    }}
                  >
                    <InputLabelComponent2>
                      {user && user.displayName}
                    </InputLabelComponent2>
                    <SelectComponent>
                      <MenuItemComponent
                        clickEvent={() => router.push("/staff/profile/")}
                        buttonText={"アカウント情報編集"}
                        style={{ display: "block", width: "100%" }}
                      />
                      <MenuItemComponent
                        clickEvent={() => router.push(`/login/staff`)}
                        buttonText={"ログアウト"}
                        style={{ display: "block", width: "100%" }}
                      />
                    </SelectComponent>
                  </FormControl>
                </>
              </Toolbar>
            </Media>
          </AppBar>
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                bgcolor: grey[100],
              },
            }}
            variant="persistent"
            anchor="left"
            open={open}
          >
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? (
                  <ChevronLeftIcon sx={{ color: blue[500] }} />
                ) : (
                  <ChevronRightIcon sx={{ color: blue[500] }} />
                )}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
              <HomeButton_Blue goLink={"/staff/home/"} />
              <ShiftButton_Blue goLink={"/staff/shift/"} />
              <RsvButton goLink={"/staff/reserve/"} />
            </List>
          </Drawer>
          <Main open={open}>
            <DrawerHeader />
          </Main>
        </Box>
      </MediaContextProvider>
    </>
  );
};

export default Header;
