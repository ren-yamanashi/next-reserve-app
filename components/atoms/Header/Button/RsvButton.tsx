import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Link_mui from "@mui/material/Link";
import DateRangeIcon from "@mui/icons-material/DateRange";
const RsvButton = (props) => {
  return (
    <>
      <Link_mui href={props.goLink}>
        <ListItem button key="Home">
          <ListItemIcon>
            <DateRangeIcon sx={{ color: "#e3f2fd", mt: 2 }} />
          </ListItemIcon>
          <ListItemText
            primary="予約確認 / 登録"
            sx={{ color: "#e3f2fd", fontSize: "13px", mt: 2 }}
          />
        </ListItem>
      </Link_mui>
    </>
  );
};

export default RsvButton;
