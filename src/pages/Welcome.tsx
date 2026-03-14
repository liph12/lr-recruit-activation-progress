import { Box, Typography } from "@mui/material";
import StyledButton from "../components/utils/StyledButton";
import { ArrowForward } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useAppProvider } from "../providers/AppProvider";
import NavbarLayout from "../components/layouts/NavbarLayout";

const animationStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --blue-deep: #003580;
    --blue-mid: #0055b3;
    --blue-bright: #0077e6;
    --blue-light: #e8f2ff;
    --gold: #c9a84c;
    --gold-light: #f0d98a;
    --white: #ffffff;
    --text-dark: #0a1628;
    --text-muted: #4a5d7a;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeRight {
    from { opacity: 0; transform: translateX(40px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33%       { transform: translateY(-14px) rotate(1deg); }
    66%       { transform: translateY(-7px) rotate(-1deg); }
  }

  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }

  @keyframes pulse-ring {
    0%   { transform: scale(0.95); opacity: 0.6; }
    50%  { transform: scale(1.08); opacity: 0.2; }
    100% { transform: scale(0.95); opacity: 0.6; }
  }

  @keyframes lineDraw {
    from { width: 0; }
    to   { width: 80px; }
  }

  @keyframes bgShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes orbFloat1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50%       { transform: translate(30px, -20px) scale(1.05); }
  }

  @keyframes orbFloat2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50%       { transform: translate(-20px, 30px) scale(1.08); }
  }

  @keyframes orbFloat3 {
    0%, 100% { transform: translate(0, 0); }
    50%       { transform: translate(15px, 15px); }
  }

  @keyframes cardReveal {
    from { opacity: 0; transform: scale(0.9) translateY(20px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  @keyframes goldPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.4); }
    50%       { box-shadow: 0 0 0 12px rgba(201,168,76,0); }
  }

  .anim-fade-up-1 { animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
  .anim-fade-up-2 { animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.3s both; }
  .anim-fade-up-3 { animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.5s both; }
  .anim-fade-up-4 { animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.7s both; }
  .anim-fade-right { animation: fadeRight 1s cubic-bezier(0.22,1,0.36,1) 0.3s both; }
  .anim-card { animation: cardReveal 1s cubic-bezier(0.22,1,0.36,1) 0.2s both; }
  .float { animation: float 6s ease-in-out infinite; }
  .gold-pulse { animation: goldPulse 2s ease-in-out infinite; }

  .shimmer-text {
    background: linear-gradient(
      90deg,
      var(--blue-deep) 0%,
      var(--blue-bright) 40%,
      var(--gold) 50%,
      var(--blue-bright) 60%,
      var(--blue-deep) 100%
    );
    background-size: 800px 100%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 4s linear infinite;
  }

  .get-started-btn {
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, var(--blue-mid) 0%, var(--blue-deep) 100%) !important;
    border: none !important;
    border-radius: 4px !important;
    padding: 16px 44px !important;
    font-family: 'DM Sans', sans-serif !important;
    font-weight: 600 !important;
    font-size: 1rem !important;
    letter-spacing: 0.08em !important;
    text-transform: uppercase !important;
    color: white !important;
    box-shadow: 0 6px 32px rgba(0,53,128,0.35), inset 0 1px 0 rgba(255,255,255,0.15) !important;
    transition: all 0.4s cubic-bezier(0.22,1,0.36,1) !important;
    cursor: pointer;
  }

  .get-started-btn::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    transition: left 0.5s ease;
  }

  .get-started-btn:hover::before { left: 100%; }

  .get-started-btn:hover {
    transform: translateY(-3px) !important;
    box-shadow: 0 16px 48px rgba(0,53,128,0.5), inset 0 1px 0 rgba(255,255,255,0.2) !important;
  }

  .get-started-btn:active {
    transform: translateY(-1px) !important;
  }

  .gold-line {
    display: block;
    height: 2px;
    background: linear-gradient(90deg, var(--gold), var(--gold-light), transparent);
    animation: lineDraw 1.2s cubic-bezier(0.22,1,0.36,1) 0.8s both;
    width: 0;
    margin-top: 12px;
    margin-bottom: 20px;
  }

  .stat-card {
    background: rgba(255,255,255,0.8);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(201,168,76,0.2);
    border-radius: 8px;
    padding: 16px 22px;
    transition: all 0.35s ease;
  }

  .stat-card:hover {
    transform: translateY(-4px);
    border-color: rgba(201,168,76,0.5);
    box-shadow: 0 12px 32px rgba(0,53,128,0.12);
  }

  .image-frame {
    position: relative;
    border-radius: 16px;
    overflow: visible;
  }

  .image-frame::before {
    content: '';
    position: absolute;
    top: -2px; left: -2px; right: -2px; bottom: -2px;
    border-radius: 18px;
    background: linear-gradient(135deg, var(--gold), rgba(0,85,179,0.4), var(--gold-light));
    z-index: 0;
    animation: bgShift 4s ease infinite;
    background-size: 200% 200%;
  }

  .image-inner {
    position: relative;
    z-index: 1;
    border-radius: 16px;
    overflow: hidden;
    background: white;
  }

  .badge-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.06));
    border: 1px solid rgba(201,168,76,0.35);
    border-radius: 100px;
    padding: 6px 18px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--gold);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--gold);
    animation: goldPulse 2s ease-in-out infinite;
  }

  .orb-1 { animation: orbFloat1 8s ease-in-out infinite; }
  .orb-2 { animation: orbFloat2 10s ease-in-out infinite; }
  .orb-3 { animation: orbFloat3 12s ease-in-out infinite; }
