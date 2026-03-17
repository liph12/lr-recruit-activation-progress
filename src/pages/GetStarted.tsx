import { useAppProvider } from "../providers/AppProvider";
import Webinar from "./Webinar";
import WebinarConfirmation from "./WebinarConfirmation";
import WebinarUploadAttendance from "./WebinarUploadAttendance";
import WebinarConfirmationContacts from "./WebinarConfirmationContacts";
import NavbarLayout from "../components/layouts/NavbarLayout";
import AccountDefault from "./AccountDefault";
import UploadAvatar from "./UploadAvatar";
import PageLoader from "../components/PageLoader";

export default function GetStarted() {
  const { user } = useAppProvider();

  let content;

  if (!user) {
    return <PageLoader />;
  }

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

  return <NavbarLayout>{content}</NavbarLayout>;
}
