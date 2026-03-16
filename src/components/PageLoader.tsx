import { Box, Typography } from "@mui/material";
import { keyframes } from "@mui/material";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const OUTFIT = "'Outfit', sans-serif";

export default function PageLoader({
  title = "user data",
}: {
  title?: string;
}) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#071020",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap'); * { font-family: 'Outfit', sans-serif !important; }`}</style>

      {/* Ambient blobs */}
      <Box
        sx={{
          position: "absolute",
          top: "15%",
          left: "20%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,85,179,0.16) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          right: "15%",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,55,140,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Content — delayed entry */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          opacity: 0,
          animation: `${fadeIn} 0.6s ease 0.4s forwards`,
        }}
      >
        {/* Big circle spinner */}
        <Box sx={{ position: "relative", width: 140, height: 140 }}>
          {/* Static background ring */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "5px solid rgba(255,255,255,0.07)",
            }}
          />
          {/* Spinning arc */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "5px solid transparent",
              borderTopColor: "#7eb8ff",
              borderRightColor: "rgba(126,184,255,0.4)",
              animation: `${spin} 1s linear infinite`,
            }}
          />
          {/* Gold inner ring */}
          <Box
            sx={{
              position: "absolute",
              inset: 14,
              borderRadius: "50%",
              border: "3px solid rgba(201,168,76,0.12)",
            }}
          />
        </Box>

        {/* Text */}
        <Box sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              fontSize: { xs: "1.4rem", md: "1.8rem" },
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: OUTFIT,
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
              mb: 0.8,
            }}
          >
            Loading{" "}
            <Box
              component="span"
              sx={{
                backgroundImage:
                  "linear-gradient(90deg,#7eb8ff 0%,#f0d98a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 800,
              }}
            >
              {title}
            </Box>
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "0.88rem", md: "0.95rem" },
              color: "rgba(255,255,255,0.38)",
              fontFamily: OUTFIT,
              fontWeight: 400,
              letterSpacing: "0.02em",
            }}
          >
            Please wait a moment…
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