`;

export default function Welcome() {
  const { desktop } = useAppProvider();

  return (
    <NavbarLayout>
      <style>{animationStyles}</style>

      {/* === Ambient background orbs === */}
      <Box sx={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        <Box className="orb-1" sx={{
          position: "absolute", top: "5%", right: "15%",
          width: 520, height: 520, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,119,230,0.07) 0%, transparent 70%)",
        }} />
        <Box className="orb-2" sx={{
          position: "absolute", bottom: "10%", left: "5%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)",
        }} />
        <Box className="orb-3" sx={{
          position: "absolute", top: "40%", left: "40%",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,53,128,0.04) 0%, transparent 70%)",
        }} />
        {/* subtle grid overlay */}
        <Box sx={{
          position: "absolute", inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,85,179,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,85,179,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }} />
      </Box>

      {/* === Main Content === */}
      <Box sx={{
        position: "relative",
        zIndex: 1,
        px: desktop ? "6%" : 3,
        py: desktop ? "5%" : 5,
        minHeight: desktop ? "88vh" : "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}>

        {/* Celebrate icon — top center, elevated */}
        <Box className="anim-fade-up-1" sx={{
          display: "flex", justifyContent: desktop ? "flex-start" : "center",
          mb: desktop ? 5 : 4,
        }}>
          <Box sx={{ position: "relative", display: "inline-flex", justifyContent: "center", alignItems: "center" }}>
            <Box sx={{
              position: "absolute", width: 90, height: 90, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(0,102,204,0.12) 0%, transparent 70%)",
              animation: "pulse-ring 2.5s ease-in-out infinite",
            }} />
            <Box sx={{
              width: desktop ? 72 : 56, height: desktop ? 72 : 56,
              borderRadius: "50%",
              background: "linear-gradient(145deg, #fff 0%, #e8f2ff 100%)",
              boxShadow: "0 8px 32px rgba(0,53,128,0.18), inset 0 1px 0 rgba(255,255,255,0.9)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <img
                src="/images/celebrate-icon.png"
                width={desktop ? 44 : 34}
                height="auto"
                style={{ position: "relative", zIndex: 2, filter: "drop-shadow(0 4px 12px rgba(0,102,204,0.2))" }}
              />
            </Box>
          </Box>
        </Box>

        {/* === Two column layout === */}
        <Box sx={{
          display: "grid",
          gridTemplateColumns: desktop ? "1fr 1fr" : "1fr",
          gap: desktop ? 8 : 5,
          alignItems: "center",
        }}>

          {/* ── LEFT: Copy ── */}
          <Box sx={{ display: "flex", flexDirection: "column", order: desktop ? 1 : 2 }}>

            {/* Badge */}
            <Box className="anim-fade-up-1" sx={{ mb: 3 }}>
              <span className="badge-pill">
                <span className="badge-dot" />
                Smart Property Dashboard
              </span>
            </Box>

            {/* Main heading */}
            <Box className="anim-fade-up-2">
              <Typography
                component="h1"
                sx={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: desktop ? "clamp(2.8rem, 4vw, 4.2rem)" : "2.4rem",
                  fontWeight: 700,
                  lineHeight: 1.08,
                  color: "var(--text-dark)",
                  mb: 0,
                }}
              >
                Welcome to{" "}
                <Box component="span" className="shimmer-text">
                  Leuterio
                </Box>
                <br />
                <Box component="span" sx={{
                  fontStyle: "italic",
                  color: "var(--blue-mid)",
                  WebkitTextFillColor: "var(--blue-mid)",
                }}>
                  Realty Portal
                </Box>
              </Typography>
              <span className="gold-line" />
            </Box>

            {/* Sub-headline */}
            <Box className="anim-fade-up-3" sx={{ mb: 4 }}>
              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: desktop ? "1.05rem" : "0.95rem",
                fontWeight: 400,
                color: "var(--text-muted)",
                lineHeight: 1.85,
                maxWidth: 480,
              }}>
                Congratulations! You've successfully accessed the Leuterio Realty
                Portal. We're excited to support you on your real estate journey
                and help you achieve your property goals.
              </Typography>
            </Box>

            {/* Stats row */}
            <Box className="anim-fade-up-3" sx={{
              display: "flex", gap: 2, mb: 5, flexWrap: "wrap",
            }}>
              {[
                { num: "10K+", label: "Properties Listed" },
                { num: "98%", label: "Client Satisfaction" },
                { num: "15+", label: "Years of Trust" },
              ].map((s) => (
                <Box key={s.label} className="stat-card">
                  <Typography sx={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.7rem", fontWeight: 700,
                    color: "var(--blue-deep)", lineHeight: 1,
                  }}>
                    {s.num}
                  </Typography>
                  <Typography sx={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.72rem", fontWeight: 500,
                    color: "var(--text-muted)", letterSpacing: "0.06em",
                    textTransform: "uppercase", mt: 0.5,
                  }}>
                    {s.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* CTA Button */}
            <Box className="anim-fade-up-4">
              <Link to="/welcome/get-started" style={{ textDecoration: "none" }}>
                <StyledButton
                  endIcon={<ArrowForward />}
                  variant="contained"
                  size="large"
                  className="get-started-btn"
                >
                  Get Started
                </StyledButton>
              </Link>

              {/* Trust signal */}
              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.78rem", color: "var(--text-muted)",
                mt: 2.5, display: "flex", alignItems: "center", gap: 1,
              }}>
                <Box component="span" sx={{
                  display: "inline-block", width: 18, height: 18,
                  borderRadius: "50%", background: "linear-gradient(135deg,#4ade80,#22c55e)",
                  boxShadow: "0 2px 8px rgba(34,197,94,0.4)",
                  flexShrink: 0,
                }} />
                Secure access · No credit card required · Free to explore
              </Typography>
            </Box>
          </Box>

          {/* ── RIGHT: Image ── */}
          <Box
            className="anim-fade-right"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              order: desktop ? 2 : 1,
            }}
          >
            <Box className="float" sx={{ width: "100%", maxWidth: 560 }}>
              {/* Decorative corner accent */}
              <Box sx={{
                position: "relative",
              }}>
                {/* Top-right gold corner */}
                <Box sx={{
                  position: "absolute", top: -12, right: -12, zIndex: 3,
                  width: 60, height: 60,
                  borderTop: "3px solid var(--gold)",
                  borderRight: "3px solid var(--gold)",
                  borderRadius: "0 8px 0 0",
                }} />
                {/* Bottom-left blue corner */}
                <Box sx={{
                  position: "absolute", bottom: -12, left: -12, zIndex: 3,
                  width: 60, height: 60,
                  borderBottom: "3px solid var(--blue-mid)",
                  borderLeft: "3px solid var(--blue-mid)",
                  borderRadius: "0 0 0 8px",
                }} />

                <Box className="image-frame">
                  <Box className="image-inner">
                    {/* Inner gradient top bar */}
                    <Box sx={{
                      position: "absolute", top: 0, left: 0, right: 0,
                      height: 4, zIndex: 4,
                      background: "linear-gradient(90deg, var(--blue-deep), var(--blue-bright), var(--gold))",
                    }} />

                    <Box sx={{
                      background: "linear-gradient(160deg, #ddeeff 0%, #eef5ff 40%, #f8faff 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      p: desktop ? 6 : 4,
                      minHeight: desktop ? 420 : 280,
                    }}>
                      <img
                        src="/images/celebrate-icon.png"
                        alt="Celebration"
                        style={{
                          width: desktop ? "82%" : "78%",
                          height: "auto",
                          filter: "drop-shadow(0 24px 48px rgba(0,53,128,0.18)) drop-shadow(0 8px 16px rgba(201,168,76,0.15))",
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Floating badge on image */}
                <Box className="gold-pulse" sx={{
                  position: "absolute",
                  bottom: desktop ? 28 : 18,
                  right: desktop ? -20 : -8,
                  zIndex: 5,
                  background: "linear-gradient(135deg, var(--blue-deep) 0%, var(--blue-mid) 100%)",
                  color: "white",
                  borderRadius: "12px",
                  px: 2.5, py: 1.5,
                  boxShadow: "0 8px 24px rgba(0,53,128,0.3)",
                  backdropFilter: "blur(8px)",
                }}>
                  <Typography sx={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.4rem", fontWeight: 700, lineHeight: 1, color: "white",
                  }}>
                    #1
                  </Typography>
                  <Typography sx={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.65rem", fontWeight: 500, color: "rgba(255,255,255,0.75)",
                    letterSpacing: "0.08em", textTransform: "uppercase",
                  }}>
                    Trusted Portal
                  </Typography>
                </Box>

                {/* Floating verified badge top left */}
                <Box sx={{
                  position: "absolute",
                  top: desktop ? 24 : 14,
                  left: desktop ? -16 : -6,
                  zIndex: 5,
                  background: "rgba(255,255,255,0.92)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "10px",
                  border: "1px solid rgba(201,168,76,0.25)",
                  px: 2, py: 1,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                  display: "flex", alignItems: "center", gap: 1,
                }}>
                  <Box sx={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--gold), var(--gold-light))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.85rem",
                  }}>✓</Box>
                  <Box>
                    <Typography sx={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.7rem", fontWeight: 700,
                      color: "var(--text-dark)", lineHeight: 1,
                    }}>Verified</Typography>
                    <Typography sx={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.62rem", color: "var(--text-muted)", lineHeight: 1.2,
                    }}>Real Estate Portal</Typography>
                  </Box>
                </Box>

              </Box>
            </Box>
          </Box>

        </Box>
      </Box>
    </NavbarLayout>
  );
}