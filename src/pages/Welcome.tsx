import { Box, Typography } from "@mui/material";
import StyledButton from "../components/utils/StyledButton";
import { ArrowForward } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useAppProvider } from "../providers/AppProvider";

const animationStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --blue-deep: #003580;
    --blue-mid: #0055b3;
    --blue-bright: #0077e6;
    --gold: #c9a84c;
    --gold-light: #f0d98a;
    --text-dark: #0a1628;
    --text-muted: #4a5d7a;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
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
    to   { width: 72px; opacity: 1; }
  }

  @keyframes goldPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.5); }
    50%       { box-shadow: 0 0 0 10px rgba(201,168,76,0); }
  }

  @keyframes panImage {
    0%   { transform: scale(1.06) translateX(0px); }
    50%  { transform: scale(1.06) translateX(-14px); }
    100% { transform: scale(1.06) translateX(0px); }
  }

  @keyframes orbDrift1 {
    0%, 100% { transform: translate(0, 0); }
    50%       { transform: translate(20px, -15px); }
  }

  @keyframes orbDrift2 {
    0%, 100% { transform: translate(0, 0); }
    50%       { transform: translate(-15px, 20px); }
  }

  .anim-1 { animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.10s both; }
  .anim-2 { animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
  .anim-3 { animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.40s both; }
  .anim-4 { animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.55s both; }
  .anim-5 { animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.70s both; }
  .anim-img { animation: fadeIn 1.2s ease 0.05s both; }

  .shimmer-text {
    background: linear-gradient(
      90deg,
      var(--blue-deep) 0%,
      var(--blue-bright) 38%,
      var(--gold) 50%,
      var(--blue-bright) 62%,
      var(--blue-deep) 100%
    );
    background-size: 600px 100%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 4s linear infinite;
  }

  .gold-line {
    display: block;
    height: 2px;
    background: linear-gradient(90deg, var(--gold), var(--gold-light), transparent);
    margin-top: 14px;
    margin-bottom: 22px;
    animation: lineDraw 1s cubic-bezier(0.22,1,0.36,1) 0.7s both;
    width: 0;
  }

  .badge-pill {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: linear-gradient(135deg, rgba(201,168,76,0.1), rgba(201,168,76,0.05));
    border: 1px solid rgba(201,168,76,0.4);
    border-radius: 100px;
    padding: 5px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.68rem;
    font-weight: 600;
    color: #a07c28;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--gold);
    animation: goldPulse 2s ease-in-out infinite;
    flex-shrink: 0;
  }

  .stat-card {
    background: rgba(255,255,255,0.75);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(201,168,76,0.18);
    border-radius: 10px;
    padding: 12px 14px;
    transition: all 0.3s ease;
    cursor: default;
  }

  .stat-card:hover {
    transform: translateY(-3px);
    border-color: rgba(201,168,76,0.45);
    box-shadow: 0 10px 28px rgba(0,53,128,0.1);
    background: rgba(255,255,255,0.98);
  }

  .cta-btn {
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, var(--blue-mid) 0%, var(--blue-deep) 100%) !important;
    border: none !important;
    border-radius: 6px !important;
    padding: 13px 32px !important;
    font-family: 'DM Sans', sans-serif !important;
    font-weight: 600 !important;
    font-size: 0.85rem !important;
    letter-spacing: 0.1em !important;
    text-transform: uppercase !important;
    color: white !important;
    box-shadow: 0 6px 28px rgba(0,53,128,0.32), inset 0 1px 0 rgba(255,255,255,0.15) !important;
    transition: all 0.35s cubic-bezier(0.22,1,0.36,1) !important;
    width: 100% !important;
  }

  .cta-btn::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
    transition: left 0.5s ease;
  }

  .cta-btn:hover::before { left: 100%; }
  .cta-btn:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 14px 40px rgba(0,53,128,0.45) !important;
  }
  .cta-btn:active { transform: translateY(0) !important; }

  .pan-image {
    animation: panImage 20s ease-in-out infinite;
  }

  .orb-1 { animation: orbDrift1 9s ease-in-out infinite; }
  .orb-2 { animation: orbDrift2 11s ease-in-out infinite; }

  .logo-divider {
    width: 1px;
    height: 32px;
    background: linear-gradient(to bottom, transparent, rgba(201,168,76,0.45), transparent);
    flex-shrink: 0;
    margin: 0 4px;
  }
