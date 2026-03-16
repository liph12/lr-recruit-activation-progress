import { Box } from "@mui/material";
import { useAppProvider } from "../../providers/AppProvider";
import type { ReactNode } from "react";

export default function NavbarLayout({ children }: { children: ReactNode }) {
  const { desktop } = useAppProvider();

  return (
    <>
      {desktop && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 5,
            py: 2,
            mb: -14,
            zIndex: 2,
            position: "relative",
          }}
        >
          <Box>
            <img src="/images/rentph-logo-white.png" width={160} height="auto" />
          </Box>
          <Box>
            <img src="/images/lr-logo-white.png" width={140} height="auto" />
          </Box>
          <Box>
            <img src="/images/fh-logo-white.png" width={210} height="auto" />
          </Box>
        </Box>
      )}
      {children}
    </>
  );
}
