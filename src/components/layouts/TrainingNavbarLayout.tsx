import { Box, Container } from "@mui/material";
import { useAppProvider } from "../../providers/AppProvider";
import type { ReactNode } from "react";
import StyledButton from "../utils/StyledButton";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function TrainingNavbarLayout({
  children,
}: {
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const { desktop } = useAppProvider();

  return (
    <>
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #0a1628 0%, #001a45 25%, #0d1f3c 50%, #001233 75%, #0a0f1e 100%)",
          color: "#fff",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          minHeight: desktop ? 64 : 56,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: desktop ? 1 : 1,
            py: 0,
          }}
        >
          <Box>
            <StyledButton
              variant="outlined"
              startIcon={<ArrowBack />}
              size={desktop ? "medium" : "small"}
              sx={{
                color: "#fff",
                borderColor: "rgba(255,255,255,0.45)",
                fontWeight: 700,
                "&:hover": { borderColor: "rgba(255,255,255,0.7)" },
              }}
              onClick={() => navigate(-1)}
            >
              Go Back
            </StyledButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: desktop ? 56 : 50,
              height: desktop ? 56 : 50,
              borderRadius: "50%",
              background: "#ffffff",
              boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
            }}
          >
            <img
              src="/images/fire-logo.png"
              height={desktop ? 40 : 36}
              style={{
                objectFit: "contain",
              }}
            />
          </Box>
        </Container>
      </Box>
      {children}
    </>
  );
}
