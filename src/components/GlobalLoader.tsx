import { Backdrop, Box, Typography, keyframes } from "@mui/material";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const OUTFIT = "'Outfit', sans-serif";

export default function GlobalLoader({
  open,
  title = "submitting",
}: {
  open: boolean;
  title?: string;
}) {
  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 1,
        background:
          "radial-gradient(600px 160px at 20% -10%, rgba(126,184,255,.18), transparent 60%), rgba(7,16,32,.75)",
        color: "#fff",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          animation: `${fadeIn} .4s ease` as any,
        }}
      >
        {/* Spinner */}
        <Box sx={{ position: "relative", width: 120, height: 120 }}>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "5px solid rgba(255,255,255,0.08)",
            }}
          />
        
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "5px solid transparent",
              borderTopColor: "#7eb8ff",
              borderRightColor: "rgba(126,184,255,0.45)",
              animation: `${spin} 1s linear infinite` as any,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 12,
              borderRadius: "50%",
              border: "3px solid rgba(201,168,76,0.14)",
            }}
          />
        </Box>

        <Typography
          sx={{
            fontFamily: OUTFIT,
            fontSize: { xs: "1.1rem", md: "1.25rem" },
            fontWeight: 800,
            letterSpacing: "-.01em",
          }}
        >
          {title.charAt(0).toUpperCase() + title.slice(1)}…
        </Typography>
      </Box>
    </Backdrop>
  );
}
