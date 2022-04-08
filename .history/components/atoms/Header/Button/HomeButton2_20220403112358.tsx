import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Link_mui from "@mui/material/Link";
import ListIcon from "@mui/icons-material/List";
import HomeIcon from "@mui/icons-material/Home";
import { blue } from "@mui/material/colors";
const HomeButton_Blue = (props) => {
  return (
    <>
      <Link_mui href={props.goLink}>
        <ListItem button key="Home">
          <ListItemIcon>
            <HomeIcon sx={{ color: blue[500] }} />
          </ListItemIcon>
          <ListItemText
            primary="ホーム"
            sx={{ color: blue[500], fontSize: "13px" }}
          />
        </ListItem>
      </Link_mui>
    </>
  );
};

export default HomeButton_Blue;
