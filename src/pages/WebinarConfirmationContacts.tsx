import { Box, Typography, Divider, Avatar } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useAppProvider } from "../providers/AppProvider";
import { CheckCircleRounded, ContactPhoneRounded } from "@mui/icons-material";
import { keyframes } from "@mui/material";
import { useEffect, useRef } from "react";

// ── Keyframes ──────────────────────────────────────────────────────────────
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const popIn = keyframes`
  0%   { transform: scale(0.6); opacity: 0; }
  70%  { transform: scale(1.08); }
  100% { transform: scale(1);   opacity: 1; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-16px); }
`;

const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
`;

const shimmerLine = keyframes`
  from { width: 0; opacity: 0; }
  to   { width: 48px; opacity: 1; }
`;

export default function WebinarConfirmationContacts() {
  const { user } = useAppProvider();
  const isDirect = user?.sponsor?.id === 17;

  const contactName = isDirect ? "Chijah Ilaida" : user?.sponsor?.name;
  const contactPhone = isDirect ? "09233143999" : user?.sponsor?.mobile;
  const contactEmail = isDirect
    ? "it.dept.leuteriorealty@gmail.com"
    : user?.sponsor?.email;
  const contactRole = isDirect ? "Leuterio Direct Secretary" : "Sponsor";

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
      // Use setTransform to avoid scale accumulation on repeated resize
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const blobs = [
      {
        x: 0.2,
        y: 0.18,
        r: 0.55,
        ox: 0,
        oy: 0,
        speed: 0.000035,
        color: [0, 85, 179] as [number, number, number],
      },
      {
        x: 0.78,
        y: 0.72,
        r: 0.5,
        ox: 1,
        oy: 2,
        speed: 0.000025,
        color: [0, 55, 140] as [number, number, number],
      },
      {
        x: 0.55,
        y: 0.45,
        r: 0.42,
        ox: 2,
        oy: 1,
        speed: 0.00002,
        color: [220, 235, 255] as [number, number, number],
      },
      {
        x: 0.15,
        y: 0.78,
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
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // responsive horizontal padding
        px: { xs: 2, sm: 4, md: 6 },
        // vertical padding ensures content never touches edges on short screens
        py: { xs: 4, sm: 5, md: 4 },
        pt: { xs: 4, sm: 20 },
        position: "relative",
        overflow: "hidden",
        background: "#071020",
        boxSizing: "border-box",
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

      <Grid
        container
        spacing={{ xs: 3, sm: 4, md: 8 }}
        sx={{
          maxWidth: 1100,
          width: "100%",
          position: "relative",
          zIndex: 1,
          // vertically center items on all breakpoints
          alignItems: "center",
        }}
      >
        {/* ── LEFT CONTENT ── */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ textAlign: { xs: "center", md: "left" } }}
        >
          {/* Success badge */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              mb: { xs: 2, sm: 2.5 },
              px: 1.8,
              py: 0.6,
              borderRadius: "100px",
              border: "1px solid rgba(76,175,80,0.35)",
              background: "rgba(76,175,80,0.09)",
              animation: `${fadeInUp} 0.6s ease both`,
            }}
          >
            <CheckCircleRounded
              sx={{
                fontSize: 17,
                color: "#66bb6a",
                animation: `${popIn} 0.6s ease both`,
              }}
            />
            <Typography
              sx={{
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.13em",
                textTransform: "uppercase",
                color: "#66bb6a",
              }}
            >
              Attendance Uploaded
            </Typography>
          </Box>

          {/* Headline */}
          <Box sx={{ mb: 0.5, animation: `${fadeInUp} 0.65s ease 0.08s both` }}>
            <Typography
              sx={{
                fontSize: {
                  xs: "clamp(1.6rem, 7vw, 2.1rem)",
                  sm: "clamp(1.8rem, 5vw, 2.6rem)",
                  md: "clamp(2rem, 4vw, 3.2rem)",
                },
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
                color: "#ffffff",
              }}
            >
              Almost there,
            </Typography>
            <Typography
              sx={{
                fontSize: {
                  xs: "clamp(1.6rem, 7vw, 2.1rem)",
                  sm: "clamp(1.8rem, 5vw, 2.6rem)",
                  md: "clamp(2rem, 4vw, 3.2rem)",
                },
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
                backgroundImage:
                  "linear-gradient(90deg, #7eb8ff 0%, #ffffff 35%, #f0d98a 50%, #ffffff 65%, #7eb8ff 100%)",
                backgroundSize: "600px 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: `${shimmer} 3.5s linear infinite`,
              }}
            >
              one step left!
            </Typography>
          </Box>

          {/* Gold accent line */}
          <Box
            sx={{
              height: "2px",
              background:
                "linear-gradient(90deg, #c9a84c, #f0d98a, transparent)",
              mb: { xs: 2, sm: 2.5 },
              // center on mobile/tablet, left-align on desktop
              mx: { xs: "auto", md: 0 },
              animation: `${shimmerLine} 1s cubic-bezier(0.22,1,0.36,1) 0.5s both`,
              width: 0,
            }}
          />

          {/* Subtitle */}
          <Typography
            sx={{
              color: "rgba(255,255,255,0.60)",
              maxWidth: 460,
              mb: { xs: 3, sm: 4, md: 4.5 },
              lineHeight: 1.78,
              fontSize: { xs: "0.85rem", sm: "0.92rem", md: "1rem" },
              // center on mobile/tablet, left-align on desktop
              mx: { xs: "auto", md: 0 },
              animation: `${fadeInUp} 0.65s ease 0.16s both`,
            }}
          >
            Please contact your{" "}
            <Box component="span" sx={{ color: "#f0d98a", fontWeight: 700 }}>
              {contactRole}
            </Box>{" "}
            for attendance approval. They will notify you once your request has
            been reviewed.
          </Typography>

          {/* ── Contact card ── */}
          <Box
            sx={{
              p: { xs: 2.5, sm: 3, md: 3.5 },
              // full-width on mobile, max-width on larger screens
              width: "100%",
              maxWidth: { xs: "100%", sm: 460 },
              borderRadius: "20px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.10)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 20px 48px rgba(0,0,0,0.3)",
              // center on mobile/tablet, left-align on desktop
              mx: { xs: "auto", md: 0 },
              animation: `${fadeInUp} 0.65s ease 0.24s both`,
              boxSizing: "border-box",
            }}
          >
            {/* Avatar + name row */}
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{
                  background:
                    "linear-gradient(135deg, #1e88e5 0%, #0d47a1 100%)",
                  width: { xs: 46, sm: 52 },
                  height: { xs: 46, sm: 52 },
                  boxShadow: "0 4px 18px rgba(25,118,210,0.45)",
                  flexShrink: 0,
                }}
              >
                <ContactPhoneRounded sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#ffffff",
                    fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
                    lineHeight: 1.3,
                    // prevent long names from overflowing
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {contactName}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    color: "#7eb8ff",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    mt: 0.2,
                  }}
                >
                  {contactRole}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.09)", mb: 2 }} />

            {/* Phone */}
            <Typography
              sx={{
                fontWeight: 700,
                color: "#ffffff",
                fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
                mb: 0.5,
              }}
            >
              {contactPhone}
            </Typography>

            {/* Email — allow wrapping on small screens */}
            <Typography
              sx={{
                fontSize: { xs: "0.72rem", sm: "0.78rem", md: "0.8rem" },
                color: "rgba(255,255,255,0.45)",
                wordBreak: "break-word",
              }}
            >
              {contactEmail}
            </Typography>
          </Box>
        </Grid>

        {/* ── RIGHT IMAGE — hidden on xs, visible sm+ ── */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: { xs: "none", sm: "flex" },
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              animation: `${float} 5s ease-in-out infinite`,
              filter: "drop-shadow(0 30px 60px rgba(0,85,179,0.35))",
              // responsive image size
              width: { sm: "60%", md: "75%", lg: 380 },
              maxWidth: 420,
            }}
          >
            <img
              src="/images/notify-phone-icon.png"
              style={{ width: "100%", display: "block" }}
              alt="Notification"
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
