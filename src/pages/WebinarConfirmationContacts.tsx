import { Box, Typography, Paper, Divider, Avatar } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useAppProvider } from "../providers/AppProvider";
import { CheckCircleRounded, ContactPhoneRounded } from "@mui/icons-material";

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
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        fontFamily: "'Poppins', sans-serif",
        background:
          "linear-gradient(135deg,#f5f7ff 0%,#ffffff 50%,#f0f9ff 100%)",
        overflow: "hidden",
        "@keyframes pop": {
          "0%": { transform: "scale(.7)", opacity: 0 },
          "70%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        "@keyframes float": {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
          "100%": { transform: "translateY(0)" },
        },
        "@keyframes fadeUp": {
          from: { opacity: 0, transform: "translateY(30px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      <Grid
        container
        spacing={6}
        sx={{
          maxWidth: 1100,
          alignItems: "center",
        }}
      >
        {/* LEFT CONTENT */}
        <Grid size={{ xs: 12, md: 6 }} textAlign={desktop ? "left" : "center"}>
          {/* SUCCESS ICON + Title in one line */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: desktop ? "flex-start" : "center",
              gap: 1.5,
              mb: 3,
              flexWrap: "nowrap",
              animation: "fadeUp .8s ease",
            }}
          >
            <CheckCircleRounded
              sx={{
                fontSize: 40,
                color: "#2e7d32",
                flexShrink: 0,
                animation: "pop .6s ease",
              }}
            />
            <Typography
              variant={desktop ? "h4" : "h5"}
              fontWeight={800}
              sx={{
                letterSpacing: "-0.5px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Attendance Uploaded!
            </Typography>
          </Box>

          {/* Subtitle */}
          <Typography
            sx={{
              color: "#666",
              maxWidth: 520,
              mb: 4,
              lineHeight: 1.7,
              mx: desktop ? 0 : "auto",
              animation: "fadeUp 1s ease",
            }}
          >
            Please contact your <b>{contactRole}</b> for attendance approval.
            They will notify you once your request has been reviewed.
          </Typography>

          {/* CONTACT CARD */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              maxWidth: 480,
              borderRadius: "22px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(0,0,0,0.05)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
              mx: desktop ? 0 : "auto",
              animation: "fadeUp 1.2s ease",
            }}
          >
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Avatar
                sx={{
                  bgcolor: "#1976d2",
                  width: 52,
                  height: 52,
                }}
              >
                <ContactPhoneRounded />
              </Avatar>

              <Box>
                <Typography fontWeight="bold">{contactName}</Typography>
                <Typography variant="caption" color="primary" fontWeight="600">
                  {contactRole}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography fontWeight="600">{contactPhone}</Typography>
            <Typography variant="body2">{contactEmail}</Typography>
          </Paper>
        </Grid>

        {/* RIGHT IMAGE */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box sx={{ animation: "float 4s ease-in-out infinite" }}>
            <img
              src="/images/notify-phone-icon.png"
              style={{
                width: desktop ? 420 : "85%",
                filter: "drop-shadow(0 30px 50px rgba(0,0,0,.15))",
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
