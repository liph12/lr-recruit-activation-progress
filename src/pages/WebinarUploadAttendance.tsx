import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useAppProvider } from "../providers/AppProvider";
import StyledTextField from "../components/utils/StyledTextField";
import StyledButton from "../components/utils/StyledButton";
import { UploadRounded, CheckCircleRounded } from "@mui/icons-material";
import { useState } from "react";
import axios from "axios";
import confetti from "canvas-confetti"; // I-import ang confetti

interface Confirmation {
  photo: File | null;
  attended: string | null;
  description: string;
}

export default function WebinarUploadAttendance() {
  const { desktop, setUserData, authToken, user } = useAppProvider();
  const [confirmation, setConfirmation] = useState<Confirmation>({
    photo: null,
    attended: null,
    description: "",
  });
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // Function para sa Fireworks Animation
  const fireworkAnimation = () => {
    const duration = 3 * 1000; // 3 seconds nga buto-buto
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // Fireworks sa wala ug tuo
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const key = e.target.name;

    if (key === "photo" && files) {
      setConfirmation((prev) => ({ ...prev, photo: files[0] }));
    } else {
      setConfirmation((prev) => ({ ...prev, [key]: e.target.value }));
    }
  };

  const uploadAsync = async () => {
    if (confirmation.photo && confirmation.attended) {
      const URL =
        "https://api.leuteriorealty.com/lr/v2/public/api/upload-nao-proof-of-attendance";
      const formData = new FormData();

      formData.append("photo", confirmation.photo);
      formData.append("attended", confirmation.attended);
      formData.append("description", confirmation.description);

      if (user) {
        formData.append("memberId", user.agent_id.toString());
      }

      setConfirming(true);
      try {
        const response = await axios.post(URL, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        });
        const { data } = response.data;

        setUserData(data.agent);
        setConfirmed(true);

        fireworkAnimation();

        setTimeout(() => setConfirmed(false), 3000);
      } catch (e) {
        console.error(e);
      } finally {
        setConfirming(false);
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        minHeight: "80vh",
        alignItems: "center",
        py: 4,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "700px", px: 2 }}>
        <Typography
          variant={desktop ? "h4" : "h5"}
          fontWeight="800"
          textAlign="center"
          sx={{ mb: 1, color: "#1a1a1a", fontFamily: "'Poppins', sans-serif" }}
        >
          Congratulations on completing the New Agents Orientation
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          color="textSecondary"
          sx={{ mb: 4 }}
        >
          Accepted files: <b>JPG, PNG</b> | Maximum file size: <b>5MB</b>
        </Typography>

        <Grid container spacing={3}>
          {/* Upload Zone */}
          <Grid size={12}>
            <Box
              component="label"
              sx={{
                p: 5,
                border: "2px dashed #ccc",
                borderRadius: "16px",
                bgcolor: confirmation.photo
                  ? "rgba(25, 118, 210, 0.04)"
                  : "transparent",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                cursor: "pointer",
                "&:hover": {
                  bgcolor: "rgba(25, 118, 210, 0.08)",
                  borderColor: "#1976d2",
                },
              }}
            >
              <UploadRounded sx={{ fontSize: 56, color: "#bbb", mb: 1.5 }} />
              <Typography
                textAlign="center"
                sx={{ color: "#555", fontWeight: 600 }}
              >
                {confirmation.photo ? (
                  <span style={{ color: "#2e7d32" }}>
                    {confirmation.photo.name}
                  </span>
                ) : (
                  "Please Upload proof of attendance"
                )}
              </Typography>
              <Box sx={{ display: "none" }}>
                <input
                  type="file"
                  name="photo"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleChange}
                />
              </Box>
            </Box>
          </Grid>

          {/* Form Inputs */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="caption"
              fontWeight="bold"
              sx={{ mb: 0.5, display: "block", color: "#666" }}
            >
              DATE ATTENDED
            </Typography>
            <StyledTextField
              type="date"
              handleChange={handleChange}
              name="attended"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="caption"
              fontWeight="bold"
              sx={{ mb: 0.5, display: "block", color: "#666" }}
            >
              DESCRIPTION (OPTIONAL)
            </Typography>
            <StyledTextField
              handleChange={handleChange}
              name="description"
              props={{ placeholder: "Enter details..." }}
            />
          </Grid>

          {/* Full Width Submit Button */}
          <Grid size={12}>
            <StyledButton
              variant="contained"
              fullWidth
              startIcon={confirmed ? <CheckCircleRounded /> : <UploadRounded />}
              loading={confirming}
              onClick={uploadAsync}
              color={confirmed ? "success" : "primary"}
              disabled={!confirmation.attended || !confirmation.photo}
              sx={{
                py: 2,
                borderRadius: "12px",
                fontWeight: "800",
                fontSize: "1.1rem",
              }}
            >
              {confirmed ? "UPLOAD SUCCESSFUL" : "SUBMIT ATTENDANCE"}
            </StyledButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
