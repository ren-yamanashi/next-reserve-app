import * as React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Modals from "../../atoms/Modal/Modal";
import TitleComponent from "../../atoms/Text/Title";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { teal } from "@mui/material/colors";
import PrimaryBtn from "../../atoms/Button/PrimaryButton";
import { useHandle } from "../../../hooks/useHandle";
import { useReserves_teacher } from "../../../hooks/firebase/manager/useReserves";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import { useLoading } from "../../../hooks/useLoading";
import { Query } from "../../../models/router_query";
import {
  useFreeSpace_newValue,
  useSelectTeacher,
} from "../../../hooks/firebase/manager/useShift";

//OK
const SelectTeacherModal = (props) => {
  const { startLoading, completeLoading, loading } = useLoading();
  const { handleClose7, onOpen7 } = useHandle();
  const { loadRsvTeacher } = useReserves_teacher();
  const { loadSelectTeacher } = useSelectTeacher();
  const { loadFreeSpace_newValue } = useFreeSpace_newValue();
  const router = useRouter();
  const query = router.query as Query;
  const pageSelect = (userName) => {
    router.push(`/teachers/${userName.id}/`).then(() => {
      startLoading();
      setTimeout(() => {
        completeLoading();
      }, 1000);
      router.reload();
    });
  };
  const pageSelect2 = (userName, queryId) => {
    router.push(`/${queryId}/${userName.id}/`).then(() => {
      startLoading();
      setTimeout(() => {
        completeLoading();
      }, 1000);
      router.reload();
    });
  };
  return (
    <>
      <Modal
        open={onOpen7}
        onClose={handleClose7}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Modals>
          <TitleComponent>担当者を選択してください</TitleComponent>
          <Table size="small" sx={{ margin: "auto" }}>
            <TableHead style={{ backgroundColor: "#FFFFDD" }}>
              <TableRow>
                <TableCell
                  width="50%"
                  sx={{ textAlign: "center", fontSize: 13 }}
                >
                  担当者名
                </TableCell>
                <TableCell
                  width="20%"
                  sx={{ textAlign: "center", fontSize: 13 }}
                ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell
                    width="50%"
                    sx={{ textAlign: "center", fontSize: 12 }}
                  >
                    <Box display="flex">
                      <Box
                        component="img"
                        sx={{
                          height: 40,
                          width: 40,
                          borderRadius: "50%",
                        }}
                        alt={user.userName}
                        src={user.staffImageURL}
                      />
                      <Box
                        sx={{
                          textAlign: "center",
                          my: "auto",
                          ml: 1,
                          fontSize: "11px",
                        }}
                      >
                        {user.userName}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell
                    width="50%"
                    sx={{ textAlign: "center", fontSize: 12 }}
                  >
                    <PrimaryBtn
                      style={{ bgcolor: teal[500], fontSize: 12 }}
                      buttonText={"選択"}
                      click={() => {
                        props.load == 1 && pageSelect(user);
                        handleClose7();
                        props.load == 2 &&
                          loadSelectTeacher(
                            props.newDate,
                            user.userName,
                            props.queryId
                          );
                        props.load !== 3
                          ? loadRsvTeacher(user?.userName)
                          : router.push(`/${props.queryId}/${user.id}`);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Modals>
      </Modal>
      <ToastContainer />
    </>
  );
};
export default SelectTeacherModal;
