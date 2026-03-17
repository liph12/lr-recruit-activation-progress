import { Box, Typography, Avatar, Container } from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  CheckCircleRounded,
  LockRounded,
  PlayArrowRounded,
  ArrowForwardRounded,
  UploadFileRounded,
  EmojiEventsRounded,
} from "@mui/icons-material";
import { useAppProvider } from "../providers/AppProvider";
import { useEffect, useState, useRef } from "react";
import type { Course } from "../types/course";
import useExternalAxios from "../hooks/useExternalAxios";
import { Link } from "react-router-dom";
import PageLoader from "../components/PageLoader";
import { keyframes } from "@mui/material";

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
  to   { width: 64px; opacity: 1; }
`;
const softPulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(25,118,210,0.4); }
  50%       { box-shadow: 0 0 0 8px rgba(25,118,210,0); }
`;
const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const OUTFIT = "'Outfit', sans-serif";

interface ExternalUser {
  id: number;
  email: string;
  requiresEndorsement: boolean;
}

export default function TrainingCourses() {
  const axios = useExternalAxios();
  const { user } = useAppProvider();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoading] = useState(false);
  const [externalUser, setExternalUser] = useState<ExternalUser | null>(null);
  const [endorsement, setEndorsement] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);

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

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEndorsement(e.target.files ? e.target.files[0] : null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setEndorsement(f);
  };

  const handleUpload = async () => {
    if (!endorsement) return;
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("endorsementLetter", endorsement);
      const res = await axios.post(
        `/integration/agent/${externalUser?.id}/reupload-endorsement`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      const { member } = res.data;
      setExternalUser((prev) =>
        prev
          ? { ...prev, requiresEndorsement: member?.endorsement === null }
          : prev,
      );
      setUploaded(true);
    } catch {
      // to do
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const resolve = async () => {
      try {
        const res = await axios.post(
          `/integration/agent/register-or-resolve`,
          {
            emailaddress: user?.email,
            firstname: user?.first_name,
            lastname: user?.last_name,
            photo:
              user?.photo === null
                ? null
                : `https://leuteriorealty.com/memberfiles/${user?.agent_id}/${user?.photo}`,
            invitedBy: user?.sponsor.name,
          },
          { headers: { "Content-Type": "application/json" } },
        );
        const data = res.data;
        setExternalUser({
          id: data.member.id,
          email: data.member.emailaddress,
          requiresEndorsement: data.requires_endorsement,
        });
      } catch {
        /* to do */
      }
    };
    resolve();
  }, []);

  useEffect(() => {
    if (!externalUser || externalUser.requiresEndorsement) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `/integration/agent/current-courses?email=${externalUser.email}`,
        );
        const { data } = res.data;
        const tmp: Course[] = data;
        let certCount = tmp.filter((c) => c.scores.length > 0).length;
        let index = certCount + 1;
        setCourses(
          tmp.map((c, k) => ({
            ...c,
            status:
              certCount > 0
                ? index === c.id
                  ? "next"
                  : certCount === c.id
                    ? "done"
                    : certCount < c.id
                      ? "pending"
                      : "done"
                : certCount === k
                  ? "next"
                  : "pending",
          })),
        );
      } catch {
        /* to do */
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [externalUser]);

  if (!externalUser) return <PageLoader title="getting data ready" />;
  if (loadingCourses) return <PageLoader title="preparing modules" />;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "#071020",
        fontFamily: OUTFIT,
      }}
    >
      {/* Outfit font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap'); * { font-family: 'Outfit', sans-serif !important; }`}</style>

      {/* Live canvas background */}
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

      <Container
        maxWidth="xl"
        sx={{ position: "relative", zIndex: 1, py: { xs: 5, md: 7 } }}
      >
        {/* ── Header ── */}
        <Box
          sx={{ mb: { xs: 5, md: 7 }, animation: `${fadeInUp} 0.6s ease both` }}
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
                whiteSpace: "nowrap",
                fontFamily: OUTFIT,
              }}
            >
              FIRE Training Program
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 3, md: 6 }} alignItems="center">
            {/* Left — title + gold line + description */}
            <Grid size={{ xs: 12, md: 12 }}>
              {/* Title — one line */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: { xs: 1.5, md: 2 },
                  flexWrap: "wrap",
                  mb: 0.2,
                }}
              >
                <Typography
                  sx={{
                    fontSize: {
                      xs: "clamp(2rem,8vw,2.8rem)",
                      md: "clamp(2.4rem,4vw,3.5rem)",
                    },
                    fontWeight: 900,
                    lineHeight: 1.05,
                    letterSpacing: "-0.03em",
                    color: "#ffffff",
                    fontFamily: OUTFIT,
                  }}
                >
                  Get Started with
                </Typography>
                <Typography
                  sx={{
                    fontSize: {
                      xs: "clamp(2rem,8vw,2.8rem)",
                      md: "clamp(2.4rem,4vw,3.5rem)",
                    },
                    fontWeight: 900,
                    lineHeight: 1.05,
                    letterSpacing: "-0.03em",
                    backgroundImage:
                      "linear-gradient(90deg,#7eb8ff 0%,#ffffff 35%,#f0d98a 50%,#ffffff 65%,#7eb8ff 100%)",
                    backgroundSize: "600px 100%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: `${shimmer} 3.5s linear infinite`,
                    fontFamily: OUTFIT,
                  }}
                >
                  FIRE
                </Typography>
              </Box>

              {/* Gold accent line */}
              <Box
                sx={{
                  height: "2px",
                  background:
                    "linear-gradient(90deg,#c9a84c,#f0d98a,transparent)",
                  mt: 1.5,
                  mb: 2,
                  animation: `${shimmerLine} 1s cubic-bezier(0.22,1,0.36,1) 0.4s both`,
                  width: 0,
                }}
              />

              {/* Description */}
              <Typography
                sx={{
                  fontSize: { xs: "0.88rem", md: "1.3rem" },
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.75,
                  fontFamily: OUTFIT,
                  maxWidth: 520,
                }}
              >
                {externalUser.requiresEndorsement
                  ? "Please upload your endorsement letter to unlock your training modules."
                  : "Complete all 12 training modules required to finish your requirements as a Filipino Homes agent."}
              </Typography>
            </Grid>

            {/* Right — progress removed per request */}
          </Grid>
        </Box>

        {/* ── Endorsement upload ── */}
        {externalUser.requiresEndorsement ? (
          <Box
            sx={{
              maxWidth: 560,
              animation: `${fadeInUp} 0.65s ease 0.1s both`,
            }}
          >
            {/* Drop zone */}
            <Box
              component="label"
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
                p: 4,
                mb: 2.5,
                borderRadius: "16px",
                cursor: "pointer",
                border: "1.5px dashed",
                borderColor: dragOver
                  ? "rgba(126,184,255,0.7)"
                  : endorsement
                    ? "rgba(76,175,80,0.45)"
                    : "rgba(255,255,255,0.14)",
                background: dragOver
                  ? "rgba(126,184,255,0.06)"
                  : endorsement
                    ? "rgba(76,175,80,0.05)"
                    : "rgba(255,255,255,0.03)",
                backdropFilter: "blur(8px)",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "rgba(126,184,255,0.5)",
                  background: "rgba(255,255,255,0.05)",
                },
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: endorsement
                    ? "rgba(76,175,80,0.12)"
                    : "rgba(255,255,255,0.06)",
                  border: "1px solid",
                  borderColor: endorsement
                    ? "rgba(76,175,80,0.35)"
                    : "rgba(255,255,255,0.10)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {endorsement ? (
                  <CheckCircleRounded sx={{ fontSize: 26, color: "#66bb6a" }} />
                ) : (
                  <UploadFileRounded
                    sx={{ fontSize: 26, color: "rgba(255,255,255,0.35)" }}
                  />
                )}
              </Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#ffffff",
                  fontSize: "0.92rem",
                  fontFamily: OUTFIT,
                }}
              >
                {endorsement
                  ? endorsement.name
                  : "Drop your endorsement letter here"}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.38)",
                  fontFamily: OUTFIT,
                }}
              >
                JPG, PNG, PDF · max 5MB
              </Typography>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleChangeFile}
                style={{ display: "none" }}
              />
            </Box>

            {/* Upload button */}
            <Box
              onClick={endorsement && !uploading ? handleUpload : undefined}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.2,
                py: 1.6,
                px: 3,
                borderRadius: "14px",
                cursor: endorsement && !uploading ? "pointer" : "not-allowed",
                userSelect: "none",
                background: uploaded
                  ? "rgba(76,175,80,0.2)"
                  : endorsement
                    ? "linear-gradient(135deg,#1e88e5 0%,#0d47a1 100%)"
                    : "rgba(255,255,255,0.05)",
                border: "1px solid",
                borderColor: uploaded
                  ? "rgba(76,175,80,0.45)"
                  : endorsement
                    ? "rgba(100,180,255,0.35)"
                    : "rgba(255,255,255,0.08)",
                opacity: !endorsement && !uploaded ? 0.5 : 1,
                animation:
                  endorsement && !uploading && !uploaded
                    ? `${softPulse} 3s ease-in-out infinite`
                    : "none",
                transition: "all 0.3s ease",
                "&:hover":
                  endorsement && !uploading
                    ? {
                        transform: "translateY(-2px)",
                        boxShadow: "0 10px 36px rgba(25,118,210,0.45)",
                      }
                    : {},
              }}
            >
              {uploading ? (
                <Box
                  sx={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    border: "2.5px solid rgba(255,255,255,0.2)",
                    borderTopColor: "#fff",
                    animation: `${spin} 0.7s linear infinite`,
                  }}
                />
              ) : uploaded ? (
                <CheckCircleRounded sx={{ fontSize: 20, color: "#66bb6a" }} />
              ) : (
                <UploadFileRounded sx={{ fontSize: 20, color: "#ffffff" }} />
              )}
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: "0.88rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: uploaded ? "#66bb6a" : "#ffffff",
                  fontFamily: OUTFIT,
                }}
              >
                {uploading
                  ? "Uploading…"
                  : uploaded
                    ? "Uploaded!"
                    : "Upload Endorsement"}
              </Typography>
            </Box>
          </Box>
        ) : (
          // ── Course cards grid ──
          <Grid
            container
            spacing={{ xs: 2, sm: 2, md: 2.5 }}
            alignItems="stretch"
          >
            {courses.map((c, k) => {
              const isLocked = false;
              const isDone = c.status === "done";
              const isHovered = hoveredCard === k;

              return (
                <Grid
                  key={k}
                  size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                  sx={{ display: "flex" }}
                >
                  <Box
                    component={isLocked ? "div" : Link}
                    to={
                      isLocked
                        ? undefined
                        : `/welcome/get-started/training/${c.id}`
                    }
                    onMouseEnter={() => !isLocked && setHoveredCard(k)}
                    onMouseLeave={() => setHoveredCard(null)}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      minHeight: { xs: 260, md: 290 },
                      borderRadius: "20px",
                      overflow: "hidden",
                      position: "relative",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid",
                      borderColor: isHovered
                        ? "rgba(126,184,255,0.45)"
                        : "rgba(255,255,255,0.09)",
                      backdropFilter: "blur(16px)",
                      cursor: isLocked ? "default" : "pointer",
                      transform: isHovered ? "translateY(-5px)" : "none",
                      boxShadow: isHovered
                        ? "0 20px 50px rgba(25,118,210,0.18)"
                        : "0 2px 16px rgba(0,0,0,0.15)",
                      transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                      textDecoration: "none",
                      animation: `${fadeInUp} 0.5s ease ${(k * 0.05).toFixed(2)}s both`,
                    }}
                  >
                    {/* Coloured top strip */}
                    <Box
                      sx={{
                        height: "3px",
                        flexShrink: 0,
                        background: isDone
                          ? "linear-gradient(90deg,#4caf50,#81c784)"
                          : isNext
                            ? "linear-gradient(90deg,#1e88e5,#7eb8ff)"
                            : "rgba(255,255,255,0.06)",
                      }}
                    />

                    <Box
                      sx={{
                        p: { xs: 2.2, md: 2.5 },
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                      }}
                    >
                      {/* Top row: avatar + number */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
                        <Avatar
                          src={c.speaker.avatar}
                          sx={{
                            width: 48,
                            height: 48,
                            border: "2px solid rgba(255,255,255,0.15)",
                            flexShrink: 0,
                            filter: isLocked
                              ? "grayscale(60%) opacity(0.6)"
                              : "none",
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: "3.1rem",
                            fontWeight: 900,
                            letterSpacing: "-0.06em",
                            lineHeight: 1,
                            color: isLocked
                              ? "rgba(255,255,255,0.12)"
                              : "rgba(255,255,255,0.18)",
                            fontFamily: OUTFIT,
                          }}
                        >
                          {String(k + 1).padStart(2, "0")}
                        </Typography>
                      </Box>

                      {/* Speaker name */}
                      <Typography
                        sx={{
                          fontSize: { xs: "1rem", md: "1.28rem" },
                          fontWeight: 700,
                          color: isLocked
                            ? "rgba(255,255,255,0.28)"
                            : "#ffffff",
                          fontFamily: OUTFIT,
                          lineHeight: 1.25,
                          mb: 0.5,
                          // overflow: "hidden",
                          // textOverflow: "ellipsis",
                          // whiteSpace: "nowrap",
                        }}
                      >
                        {c.speaker.name}
                      </Typography>

                      {/* Status chip — only show when completed */}
                      {isDone && (
                        <Box sx={{ mb: 1.5 }}>
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 0.5,
                              px: 1.1,
                              py: 0.3,
                              borderRadius: "100px",
                              background: "rgba(76,175,80,0.12)",
                              border: "1px solid",
                              borderColor: "rgba(76,175,80,0.3)",
                            }}
                          >
                            <CheckCircleRounded
                              sx={{ fontSize: 15, color: "#66bb6a" }}
                            />
                            <Typography
                              sx={{
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                color: "#66bb6a",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                fontFamily: OUTFIT,
                              }}
                            >
                              Completed
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      {/* Course title */}
                      <Typography
                        sx={{
                          fontSize: "1.22rem",
                          fontWeight: 400,
                          color: isLocked
                            ? "rgba(255,255,255,0.2)"
                            : "rgba(255,255,255,1)",
                          fontFamily: OUTFIT,
                          lineHeight: 1.55,
                          flex: 1,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          mb: 2,
                        }}
                      >
                        {c.title}
                      </Typography>

                      {/* CTA */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                          py: 1.2,
                          borderRadius: "12px",
                          background: isLocked
                            ? "rgba(255,255,255,0.04)"
                            : isDone
                              ? isHovered
                                ? "rgba(76,175,80,0.2)"
                                : "rgba(76,175,80,0.1)"
                              : isHovered
                                ? "linear-gradient(135deg,#1e88e5,#0d47a1)"
                                : "rgba(255,255,255,0.08)",
                          border: "1px solid",
                          borderColor: isLocked
                            ? "rgba(255,255,255,0.06)"
                            : isDone
                              ? "rgba(76,175,80,0.3)"
                              : isHovered
                                ? "rgba(126,184,255,0.5)"
                                : "rgba(255,255,255,0.12)",
                          boxShadow:
                            isHovered && !isLocked
                              ? isDone
                                ? "0 4px 18px rgba(76,175,80,0.3)"
                                : "0 4px 18px rgba(25,118,210,0.4)"
                              : "none",
                          transition: "all 0.25s ease",
                          mt: "auto",
                        }}
                      >
                        {isLocked ? (
                          <LockRounded
                            sx={{
                              fontSize: 15,
                              color: "rgba(255,255,255,0.2)",
                            }}
                          />
                        ) : isDone ? (
                          <EmojiEventsRounded
                            sx={{ fontSize: 15, color: "#66bb6a" }}
                          />
                        ) : (
                          <PlayArrowRounded
                            sx={{ fontSize: 16, color: "#ffffff" }}
                          />
                        )}
                        <Typography
                          sx={{
                            fontSize: "0.98rem",
                            fontWeight: 700,
                            color: isLocked
                              ? "rgba(255,255,255,0.2)"
                              : isDone
                                ? "#66bb6a"
                                : "#ffffff",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            fontFamily: OUTFIT,
                          }}
                        >
                          {isLocked
                            ? "Locked"
                            : isDone
                              ? "Review"
                              : "Take Course"}
                        </Typography>
                        {!isLocked && (
                          <ArrowForwardRounded
                            sx={{
                              fontSize: 14,
                              color: isDone
                                ? "#66bb6a"
                                : "rgba(255,255,255,0.7)",
                              transform: isHovered ? "translateX(2px)" : "none",
                              transition: "transform 0.2s",
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
