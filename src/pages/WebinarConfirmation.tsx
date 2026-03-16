import { Typography, Box, keyframes } from "@mui/material";
import { Close, Check } from "@mui/icons-material";
import { useAppProvider } from "../providers/AppProvider";
import useAxios from "../hooks/useAxios";
import { useState, useEffect, useRef } from "react";

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(36px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const softPulse = keyframes`
  0%, 100% { box-shadow: 0 8px 32px rgba(25,118,210,0.35), inset 0 1px 0 rgba(255,255,255,0.15); }
  50%      { box-shadow: 0 12px 48px rgba(25,118,210,0.55), inset 0 1px 0 rgba(255,255,255,0.15); }
`;

const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position: 600px 0; }
`;

// ── logo slide animations (match Welcome.tsx) ───────────────────────────────
const logoSlideIn = keyframes`
  from { opacity: 0; transform: translateX(30px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const logoSlideOut = keyframes`
  from { opacity: 1; transform: translateX(0); }
  to   { opacity: 0; transform: translateX(-30px); }
`;

// same logo set as Welcome.tsx
const LOGOS = [
  { src: "/images/rentph-logo-white.png", alt: "Rent.ph" },
  { src: "/images/lr-logo-white.png", alt: "Leuterio Realty & Brokerage" },
  { src: "/images/fh-logo-white.png", alt: "Filipino Homes" },
];

export default function WebinarConfirmation() {
  const axios = useAxios();
  const { desktop, setUserData } = useAppProvider();
  const [hoveredBtn, setHoveredBtn] = useState<"yes" | "no" | null>(null);
  const [loading, setLoading] = useState<"yes" | "no" | null>(null);
  // logo slider state
  const [logoIndex, setLogoIndex] = useState(0);
  const [logoAnim, setLogoAnim] = useState<"in" | "out">("in");

  const handleConfirmAsync = async (status: "yes" | "no") => {
    try {
      setLoading(status);
      setUserData(null);
      const response = await axios.post(
        "/agent/confirm-nao-attendance",
        { status },
        { headers: { "Content-Type": "application/json" } },
      );
      const { data } = response.data;
      setUserData(data);
    } catch (e) {
      // TODO
    } finally {
      setLoading(null);
    }
  };

  // ── live blob background (same as welcome page) ─────────────────────────
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const blobs = [
      {
        x: 0.25,
        y: 0.2,
        r: 0.55,
        ox: 0,
        oy: 0,
        speed: 0.000035,
        color: [0, 85, 179] as [number, number, number],
      },
      {
        x: 0.75,
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
        y: 0.75,
        r: 0.38,
        ox: 3,
        oy: 3,
        speed: 0.000015,
        color: [200, 218, 255] as [number, number, number],
      },
    ];

    let t = 0;
    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
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

  // ── cycle logos one at a time (like Welcome.tsx) ─────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setLogoAnim("out");
      setTimeout(() => {
        setLogoIndex((prev) => (prev + 1) % LOGOS.length);
        setLogoAnim("in");
      }, 420);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: { xs: "flex-start", lg: "center" },
        flexDirection: "column",
        height: { xs: "100dvh", lg: "100vh" },
        alignItems: "center",
        px: desktop ? 4 : 2.5,
        pt: desktop ? 0 : 7,
        position: "relative",
        overflow: "hidden",
        background: "#071020",
      }}
    >
      {/* ── Sliding single-logo header (mobile-friendly) ── */}
        <Box
          sx={{
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            mb: desktop ? 3 : 2.5,
            pb: desktop ? 1.5 : 1.5,
            width: "100%",
            overflow: "hidden",
            minHeight: desktop ? 0 : 96,
            display: desktop ? "none" : "flex",
            animation: `${fadeInUp} 0.6s ease-out 0.05s both`,
          }}
        >
          <Box
            component="img"
            key={`logo-${logoIndex}`}
            src={LOGOS[logoIndex].src}
            alt={LOGOS[logoIndex].alt}
            sx={{
              height: desktop ? { lg: 64, xs: 44 } : 90,
              // Fallbacks to ensure reasonable size across breakpoints
              maxWidth: desktop ? 210 : 260,
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

      {/* ── Heading ── */}
      <Box
        sx={{
          textAlign: "center",
          zIndex: 1,
          mb: desktop ? 5 : 4,
          animation: `${fadeInUp} 0.65s ease-out 0.1s both`,
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: desktop
              ? "clamp(2.6rem, 5vw, 4rem)"
              : "clamp(2rem, 9vw, 3rem)",
            fontWeight: 900,
            lineHeight: 1.12,
            letterSpacing: "-0.025em",
            color: "#ffffff",
            mb: 0.5,
          }}
        >
          Have you attended the
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: desktop
              ? "clamp(2.6rem, 5vw, 4rem)"
              : "clamp(2rem, 9vw, 3rem)",
            fontWeight: 900,
            lineHeight: 1.5,
            letterSpacing: "-0.025em",
            backgroundImage:
              "linear-gradient(90deg, #7eb8ff 0%, #ffffff 35%, #f0d98a 50%, #ffffff 65%, #7eb8ff 100%)",
            backgroundSize: "600px 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: `${shimmer} 3.5s linear infinite`,
          }}
        >
          New Agent's Orientation?
        </Typography>
      </Box>

      {/* ── YES / NO Buttons ── */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: desktop ? 6 : 4,
          zIndex: 1,
          animation: `${fadeInUp} 0.65s ease-out 0.26s both`,
        }}
      >
        {/* ✕ NO */}
        <Box
          onClick={() => !loading && handleConfirmAsync("no")}
          onMouseEnter={() => setHoveredBtn("no")}
          onMouseLeave={() => setHoveredBtn(null)}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
            cursor: loading ? "default" : "pointer",
            userSelect: "none",
          }}
        >
          <Box
            sx={{
              width: desktop ? 99 : 92,
              height: desktop ? 99 : 92,
              borderRadius: "50%",
              background:
                hoveredBtn === "no"
                  ? "rgba(255,255,255,0.18)"
                  : "rgba(255,255,255,0.07)",
              border: "1.5px solid",
              borderColor:
                hoveredBtn === "no"
                  ? "rgba(255,255,255,0.55)"
                  : "rgba(255,255,255,0.18)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
              transform: hoveredBtn === "no" ? "scale(1.12)" : "scale(1)",
              boxShadow:
                hoveredBtn === "no"
                  ? "0 8px 32px rgba(0,0,0,0.4)"
                  : "0 2px 12px rgba(0,0,0,0.2)",
              "&:active": { transform: "scale(0.94)" },
            }}
          >
            <Close
              sx={{
                fontSize: desktop ? 40 : 40,
                color:
                  hoveredBtn === "no" ? "#ffffff" : "rgba(255,255,255,0.55)",
                transition: "color 0.3s",
              }}
            />
          </Box>
          <Typography
            sx={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: desktop ? "1.2rem" : "1.5rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: hoveredBtn === "no" ? "#ffffff" : "rgba(255,255,255,0.45)",
              transition: "color 0.3s",
            }}
          >
            {loading === "no" ? "..." : "No"}
          </Typography>
        </Box>

        {/* ✓ YES */}
        <Box
          onClick={() => !loading && handleConfirmAsync("yes")}
          onMouseEnter={() => setHoveredBtn("yes")}
          onMouseLeave={() => setHoveredBtn(null)}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
            cursor: loading ? "default" : "pointer",
            userSelect: "none",
          }}
        >
          <Box
            sx={{
              width: desktop ? 100 : 88,
              height: desktop ? 100 : 88,
              borderRadius: "50%",
              background:
                hoveredBtn === "yes"
                  ? "linear-gradient(135deg, #2196f3 0%, #0d47a1 100%)"
                  : "linear-gradient(135deg, #1565c0 0%, #0a2d6e 100%)",
              border: "1.5px solid",
              borderColor:
                hoveredBtn === "yes"
                  ? "rgba(100,180,255,0.6)"
                  : "rgba(25,118,210,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
              transform: hoveredBtn === "yes" ? "scale(1.12)" : "scale(1)",
              animation:
                hoveredBtn !== "yes"
                  ? `${softPulse} 3s ease-in-out infinite`
                  : "none",
              boxShadow:
                hoveredBtn === "yes"
                  ? "0 8px 40px rgba(25,118,210,0.6)"
                  : "0 4px 20px rgba(25,118,210,0.3)",
              "&:active": { transform: "scale(0.94)" },
            }}
          >
            <Check
              sx={{
                fontSize: desktop ? 40 : 32,
                color: "#ffffff",
              }}
            />
          </Box>
          <Typography
            sx={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: desktop ? "1.2rem" : "1.5rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: hoveredBtn === "yes" ? "#ffffff" : "rgba(255,255,255,0.7)",
              transition: "color 0.3s",
            }}
          >
            {loading === "yes" ? "..." : "Yes"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
