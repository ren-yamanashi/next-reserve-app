import TeachersRsv from "../../../organisms/manager/TeachersRsv";
import Header from "../../../templates/Header/HeaderNext";
import HeaderAtMd from "../../../templates/Header/Header";
import { createMedia } from "@artsy/fresnel";
import { Box } from "@mui/material";
//MediaQuery設定
const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    sm: 0,
    md: 600,
    lg: 990,
    xl: 1220,
  },
});

const Rsv_Teacher = () => {
  return (
    <>
      <MediaContextProvider>
        <Media greaterThan="md">
          <Header>
            <Box mt={10}>
              <TeachersRsv />
            </Box>
          </Header>
        </Media>
        <Media at="md">
          <HeaderAtMd />
          <TeachersRsv />
        </Media>
        <Media at="sm">
          <HeaderAtMd />
          <TeachersRsv />
        </Media>
      </MediaContextProvider>
    </>
  );
};

export default Rsv_Teacher;
