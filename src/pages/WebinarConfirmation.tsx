import { Typography, Box } from "@mui/material";
import StyledButton from "../components/utils/StyledButton";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useAppProvider } from "../providers/AppProvider";
import useAxios from "../hooks/useAxios";

export default function WebinarConfirmation() {
  const axios = useAxios();
  const { desktop, setUserData } = useAppProvider();

  const handleConfirmAsync = async (status: "yes" | "no") => {
    try {
      setUserData(null);
      const response = await axios.post(
        "/agent/confirm-nao-attendance",
        { status },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { data } = response.data;

      setUserData(data);
    } catch (e) {
      // to do
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        height: "80vh",
        alignItems: "center",
      }}
    >
      <Box sx={{ mb: 5, textAlign: "center", px: desktop ? 0 : 2 }}>
        <Typography variant={desktop ? "h3" : "h4"} fontWeight="bold">
          New Agents Orientation
        </Typography>
        <Typography variant={desktop ? "h4" : "h5"} fontWeight="bold">
          Have you already attended?
        </Typography>
        <Typography sx={{ mt: 1 }}>
          The New Agents Webinar (NAW) is the video presentation,{" "}
          {desktop && <br />} while the New Agents Orientation (NAO) is the
          face-to-face session.
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box>
          {desktop ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                mb: 5,
              }}
            >
              <StyledButton
                color="inherit"
                variant="contained"
                size={"large"}
                startIcon={<ArrowBack />}
                onClick={() => handleConfirmAsync("no")}
              >
                No, Continue watching NAW
              </StyledButton>
              <StyledButton
                color="primary"
                variant="contained"
                size={"large"}
                endIcon={<ArrowForward />}
                onClick={() => handleConfirmAsync("yes")}
              >
                Yes, I have already attended
              </StyledButton>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                mb: 5,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <StyledButton
                  color="inherit"
                  variant="contained"
                  startIcon={<ArrowBack />}
                  size="large"
                  fullWidth
                  onClick={() => handleConfirmAsync("no")}
                >
                  No, Continue watching NAW
                </StyledButton>
                <StyledButton
                  color="primary"
                  variant="contained"
                  endIcon={<ArrowForward />}
                  size="large"
                  fullWidth
                  onClick={() => handleConfirmAsync("yes")}
                >
                  Yes, Already attended NAO
                </StyledButton>
              </Box>
            </Box>
          )}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img
              src="/images/notify-phone-icon.png"
              width={desktop ? 300 : 200}
              height="auto"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
