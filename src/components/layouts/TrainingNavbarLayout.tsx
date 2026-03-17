import { Box, Container } from "@mui/material";
import { useAppProvider } from "../../providers/AppProvider";
import { ArrowBackRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function TrainingNavbarLayout() {
  const navigate = useNavigate();
  const { desktop } = useAppProvider();

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "transparent",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          minHeight: desktop ? 68 : 58,
          display: "flex",
          alignItems: "center",
          overflow: "visible",
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 2, sm: 3 },
            py: 0,
            position: "relative",
            overflow: "visible",
          }}
        >
          {/* Back button */}
          <Box
            onClick={() => navigate(-1)}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.8,
              px: { xs: 1.5, sm: 2 },
              py: { xs: 0.7, sm: 0.85 },
              borderRadius: "100px",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.06)",
              cursor: "pointer",
              userSelect: "none",
              transition: "all 0.25s ease",
              "&:hover": {
                background: "rgba(255,255,255,0.12)",
                borderColor: "rgba(255,255,255,0.35)",
                transform: "translateX(-2px)",
              },
              "&:active": { transform: "translateX(0)" },
            }}
          >
            <ArrowBackRounded
              sx={{
                fontSize: { xs: 16, sm: 17 },
                color: "rgba(255,255,255,0.75)",
              }}
            />
            <Box
              component="span"
              sx={{
                fontSize: { xs: "0.78rem", sm: "0.82rem" },
                fontWeight: 700,
                color: "rgba(255,255,255,0.75)",
                letterSpacing: "0.06em",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              Go Back
            </Box>
          </Box>

          {/* FIRE logo — right side, overlapping below navbar */}
          <Box
            sx={{
              position: "absolute",
              right: { xs: 16, sm: 24 },
              top: "50%",
              transform: "translateY(-20%)",
              zIndex: 110,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="/images/fire-icon.png"
              height={desktop ? 126 : 76}
              style={{
                objectFit: "contain",
                display: "block",
              }}
              alt="FIRE"
            />
          </Box>
        </Container>
      </Box>

      {/* Offset content below fixed navbar */}
      <Box sx={{ pt: desktop ? "68px" : "58px" }}>
        <Outlet />
      </Box>
    </>
  );
}
