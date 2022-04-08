import * as React from "react";
import Select from "@mui/material/Select";
interface SelectComponent {
  children?: React.ReactNode;
}

export default function SelectComponent(props: SelectComponent) {
  return (
    <Select
      labelId="demo-simple-select-standard-label"
      id="demo-simple-select-standard"
    >
      {props.children}
    </Select>
  );
}
