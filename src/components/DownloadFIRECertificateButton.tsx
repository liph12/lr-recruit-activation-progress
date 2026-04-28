import { useState, useRef } from "react";
import { Box, Typography } from "@mui/material";
import {
  DownloadRounded,
  CheckRounded,
  ErrorOutlineRounded,
} from "@mui/icons-material";
import { keyframes } from "@mui/material";

const OUTFIT = "'Outfit', sans-serif";

const shimmer = keyframes`
  0%   { left: -80%; }
  100% { left: 120%; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const popIn = keyframes`
  from { transform: scale(0.7); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
`;

interface Props {
  certificateImage: string;
  moduleId: number;
  userName: string;
  yCoordinate: number;
}

type State = "idle" | "loading" | "success" | "error";

export default function DownloadFIRECertButton({
  certificateImage,
  moduleId,
  userName,
  yCoordinate,
}: Props) {
  const [state, setState] = useState<State>("idle");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDownload = async () => {
    if (state === "loading") return;
    setState("loading");

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Image load failed"));
        img.src = certificateImage;
      });

      const canvas = canvasRef.current!;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      // Draw recipient name
      ctx.font = "bold 48px 'Arial', sans-serif";
      ctx.fillStyle = "#1a3a6b";
      ctx.textAlign = "center";
      ctx.fillText(userName, canvas.width / 2, yCoordinate);

      const link = document.createElement("a");
      link.download = `FIRE-Certificate-Module${moduleId}-${userName.replace(/\s+/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      setState("success");
      setTimeout(() => setState("idle"), 3000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  };

  // Hidden canvas for compositing
  const canvas = <canvas ref={canvasRef} style={{ display: "none" }} />;

  const isLoading = state === "loading";
  const isSuccess = state === "success";
  const isError = state === "error";

  return (
    <>
      {canvas}
      <Box
        onClick={handleDownload}
        sx={{
          mt: 1.5,
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          px: { xs: 1.8, md: 2.2 },
          py: { xs: 0.7, md: 0.85 },
          borderRadius: "100px",
          position: "relative",
          overflow: "hidden",
          cursor: isLoading ? "default" : "pointer",
          userSelect: "none",
          transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",

          // Idle / Loading: outlined gold-ish
          background: isSuccess
            ? "rgba(76,175,80,0.12)"
            : isError
              ? "rgba(244,67,54,0.10)"
              : "rgba(240,217,138,0.08)",

          border: "1px solid",
          borderColor: isSuccess
            ? "rgba(76,175,80,0.35)"
            : isError
              ? "rgba(244,67,54,0.32)"
              : "rgba(240,217,138,0.32)",

          "&:hover": !isLoading
            ? {
                background: isSuccess
                  ? "rgba(76,175,80,0.18)"
                  : isError
                    ? "rgba(244,67,54,0.16)"
                    : "rgba(240,217,138,0.14)",
                borderColor: isSuccess
                  ? "rgba(76,175,80,0.55)"
                  : isError
                    ? "rgba(244,67,54,0.5)"
                    : "rgba(240,217,138,0.55)",
                transform: "translateY(-1px)",
              }
            : {},

          "&:active": !isLoading ? { transform: "scale(0.97)" } : {},

          // Shimmer sweep on hover (idle only)
          "&:hover .cert-shimmer":
            !isLoading && !isSuccess && !isError ? { left: "120%" } : {},
        }}
      >
        {/* Shimmer */}
        {!isSuccess && !isError && (
          <Box
            className="cert-shimmer"
            sx={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "-80%",
              width: "60%",
              background:
                "linear-gradient(90deg,transparent,rgba(240,217,138,0.18),transparent)",
              transform: "skewX(-15deg)",
              transition: "left 0.5s ease",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Icon */}
        <Box
          sx={{
            width: { xs: 18, md: 20 },
            height: { xs: 18, md: 20 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {isLoading && (
            <Box
              sx={{
                width: { xs: 14, md: 16 },
                height: { xs: 14, md: 16 },
                borderRadius: "50%",
                border: "2px solid rgba(240,217,138,0.2)",
                borderTopColor: "#f0d98a",
                animation: `${spin} 0.75s linear infinite`,
              }}
            />
          )}
          {isSuccess && (
            <CheckRounded
              sx={{
                fontSize: { xs: 15, md: 17 },
                color: "#66bb6a",
                animation: `${popIn} 0.3s ease both`,
              }}
            />
          )}
          {isError && (
            <ErrorOutlineRounded
              sx={{
                fontSize: { xs: 15, md: 17 },
                color: "#ef5350",
                animation: `${popIn} 0.3s ease both`,
              }}
            />
          )}
          {!isLoading && !isSuccess && !isError && (
            <DownloadRounded
              sx={{
                fontSize: { xs: 15, md: 17 },
                color: "#f0d98a",
                transition: "transform 0.2s ease",
                ".MuiBox-root:hover &": { transform: "translateY(2px)" },
              }}
            />
          )}
        </Box>

        {/* Label */}
        <Typography
          sx={{
            fontSize: { xs: "0.78rem", md: "0.88rem" },
            fontWeight: 700,
            fontFamily: OUTFIT,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            lineHeight: 1,
            color: isSuccess ? "#66bb6a" : isError ? "#ef5350" : "#f0d98a",
            transition: "color 0.2s ease",
          }}
        >
          {isLoading
            ? "Preparing…"
            : isSuccess
              ? "Downloaded!"
              : isError
                ? "Try Again"
                : "Download Certificate"}
        </Typography>
      </Box>
    </>
  );
}
