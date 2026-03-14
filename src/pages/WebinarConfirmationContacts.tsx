import { Box, Typography } from "@mui/material";
import { useAppProvider } from "../providers/AppProvider";
import { CheckCircleRounded } from "@mui/icons-material";

export default function WebinarConfirmationContacts() {
  const { desktop, user } = useAppProvider();
  const isDirect = user?.sponsor?.id === 17;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        height: desktop ? "80vh" : "85vh",
        alignItems: "center",
        px: desktop ? 0 : 2,
      }}
    >
      <CheckCircleRounded
        sx={{ fontSize: desktop ? 59 : 50 }}
        color="success"
      />
      <Typography variant={desktop ? "h3" : "h4"} fontWeight="bold">
        NAO Attendance Uploaded
      </Typography>
      <Typography variant={desktop ? "h5" : "body1"} fontWeight="bold">
        Please contact your Sponsor to assist you with your attendance approval.
      </Typography>
      <Typography sx={{ mt: 1 }} variant="h6">
        They will send you a notification status once they approved or not.
      </Typography>
      <Box sx={{ mt: 2 }}>
        {isDirect ? (
          <>
            <Typography variant="h5">Chijah Ilaida</Typography>
            <Typography>09233143999</Typography>
            <Typography>it.dept.leuteriorealty@gmail.com</Typography>
            <Typography color="textSecondary">
              Leuterio Direct Secretary
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h5">{user?.sponsor?.name}</Typography>
            <Typography>{user?.sponsor?.mobile}</Typography>
            <Typography>{user?.sponsor?.email}</Typography>
            <Typography color="textSecondary">Sponsor</Typography>
          </>
        )}
      </Box>
      <Box sx={{ mt: 2 }}>
        <img
          src="/images/notify-phone-icon.png"
          width={desktop ? 300 : 200}
          height="auto"
        />
      </Box>
    </Box>
  );
}
