import { Box, Typography } from "@mui/material";
import StyledButton from "../components/utils/StyledButton";
import { ArrowForward } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useAppProvider } from "../providers/AppProvider";
import NavbarLayout from "../components/layouts/NavbarLayout";

export default function Welcome() {
  const { desktop } = useAppProvider();

  return (
    <NavbarLayout>
      <Box sx={{ textAlign: "center", px: desktop ? 0 : 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <img
            src="/images/celebrate-icon.png"
            width={desktop ? 200 : 120}
            height="auto"
          />
        </Box>
        <Box sx={{ mt: 1, mb: 5 }}>
          <Typography variant={desktop ? "h3" : "h4"} fontWeight="bold">
            Welcome to {!desktop && <br />} Leuterio Realty Portal:
          </Typography>
          <Typography variant={desktop ? "h4" : "h6"} fontWeight="bold">
            Your smart property dashboard.
          </Typography>
          <Typography variant={desktop ? "h5" : "body2"}>
            Congratulations! You've successfully accessed the Leuterio Realty
            Portal.
            <br />
            We're excited to support you on your real estate journey.
          </Typography>
        </Box>
        <Link to="/welcome/get-started">
          <StyledButton
            endIcon={<ArrowForward />}
            variant="contained"
            size="large"
          >
            Get started
          </StyledButton>
        </Link>
      </Box>
    </NavbarLayout>
  );
}
