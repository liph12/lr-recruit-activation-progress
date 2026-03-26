import { useAppProvider } from "../providers/AppProvider";
import Webinar from "./Webinar";
import WebinarConfirmation from "./WebinarConfirmation";
import WebinarUploadAttendance from "./WebinarUploadAttendance";
import WebinarConfirmationContacts from "./WebinarConfirmationContacts";
import NavbarLayout from "../components/layouts/NavbarLayout";
import AccountDefault from "./AccountDefault";
import UploadAvatar from "./UploadAvatar";
import BackToLogin from "./BackToLogin";
import type { User } from "../types/user";

export default function GetStarted() {
  const { user } = useAppProvider();

  const RenderPage = ({ user }: { user: User | null }) => {
    if (!user) return <BackToLogin />;

    if (user.photo) {
      if (user.confirmation === "disapproved") {
        return <WebinarConfirmation />;
      } else {
        if (user.confirmation === "yes") {
          if (user.webinar_progress === 100) {
            return <AccountDefault />;
          } else if (user.uploaded_attendance) {
            return <WebinarConfirmationContacts />;
          } else {
            return <WebinarUploadAttendance />;
          }
        } else if (user.confirmation === "no") {
          if (user.webinar_progress === 100) {
            return <AccountDefault />;
          } else {
            return <Webinar />;
          }
        } else {
          return <WebinarConfirmation />;
        }
      }
    } else {
      return <UploadAvatar />;
    }
  };

  return (
    <NavbarLayout>
      <RenderPage user={user} />
    </NavbarLayout>
  );
}
