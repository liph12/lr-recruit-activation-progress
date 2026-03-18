import { useAppProvider } from "../providers/AppProvider";
import { Box, Typography, Avatar } from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  VerifiedRounded,
  RocketLaunchRounded,
  ArrowForwardRounded,
  EmailRounded,
  HowToRegRounded,
  CoPresentRounded,
} from "@mui/icons-material";
import { keyframes } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import useExternalAxios from "../hooks/useExternalAxios";

// ── Keyframes ───────────────────────────────────────────────────────────────
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const shimmerTitle = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
`;
// const softPulse = keyframes`
//   0%, 100% { box-shadow: 0 8px 32px rgba(25,118,210,0.35); }
//   50%       { box-shadow: 0 16px 52px rgba(25,118,210,0.6); }
// `;
const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const OUTFIT = "'Outfit', sans-serif";

export default function AccountDefault() {
  const { user } = useAppProvider();
  const axios = useExternalAxios();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(false);
  const [stepper, setStepper] = useState([
    {
      id: 0,
      title: "Portal Registration",
      description:
        "Your account is officially registered. Welcome to the Filipino Homes community.",
      completed: true,
      icon: <HowToRegRounded sx={{ fontSize: 22 }} />,
    },
    {
      id: 1,
      title: "New Agents Orientation",
      description:
        "Webinar orientation successfully completed. You are ready for the next phase.",
      completed: true,
      icon: <CoPresentRounded sx={{ fontSize: 22 }} />,
    },
    {
      id: 2,
      title: "FIRE Certification",
      description:
        "Start your professional journey by completing Modules 1, 2, and 3.",
      completed: false,
      icon: (
        <img
          src="/images/fire-icon-badge.png"
          alt="FIRE"
          style={{ width: 50, height: 50, objectFit: "contain" }}
        />
      ),
    },
  ]);

  // ── Live canvas background ──────────────────────────────────────────────
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
        y: 0.15,
        r: 0.55,
        ox: 0,
        oy: 0,
        speed: 0.000035,
        color: [0, 85, 179] as [number, number, number],
      },
      {
        x: 0.82,
        y: 0.7,
        r: 0.5,
        ox: 1,
        oy: 2,
        speed: 0.000025,
        color: [0, 55, 140] as [number, number, number],
      },
      {
        x: 0.5,
        y: 0.5,
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

  useEffect(() => {
    const getFireProgressAsync = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/integration/agent/taken-courses?email=${user?.email}`,
        );
        const takenCourses = response.data.data;

        const coursesHistory = takenCourses.map((c: any) => ({
          id: stepper.length + c.id,
          title: `FIRE Certificate — Module ${c.id}: ${c.title}`,
          description: `Congratulations! You have passed Module ${c.id}: ${c.title} with a score of ${c.scores[0].score} out of 10`,
          completed: true,
          icon: (
            <Typography
              sx={{
                fontSize: "1.4rem",
                fontWeight: 500,
                color: "inherit",
                fontFamily: "'Outfit', sans-serif",
                lineHeight: 1,
              }}
            >
              {c.id}
            </Typography>
          ),
        }));

        setStepper((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const newItems = coursesHistory.filter(
            (item: any) => !existingIds.has(item.id),
          );
          // Mark FIRE Certification completed only once all 3 required modules are done
          if (newItems.length >= 3) {
            prev[2].completed = true;
          }
          return [...prev, ...newItems];
        });
      } catch (e) {
        // to do
      } finally {
        setLoading(false);
      }
    };

    getFireProgressAsync();
  }, []);

  return (
    <Box
      sx={{
        minHeight: { xs: "100dvh", md: "88vh" },
        position: "relative",
        overflow: "hidden",
        background: "#071020",
        display: "flex",
        alignItems: { xs: "flex-start", md: "center" },
        py: { xs: 3, md: 0 },
        px: { xs: 1.5, md: 0 },
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap'); * { font-family: 'Outfit', sans-serif !important; }`}</style>

      {/* Canvas */}
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

      {/* <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}> */}
      <Grid
        container
        sx={{
          borderRadius: { xs: "20px", md: "28px" },
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(24px)",
          margin: "0 auto",
          maxWidth: "1500px",
          width: "100%",
        }}
      >
        {/* ── LEFT: Profile + FIRE CTA ── */}
        <Grid size={{ md: 4, xs: 12 }}>
          <Box
            sx={{
              px: { xs: 2.5, md: 7 },
              py: { xs: 3, md: 4 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              height: "100%",
              justifyContent: "center",
              borderRight: { md: "1px solid rgba(255,255,255,0.07)" },
              borderBottom: {
                xs: "1px solid rgba(255,255,255,0.07)",
                md: "none",
              },
              animation: `${fadeInUp} 0.6s ease both`,
              gap: 0,
            }}
          >
            {/* Avatar with glow */}
            <Box sx={{ position: "relative", mb: 3 }}>
              <Box
                sx={{
                  position: "absolute",
                  inset: -8,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg,rgba(30,136,229,0.4),rgba(240,217,138,0.12))",
                  filter: "blur(12px)",
                }}
              />
              <Avatar
                src={user?.photo ?? ""}
                sx={{
                  width: { xs: 80, md: 110 },
                  height: { xs: 80, md: 110 },
                  border: "3px solid rgba(30,136,229,0.55)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
                  position: "relative",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 4,
                  right: 4,
                  width: { xs: 22, md: 28 },
                  height: { xs: 22, md: 28 },
                  borderRadius: "50%",
                  background: "#071020",
                  border: "2px solid rgba(30,136,229,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <VerifiedRounded
                  sx={{ fontSize: { xs: 14, md: 18 }, color: "#1e88e5" }}
                />
              </Box>
            </Box>

            {/* Name */}
            <Typography
              sx={{
                fontWeight: 700,
                color: "#ffffff",
                fontSize: { xs: "1.4rem", md: "2.2rem" },
                fontFamily: OUTFIT,
                lineHeight: 1.2,
                mb: 0.5,
                maxWidth: "100%",
                wordBreak: "break-word",
              }}
            >
              {user?.name}
            </Typography>

            {/* Email */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.6,
                mb: { xs: 2.5, md: 4 },
                maxWidth: "100%",
                overflow: "hidden",
              }}
            >
              <EmailRounded
                sx={{
                  fontSize: { xs: 18, md: 25 },
                  color: "#fff",
                  flexShrink: 0,
                }}
              />
              <Typography
                sx={{
                  fontSize: { xs: "0.85rem", md: "1.5rem" },
                  color: "#fff",
                  fontFamily: OUTFIT,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.email}
              </Typography>
            </Box>

            {/* Role chip */}
            {/* <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.6,
                  px: 1.6,
                  py: 0.45,
                  borderRadius: "100px",
                  mb: 4,
                  background: "rgba(30,136,229,0.1)",
                  border: "1px solid rgba(30,136,229,0.28)",
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
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: "#7eb8ff",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontFamily: OUTFIT,
                  }}
                >
                  Certified Salesperson
                </Typography>
              </Box> */}

            {/* ── FIRE CTA card ── */}
            <Box
              component={Link}
              to="/welcome/fire"
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                textDecoration: "none",
                borderRadius: "18px",
                overflow: "hidden",
                position: "relative",
                background:
                  "linear-gradient(135deg,#0d47a1 0%,#1565c0 50%,#1e88e5 100%)",
                // border: "1px solid rgba(126,184,255,0.25)",
                p: 2.5,
                // animation: `${softPulse} 3s ease-in-out infinite`,
                transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                "&:hover": {
                  transform: "translateY(-4px) scale(1.01)",
                  // boxShadow: "0 24px 60px rgba(25,118,210,0.55)",
                  // borderColor: "rgba(126,184,255,0.5)",
                  animation: "none",
                },
                "&:hover .fire-arrow": { transform: "translateX(4px)" },
                "&:hover .fire-shimmer": { left: "120%" },
              }}
            >
              {/* Shimmer sweep */}
              <Box
                className="fire-shimmer"
                sx={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: "-80%",
                  width: "60%",
                  background:
                    "linear-gradient(90deg,transparent,rgba(255,255,255,0.09),transparent)",
                  transform: "skewX(-15deg)",
                  transition: "left 0.55s ease",
                  pointerEvents: "none",
                }}
              />

              {/* Icon + title */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <RocketLaunchRounded
                    sx={{ fontSize: 22, color: "#ffffff" }}
                  />
                </Box>
                <Box sx={{ textAlign: "left" }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "1.1rem", md: "1.5rem" },
                      color: "#ffffff",
                      fontFamily: OUTFIT,
                      lineHeight: 1.2,
                    }}
                  >
                    Get Started with FIRE
                  </Typography>
                </Box>
              </Box>

              {/* Description */}
              <Typography
                sx={{
                  fontSize: { xs: "0.85rem", md: "1.1rem" },
                  color: "#fff",
                  fontFamily: OUTFIT,
                  lineHeight: 1.55,
                  mb: 2,
                  fontWeight: 400,
                  textAlign: "left",
                }}
              >
                Complete your training modules and become a certified Filipino
                Homes agent.
              </Typography>

              {/* Bottom row */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#fff",
                    fontFamily: OUTFIT,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Begin Now
                </Typography>
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    // background: "rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ArrowForwardRounded
                    className="fire-arrow"
                    sx={{
                      fontSize: 28,
                      color: "#ffffff",
                      transition: "transform 0.25s ease",
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* ── RIGHT: Onboarding progress ── */}
        <Grid
          size={{ md: 8, xs: 12 }}
          sx={{
            height: { xs: "auto", md: "700px" },
            pb: { xs: 3, md: "85px" },
          }}
        >
          <Box
            sx={{
              p: { xs: 2.5, md: 5 },
              display: "flex",
              flexDirection: "column",
              height: "100%",
              animation: `${fadeInUp} 0.7s ease 0.1s both`,
            }}
          >
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.8,
                  mb: 1.5,
                  px: 1.6,
                  py: 0.5,
                  borderRadius: "100px",
                  border: "1px solid rgba(25,118,210,0.35)",
                  background: "rgba(25,118,210,0.09)",
                }}
              >
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#7eb8ff",
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#7eb8ff",
                    fontFamily: OUTFIT,
                  }}
                >
                  Your Journey
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: { xs: "1.5rem", md: "2.8rem" },
                  fontWeight: 900,
                  fontFamily: OUTFIT,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  backgroundImage:
                    "linear-gradient(90deg,#7eb8ff 0%,#ffffff 40%,#f0d98a 60%,#ffffff 80%,#7eb8ff 100%)",
                  backgroundSize: "600px 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: `${shimmerTitle} 4s linear infinite`,
                }}
              >
                Onboarding Progress
              </Typography>
            </Box>

            {/* Timeline */}
            <Box
              sx={{
                flex: 1,
                overflowY: { xs: "visible", md: "auto" },
                pr: 0.5,
              }}
            >
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    py: 8,
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      border: "3px solid rgba(255,255,255,0.08)",
                      borderTopColor: "#7eb8ff",
                      animation: `${spin} 0.8s linear infinite`,
                    }}
                  />
                </Box>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  {stepper.map((item, idx) => {
                    const isLast = idx === stepper.length - 1;
                    return (
                      <Box
                        key={item.id}
                        sx={{
                          display: "flex",
                          gap: { xs: 1.5, md: 2.5 },
                          position: "relative",
                          pb: isLast ? 0 : "32px",
                          alignItems: "flex-start",
                        }}
                      >
                        {/* Connector line — runs from bottom of icon circle to bottom of padding gap */}
                        {!isLast && (
                          <Box
                            sx={{
                              position: "absolute",
                              left: { xs: 24, md: 33 },
                              top: { xs: 52, md: 68 },
                              bottom: 0,
                              width: 2,
                              background: item.completed
                                ? "linear-gradient(180deg,#1e88e5 0%,rgba(30,136,229,0.2) 100%)"
                                : "rgba(255,255,255,0.07)",
                              zIndex: 0,
                            }}
                          />
                        )}

                        {/* Icon circle */}
                        <Box
                          sx={{
                            zIndex: 1,
                            flexShrink: 0,
                            width: { xs: 50, md: 65 },
                            height: { xs: 50, md: 65 },
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: item.completed
                              ? "linear-gradient(135deg,rgba(30,136,229,0.22),rgba(13,71,161,0.72))"
                              : "rgba(255,255,255,0.04)",
                            border: "1px solid",
                            borderColor: item.completed
                              ? "rgba(88, 164, 231, 0.85)"
                              : "rgba(255,255,255,0.07)",
                            color: item.completed
                              ? "#fff"
                              : "rgba(255,255,255,0.2)",
                            // boxShadow: item.completed
                            //   ? "0 4px 16px rgba(30,136,229,0.18)"
                            //   : "none",
                          }}
                        >
                          {"moduleNumber" in item ? (
                            <Typography
                              sx={{
                                fontSize: "1rem",
                                fontWeight: 500,
                                color: "#7eb8ff",
                                fontFamily: OUTFIT,
                                lineHeight: 1,
                                letterSpacing: "-0.04em",
                              }}
                            >
                              {String((item as any).moduleNumber).padStart(
                                2,
                                "0",
                              )}
                            </Typography>
                          ) : (
                            item.icon
                          )}
                        </Box>

                        {/* Card */}
                        <Box
                          sx={{
                            flex: 1,
                            p: { xs: 2, md: 2.5 },
                            borderRadius: "16px",
                            background: item.completed
                              ? "rgba(22, 124, 214, 0.35)"
                              : "rgba(255,255,255,0.02)",
                            border: "1px solid",
                            borderColor: item.completed
                              ? "rgba(84, 165, 236, 0.45)"
                              : "rgba(255,255,255,0.05)",
                          }}
                        >
                          {/* Title + badge */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              flexWrap: "wrap",
                              gap: 1,
                              mb: 0.6,
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: 700,
                                color: item.completed
                                  ? "#ffffff"
                                  : "rgba(255,255,255,0.3)",
                                fontSize: { xs: "0.95rem", md: "1.3rem" },
                                fontFamily: OUTFIT,
                                lineHeight: 1.2,
                              }}
                            >
                              {item.title}
                            </Typography>

                            {item.completed && (
                              <Box
                                sx={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 0.4,
                                  px: 1,
                                  py: 0.2,
                                  borderRadius: "100px",
                                  background: "rgba(76,175,80,0.12)",
                                  border: "1px solid rgba(76,175,80,0.28)",
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    background: "#66bb6a",
                                    flexShrink: 0,
                                  }}
                                />
                                <Typography
                                  sx={{
                                    fontSize: "0.8rem",
                                    fontWeight: 700,
                                    color: "#66bb6a",
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    fontFamily: OUTFIT,
                                  }}
                                >
                                  Completed
                                </Typography>
                              </Box>
                            )}

                            {!item.completed && (
                              <Box
                                sx={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 0.4,
                                  px: 1,
                                  py: 0.2,
                                  borderRadius: "100px",
                                  background: "rgba(255,255,255,0.05)",
                                  border: "1px solid rgba(255,255,255,0.09)",
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    background: "rgba(255,255,255,0.28)",
                                    flexShrink: 0,
                                  }}
                                />
                                <Typography
                                  sx={{
                                    fontSize: "0.8rem",
                                    fontWeight: 700,
                                    color: "rgba(255,255,255,0.28)",
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    fontFamily: OUTFIT,
                                  }}
                                >
                                  Pending
                                </Typography>
                              </Box>
                            )}
                          </Box>

                          <Typography
                            sx={{
                              color: "rgba(255,255,255,0.48)",
                              fontWeight: 400,
                              lineHeight: 1.65,
                              fontSize: { xs: "0.8rem", md: "1.1rem" },
                              fontFamily: OUTFIT,
                            }}
                          >
                            {item.description}
                          </Typography>

                          {!item.completed && (
                            <Box
                              component={Link}
                              to="/welcome/fire"
                              sx={{
                                mt: 1.5,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.8,
                                textDecoration: "none",
                                color: "#7eb8ff",
                                fontFamily: OUTFIT,
                                fontWeight: 700,
                                fontSize: "0.9rem",
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                "& .proceed-arrow": {
                                  transition: "transform 0.2s",
                                },
                                "&:hover .proceed-arrow": {
                                  transform: "translateX(4px)",
                                },
                              }}
                            >
                              Proceed Now
                              <ArrowForwardRounded
                                className="proceed-arrow"
                                sx={{ fontSize: 15 }}
                              />
                            </Box>
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
      {/* </Container> */}
    </Box>
  );
}
