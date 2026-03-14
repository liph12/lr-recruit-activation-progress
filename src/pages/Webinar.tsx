import { Box, Typography } from "@mui/material";
import { InfoOutlineRounded } from "@mui/icons-material";
import YoutubeEmbedWebinar from "../components/utils/YoutubeEmbededWebiner";
import { useAppProvider } from "../providers/AppProvider";

export default function Webinar() {
  const { desktop } = useAppProvider();

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
      <Box sx={{ px: desktop ? 0 : 2 }}>
        <Typography variant={desktop ? "h3" : "h4"} fontWeight="bold">
          New Agents Webinar
        </Typography>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center", my: 1 }}>
          <InfoOutlineRounded color="action" />
          <Typography variant={desktop ? "h5" : "body1"} fontWeight="bold">
            Please read carefully before proceeding.
          </Typography>
        </Box>
        <Typography variant="body1">
          To continue to the FIRE Website, you must watch and complete the full
          video presentation. <br />
          Save the video watched progress if you want to continue at a later
          time.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <YoutubeEmbedWebinar />
        </Box>
      </Box>
    </Box>
  );
}
