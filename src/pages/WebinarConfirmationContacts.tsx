import { Box, Typography, Divider, Avatar } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useAppProvider } from "../providers/AppProvider";
import { CheckCircleRounded, ContactPhoneRounded } from "@mui/icons-material";
import { keyframes } from "@mui/material";
import { useEffect, useRef, useState } from "react";

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

// ── Mobile logo slider animations (reuse pattern from Welcome) ────────────
const logoSlideIn = keyframes`
  from { opacity: 0; transform: translateX(30px); }
  to   { opacity: 1; transform: translateX(0); }
`;
const logoSlideOut = keyframes`
  from { opacity: 1; transform: translateX(0); }
  to   { opacity: 0; transform: translateX(-30px); }
`;
const LOGOS = [
  { src: "/images/rentph-logo-white.png", alt: "Rent.ph" },
  { src: "/images/lr-logo-white.png", alt: "Leuterio Realty & Brokerage" },
  { src: "/images/fh-logo-white.png", alt: "Filipino Homes" },
];

export default function WebinarConfirmationContacts() {
  const { user, desktop } = useAppProvider();
  const isDirect = user?.sponsor?.id === 17;

  const contactName = isDirect ? "Chijah Ilaida" : user?.sponsor?.name;
  const contactPhone = isDirect ? "09233143999" : user?.sponsor?.mobile;
  const contactEmail = isDirect
    ? "it.dept.leuteriorealty@gmail.com"
    : user?.sponsor?.email;
  const contactRole = isDirect ? "Leuterio Direct Secretary" : "Sponsor";

  // ── Toast state — show checkmark animation for 2.2s then reveal content ──
  const [showToast, setShowToast] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const [logoIndex, setLogoIndex] = useState(0);
  const [logoAnim, setLogoAnim] = useState<"in" | "out">("in");

  useEffect(() => {
    // Show toast for 4.5s so user can read, then fade out and reveal content
    const t1 = setTimeout(() => setShowToast(false), 4500);
    const t2 = setTimeout(() => setContentVisible(true), 4800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // rotate logos on mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setLogoAnim("out");
      setTimeout(() => {
        setLogoIndex((p) => (p + 1) % LOGOS.length);
        setLogoAnim("in");
      }, 420);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

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
        justifyContent: { xs: "flex-start", md: "center" },
        alignItems: "center",
        // responsive horizontal padding
        px: { xs: 2, sm: 4, md: 6 },
        // vertical padding ensures content never touches edges on short screens
        py: { xs: 3, sm: 5, md: 4 },
        pt: { xs: 7, sm: 12 },
        position: "relative",
        overflow: "hidden",
        background: "#071020",
        boxSizing: "border-box",
      }}
    >
      {/* ── Sliding single-logo header (mobile-only) ── */}
      <Box
        sx={{
          display: desktop ? "none" : "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: 12,
          left: 0,
          right: 0,
          zIndex: 2,
          width: "100%",
          overflow: "hidden",
          minHeight: 70,
          pointerEvents: "none",
        }}
      >
        <Box
          component="img"
          key={`logo-${logoIndex}`}
          src={LOGOS[logoIndex].src}
          alt={LOGOS[logoIndex].alt}
          sx={{
            height: 80,
            maxWidth: 230,
            width: "auto",
            objectFit: "contain",
            filter: "drop-shadow(0 2px 8px rgba(0,53,128,0.12))",
            animation:
              logoAnim === "in"
                ? `${logoSlideIn} 0.5s cubic-bezier(0.22,1,0.36,1) both`
                : `${logoSlideOut} 0.4s cubic-bezier(0.55,0,0.78,0) both`,
          }}
        />
      </Box>
      {/* ── Live canvas background ── */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: -1,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Subtle overlay to unify background tones on desktop */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background: `
            radial-gradient(70% 90% at 15% 20%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 60%),
            linear-gradient(to top, rgba(0,10,30,0.25) 0%, rgba(0,10,30,0.05) 40%, transparent 70%)
          `,
        }}
      />

      {/* ── Outfit font + toast keyframes ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

        * { font-family: 'Outfit', sans-serif !important; }

        @keyframes wcc-draw-circle {
          from { stroke-dashoffset: 283; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes wcc-draw-check {
          from { stroke-dashoffset: 120; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes wcc-pop-in {
          0%   { transform: scale(0.4); opacity: 0; }
          65%  { transform: scale(1.08); opacity: 1; }
          82%  { transform: scale(0.97); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes wcc-fade-out {
          0%   { opacity: 1; }
          80%  { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes wcc-glow-pulse {
          0%, 100% { filter: drop-shadow(0 0 32px rgba(76,175,80,0.4)); }
          50%       { filter: drop-shadow(0 0 64px rgba(76,175,80,0.75)); }
        }
        .wcc-toast {
          position: fixed; inset: 0; z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          flex-direction: column; gap: 28px;
          background: rgba(7,16,32,0.90);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          animation: wcc-fade-out 4.5s ease forwards;
        }
        .wcc-svg-wrap {
          animation: wcc-pop-in 0.65s cubic-bezier(0.34,1.56,0.64,1) both,
                     wcc-glow-pulse 2.2s ease-in-out 1.2s infinite;
        }
        .wcc-text {
          display: flex; flex-direction: column;
          align-items: center; gap: 8px;
          text-align: center;
          opacity: 0;
          animation: wcc-text-in 0.5s ease 1.1s forwards;
        }
        @keyframes wcc-text-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .wcc-text-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(1.3rem, 3.5vw, 1.75rem);
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.02em;
          margin: 0;
          line-height: 1.15;
        }
        .wcc-text-sub {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(0.82rem, 2vw, 0.95rem);
          color: rgba(255,255,255,0.48);
          margin: 0;
          letter-spacing: 0.01em;
        }
        .wcc-circle-bg {
          fill: rgba(76,175,80,0.07);
          stroke: rgba(76,175,80,0.2);
          stroke-width: 1.5;
        }
        .wcc-circle-ring {
          fill: none; stroke: #4caf50; stroke-width: 2.4;
          stroke-linecap: round;
          stroke-dasharray: 283; stroke-dashoffset: 283;
          animation: wcc-draw-circle 0.85s cubic-bezier(0.65,0,0.45,1) 0.2s forwards;
        }
        .wcc-check {
          fill: none; stroke: #69f0ae; stroke-width: 5;
          stroke-linecap: round; stroke-linejoin: round;
          stroke-dasharray: 120; stroke-dashoffset: 120;
          animation: wcc-draw-check 0.5s cubic-bezier(0.65,0,0.45,1) 0.95s forwards;
        }
      `}</style>

      {/* ── Success toast — checkmark only ── */}
      {showToast && (
        <div className="wcc-toast">
          <div className="wcc-svg-wrap">
            <svg viewBox="0 0 90 90" width="220" height="220">
              <circle className="wcc-circle-bg" cx="45" cy="45" r="43" />
              <circle
                className="wcc-circle-ring"
                cx="45"
                cy="45"
                r="43"
                transform="rotate(-90 45 45)"
              />
              <polyline className="wcc-check" points="24,46 38,60 66,32" />
            </svg>
          </div>
          <div className="wcc-text">
            <p className="wcc-text-title">Proof successfully uploaded!</p>
            <p className="wcc-text-sub">Your attendance has been submitted.</p>
          </div>
        </div>
      )}

      {/* ── Main content — fades in after toast ── */}
      <Grid
        container
        spacing={{ xs: 3, sm: 4, md: 8 }}
        sx={{
          maxWidth: 1300,
          width: "100%",
          position: "relative",
          zIndex: 1,
          alignItems: "center",
          opacity: contentVisible ? 1 : 0,
          transform: contentVisible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
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
                  xs: "clamp(3.5rem, 9vw, 2.8rem)",
                  sm: "clamp(2.2rem, 6vw, 3rem)",
                  md: "clamp(2.2rem, 4vw, 4.2rem)",
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
                  xs: "clamp(3.5rem, 9vw, 4rem)",
                  sm: "clamp(3rem, 6vw, 4rem)",
                  md: "clamp(2.2rem, 4vw, 4.2rem)",
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
              maxWidth: 500,
              mb: { xs: 3, sm: 4, md: 4.5 },
              lineHeight: 1.78,
              fontSize: { xs: "1rem", sm: "1.05rem", md: "1.2rem" },
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
              textAlign: { xs: "left", md: "left" },
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
                    fontSize: { xs: "1.2rem", sm: "1.3rem", md: "1.8rem" },
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
                    fontSize: "1rem",
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
                fontSize: { xs: "1.05rem", sm: "1.1rem", md: "1.3rem" },
                mb: 0.5,
                textAlign: { xs: "left", md: "left" },
              }}
            >
              {contactPhone}
            </Typography>

            {/* Email — allow wrapping on small screens */}
            <Typography
              sx={{
                fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1.1rem" },
                color: "rgba(255,255,255,0.45)",
                wordBreak: "break-word",
                textAlign: { xs: "left", md: "left" },
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
              width: { sm: "60%", md: "75%", lg: 680 },
              maxWidth: 680,
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
