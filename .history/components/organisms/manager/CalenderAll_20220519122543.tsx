import * as React from "react";
import moment from "moment";
import Box from "@mui/material/Box";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { ToastContainer } from "react-toastify";
//import my File
import Loading from "../../atoms/loading/loadingComponent";
import RsvModal from "../../templates/Modal/RsvModal";
import AlertComponent from "../../atoms/Alert/Alert";
import { useCalenderEvent } from "../../../hooks/date/useCalenderEvent";
import { useChancelRsv } from "../../../hooks/firebase/manager/useReserves";
import { useSelectReserve } from "../../../hooks/useSelectReserve";
import { useAuth } from "../../../hooks/firebase/useUserAuth";
import { useLoading } from "../../../hooks/useLoading";
import { useHandle } from "../../../hooks/useHandle";
moment.locale("ja");

const CalenderAll: React.FC = () => {
  const { user } = useAuth();
  const { rsvData, selectRsv } = useSelectReserve();
  const { setEvent, formats } = useCalenderEvent();
  const { chancelRsv } = useChancelRsv();
  const localizer = momentLocalizer(moment);
  const { loading } = useLoading();
  const { handleOpen1, handleClose1, open } = useHandle();
  return (
    <>
      <React.Fragment>
        {loading == true ? (
          <Loading />
        ) : (
          <>
            {!user ? (
              <AlertComponent>ログインしてください</AlertComponent>
            ) : (
              <>
                <Box mb={3} mx="auto" mt={5}>
                  <Calendar
                    views={["month"]}
                    selectable
                    localizer={localizer}
                    defaultDate={new Date()}
                    defaultView="month"
                    events={setEvent}
                    style={{ height: "120vh" }}
                    onSelectEvent={(item) => {
                      handleOpen1();
                      selectRsv(item);
                    }}
                    formats={formats}
                  />
                </Box>
              </>
            )}
          </>
        )}
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
      </React.Fragment>
    </>
  );
};

export default CalenderAll;
