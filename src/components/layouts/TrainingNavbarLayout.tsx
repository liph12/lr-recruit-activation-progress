import { Box } from "@mui/material";
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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: desktop ? 5 : 1,
          py: 2,
        }}
      >
        <Box>
          <StyledButton
            variant="outlined"
            startIcon={<ArrowBack />}
            size={desktop ? "medium" : "small"}
            onClick={() => navigate(-1)}
          >
            Go Back
          </StyledButton>
        </Box>
        <Box>
          <img
            src="/images/fire-logo.png"
            width={desktop ? 150 : 110}
            height="auto"
          />
        </Box>
      </Box>
      {children}
    </>
  );
}
