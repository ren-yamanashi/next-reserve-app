import { blue, grey, teal } from "@mui/material/colors";
import TableCell from "@mui/material/TableCell";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import { Button } from "@mui/material";
import RectangleIcon from "@mui/icons-material/Rectangle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

const TableCellComponent8 = (props) => {
  return (
    <>
      <TableCell
        sx={{
          borderStyle: "dashed",
          borderWidth: "1px",
          cursor: "pointer",
          height: 50,
          bgcolor: grey[300],
        }}
        onClick={props.clickEvent}
      >
        {props.rsv.map(
          (item) =>
            props.teacherName == item.teacher &&
            (item.student !== "" ? (
              <Tooltip
                title={
                  <>
                    <Box>{`講師名:${item.teacher}`}</Box>
                    <Box>{`生徒名:${item.student}`}</Box>
                    <Box>{`レッスン日時:${dayjs(item.date.toDate()).format(
                      "YYYY/MM/DD "
                    )} ${item.time}:00~`}</Box>
                  </>
                }
              >
                <Box
                  ml={4}
                  width={30}
                  height={30}
                  display="flex"
                  justifyContent="center"
                  borderRadius={2}
                  bgcolor={grey[600]}
                >
                  <RadioButtonUncheckedIcon
                    sx={{
                      color: "white",
                      fontSize: 12,
                      my: "auto",
                    }}
                  />
                </Box>
                {/* <Button
                  sx={{
                    bgcolor: teal[300],
                    boxShadow: "none",
                    height: 30,
                    "&:hover": { bgcolor: teal[300] },
                  }}
                  fullWidth
                /> */}
              </Tooltip>
            ) : (
              <Tooltip
                title={
                  <>
                    <Box>クリックして予約</Box>
                    <Box>{`レッスン日時:${dayjs(item.date.toDate()).format(
                      "YYYY/MM/DD "
                    )} ${item.time}:00~`}</Box>
                  </>
                }
              >
                <Button
                  sx={{
                    bgcolor: blue[200],
                    boxShadow: "none",
                    height: 30,
                    "&:hover": { bgcolor: blue[200] },
                  }}
                  fullWidth
                />
              </Tooltip>
            ))
        )}
      </TableCell>
    </>
  );
};
export default TableCellComponent8;
