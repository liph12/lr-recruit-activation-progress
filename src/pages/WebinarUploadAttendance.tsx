import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid"; // Siguroha nga Grid2 kini para sa MUI v6
import { useAppProvider } from "../providers/AppProvider";
import StyledTextField from "../components/utils/StyledTextField";
import StyledButton from "../components/utils/StyledButton";
import { UploadRounded, CheckCircleRounded } from "@mui/icons-material";
import { useState } from "react";
import axios from "axios";

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

        setTimeout(() => setConfirmed(false), 2000);
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

        <Box sx={{ bgcolor: "transparent" }}>
          <Grid container spacing={3}>
           
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
                    "& .upload-icon": { color: "#1976d2" },
                  },
                }}
              >

                <UploadRounded
                  className="upload-icon"
                  sx={{
                    fontSize: 56,
                    color: "#bbb",
                    mb: 1.5,
                    transition: "0.3s",
                  }}
                />

                <Typography
                  textAlign="center"
                  sx={{ color: "#555", fontWeight: 600, fontSize: "1rem" }}
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
                  <StyledTextField
                    type="file"
                    handleChange={handleChange}
                    name="photo"
                    props={{ inputProps: { accept: ".jpg,.jpeg,.png" } }}
                  />
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="caption"
                fontWeight="bold"
                sx={{
                  mb: 0.5,
                  display: "block",
                  color: "#666",
                  textTransform: "uppercase",
                }}
              >
                Date Attended
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
                sx={{
                  mb: 0.5,
                  display: "block",
                  color: "#666",
                  textTransform: "uppercase",
                }}
              >
                Description (Optional)
              </Typography>
              <StyledTextField
                handleChange={handleChange}
                name="description"
                props={{ placeholder: "Enter details..." }}
              />
            </Grid>

            <Grid size={12}>
              <Box sx={{ mt: 2 }}>
                {" "}
                <StyledButton
                  variant="contained"
                  fullWidth
                  startIcon={
                    confirmed ? <CheckCircleRounded /> : <UploadRounded />
                  }
                  loading={confirming}
                  onClick={uploadAsync}
                  color={confirmed ? "success" : "primary"}
                  disabled={!confirmation.attended || !confirmation.photo}
                  sx={{
                    py: 1.8,
                    borderRadius: "12px",
                    fontWeight: "800",
                    fontSize: "1.1rem",
                    // textTransform: "uppercase",
                    textTransform: "lowercase",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {confirmed ? "UPLOAD SUCCESSFUL" : "SUBMIT ATTENDANCE"}
                </StyledButton>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
