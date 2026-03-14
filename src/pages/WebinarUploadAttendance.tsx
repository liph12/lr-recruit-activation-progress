import { Box, Typography, Grid } from "@mui/material";
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

    if (files) {
      const file = files[0];

      setConfirmation((prev) => ({ ...prev, photo: file }));
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

      const response = await axios.post(URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const { data } = response.data;

      setUserData(data.agent);
      setConfirmed(true);

      const t = setTimeout(() => {
        setConfirmed(false);
        clearTimeout(t);
      }, 1000);

      try {
      } catch (e) {
        // to do
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
        height: "80vh",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: desktop ? "60vw" : "100%", px: desktop ? 0 : 2 }}>
        <Typography variant={desktop ? "h3" : "h4"} fontWeight="bold">
          Confirm your Attendance
        </Typography>
        <Typography variant={desktop ? "h5" : "body1"} fontWeight="bold">
          Please upload a screenshot or photo taken during the New Agent’s
          Orientation as proof of attendance.
        </Typography>
        <Typography variant="body1">
          Accepted files: <b>JPG, PNG</b> {desktop ? "|" : <br />} Maximum file
          size: <b>5MB</b>
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid size={{ lg: 6, md: 6, xs: 12 }}>
              <Typography>Proof of attendance</Typography>
              <StyledTextField
                type="file"
                handleChange={handleChange}
                name="photo"
                props={{
                  inputProps: {
                    accept: ".jpg,.jpeg,.png",
                  },
                }}
              />
            </Grid>
            <Grid size={{ lg: 6, md: 6, xs: 12 }}>
              <Typography>Date attended</Typography>
              <StyledTextField
                type="date"
                handleChange={handleChange}
                name="attended"
              />
            </Grid>
            <Grid size={{ lg: 12, md: 12, xs: 12 }}>
              <Typography>Description (Optional)</Typography>
              <StyledTextField
                handleChange={handleChange}
                name="description"
                props={{ multiline: true, rows: 3 }}
              />
            </Grid>
            <Grid size={{ lg: 12, md: 12, xs: 12 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box />
                <StyledButton
                  variant="contained"
                  startIcon={
                    confirmed ? <CheckCircleRounded /> : <UploadRounded />
                  }
                  loading={confirming}
                  onClick={uploadAsync}
                  color={confirmed ? "success" : "primary"}
                  disabled={
                    confirmation.attended === null ||
                    confirmation.attended === "" ||
                    confirmation.photo === null
                  }
                >
                  {confirmed ? "Uploaded & Confirmed" : "Upload & Confirm"}
                </StyledButton>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
