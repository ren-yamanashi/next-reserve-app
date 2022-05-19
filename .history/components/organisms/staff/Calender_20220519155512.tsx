import * as React from "react";
import moment from "moment";
import Box from "@mui/material/Box";
import { createMedia } from "@artsy/fresnel";
import { ToastContainer } from "react-toastify";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
// import my File
import { useAuth } from "../../../hooks/firebase/useUserAuth";
import { useChancelRsv } from "../../../hooks/firebase/manager/useReserves";
import { useCalenderEvent_Teacher } from "../../../hooks/date/useCalenderEvent_Teacher";
import { useSelectReserve } from "../../../hooks/useSelectReserve";
import { useHandle } from "../../../hooks/useHandle";
import RsvModal from "../../templates/Modal/RsvModal";
import AlertComponent from "../../atoms/Alert/Alert";
moment.locale("ja");
//create Media
const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    sm: 0,
    md: 600,
    lg: 990,
    xl: 1200,
  },
});
// カレンダー
const Calender_Staff = () => {
  const { selectRsv, rsvData } = useSelectReserve();
  const { chancelRsv } = useChancelRsv();
  const { formats, setEvent, setEventAtSm } = useCalenderEvent_Teacher();
  const { user } = useAuth();
  const { open, handleOpen1, handleClose1 } = useHandle();
  const localizer = momentLocalizer(moment);
  return (
    <>
      <MediaContextProvider>
        <React.Fragment>
          {!user ? (
            <AlertComponent>ログインしてください</AlertComponent>
          ) : (
            <>
              <Media greaterThan="sm">
                <Box mb={3} width="95%" mx="auto">
                  <Calendar
                    views={["month"]}
                    selectable
                    localizer={localizer}
                    defaultDate={new Date()}
                    defaultView="month"
                    events={setEvent}
                    style={{ height: "180vh" }}
                    onSelectEvent={(e) => {
                      handleOpen1();
                      selectRsv(e);
                    }}
                    formats={formats}
                  />
                </Box>
              </Media>
              {/* mobile */}
              <Media at="sm">
                <Box overflow="scroll">
                  <Box mb={3} width="120%" mx="auto">
                    <Calendar
                      views={["month"]}
                      selectable
                      localizer={localizer}
                      defaultDate={new Date()}
                      defaultView="month"
                      events={setEventAtSm}
                      style={{
                        height: "200vh",
                      }}
                      onSelectEvent={(event) => {
                        handleOpen1();
                        selectRsv(event);
                      }}
                      formats={formats}
                    />
                  </Box>
                </Box>
              </Media>
              {/* 予約詳細確認 */}
              <RsvModal
                open={open.open1}
                handleClose={handleClose1}
                date={rsvData.date}
                teacher={user && user.displayName}
                student={rsvData.rsvStudent}
                email={rsvData.email}
                phoneNumber={rsvData.phoneNumber}
                reserver={rsvData.reserver}
                chancelRsv={(e) => {
                  chancelRsv(e, rsvData.id);
                  handleClose1();
                }}
              />
              <ToastContainer />
            </>
          )}
        </React.Fragment>
      </MediaContextProvider>
    </>
  );
};

export default Calender_Staff;