`;

export default function Welcome() {
  const { desktop } = useAppProvider();

  return (
    <>
      <style>{animationStyles}</style>

      {/* ── Root: full viewport, locked, no scroll ── */}
      <Box sx={{
        display: "flex",
        flexDirection: desktop ? "row" : "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "fixed",
        top: 0, left: 0,
        background: "#fff",
      }}>

        {/* ══════════════════════════════════════
            LEFT PANEL — 20%
        ══════════════════════════════════════ */}
        <Box sx={{
          width: desktop ? "20%" : "100%",
          height: desktop ? "100vh" : "auto",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          px: desktop ? "3.5%" : 3,
          pt: desktop ? 3 : 4,
          pb: desktop ? 3 : 5,
          position: "relative",
          zIndex: 2,
          background: "#ffffff",
          overflow: "hidden",
          borderRight: desktop ? "1px solid rgba(201,168,76,0.15)" : "none",
          boxShadow: desktop ? "4px 0 32px rgba(0,53,128,0.05)" : "none",
        }}>

          {/* Ambient orbs */}
          <Box className="orb-1" sx={{
            position: "absolute", top: "5%", right: "-10%",
            width: 240, height: 240, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,119,230,0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <Box className="orb-2" sx={{
            position: "absolute", bottom: "8%", left: "-6%",
            width: 200, height: 200, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* ── THREE LOGOS ROW — top of panel ── */}
          <Box
            className="anim-1"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2.5,
              mb: 3,
              pb: 2.5,
              borderBottom: "1px solid rgba(201,168,76,0.2)",
            }}
          >
            {/* Left: Rent.ph */}
            <img
              src="/images/rentph-logo.png"
              alt="Rent.ph"
              style={{
                height: desktop ? 30 : 24,
                width: "auto",
                objectFit: "contain",
                flex: "0 0 auto",
              }}
            />

            <span className="logo-divider" />

            {/* Center: Leuterio Realty — primary, larger */}
            <img
              src="/images/lr-logo.png"
              alt="Leuterio Realty & Brokerage"
              style={{
                height: desktop ? 50 : 38,
                width: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0 2px 8px rgba(0,53,128,0.12))",
                flex: "0 0 auto",
              }}
            />

            <span className="logo-divider" />

            {/* Right: Filipino Homes */}
            <img
              src="/images/fh-logo.png"
              alt="Filipino Homes"
              style={{
                height: desktop ? 30 : 24,
                width: "auto",
                objectFit: "contain",
                flex: "0 0 auto",
              }}
            />
          </Box>

          {/* ── Content area: vertically centered in remaining space ── */}
          <Box sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}>

            {/* Badge */}
            <Box className="anim-2" sx={{ mb: 2 }}>
              <span className="badge-pill">
                <span className="badge-dot" />
                Smart Property Dashboard
              </span>
            </Box>

            {/* Headline */}
            <Box className="anim-3">
              <Typography
                component="h1"
                sx={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: desktop ? "clamp(2.2rem, 2.8vw, 3.4rem)" : "2.1rem",
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
                    fontStyle: "italic",
                    color: "var(--blue-mid)",
                    WebkitTextFillColor: "var(--blue-mid)",
                  }}
                >
                  Realty Portal
                </Box>
              </Typography>
              <span className="gold-line" />
            </Box>

            {/* Body copy */}
            <Box className="anim-3" sx={{ mb: desktop ? 3 : 2.5 }}>
              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: desktop ? "0.88rem" : "0.84rem",
                fontWeight: 400,
                color: "var(--text-muted)",
                lineHeight: 1.82,
              }}>
                Congratulations! You've successfully accessed the Leuterio Realty
                Portal. We're excited to support you on your real estate journey
                and help you achieve your property goals.
              </Typography>
            </Box>

            {/* Stats */}
            <Box className="anim-4" sx={{
              display: "flex", gap: 1, mb: desktop ? 3.5 : 3, flexWrap: "wrap",
            }}>
              {[
                { num: "10K+", label: "Properties" },
                { num: "98%",  label: "Satisfaction" },
                { num: "15+",  label: "Years" },
              ].map((s) => (
                <Box key={s.label} className="stat-card" sx={{ flex: "1 1 auto" }}>
                  <Typography sx={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.5rem", fontWeight: 700,
                    color: "var(--blue-deep)", lineHeight: 1,
                  }}>
                    {s.num}
                  </Typography>
                  <Typography sx={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.63rem", fontWeight: 500,
                    color: "var(--text-muted)",
                    letterSpacing: "0.07em",
                    textTransform: "uppercase", mt: 0.4,
                  }}>
                    {s.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* CTA */}
            <Box className="anim-5">
              <Link to="/welcome/get-started" style={{ textDecoration: "none", display: "block" }}>
                <StyledButton
                  endIcon={<ArrowForward />}
                  variant="contained"
                  size="large"
                  className="cta-btn"
                >
                  Get Started
                </StyledButton>
              </Link>

              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                mt: 1.8,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}>
                <Box component="span" sx={{
                  display: "inline-block", width: 14, height: 14,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#4ade80,#22c55e)",
                  boxShadow: "0 2px 8px rgba(34,197,94,0.4)",
                  flexShrink: 0,
                }} />
                Secure access · Free to explore
              </Typography>
            </Box>

          </Box>{/* end content flex */}

          {/* Bottom branding strip */}
          <Box sx={{
            display: "flex", alignItems: "center", gap: 1.5, mt: 2,
          }}>
            <Box sx={{ height: 1, width: 24, background: "var(--gold)", opacity: 0.5 }} />
            <Typography sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.58rem", color: "var(--text-muted)",
              letterSpacing: "0.1em", textTransform: "uppercase",
            }}>
              Leuterio Realty & Brokerage
            </Typography>
          </Box>

        </Box>
        {/* end LEFT PANEL */}

        {/* ══════════════════════════════════════
            RIGHT PANEL — 80% full-bleed image
        ══════════════════════════════════════ */}
        <Box sx={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          height: "100vh",
        }}>

          {/* Full-bleed image with subtle pan animation */}
          <Box className="anim-img" sx={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <img
              src="/images/welcome-img.jpg"
              alt="Leuterio Realty"
              className="pan-image"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center center",
                display: "block",
              }}
            />
          </Box>

          {/* Gradient overlays */}
          <Box sx={{
            position: "absolute", inset: 0, zIndex: 1,
            background: `
              linear-gradient(to right, rgba(255,255,255,0.1) 0%, transparent 14%),
              linear-gradient(to top, rgba(0,10,30,0.45) 0%, rgba(0,10,30,0.1) 38%, transparent 60%)
            `,
          }} />

          {/* Gold corner accent — top left of image */}
          <Box sx={{
            position: "absolute", top: 0, left: 0, zIndex: 2,
            width: 0, height: 0,
            borderTop: "80px solid rgba(201,168,76,0.12)",
            borderRight: "80px solid transparent",
          }} />
        </Box>

      </Box>
    </>
  );
}