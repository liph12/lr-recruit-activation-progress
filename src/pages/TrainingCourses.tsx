import {
  Box,
  Typography,
  Divider,
  Grid,
  Container,
  Avatar,
} from "@mui/material";
import { OpenInNewRounded, UploadRounded } from "@mui/icons-material";
import { useAppProvider } from "../providers/AppProvider";
import { useEffect, useState } from "react";
import type { Course } from "../types/course";
import useExternalAxios from "../hooks/useExternalAxios";
import StyledButton from "../components/utils/StyledButton";
import { Link } from "react-router-dom";
import StyledTextField from "../components/utils/StyledTextField";
import PageLoader from "../components/PageLoader";

interface ExternalUser {
  id: number;
  email: string;
  requiresEndorsement: boolean;
}

export default function TrainingCourses() {
  const axios = useExternalAxios();
  const { user, desktop } = useAppProvider();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [externalUser, setExternalUser] = useState<ExternalUser | null>(null);
  const [endorsement, setEndorsement] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentCourseIdx, setCurrentCourseIdx] = useState<number>(0);

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEndorsement(e.target.files ? e.target.files[0] : null);

  const handleNextCourse = () =>
    setCurrentCourseIdx((prev) => (prev < courses.length ? prev + 1 : prev));
  const handlePrevCourse = () =>
    setCurrentCourseIdx((prev) => (prev > 0 ? prev - 1 : prev));

  const handleUploadEndorsement = async () => {
    try {
      setUploading(true);

      const formData = new FormData();

      if (endorsement) {
        formData.append("endorsementLetter", endorsement);
      }

      const response = await axios.post(
        `/integration/agent/${externalUser?.id}/reupload-endorsement`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const { member } = response.data;

      setExternalUser((prev) =>
        prev
          ? { ...prev, requiresEndorsement: member?.endorsement === null }
          : prev
      );
    } catch (e) {
      // to do
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const storeAndResolveUserAsync = async () => {
      try {
        const payLoad = {
          emailaddress: user?.email,
          firstname: user?.first_name,
          lastname: user?.last_name,
          photo:
            user?.photo === null
              ? null
              : `https://leuteriorealty.com/memberfiles/${user?.agent_id}/${user?.photo}`,
          invitedBy: user?.sponsor.name,
        };

        const response = await axios.post(
          `/integration/agent/register-or-resolve`,
          payLoad,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data;

        setExternalUser({
          id: data.member.id,
          email: data.member.emailaddress,
          requiresEndorsement: data.requires_endorsement,
        });
      } catch (e) {
        // to do
      } finally {
        // to do
      }
    };

    storeAndResolveUserAsync();
  }, []);

  useEffect(() => {
    const fetchCoursesAsync = async () => {
      try {
        setLoadingCourses(true);
        const response = await axios.get(
          `/integration/agent/current-courses?email=${externalUser?.email}`
        );
        const { data } = response.data;
        const tmp: Course[] = data;
        let certCount = tmp.filter((c) => c.scores.length > 0).length;
        let index = certCount + 1;

        const _courses = tmp.map((c, k) => {
          const updated: Course = {
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
          };

          return updated;
        });

        setCourses(_courses);
      } catch (e) {
        // to do
      } finally {
        setLoadingCourses(false);
      }
    };

    if (externalUser) {
      const { requiresEndorsement } = externalUser;

      if (!requiresEndorsement) {
        fetchCoursesAsync();
      }
    }
  }, [externalUser]);

  if (!externalUser) {
    return <PageLoader title="getting data ready" />;
  }

  if (loadingCourses) {
    return <PageLoader title="preparing modules" />;
  }

  // visual layout sizing so background fills below the navbar
  // subtract navbar height + its 1px bottom border to avoid a tiny page scroll
  const navH = desktop ? 65 : 57;
  const pageMinHeight = `calc(100dvh - ${navH}px)`;

  // lightweight CSS for animated aurora + card sheen
  const tcCss = `
    :root {
      --gold: #c9a84c;
      --gold-soft: #f0d98a;
      --text-muted: rgba(255,255,255,0.78);
    }

    @keyframes tcFloat1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-18px, 6px) scale(1.04); } }
    @keyframes tcFloat2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(16px, -10px) scale(1.03); } }
    @keyframes tcSheen { 0% { left: -120%; } 100% { left: 140%; } }

    .tc-aurora {
      position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0;
    }
    .tc-blob {
      position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.35; mix-blend-mode: screen;
    }
    .tc-blob.b1 { width: 52vw; height: 52vw; top: -12vw; left: -10vw; background: radial-gradient(closest-side, #0b5bd6, transparent 70%); animation: tcFloat1 18s ease-in-out infinite; }
    .tc-blob.b2 { width: 46vw; height: 46vw; bottom: -14vw; right: -8vw; background: radial-gradient(closest-side, #003580, transparent 70%); animation: tcFloat2 20s ease-in-out infinite; }
    .tc-blob.b3 { width: 38vw; height: 38vw; bottom: 8vh; left: 22vw; background: radial-gradient(closest-side, rgba(255,255,255,0.9), transparent 65%); opacity: 0.13; animation: tcFloat1 22s ease-in-out infinite; }

    /* glass panels */
    .tc-glass {
      border: 1px solid rgba(255,255,255,0.14);
      background: linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.05));
      box-shadow: 0 14px 36px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.18);
      position: relative; overflow: hidden;
    }
    .tc-glass::after {
      content: ""; position: absolute; top: 0; left: -120%; width: 60%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
      transform: skewX(-18deg);
    }
    .tc-glass:hover::after { animation: tcSheen 1.4s ease; }

    /* course card */
    .tc-card { transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s ease; }
    .tc-card:hover { transform: translateY(-6px); box-shadow: 0 18px 44px rgba(0,0,0,0.45); }
    .tc-card .tc-topline { height: 2px; background: linear-gradient(90deg, var(--gold), var(--gold-soft), transparent); opacity:.8; margin-bottom: 6px; }

    /* number badge */
    .tc-num { display:flex; align-items:center; justify-content:center; width:38px; height:38px; border-radius:50%; font-weight:800; color:#0b1530; background: linear-gradient(135deg, #ffd372, #e6c25d); box-shadow: 0 4px 14px rgba(201,168,76,.45); }

    /* status chips */
    .tc-chip { font-size:.72rem; padding:3px 10px; border-radius: 999px; font-weight:700; letter-spacing:.06em; text-transform: uppercase; }
    .chip-done    { color:#d6f7df; background: rgba(46, 204, 113, .18); border: 1px solid rgba(46,204,113,.35); }
    .chip-next    { color:#ffeab3; background: rgba(201,168,76,.18); border: 1px solid rgba(201,168,76,.45); }
    .chip-pending { color:#b7d3ff; background: rgba(52,152,219,.18); border: 1px solid rgba(52,152,219,.38); }

    /* lively headline + shimmer */
    .tc-headline { font-weight: 800; letter-spacing: .02em; line-height: 1.05; text-align:center; }
    .tc-shimmer {
      background: linear-gradient(90deg, #7eb8ff 0%, #ffffff 35%, var(--gold-soft) 50%, #ffffff 65%, #7eb8ff 100%);
      background-size: 600px 100%;
      -webkit-background-clip: text; background-clip:text; -webkit-text-fill-color: transparent;
      animation: tcShimmer 3.5s linear infinite;
    }
    @keyframes tcShimmer { 0% { background-position:-600px 0; } 100% { background-position: 600px 0; } }
    .tc-subtitle { text-align:center; color: var(--text-muted); font-weight:600; letter-spacing:.06em; text-transform:uppercase; }
    .tc-goldline { width:72px; height:2px; margin:14px auto 20px; background: linear-gradient(90deg, var(--gold), var(--gold-soft), transparent); opacity:.85; }
  `;

  return (
    <>
      <style>{tcCss}</style>
      {/* Page background: same deep navy gradient used in the training navbar */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #0a1628 0%, #001a45 25%, #0d1f3c 50%, #001233 75%, #0a0f1e 100%)",
          height: pageMinHeight,
          pb: 0,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          overflow: externalUser?.requiresEndorsement ? "hidden" : "auto",
        }}
      >
        {/* animated aurora blobs */}
        <Box className="tc-aurora">
          <Box className="tc-blob b1" />
          <Box className="tc-blob b2" />
          <Box className="tc-blob b3" />
        </Box>
        <Container maxWidth="lg" sx={{ pt: externalUser?.requiresEndorsement ? 3 : 5, pb: externalUser?.requiresEndorsement ? 1 : 2 }}>
          {externalUser?.requiresEndorsement ? (
            <Box sx={{ textAlign: "center" }}>
              <Typography className="tc-headline" sx={{ color: "#fff", fontSize: { xs: "2.4rem", md: "2.8rem" } }}>
                Get Started with <Box component="span" className="tc-shimmer">FIRE</Box>
              </Typography>
              <Box className="tc-goldline" />
              <Typography className="tc-subtitle" sx={{ fontSize: ".82rem" }}>
                Filipino Homes Institute of Real Estate
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              <Grid size={{ lg: 6, md: 12, xs: 12 }}>
                <Typography
                  variant={desktop ? "h4" : "h5"}
                  sx={{ color: "#fff", fontWeight: 700 }}
                >
                  Get Started with FIRE
                </Typography>
                <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.75)" }}>
                  Filipino Homes Institute of Real Estate
                </Typography>
              </Grid>
              <Grid size={{ lg: 6, md: 12, xs: 12 }}>
                <Typography variant={desktop ? "h6" : "body1"} sx={{ color: "rgba(255,255,255,0.85)" }}>
                  You are about to begin the 12 training modules required to
                  complete your requirements as a Filipino Homes agent.
                </Typography>
              </Grid>
            </Grid>
          )}
        </Container>

        {/* Content area */}
        <Box
          component={desktop ? Container : "div"}
          sx={{
            px: desktop ? 0 : 3,
            flexGrow: 1,
            display: "flex",
            // For endorsement: place content near the top but keep it centered horizontally
            alignItems: externalUser?.requiresEndorsement ? "flex-start" : "flex-start",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {externalUser?.requiresEndorsement ? (
            <Box sx={{ width: "100%", maxWidth: 820, mt: 2 }}>
              {/* Centered endorsement panel */}
              <Box className="tc-glass tc-card" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, rgba(255,255,255,.22), rgba(255,255,255,.08))", border: "1px solid rgba(255,255,255,.28)", boxShadow: "0 6px 18px rgba(0,0,0,.35)" }}>
                    <UploadRounded />
                  </Box>
                  <Box>
                    <Typography sx={{ color: "#fff", fontWeight: 700 }}>Upload Endorsement Letter</Typography>
                    <Typography sx={{ color: "rgba(255,255,255,.78)", fontSize: ".85rem" }}>
                      JPG, PNG, or PDF up to 5MB
                    </Typography>
                  </Box>
                </Box>
                <Grid container spacing={1}>
                  <Grid size={{ lg: 7, md: 7, xs: 12 }}>
                    <StyledTextField
                      type="file"
                      name="endorsement"
                      handleChange={handleChangeFile}
                      props={{
                        inputProps: { accept: ".jpg,.jpeg,.png,.pdf" },
                      }}
                    />
                  </Grid>
                  <Grid size={{ lg: 5, md: 5, xs: 12 }}>
                    <StyledButton
                      variant="contained"
                      fullWidth
                      startIcon={<UploadRounded />}
                      disabled={endorsement === null}
                      loading={uploading}
                      onClick={handleUploadEndorsement}
                      sx={{
                        fontWeight: 800,
                        letterSpacing: ".06em",
                        color: "#0b1530",
                        border: "1px solid rgba(201,168,76,.6)",
                        background: "linear-gradient(135deg, #ffd372, #e6c25d)",
                        boxShadow: "0 8px 22px rgba(201,168,76,.28)",
                        textTransform: "uppercase",
                        '&:hover': {
                          background: "linear-gradient(135deg, #ffe08f, #f0cf72)",
                          boxShadow: "0 10px 28px rgba(201,168,76,.38)",
                          borderColor: "rgba(201,168,76,.8)",
                        },
                        '&.Mui-disabled': {
                          opacity: 1,
                          color: "rgba(11,21,48,.7)",
                          background: "linear-gradient(135deg, rgba(255,211,114,.55), rgba(230,194,93,.55))",
                          borderColor: "rgba(201,168,76,.45)",
                          boxShadow: "none",
                        },
                      }}
                    >
                      Upload file
                    </StyledButton>
                  </Grid>
                </Grid>
              </Box>
              {/* Support text below card */}
              <Box sx={{ mt: 2.5, textAlign: "center" }}>
                <Typography sx={{ color: "rgba(255,255,255,0.92)", fontWeight: 700 }}>
                  Please upload your endorsement letter.
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: ".9rem" }}>
                  Accepted file types: JPG, PNG, PDF. Maximum file size: 5MB.
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={{ width: "100%", my: 4 }}>
              <Grid container spacing={2}>
                {courses.map((c, k) => (
                  <Grid key={k} size={{ lg: 4, md: 12, xs: 12 }}>
                    <Box className="tc-glass tc-card" sx={{ height: 190, px: 2, py: 1.5, display: "flex", flexDirection: "column", borderRadius: 2, color: "#fff" }}>
                      <Box className="tc-topline" />
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Box className="tc-num">{k + 1}</Box>
                        <Box sx={{ width: "100%" }}>
                          <Typography variant={desktop ? "h6" : "body1"} sx={{ color: "#fff" }}>
                            {c.title}
                          </Typography>
                        </Box>
                        <Box sx={{ ml: "auto" }}>
                          <Box className={`tc-chip ${c.status === "done" ? "chip-done" : c.status === "next" ? "chip-next" : "chip-pending"}`}>{c.status === "done" ? "Completed" : c.status === "next" ? "Next Up" : "Pending"}</Box>
                        </Box>
                      </Box>
                      <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.12)" }} />
                      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        <Avatar src={c.speaker.avatar} sx={{ height: "auto", width: 35, border: "2px solid rgba(255,255,255,0.22)" }} />
                        <Box>
                          <Typography variant="body2" sx={{ color: "#fff" }}>{c.speaker.name}</Typography>
                          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>Speaker</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ mt: "auto", display: "flex", gap: 2, alignItems: "center" }}>
                        <Box component={Link} to={`/welcome/get-started/training/${c.id}`} sx={{ width: "100%" }}>
                          <StyledButton
                            fullWidth
                            variant="outlined"
                            size="small"
                            startIcon={<OpenInNewRounded />}
                            sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.45)", fontWeight: 700, "&:hover": { borderColor: "rgba(255,255,255,0.7)" } }}
                          >
                            Take course
                          </StyledButton>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}
