import { Box, Typography } from "@mui/material";
import { useAppProvider } from "../providers/AppProvider";
import { useState, useRef, useEffect } from "react";
import type { Course } from "../types/course";
import {
  PlayArrowRounded,
  SubscriptionsRounded,
  AutoStoriesRounded,
  ArrowForwardRounded,
} from "@mui/icons-material";
import PresentationPDF from "../components/PresentationPDF";
import { keyframes } from "@mui/material";

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
`;
const shimmerLine = keyframes`
  from { width: 0; opacity: 0; }
  to   { width: 64px; opacity: 1; }
`;
const softPulse = keyframes`
  0%, 100% { box-shadow: 0 8px 32px rgba(25,118,210,0.3); }
  50%       { box-shadow: 0 12px 48px rgba(25,118,210,0.55); }
`;

const OUTFIT = "'Outfit', sans-serif";

const pdfStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
  * { font-family: 'Outfit', sans-serif !important; }

  .react-pdf__Document {
    display: flex; flex-direction: column; height: 100%; width: 100%;
  }
  .react-pdf__Page { display: flex; justify-content: center; }
  .react-pdf__Document > div:last-child {
    background: rgba(201,168,76,0.12) !important;
    border: 1px solid rgba(201,168,76,0.35) !important;
    border-radius: 10px !important;
    padding: 10px 16px !important;
    margin-top: 10px !important;
    text-align: center;
    color: #f0d98a !important;
    font-weight: 600 !important;
    font-size: 13px !important;
  }
  button[aria-label*="next"], button[aria-label*="Next"],
  button[aria-label*="previous"], button[aria-label*="Previous"] {
    color: #f0d98a !important;
    background: rgba(201,168,76,0.15) !important;
    border: 1px solid rgba(201,168,76,0.4) !important;
    border-radius: 8px !important;
    padding: 6px 10px !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
  }
  button[aria-label*="next"]:hover, button[aria-label*="Next"]:hover,
  button[aria-label*="previous"]:hover, button[aria-label*="Previous"]:hover {
    background: rgba(201,168,76,0.3) !important;
  }
  button[aria-label*="next"] svg, button[aria-label*="Next"] svg,
  button[aria-label*="previous"] svg, button[aria-label*="Previous"] svg {
    fill: #f0d98a !important; stroke: #f0d98a !important;
  }
`;

interface CourseProps {
  course: Course;
  takeCourse: () => void;
}

