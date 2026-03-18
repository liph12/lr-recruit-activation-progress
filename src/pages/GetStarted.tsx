import { useAppProvider } from "../providers/AppProvider";
import Webinar from "./Webinar";
import WebinarConfirmation from "./WebinarConfirmation";
import WebinarUploadAttendance from "./WebinarUploadAttendance";
import WebinarConfirmationContacts from "./WebinarConfirmationContacts";
import NavbarLayout from "../components/layouts/NavbarLayout";
import AccountDefault from "./AccountDefault";
import UploadAvatar from "./UploadAvatar";
import BackToLogin from "./BackToLogin";

export default function GetStarted() {
  const { user } = useAppProvider();

  let content;

  if (user) {
    if (user?.photo) {
      if (user?.confirmation === "yes") {
        if (user?.webinar_progress === 100) {
          content = <AccountDefault />;
        } else if (user?.uploaded_attendance) {
          content = <WebinarConfirmationContacts />;
        } else {
          content = <WebinarUploadAttendance />;
        }
      } else if (user?.confirmation === "no") {
        if (user?.webinar_progress === 100) {
          content = <AccountDefault />;
        } else {
          content = <Webinar />;
        }
      } else {
        content = <WebinarConfirmation />;
      }
    } else {
      content = <UploadAvatar />;
    }
  } else {
    content = <BackToLogin />;
  }

  return <NavbarLayout>{content}</NavbarLayout>;
}
