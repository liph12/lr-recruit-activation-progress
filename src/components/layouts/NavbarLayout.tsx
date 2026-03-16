import { Box } from "@mui/material";
import { useAppProvider } from "../../providers/AppProvider";
import type { ReactNode } from "react";

export default function NavbarLayout({ children }: { children: ReactNode }) {
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
          mb: -14,
          zIndex: 2,
          position: "relative",
        }}
      >
        <Box>
          <img
            src="/images/rentph-logo-white.png"
            width={desktop ? 160 : 110}
            height="auto"
          />
        </Box>
        <Box>
          <img
            src="/images/lr-logo-white.png"
            width={desktop ? 140 : 90}
            height="auto"
          />
        </Box>
        <Box>
          <img
            src="/images/fh-logo-white.png"
            width={desktop ? 210 : 130}
            height="auto"
          />
        </Box>
      </Box>
      {children}
    </>
  );
}
