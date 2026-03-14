import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { AppProvider } from "../../providers/AppProvider";

export default function MainLayout() {
  return (
    <AppProvider>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          backgroundImage: "url('/images/lr-main-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Outlet />
      </Box>
    </AppProvider>
  );
}
