import { Avatar, Box, Divider, Grid, Typography } from "@mui/material";
import YoutubeEmbedWebinar from "../components/utils/YoutubeEmbededWebiner";
import { useAppProvider } from "../providers/AppProvider";

export default function Webinar() {
  const { desktop } = useAppProvider();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ px: desktop ? 0 : 2 }}>
        <Typography variant={desktop ? "h3" : "h4"} fontWeight="bold">
          New Agents Webinar
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid size={{ lg: 6, md: 12, xs: 12 }}>
            <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
              <Avatar
                src="https://leuteriorealty.com/memberfiles/0/20240419043008.jpg"
                sx={{ height: "auto", width: 50 }}
              />
              <Box>
                <Typography>Anthony Leuterio - REB e-PRO</Typography>
                <Typography variant="body2" color="textSecondary">
                  Speaker
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ lg: 6, md: 12, xs: 12 }}>
            <Typography>CEO & Founder of Filipino Homes</Typography>
            <Typography>2024 International Realtor of the Year</Typography>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2 }}>
          <YoutubeEmbedWebinar />
        </Box>
        <Typography variant="body1">
          To continue to the FIRE Website, you must watch and complete the full
          video presentation. <br />
          Save the video watched progress if you want to continue at a later
          time.
        </Typography>
      </Box>
    </Box>
  );
}