export default function TrainingCourse({ course, takeCourse }: CourseProps) {
  const { desktop } = useAppProvider();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVideo, setIsVideo] = useState(true);

  const NAVBAR_HEIGHT = desktop ? 68 : 58;

  const iframeString = course.video
    .replace(/width="\d+px"/, 'width="100%"')
    .replace(/height="\d+px"/, 'height="100%"');

  // ── Live canvas background ─────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const w = canvas.offsetWidth,
        h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const blobs = [
      {
        x: 0.15,
        y: 0.2,
        r: 0.55,
        ox: 0,
        oy: 0,
        speed: 0.000035,
        color: [0, 85, 179] as [number, number, number],
      },
      {
        x: 0.8,
        y: 0.7,
        r: 0.5,
        ox: 1,
        oy: 2,
        speed: 0.000025,
        color: [0, 55, 140] as [number, number, number],
      },
      {
        x: 0.5,
        y: 0.45,
        r: 0.42,
        ox: 2,
        oy: 1,
        speed: 0.00002,
        color: [220, 235, 255] as [number, number, number],
      },
      {
        x: 0.2,
        y: 0.8,
        r: 0.38,
        ox: 3,
        oy: 3,
        speed: 0.000015,
        color: [200, 218, 255] as [number, number, number],
      },
    ];
    let t = 0;
    const draw = () => {
      const W = canvas.offsetWidth,
        H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#071020";
      ctx.fillRect(0, 0, W, H);
      blobs.forEach((b) => {
        const cx = (b.x + Math.sin(t * b.speed * 1000 + b.ox) * 0.1) * W;
        const cy = (b.y + Math.cos(t * b.speed * 800 + b.oy) * 0.08) * H;
        const rad = b.r * Math.max(W, H);
        const [r, g, bl] = b.color;
        const peak = r > 150 ? 0.06 : 0.2;
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        grd.addColorStop(0, `rgba(${r},${g},${bl},${peak})`);
        grd.addColorStop(0.45, `rgba(${r},${g},${bl},${peak * 0.35})`);
        grd.addColorStop(1, `rgba(${r},${g},${bl},0)`);
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
      });
      t++;
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        overflow: "hidden",
        background: "#071020",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{pdfStyles}</style>

      {/* Canvas background */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          px: { xs: 2, sm: 3, md: 4 },
          pt: { xs: 3, md: 5 },
          pb: { xs: 1.5, md: 2 },
          gap: { xs: 2, md: 4 },
          overflow: "hidden",
        }}
      >
        {/* ── LEFT: Title + tabs + CTA ── */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flexShrink: 0,
            width: { xs: "100%", md: "38%" },
            gap: { xs: 2, md: 2.5 },
            animation: `${fadeInUp} 0.5s ease both`,
          }}
        >
          {/* Module pill */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.8,
              px: 1.4,
              py: 0.4,
              borderRadius: "100px",
              border: "1px solid rgba(25,118,210,0.35)",
              background: "rgba(25,118,210,0.09)",
              alignSelf: "flex-start",
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#7eb8ff",
              }}
            />
            <Typography
              sx={{
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#7eb8ff",
                fontFamily: OUTFIT,
              }}
            >
              Module {course.id}
            </Typography>
          </Box>

          {/* Title */}
          <Box>
            <Typography
              sx={{
                fontSize: {
                  xs: "clamp(1.5rem,6vw,2rem)",
                  md: "clamp(1.6rem,2.8vw,2.6rem)",
                },
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                fontFamily: OUTFIT,
                backgroundImage:
                  "linear-gradient(90deg,#7eb8ff 0%,#ffffff 35%,#f0d98a 50%,#ffffff 65%,#7eb8ff 100%)",
                backgroundSize: "600px 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: `${shimmer} 4s linear infinite`,
                mb: 0.5,
              }}
            >
              {course.title}
            </Typography>
            {/* Gold accent line */}
            <Box
              sx={{
                height: "2px",
                background:
                  "linear-gradient(90deg,#c9a84c,#f0d98a,transparent)",
                animation: `${shimmerLine} 1s cubic-bezier(0.22,1,0.36,1) 0.3s both`,
                width: 0,
              }}
            />
          </Box>

          {/* Toggle tabs */}
          <Box sx={{ display: "flex", gap: 1 }}>
            {[
              {
                label: "Video",
                icon: <SubscriptionsRounded sx={{ fontSize: 15 }} />,
                active: isVideo,
                onClick: () => setIsVideo(true),
              },
              {
                label: "Powerpoint",
                icon: <AutoStoriesRounded sx={{ fontSize: 15 }} />,
                active: !isVideo,
                onClick: () => setIsVideo(false),
              },
            ].map((tab) => (
              <Box
                key={tab.label}
                onClick={tab.onClick}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.7,
                  px: 2,
                  py: 0.9,
                  borderRadius: "10px",
                  cursor: "pointer",
                  userSelect: "none",
                  background: tab.active
                    ? "linear-gradient(135deg,rgba(30,136,229,0.3),rgba(13,71,161,0.2))"
                    : "rgba(255,255,255,0.04)",
                  border: "1px solid",
                  borderColor: tab.active
                    ? "rgba(126,184,255,0.45)"
                    : "rgba(255,255,255,0.08)",
                  transition: "all 0.2s ease",
                  "&:hover": tab.active
                    ? {}
                    : {
                        background: "rgba(255,255,255,0.07)",
                        borderColor: "rgba(255,255,255,0.14)",
                      },
                }}
              >
                <Box
                  sx={{
                    color: tab.active ? "#7eb8ff" : "rgba(255,255,255,0.4)",
                  }}
                >
                  {tab.icon}
                </Box>
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: tab.active ? 700 : 500,
                    color: tab.active ? "#ffffff" : "rgba(255,255,255,0.45)",
                    fontFamily: OUTFIT,
                  }}
                >
                  {tab.label}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* CTA button */}
          <Box
            onClick={takeCourse}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 2.8,
              py: 1.4,
              borderRadius: "12px",
              cursor: "pointer",
              userSelect: "none",
              alignSelf: "flex-start",
              background:
                "linear-gradient(135deg,rgba(30,136,229,0.35),rgba(13,71,161,0.25))",
              border: "1px solid rgba(30,136,229,0.4)",
              animation: `${softPulse} 3s ease-in-out infinite`,
              transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
              "&:hover": {
                background: "linear-gradient(135deg,#1e88e5,#0d47a1)",
                borderColor: "rgba(126,184,255,0.55)",
                transform: "translateY(-2px)",
                animation: "none",
                boxShadow: "0 10px 36px rgba(25,118,210,0.5)",
              },
              "&:hover .cta-arrow": { transform: "translateX(3px)" },
            }}
          >
            <PlayArrowRounded sx={{ fontSize: 20, color: "#ffffff" }} />
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "0.88rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#ffffff",
                fontFamily: OUTFIT,
              }}
            >
              Ready to Take Quiz?
            </Typography>
            <ArrowForwardRounded
              className="cta-arrow"
              sx={{
                fontSize: 15,
                color: "rgba(255,255,255,0.7)",
                transition: "transform 0.2s",
              }}
            />
          </Box>
        </Box>

        {/* ── RIGHT: Video / PDF — no background ── */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: `${fadeInUp} 0.55s ease 0.1s both`,
            overflow: "hidden",
          }}
        >
          {isVideo ? (
            <Box
              sx={{
                width: "100%",
                aspectRatio: "16 / 9",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
              }}
            >
              <div
                dangerouslySetInnerHTML={{ __html: iframeString }}
                style={{ width: "100%", height: "100%" }}
              />
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                borderRadius: "16px",
                "& > *": {
                  flex: 1,
                  height: "100% !important",
                  width: "calc(100% + 80px) !important",
                  maxWidth: "none !important",
                  maxHeight: "100% !important",
                  marginLeft: "-40px !important",
                },
                "& canvas, & img": {
                  width: "100% !important",
                  height: "auto !important",
                  maxHeight: "100% !important",
                  objectFit: "contain",
                },
              }}
            >
              <PresentationPDF
                document={`https://socket.leuteriorealty.com/proxy?url=${course.presentation}`}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
