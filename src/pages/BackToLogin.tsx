import { Typography, Box } from "@mui/material";
import { ArrowBack, InfoRounded } from "@mui/icons-material";
import { useAppProvider } from "../providers/AppProvider";

const OUTFIT = "'Outfit', sans-serif";

export default function BackToLogin() {
  const { desktop } = useAppProvider();
  return (
    <Box
      sx={{
        height: desktop ? "70vh" : "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: desktop ? "25%" : "60%", textAlign: "center" }}>
        <InfoRounded sx={{ color: "#999", fontSize: 60 }} />
        <Typography color="#fff" sx={{ fontSize: 25, my: 2 }}>
          Unauthorized page access.
        </Typography>
        <Box
          sx={{
            mt: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.2,

            py: 1.8,
            borderRadius: "14px",
            cursor: "pointer",
            userSelect: "none",
            background: "linear-gradient(135deg,#1e88e5,#0d47a1)",
            border: "1px solid rgba(126,184,255,0.3)",
          }}
          onClick={() => (window.location.href = "/login")}
        >
          <ArrowBack sx={{ color: "#fff" }} />
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "1rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#ffffff",
              fontFamily: OUTFIT,
            }}
          >
            Back to login
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
