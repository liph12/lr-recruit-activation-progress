import { useAppProvider } from "../providers/AppProvider";
import { useParams, Outlet } from "react-router-dom";
import Webinar from "./Webinar";
import WebinarConfirmation from "./WebinarConfirmation";
import WebinarUploadAttendance from "./WebinarUploadAttendance";
import WebinarConfirmationContacts from "./WebinarConfirmationContacts";
import TrainingCourses from "./TrainingCourses";
import NavbarLayout from "../components/layouts/NavbarLayout";
import TrainingNavbarLayout from "../components/layouts/TrainingNavbarLayout";

export default function GetStarted() {
  const { course_id } = useParams();
  const { user } = useAppProvider();

  let content;
  let isMain = true;

  if (user?.confirmation === "yes") {
    if (user?.webinar_progress === 100) {
      if (course_id) {
        content = <Outlet context={{ course_id }} />;
      } else {
        content = <TrainingCourses />;
      }

      isMain = false;
    } else if (user?.uploaded_attendance) {
      content = <WebinarConfirmationContacts />;
    } else {
      content = <WebinarUploadAttendance />;
    }
  } else if (user?.confirmation === "no") {
    content = <Webinar />;
  } else {
    content = <WebinarConfirmation />;
  }

  return isMain ? (
    <NavbarLayout>{content}</NavbarLayout>
  ) : (
    <TrainingNavbarLayout>{content}</TrainingNavbarLayout>
  );
}
