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
        }}
      >
        <Box>
          <img
            src="/images/rentph-logo.png"
            width={desktop ? 150 : 110}
            height="auto"
          />
        </Box>
        <Box>
          <img
            src="/images/lr-logo.png"
            width={desktop ? 120 : 90}
            height="auto"
          />
        </Box>
        <Box>
          <img
            src="/images/fh-logo.png"
            width={desktop ? 220 : 130}
            height="auto"
          />
        </Box>
      </Box>
      {children}
    </>
  );
}
