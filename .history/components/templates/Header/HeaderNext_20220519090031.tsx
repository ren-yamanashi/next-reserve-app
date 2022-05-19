import React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import List from "@mui/material/List";
import { useRouter } from "next/router";
import FormControl from "@mui/material/FormControl";
// import my File
import { useAuth } from "../../../hooks/firebase/useUserAuth";
import { useSignOut } from "../../../hooks/firebase/user/useSign";
import AppBarComponent from "../../atoms/Header/AppBar/AppBar";
import InputLabelComponent from "../../atoms/Header/InputLabel/InputLabel";
import SelectComponent from "../../atoms/Header/Select";
import MenuItemComponent from "../../atoms/Header/MenuItem";
import DrawerComponent from "../../atoms/Header/Drawer/Drawer";
import HomeButton from "../../atoms/Header/Button/HomeButton";
import RsvButton from "../../atoms/Header/Button/RsvButton";
import ShiftButton from "../../atoms/Header/Button/ShiftButton";
import { Query } from "../../../models/router_query";
interface HeaderProps {
  children?: React.ReactNode;
}

const MainHeader = (props: HeaderProps) => {
  const { user } = useAuth();
  const { loadSingOut } = useSignOut();
  const router = useRouter();
  const query = router.query as Query;
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBarComponent>
        <Toolbar>
          <>
            <FormControl
              variant="standard"
              sx={{ m: 1, minWidth: 120, color: "#0288d1" }}
            >
              <InputLabelComponent>
                {!user ? "Anonymous" : user.displayName}
              </InputLabelComponent>
              <SelectComponent>
                {!user ? (
                  <>
                    <MenuItemComponent
                      clickEvent={() => router.push(`/${query?.id}/staffs`)}
                      buttonText={"スタッフ一覧 / 登録"}
                      style={{ display: "block", width: "100%" }}
                    />
                    <MenuItemComponent
                      clickEvent={() => router.push("/")}
                      buttonText={"トップへ戻る"}
                      style={{ display: "block", width: "100%" }}
                    />
                  </>
                ) : (
                  <>
                    <MenuItemComponent
                      clickEvent={() =>
                        router.push(`/add/${user?.displayName}/`)
                      }
                      buttonText={"店舗情報編集"}
                      style={{ display: "block", width: "100%" }}
                    />
                    <MenuItemComponent
                      clickEvent={() =>
                        router.push(`/${user?.displayName}/staffs`)
                      }
                      buttonText={"スタッフ一覧 / 登録"}
                      style={{ display: "block", width: "100%" }}
                    />
                    <MenuItemComponent
                      clickEvent={() =>
                        loadSingOut().then(() => router.push(`/login/store`))
                      }
                      buttonText={"ログアウト"}
                      style={{ display: "block", width: "100%" }}
                    />
                    <MenuItemComponent
                      clickEvent={() =>
                        loadSingOut().then(() => router.push(`/login/staff`))
                      }
                      buttonText={"スタッフログイン"}
                      style={{ display: "block", width: "100%" }}
                    />
                  </>
                )}
              </SelectComponent>
            </FormControl>
          </>
        </Toolbar>
      </AppBarComponent>
      <DrawerComponent>
        <Toolbar />
        <List>
          {!user ? (
            <>
              <HomeButton goLink={`/${query?.id}/home/`} />
              <ShiftButton
                addShift={() => router.push(`/${query?.id}/staffs`)}
                seeShift={() => router.push(`/${query?.id}/shift`)}
              />
              <RsvButton goLink={`/${query?.id}/reserve/`} />
            </>
          ) : (
            <>
              <HomeButton goLink={`/${user?.displayName}/home/`} />
              <ShiftButton
                addShift={() => router.push(`/${user?.displayName}/staffs`)}
                seeShift={() => router.push(`/${user?.displayName}/shift`)}
              />
              <RsvButton goLink={`/${user?.displayName}/reserve/`} />
            </>
          )}
        </List>
      </DrawerComponent>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        {props.children}
      </Box>
    </Box>
  );
};

export default MainHeader;
