import { Avatar, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import YoutubeEmbedWebinar from "../components/utils/YoutubeEmbededWebiner";
// import { useAppProvider } from "../providers/AppProvider";
import { keyframes } from "@mui/material";
import { useEffect, useRef } from "react";

// ── Keyframes ──────────────────────────────────────────────────────────────
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
`;

const shimmerLine = keyframes`
  from { width: 0; opacity: 0; }
  to   { width: 120px; opacity: 1; }
`;

const avatarGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(25,118,210,0.4); }
  50%       { box-shadow: 0 0 0 6px rgba(25,118,210,0); }
`;

export default function Webinar() {
  // const { desktop } = useAppProvider();

  // ── Live canvas background ───────────────────────────────────────────────
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
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
        x: 0.2,
        y: 0.15,
        r: 0.55,
        ox: 0,
        oy: 0,
        speed: 0.000035,
        color: [0, 85, 179] as [number, number, number],
      },
      {
        x: 0.8,
        y: 0.75,
        r: 0.5,
        ox: 1,
        oy: 2,
        speed: 0.000025,
        color: [0, 55, 140] as [number, number, number],
      },
      {
        x: 0.55,
        y: 0.5,
        r: 0.42,
        ox: 2,
        oy: 1,
        speed: 0.00002,
        color: [220, 235, 255] as [number, number, number],
      },
      {
        x: 0.15,
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
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#071020";
      ctx.fillRect(0, 0, W, H);

      blobs.forEach((b) => {
        const cx = (b.x + Math.sin(t * b.speed * 1000 + b.ox) * 0.1) * W;
        const cy = (b.y + Math.cos(t * b.speed * 800 + b.oy) * 0.08) * H;
        const rad = b.r * Math.max(W, H);
        const [r, g, bl] = b.color;
        const isLight = r > 150;
        const peak = isLight ? 0.06 : 0.2;
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
        height: "100vh",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background: "#071020",
      }}
    >
      {/* ── Live canvas background ── */}
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

      {/* ── Two-column layout ── */}
      <Grid
        container
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100%",
        }}
      >
        {/* ════ LEFT — text content ════ */}
        <Grid
          size={{ xs: 12, md: 5 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            px: { xs: 3, sm: 5, md: 5, lg: 7 },
            py: { xs: 4, md: 0 },
            // borderRight: { md: "1px solid rgba(255,255,255,0.07)" },
            // on mobile: takes natural height, stacks above video
            overflowY: { xs: "auto", md: "hidden" },
          }}
        >
          {/* Label pill */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.8,
              mb: { xs: 2, md: 2.5 },
              px: 1.8,
              py: 0.6,
              width: "fit-content",
              borderRadius: "100px",
              border: "1px solid rgba(25,118,210,0.35)",
              background: "rgba(25,118,210,0.09)",
              animation: `${fadeInUp} 0.5s ease both`,
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#7eb8ff",
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                fontSize: { xs: "0.68rem", md: "0.72rem" },
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#7eb8ff",
                whiteSpace: "nowrap",
              }}
            >
              New Agents Webinar
            </Typography>
          </Box>

          {/* Headline */}
          <Box sx={{ animation: `${fadeInUp} 0.6s ease 0.08s both` }}>
            <Typography
              sx={{
                fontSize: {
                  xs: "clamp(2.4rem, 10vw, 3.5rem)",
                  sm: "clamp(3rem, 7vw, 4.5rem)",
                  md: "clamp(2.6rem, 4.5vw, 4rem)",
                  lg: "clamp(3rem, 4vw, 4.8rem)",
                },
                fontWeight: 900,
                lineHeight: 1.0,
                letterSpacing: "-0.035em",
                color: "#ffffff",
                mb: 0.2,
              }}
            >
              Watch the
            </Typography>
            <Typography
              sx={{
                fontSize: {
                  xs: "clamp(2.4rem, 10vw, 3.5rem)",
                  sm: "clamp(3rem, 7vw, 4.5rem)",
                  md: "clamp(2.6rem, 4.5vw, 4rem)",
                  lg: "clamp(3rem, 4vw, 4.8rem)",
                },
                fontWeight: 900,
                lineHeight: 1.0,
                letterSpacing: "-0.035em",
                backgroundImage:
                  "linear-gradient(90deg, #7eb8ff 0%, #ffffff 35%, #f0d98a 50%, #ffffff 65%, #7eb8ff 100%)",
                backgroundSize: "600px 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: `${shimmer} 3.5s linear infinite`,
              }}
            >
              Full Presentation
            </Typography>

            {/* Gold accent line */}
            <Box
              sx={{
                height: "2px",
                background:
                  "linear-gradient(90deg, #c9a84c, #f0d98a, transparent)",
                mt: 1.5,
                mb: { xs: 2.5, md: 3 },
                animation: `${shimmerLine} 1s cubic-bezier(0.22,1,0.36,1) 0.4s both`,
                width: 0,
              }}
            />
          </Box>

          {/* Speaker */}
          <Box
            sx={{
              animation: `${fadeInUp} 0.65s ease 0.16s both`,
            }}
          >
            <Box
              sx={{ display: "flex", gap: 2.5, alignItems: "center", mb: 2 }}
            >
              <Avatar
                src="/images/boss-ton.jpg"
                sx={{
                  width: { xs: 58, md: 108 },
                  height: { xs: 58, md: 108 },
                  flexShrink: 0,
                  border: "2px solid rgba(25,118,210,0.45)",
                  animation: `${avatarGlow} 3s ease-in-out infinite`,
                }}
              />
              <Box>
                <Typography
                  sx={{
                    fontWeight: 800,
                    color: "#ffffff",
                    fontSize: { xs: "1.1rem", md: "1.25rem", lg: "2.6rem" },
                    lineHeight: 1.2,
                  }}
                >
                  Anthony Leuterio
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "0.8rem", md: "1rem" },
                    fontWeight: 600,
                    color: "#7eb8ff",
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    mt: 0.3,
                  }}
                >
                  REB e-PRO · Speaker
                </Typography>
              </Box>
            </Box>

            {/* Credentials */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.8,
                pl: 0.5,
              }}
            >
              {[
                "CEO & Founder of Filipino Homes",
                "2024 International Realtor of the Year",
              ].map((line) => (
                <Box
                  key={line}
                  sx={{ display: "flex", alignItems: "center", gap: 1.2 }}
                >
                  <Box
                    sx={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "#c9a84c",
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: { xs: "0.88rem", md: "0.96rem", lg: "1.1rem" },
                      color: "rgba(255,255,255,0.70)",
                      fontWeight: 500,
                    }}
                  >
                    {line}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* ════ RIGHT — video + instructions ════ */}
        <Grid
          size={{ xs: 12, md: 7 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 2, md: 2.5 },
            px: { xs: 2, sm: 3, md: 4, lg: 5 },
            py: { xs: 3, md: 0 },
            height: { xs: "auto", md: "100%" },
          }}
        >
          {/* Video */}
          <Box
            sx={{
              width: "100%",
              maxWidth: { xs: "100%", md: 800 },
              animation: `${fadeInUp} 0.7s ease 0.12s both`,
            }}
          >
            <Box
              sx={{
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.10)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.55)",
                position: "relative",
                py: 0,
              }}
            >
              <YoutubeEmbedWebinar />
            </Box>
          </Box>

          {/* Instructions — below video */}
          <Box
            sx={{
              width: "100%",
              maxWidth: { xs: "100%", md: 800 },
              p: { xs: 2, md: 2.5 },
              borderRadius: "14px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              animation: `${fadeInUp} 0.7s ease 0.22s both`,
            }}
          >
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#f0d98a",
                  flexShrink: 0,
                  mt: "5px",
                }}
              />
              <Typography
                sx={{
                  fontSize: { xs: "0.78rem", md: "0.82rem" },
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.72,
                }}
              >
                To continue to the{" "}
                <Box
                  component="span"
                  sx={{ color: "#f0d98a", fontWeight: 700 }}
                >
                  FIRE Website
                </Box>
                , you must watch and complete the full video presentation.{" "}
                <Box
                  component="span"
                  sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}
                >
                  Save the video watched progress
                </Box>{" "}
                if you want to continue at a later time.
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
