import { Box, Typography } from "@mui/material";
import StyledButton from "../components/utils/StyledButton";
import { ArrowForward } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

// ── Slider images ──────────────────────────────────────────────────────────────
const SLIDE_IMAGES = [
  "/images/natcon2025.jpg",
  "/images/natcon2024.jpg",
  "/images/natcon2023.jpg",
];

// ── Logos that slide one-by-one, all same size ────────────────────────────────
const LOGOS = [
  { src: "/images/rentph-logo-white.png", alt: "Rent.ph" },
  { src: "/images/lr-logo-white.png", alt: "Leuterio Realty & Brokerage" },
  { src: "/images/fh-logo-white.png", alt: "Filipino Homes" },
];

const animationStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,400;1,600;1,700&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  :root {
    --blue-deep: #003580;
    --blue-mid: #0055b3;
    --blue-bright: #0077e6;
    --gold: #c9a84c;
    --gold-light: #f0d98a;
    --text-dark: #ffffff;
    --text-muted: rgba(255,255,255,0.72);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }

  @keyframes lineDraw {
    from { width: 0; opacity: 0; }
    to   { width: 60px; opacity: 1; }
  }

  @keyframes goldPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.5); }
    50%       { box-shadow: 0 0 0 8px rgba(201,168,76,0); }
  }

  @keyframes bgShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes particleDrift {
    0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 0.6; }
    100% { transform: translateY(-80px) translateX(20px) scale(0.6); opacity: 0; }
  }

  @keyframes panImage {
    0%   { transform: scale(1.06) translateX(0px); }
    50%  { transform: scale(1.06) translateX(-12px); }
    100% { transform: scale(1.06) translateX(0px); }
  }

  @keyframes orbDrift1 {
    0%, 100% { transform: translate(0, 0); }
    50%       { transform: translate(16px, -12px); }
  }

  @keyframes orbDrift2 {
    0%, 100% { transform: translate(0, 0); }
    50%       { transform: translate(-12px, 16px); }
  }

  /* ── LOGO SLIDER ── */
  @keyframes logoSlideIn {
    from { opacity: 0; transform: translateX(30px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  @keyframes logoSlideOut {
    from { opacity: 1; transform: translateX(0); }
    to   { opacity: 0; transform: translateX(-30px); }
  }

  .logo-slide-in  { animation: logoSlideIn  0.5s cubic-bezier(0.22,1,0.36,1) both; }
  .logo-slide-out { animation: logoSlideOut 0.4s cubic-bezier(0.55,0,0.78,0) both; }

  /* uniform logo size — all logos same height, same max-width */
  .logo-unified {
    height: 44px;
    width: auto;
    max-width: 160px;
    object-fit: contain;
    flex-shrink: 0;
    display: block;
  }

  /* ── IMAGE SLIDER ── */
  .slide-track {
    display: flex;
    width: 100%;
    height: 100%;
    will-change: transform;
    transition: transform 0.9s cubic-bezier(0.77, 0, 0.175, 1);
  }

  .slide-item {
    flex: 0 0 100%;
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  .slide-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    display: block;
    animation: panImage 20s ease-in-out infinite;
  }

  /* dot indicators */
  .slider-dots {
    position: absolute;
    bottom: 18px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    z-index: 10;
  }

  .slider-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: rgba(255,255,255,0.45);
    border: 1px solid rgba(255,255,255,0.6);
    cursor: pointer;
    transition: all 0.35s ease;
  }

  .slider-dot.active {
    background: var(--gold);
    border-color: var(--gold-light);
    transform: scale(1.35);
    box-shadow: 0 0 6px rgba(201,168,76,0.7);
  }

  .anim-1 { animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.10s both; }
  .anim-2 { animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.22s both; }
  .anim-3 { animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.34s both; }
  .anim-4 { animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.46s both; }
  .anim-5 { animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.58s both; }
  .anim-img { animation: fadeIn 1.2s ease 0.05s both; }

  .shimmer-text {
    background: linear-gradient(
      90deg,
      #7eb8ff 0%,
      #ffffff 35%,
      var(--gold-light) 50%,
      #ffffff 65%,
      #7eb8ff 100%
    );
    background-size: 600px 100%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3.5s linear infinite;
  }

  .gold-line {
    display: block;
    height: 2px;
    background: linear-gradient(90deg, var(--gold), var(--gold-light), transparent);
    margin-top: 12px;
    margin-bottom: 18px;
    animation: lineDraw 1s cubic-bezier(0.22,1,0.36,1) 0.6s both;
    width: 0;
    opacity: 0.8;
  }

  .badge-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.08));
    border: 1px solid rgba(201,168,76,0.5);
    border-radius: 100px;
    padding: 4px 13px;
    font-family: 'Open Sans', sans-serif;
    font-size: 0.65rem;
    font-weight: 600;
    color: var(--gold-light);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .badge-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--gold);
    animation: goldPulse 2s ease-in-out infinite;
    flex-shrink: 0;
  }

  .cta-btn {
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 100%) !important;
    border: 1px solid rgba(255,255,255,0.35) !important;
    border-radius: 6px !important;
    font-family: 'Open Sans', sans-serif !important;
    font-weight: 600 !important;
    letter-spacing: 0.1em !important;
    text-transform: uppercase !important;
    color: white !important;
    box-shadow: 0 4px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.25) !important;
    backdrop-filter: blur(8px) !important;
    transition: all 0.35s cubic-bezier(0.22,1,0.36,1) !important;
    width: 100% !important;
  }

  .cta-btn::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
    transition: left 0.5s ease;
  }

  .cta-btn:hover::before { left: 100%; }
  .cta-btn:hover {
    transform: translateY(-2px) !important;
    background: linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.15) 100%) !important;
    border-color: rgba(255,255,255,0.55) !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.35) !important;
  }
  .cta-btn:active { transform: translateY(0) !important; }

  .pan-image { animation: panImage 20s ease-in-out infinite; }

  .logo-divider {
    width: 1px;
    height: 28px;
    background: linear-gradient(to bottom, transparent, rgba(201,168,76,0.4), transparent);
    flex-shrink: 0;
    margin: 0 2px;
  }

  .orb-1 { animation: orbDrift1 9s ease-in-out infinite; }
  .orb-2 { animation: orbDrift2 11s ease-in-out infinite; }

  /* ── WELCOME ROOT ── */
  .welcome-root {
    display: flex;
    width: 100%;
    min-height: 100vh;
    overflow: hidden;
    position: relative;
  }

  /* ── LEFT PANEL dark animated background ── */
  .left-panel {
    background: linear-gradient(
      135deg,
      #0a1628 0%,
      #001a45 25%,
      #0d1f3c 50%,
      #001233 75%,
      #0a0f1e 100%
    ) !important;
    background-size: 400% 400% !important;
    animation: bgShift 14s ease infinite !important;
  }

  /* Subtle star-like particles */
  .left-panel::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(1px 1px at 18% 22%, rgba(255,255,255,0.18) 0%, transparent 100%),
      radial-gradient(1px 1px at 72% 11%, rgba(255,255,255,0.12) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 45% 68%, rgba(201,168,76,0.25) 0%, transparent 100%),
      radial-gradient(1px 1px at 88% 55%, rgba(255,255,255,0.10) 0%, transparent 100%),
      radial-gradient(1px 1px at 30% 82%, rgba(255,255,255,0.14) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 62% 38%, rgba(201,168,76,0.18) 0%, transparent 100%),
      radial-gradient(1px 1px at 10% 58%, rgba(255,255,255,0.09) 0%, transparent 100%),
      radial-gradient(1px 1px at 93% 78%, rgba(255,255,255,0.13) 0%, transparent 100%);
    pointer-events: none;
    z-index: 0;
    opacity: 0.7;
  }

  /* ── MOBILE (< 640px) ── */
  @media (max-width: 639px) {
    .welcome-root {
      flex-direction: column;
      position: relative;
    }
    .image-panel {
      position: fixed !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      z-index: 0 !important;
    }
    .left-panel {
      position: relative;
      z-index: 2;
      width: 100% !important;
      min-height: 100vh;
      background: linear-gradient(160deg, #0a1628 0%, #001a45 50%, #0a0f1e 100%) !important;
      border-right: none !important;
      box-shadow: none !important;
      padding: 120px 24px 40px !important;
      overflow-y: auto;
      display: flex !important;
      flex-direction: column !important;
      justify-content: flex-start !important;
    }
    .logo-row img.logo-unified { height: 30px !important; max-width: 120px !important; }
    .welcome-headline { font-size: 1.9rem !important; }
    .body-copy { font-size: 0.84rem !important; }
    .cta-btn { padding: 13px 24px !important; font-size: 0.84rem !important; }
  }

  /* ── TABLET (640px – 1023px) ── */
  @media (min-width: 640px) and (max-width: 1023px) {
    .welcome-root {
      flex-direction: column;
      min-height: 100vh;
      overflow-y: auto;
      position: relative;
    }
    .image-panel {
      position: relative !important;
      width: 100% !important;
      height: 52vw !important;
      min-height: 280px !important;
      max-height: 420px !important;
      flex-shrink: 0 !important;
    }
    .left-panel {
      width: 100% !important;
      min-height: auto !important;
      padding: 32px 48px 40px !important;
      border-right: none !important;
      box-shadow: none !important;
      border-top: 1px solid rgba(201,168,76,0.15) !important;
    }
    .logo-row { justify-content: center !important; }
    .logo-row img.logo-unified { height: 36px !important; max-width: 140px !important; }
    .welcome-headline { font-size: clamp(2rem, 4vw, 2.8rem) !important; }
    .content-grid {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 32px !important;
      align-items: start !important;
    }
    .content-left { grid-column: 1; }
    .content-right { grid-column: 2; }
    .cta-btn { padding: 13px 32px !important; font-size: 0.88rem !important; }
  }

  /* ── SMALL DESKTOP (1024px – 1279px) ── */
  @media (min-width: 1024px) and (max-width: 1279px) {
    .left-panel { width: 30% !important; padding: 24px 2% !important; }
    .welcome-root { position: fixed; inset: 0; overflow: hidden; }
    .image-panel { position: relative !important; }
    .welcome-headline { font-size: clamp(1.6rem, 2vw, 2.2rem) !important; }
    .logo-row img.logo-unified { height: 28px !important; max-width: 110px !important; }
    .cta-btn { padding: 12px 24px !important; font-size: 0.82rem !important; }
  }

  /* ── LARGE DESKTOP (1280px+) ── */
  @media (min-width: 1280px) {
    .welcome-root { position: fixed; inset: 0; overflow: hidden; }
    .image-panel { position: relative !important; }
    .left-panel { width: 28% !important; padding: 28px 2%!important; }
    .welcome-headline { font-size: clamp(4rem, 2.4vw, 3rem) !important;}
    .logo-row img.logo-unified { height: 74px !important; max-width: 190px !important; }
    .cta-btn { padding: 13px 32px !important; font-size: 0.88rem !important; }
  }
`;

export default function Welcome() {
  // ── logo slider state ────────────────────────────────────────────────────
  const [logoIndex, setLogoIndex] = useState(0);
  const [logoAnim, setLogoAnim] = useState<"in" | "out">("in");

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

  // ── image slider state ───────────────────────────────────────────────────
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDE_IMAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <style>{animationStyles}</style>

      <div className="welcome-root">
        {/* ══════════════════════════════════════
            LEFT PANEL
        ══════════════════════════════════════ */}
        <Box
          className="left-panel"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            position: "relative",
            background: "#e0dddd",
            overflow: "hidden",
            borderRight: "1px solid rgba(201,168,76,0.18)",
            boxShadow: "4px 0 40px rgba(0,0,0,0.4)",
            height: { xs: "auto", lg: "100vh" },
            padding: { xs: "24px 20px 32px", sm: "32px 48px 40px" },
          }}
        >
          {/* Ambient orbs */}
          <Box
            className="orb-1"
            sx={{
              position: "absolute",
              top: "5%",
              right: "-10%",
              width: 200,
              height: 200,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(0,119,230,0.12) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <Box
            className="orb-2"
            sx={{
              position: "absolute",
              bottom: "8%",
              left: "-6%",
              width: 160,
              height: 160,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* ── LOGO SLIDER — one logo at a time, same size ── */}
          <Box
            className="anim-1 logo-row"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: { xs: 2.5, lg: 3 },
              pb: { xs: 2, lg: 2.5 },
              // borderBottom: "1px solid rgba(201,168,76,0.2)",
              width: "100%",
              overflow: "hidden",
              minHeight: 60,
            }}
          >
            <img
              key={`logo-${logoIndex}`}
              src={LOGOS[logoIndex].src}
              alt={LOGOS[logoIndex].alt}
              className={`logo-unified ${logoAnim === "in" ? "logo-slide-in" : "logo-slide-out"}`}
              style={{
                filter: "drop-shadow(0 2px 8px rgba(0,53,128,0.12))",
              }}
            />
          </Box>

          {/* ── CONTENT GRID (tablet: 2-col, others: single col) ── */}
          <Box
            className="content-grid"
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: { xs: "flex-start", lg: "center" },
            }}
          >
            {/* ── LEFT COLUMN of tablet grid ── */}
            <Box className="content-left">
              {/* Badge */}
              <Box className="anim-2" sx={{ mb: { xs: 1.5, lg: 2 } }}>
                <span className="badge-pil">
                  {/* <span className="badge-dot" /> */}
                  {/* Smart Property Dashboard */}
                </span>
              </Box>

              {/* Headline */}
              <Box className="anim-3">
                <Typography
                  component="h1"
                  className="welcome-headline"
                  sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontWeight: 700,
                    lineHeight: 1.07,
                    color: "var(--text-dark)",
                  }}
                >
                  Welcome to{" "}
                  <Box component="span" className="shimmer-text">
                    Leuterio
                  </Box>
                  <br />
                  <Box
                    component="span"
                    sx={{
                      // fontStyle: "italic",
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.92)",
                      WebkitTextFillColor: "rgba(255,255,255,0.92)",
                    }}
                  >
                    Realty Portal
                  </Box>
                </Typography>
                <span className="gold-line" />
              </Box>

              {/* Body copy */}
              <Box className="anim-3" sx={{ mb: { xs: 2.5, lg: 3 } }}>
                <Typography
                  className="body-copy"
                  sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: { xs: "0.84rem", sm: "0.9rem", lg: "1.2rem" },
                    fontWeight: 400,
                    color: "var(--text-muted)",
                    lineHeight: 1.82,
                  }}
                >
                  Congratulations! You've successfully accessed the Leuterio
                  Realty Portal. We're excited to support you on your real
                  estate journey and help you achieve your dreams.
                </Typography>
              </Box>
            </Box>

            {/* ── RIGHT COLUMN of tablet grid ── */}
            <Box className="content-right">
              {/* CTA */}
              <Box className="anim-5">
                <Link
                  to="/welcome/get-started"
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <StyledButton
                    endIcon={<ArrowForward />}
                    variant="contained"
                    size="large"
                    className="cta-btn"
                  >
                    Get Started
                  </StyledButton>
                </Link>

                <Typography
                  sx={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: { xs: "0.7rem", lg: "0.7rem" },
                    color: "var(--text-muted)",
                    mt: 1.8,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      width: 13,
                      height: 13,
                    }}
                  />
                  {/* Secure access · Free to explore */}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Bottom branding strip */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mt: { xs: 3, lg: 2 },
            }}
          >
            <Box
              sx={{
                height: 1,
                width: 22,
                background: "var(--gold)",
                opacity: 0.5,
              }}
            />
            <Typography
              sx={{
                fontFamily: "'Open Sans', sans-serif",
                fontSize: "0.57rem",
                color: "var(--text-muted)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {/* Leuterio Realty & Brokerage */}
            </Typography>
          </Box>
        </Box>

        {/* ══════════════════════════════════════
            IMAGE PANEL — slider
        ══════════════════════════════════════ */}
        <Box
          className="image-panel anim-img"
          sx={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            minHeight: { xs: "100%", sm: "280px" },
          }}
        >
          {/* Slide track */}
          <div
            className="slide-track"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {SLIDE_IMAGES.map((src, idx) => (
              <div className="slide-item" key={idx}>
                <img src={src} alt={`Leuterio Realty slide ${idx + 1}`} />
              </div>
            ))}
          </div>

          {/* Gradient overlays */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              background: `
              linear-gradient(to right, rgba(255,255,255,0.08) 0%, transparent 12%),
              linear-gradient(to top, rgba(0,10,30,0.45) 0%, rgba(0,10,30,0.08) 35%, transparent 55%)
            `,
              pointerEvents: "none",
            }}
          />

          {/* Mobile overlay */}
          <Box
            sx={{
              display: { xs: "block", sm: "none" },
              position: "absolute",
              inset: 0,
              zIndex: 1,
              background: "rgba(255,255,255,0.0)",
              pointerEvents: "none",
            }}
          />

          {/* Gold corner accent */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 2,
              width: 0,
              height: 0,
              borderTop: "70px solid rgba(201,168,76,0.12)",
              borderRight: "70px solid transparent",
              pointerEvents: "none",
            }}
          />

          {/* Dot indicators */}
          <div className="slider-dots">
            {SLIDE_IMAGES.map((_, idx) => (
              <div
                key={idx}
                className={`slider-dot${activeSlide === idx ? " active" : ""}`}
                onClick={() => setActiveSlide(idx)}
              />
            ))}
          </div>
        </Box>
      </div>
    </>
  );
}
