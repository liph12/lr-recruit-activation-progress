import { Box, Typography, Avatar } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useAppProvider } from "../providers/AppProvider";
import useExternalAxios from "../hooks/useExternalAxios";
import { useEffect, useState, useRef } from "react";
import type { Course, Questionaire } from "../types/course";
import { useOutletContext } from "react-router-dom";
import PageLoader from "../components/PageLoader";
import { CheckCircleRounded, PlayArrowRounded } from "@mui/icons-material";
import TrainingCourse from "./TrainingCourse";
import { keyframes } from "@mui/material";

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(22px); }
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
  0%, 100% { box-shadow: 0 8px 32px rgba(25,118,210,0.35); }
  50%       { box-shadow: 0 12px 48px rgba(25,118,210,0.55); }
`;

const OUTFIT = "'Outfit', sans-serif";

type OutletContextProps = { course_id: string };

export default function Course() {
  const { course_id } = useOutletContext<OutletContextProps>();
  const axios = useExternalAxios();
  const { user } = useAppProvider();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [exam, setExam] = useState<Questionaire[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [isTaking, setIsTaking] = useState(false);
  const [hovered, setHovered] = useState(false);

  const takeCourse = () => setIsTaking((prev) => !prev);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await axios.get(
          `/integration/agent/course-exam?id=${course_id}&email=${user?.email}`,
        );
        const { exam, course } = response.data;
        setCourse(course);
        setExam(exam);
      } catch (error) {
        console.error("Failed to fetch exam:", error);
      }
    };
    fetchExam();
  }, [axios, course_id, user?.email]);

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

  if (!course) return <PageLoader title="getting module ready" />;

  return (
    <>
      {isTaking ? (
        <TrainingCourse course={course} takeCourse={takeCourse} />
      ) : (
        <Box
          sx={{
            minHeight: "100vh",
            position: "relative",
            overflow: "hidden",
            background: "#071020",
          }}
        >
          <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap'); * { font-family: 'Outfit', sans-serif !important; }`}</style>

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
              maxWidth: 1100,
              mx: "auto",
              px: { xs: 2, sm: 4, md: 6 },
              py: { xs: 5, md: 7 },
            }}
          >
            {/* ── Header ── */}
            <Box
              sx={{
                mb: { xs: 5, md: 6 },
                animation: `${fadeInUp} 0.6s ease both`,
              }}
            >
              {/* Pill */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.8,
                  mb: 2,
                  px: 1.8,
                  py: 0.6,
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
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "0.7rem",
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

              <Grid container spacing={{ xs: 2, md: 5 }} alignItems="center">
                <Grid size={{ xs: 12, md: 8 }}>
                  <Typography
                    sx={{
                      fontSize: {
                        xs: "clamp(2.5rem,7vw,2.4rem)",
                        md: "clamp(4.5rem,4vw,3rem)",
                      },
                      fontWeight: 900,
                      lineHeight: 1.05,
                      letterSpacing: "-0.025em",
                      color: "#ffffff",
                      mb: 0.2,
                      fontFamily: OUTFIT,
                    }}
                  >
                    You are taking
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: {
                        xs: "clamp(2.5rem,7vw,2.4rem)",
                        md: "clamp(4rem,4vw,3rem)",
                      },
                      fontWeight: 900,
                      lineHeight: 1.05,
                      letterSpacing: "-0.025em",
                      backgroundImage:
                        "linear-gradient(90deg,#7eb8ff 0%,#ffffff 35%,#f0d98a 50%,#ffffff 65%,#7eb8ff 100%)",
                      backgroundSize: "600px 100%",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      animation: `${shimmer} 3.5s linear infinite`,
                      fontFamily: OUTFIT,
                    }}
                  >
                    {course.title}
                  </Typography>
                  <Box
                    sx={{
                      height: "2px",
                      background:
                        "linear-gradient(90deg,#c9a84c,#f0d98a,transparent)",
                      mt: 1.5,
                      animation: `${shimmerLine} 1s cubic-bezier(0.22,1,0.36,1) 0.4s both`,
                      width: 0,
                    }}
                  />
                </Grid>

                {/* CTA desktop */}
                <Grid
                  size={{ xs: 0, md: 4 }}
                  sx={{
                    display: { xs: "none", md: "flex" },
                    justifyContent: "flex-end",
                  }}
                >
                  <Box
                    onClick={takeCourse}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1.2,
                      px: 3.5,
                      py: 1.6,
                      borderRadius: "14px",
                      cursor: "pointer",
                      userSelect: "none",
                      background: hovered
                        ? "linear-gradient(135deg,#1e88e5,#0d47a1)"
                        : "linear-gradient(135deg,rgba(30,136,229,0.35),rgba(13,71,161,0.25))",
                      border: "1px solid",
                      borderColor: hovered
                        ? "rgba(126,184,255,0.55)"
                        : "rgba(30,136,229,0.4)",
                      animation: !hovered
                        ? `${softPulse} 3s ease-in-out infinite`
                        : "none",
                      transform: hovered ? "translateY(-2px)" : "none",
                      boxShadow: hovered
                        ? "0 10px 36px rgba(25,118,210,0.5)"
                        : "none",
                      transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                    }}
                  >
                    <PlayArrowRounded sx={{ fontSize: 22, color: "#ffffff" }} />
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: "1rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#ffffff",
                        fontFamily: OUTFIT,
                      }}
                    >
                      Start Learning Now
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* ── Main content ── */}
            <Grid container spacing={{ xs: 3, md: 5 }}>
              {/* Left — description + speaker */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Box sx={{ animation: `${fadeInUp} 0.65s ease 0.1s both` }}>
                  <Typography
                    sx={{
                      fontSize: { xs: "0.92rem", md: "1.05rem" },
                      color: "rgba(255,255,255,0.65)",
                      lineHeight: 1.85,
                      fontFamily: OUTFIT,
                      mb: 4,
                    }}
                  >
                    {course.description}
                  </Typography>

                  {/* Speaker card */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2.5,
                      p: { xs: 2.5, md: 3 },
                      borderRadius: "18px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.09)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    <Avatar
                      src={course.speaker.avatar}
                      sx={{
                        width: { xs: 56, md: 64 },
                        height: { xs: 56, md: 64 },
                        border: "2px solid rgba(126,184,255,0.35)",
                        flexShrink: 0,
                      }}
                    />
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          color: "#ffffff",
                          fontSize: { xs: "1.05rem", md: "1.2rem" },
                          fontFamily: OUTFIT,
                          lineHeight: 1.2,
                        }}
                      >
                        {course.speaker.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: "#7eb8ff",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          fontFamily: OUTFIT,
                          mt: 0.3,
                        }}
                      >
                        Speaker
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Right — what you'll learn */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Box
                  sx={{
                    animation: `${fadeInUp} 0.65s ease 0.18s both`,
                    p: { xs: 2.5, md: 3 },
                    borderRadius: "16px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 800,
                      color: "#ffffff",
                      fontSize: { xs: "1rem", md: "1.5rem" },
                      fontFamily: OUTFIT,
                      mb: 2,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    What you'll learn
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.4 }}
                  >
                    {course.learning_descriptions.map((d, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: "flex",
                          gap: 1.2,
                          alignItems: "flex-start",
                        }}
                      >
                        <CheckCircleRounded
                          sx={{
                            fontSize: 17,
                            color: "#66bb6a",
                            flexShrink: 0,
                            mt: "2px",
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: { xs: "0.85rem", md: "1rem" },
                            color: "rgba(255,255,255,0.7)",
                            lineHeight: 1.55,
                            fontFamily: OUTFIT,
                          }}
                        >
                          {d}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* CTA mobile */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                mt: 4,
                animation: `${fadeInUp} 0.65s ease 0.24s both`,
              }}
              onClick={takeCourse}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.2,
                  width: "100%",
                  py: 1.8,
                  borderRadius: "14px",
                  cursor: "pointer",
                  userSelect: "none",
                  background: "linear-gradient(135deg,#1e88e5,#0d47a1)",
                  border: "1px solid rgba(126,184,255,0.3)",
                  animation: `${softPulse} 3s ease-in-out infinite`,
                }}
              >
                <PlayArrowRounded sx={{ fontSize: 22, color: "#ffffff" }} />
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: "1rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#ffffff",
                    fontFamily: OUTFIT,
                  }}
                >
                  Start Learning Now
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
