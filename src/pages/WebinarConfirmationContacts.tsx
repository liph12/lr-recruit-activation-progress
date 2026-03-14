import { Box, Typography, Paper, Divider, Avatar } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useAppProvider } from "../providers/AppProvider";
import {
  CheckCircleRounded,
  ContactPhoneRounded,
  MailRounded,
  PhoneIphoneRounded,
} from "@mui/icons-material";

export default function WebinarConfirmationContacts() {
  const { desktop, user } = useAppProvider();
  const isDirect = user?.sponsor?.id === 17;

  const contactName = isDirect ? "Chijah Ilaida" : user?.sponsor?.name;
  const contactPhone = isDirect ? "09233143999" : user?.sponsor?.mobile;
  const contactEmail = isDirect
    ? "it.dept.leuteriorealty@gmail.com"
    : user?.sponsor?.email;
  const contactRole = isDirect ? "Leuterio Direct Secretary" : "Sponsor";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: desktop ? "80vh" : "90vh",
        py: 4,
        px: 2,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Grid
        container
        spacing={5}
        sx={{ maxWidth: "1200px", alignItems: "center" }}
      >
        <Grid
          size={{ xs: 12, md: 7 }}
          sx={{ textAlign: desktop ? "left" : "center" }}
        >
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                justifyContent: desktop ? "flex-start" : "center",
                mb: 2,
              }}
            >
              <CheckCircleRounded sx={{ fontSize: 50, color: "#2e7d32" }} />
              <Typography
                variant={desktop ? "h3" : "h4"}
                fontWeight="800"
                sx={{ color: "#1a1a1a", letterSpacing: "-1px" }}
              >
                Attendance Uploaded!
              </Typography>
            </Box>

            <Typography
              variant="body1"
              sx={{ color: "#666", maxWidth: "600px" }}
            >
              Please contact your <b>{contactRole}</b> to assist you with your
              attendance approval. They will send you a status notification once
              they approved or reviewed it.
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: 4,
              width: "100%",
              maxWidth: "500px",
              borderRadius: "20px",
              backdropFilter: "blur(12px)",

              // border: "1px solid #eee",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              // bgcolor: "#fdfdfd",
              bgcolor: "rgba(255, 255, 255, 0.1)",
              // boxShadow: "0px 10px 30px rgba(0,0,0,0.04)",
              boxShadow: "0px 10px 30px rgba(0,0,0,0.05)",

              position: "relative",
              overflow: "hidden",
              mx: desktop ? 0 : "auto",
            }}
          >
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#1976d2",
                    width: 50,
                    height: 50,
                    boxShadow: "0px 4px 12px rgba(25, 118, 210, 0.3)",
                  }}
                >
                  <ContactPhoneRounded />
                </Avatar>
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ color: "#1a1a1a" }}
                  >
                    {contactName}
                  </Typography>
                  <Typography
                    variant="caption"
                    fontWeight="700"
                    sx={{
                      color: "#1976d2",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    {contactRole}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2.5, opacity: 0.6 }} />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  alignItems: "flex-start",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <PhoneIphoneRounded sx={{ color: "#999", fontSize: 20 }} />
                  <Typography variant="body1" fontWeight="500">
                    {contactPhone}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <MailRounded sx={{ color: "#999", fontSize: 20 }} />
                  <Typography
                    variant="body2"
                    fontWeight="500"
                    sx={{ wordBreak: "break-all" }}
                  >
                    {contactEmail}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid
          size={{ xs: 12, md: 5 }}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "450px",
              display: "flex",
              justifyContent: "center",

              animation: "float 4s ease-in-out infinite",
              "@keyframes float": {
                "0%": {
                  transform: "translateY(0px)",
                },
                "50%": {
                  transform: "translateY(-20px)",
                },
                "100%": {
                  transform: "translateY(0px)",
                },
              },
            }}
          >
            <img
              src="/images/notify-phone-icon.png"
              alt="Notification"
              style={{
                width: "100%",
                height: "auto",
                filter: "drop-shadow(0px 15px 30px rgba(0,0,0,0.1))",
                transition: "0.3s ease-in-out",
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
