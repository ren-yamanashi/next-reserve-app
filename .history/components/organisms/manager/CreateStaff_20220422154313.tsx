import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import React from "react";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import { blue } from "@mui/material/colors";
//import my File
import Title_15 from "../../atoms/Text/Title_15";
import { useHandle } from "../../../hooks/useHandle";
import CreateStaffModal from "../../templates/Modal/CreateStaff";
import SetStaffDataModal from "../../templates/Modal/SetStaffData";
import { useRouter } from "next/router";

type Query = {
  id: string;
};

const CreateStaff = () => {
  const router = useRouter();
  const query = router.query as Query;
  const { handleOpen } = useHandle();
  return (
    <React.Fragment>
      <>
        <Box mb={3} display="flex" justifyContent="center" mx="auto">
          <Grid item xs={6} sm={4} lg={4} md={5}>
            <Box mb={3} display="flex" justifyContent="center" mx="auto">
              <CardContent
                style={{
                  borderRadius: "7px",
                  borderStyle: "dashed",
                  borderWidth: "2px",
                  borderColor: blue[600],
                  margin: "auto",
                  height: 250,
                  width: 230,
                }}
              >
                <Box display="flow-root" justifyContent={"center"} mx={"auto"}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 5,
                    }}
                  >
                    <IconButton onClick={handleOpen}>
                      <PersonAddAltIcon
                        sx={{ fontSize: 60, color: blue[600] }}
                      />
                    </IconButton>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 3,
                    }}
                  >
                    <Title_15
                      fontSize={15}
                      color={blue[500]}
                      textTitle={"スタッフを追加"}
                      fontWeight={600}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Box>
          </Grid>
        </Box>
      </>
      <CreateStaffModal />
      <SetStaffDataModal queryID={query.id} />
    </React.Fragment>
  );
};

export default CreateStaff;
