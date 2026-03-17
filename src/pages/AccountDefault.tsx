import { useAppProvider } from "../providers/AppProvider";
import {
  Box,
  Typography,
  Avatar,
  Grid,
  Container,
  Chip,
  keyframes,
} from "@mui/material";
import {
  VerifiedRounded,
  RocketLaunchRounded,
  ArrowForwardRounded,
  HowToRegRounded,
  CoPresentRounded,
  SchoolRounded,
} from "@mui/icons-material";
import StyledButton from "../components/utils/StyledButton";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const OUTFIT = "'Outfit', sans-serif";

export default function AccountDefault() {
  const { user } = useAppProvider();
  const [stepper, setStepper] = useState([
    {
      id: 0,
      title: "Portal Registration",
      description:
        "Your account is officially registered. Welcome to the Filipino Homes community.",
      completed: true,
      icon: <HowToRegRounded sx={{ fontSize: 26 }} />,
    },
    {
      id: 1,
      title: "New Agents Orientation",
      description:
        "Webinar orientation successfully completed. You are ready for the next phase.",
      completed: true,
      icon: <CoPresentRounded sx={{ fontSize: 26 }} />,
    },
    {
      id: 2,
      title: "FIRE Certification",
      description:
        "Start your professional journey by completing Modules 1, 2, and 3.",
      completed: false,
      icon: <SchoolRounded sx={{ fontSize: 26 }} />,
    },
  ]);

  // Logic to sync with real user data as seen in your original file
  useEffect(() => {
    if (user?.webinar_progress === 100) {
      // Logic would go here to update the stepper state
    }
  }, [user]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background: "#071020",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap'); * { font-family: ${OUTFIT} !important; }`}</style>

      <Container maxWidth="lg">
        {/* Fix: Use spacing={0} to allow the boxes to sit perfectly together */}
        <Grid
          container
          sx={{
            minHeight: "80vh",
            borderRadius: "32px",
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* Profile Section */}
          <Grid item xs={12} md={4} sx={{ display: "flex" }}>
            <Box
              sx={{
                flex: 1,
                p: 4,
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(30px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                borderRight: { md: "1px solid rgba(255, 255, 255, 0.08)" },
                animation: `${fadeInUp} 0.6s ease both`,
              }}
            >
              <Box sx={{ position: "relative", mb: 3 }}>
                <Avatar
                  src={user?.photo ?? ""}
                  sx={{
                    height: 130,
                    width: 130,
                    border: "4px solid #1e88e5",
                    boxShadow: "0 0 30px rgba(30,136,229,0.3)",
                  }}
                />
                <VerifiedRounded
                  sx={{
                    position: "absolute",
                    bottom: 8,
                    right: 8,
                    color: "#1e88e5",
                    bgcolor: "#071020",
                    borderRadius: "50%",
                    fontSize: 30,
                  }}
                />
              </Box>

              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: "#fff", mb: 0.5 }}
              >
                {user?.name}
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.4)",
                  mb: 4,
                  fontWeight: 400,
                  fontSize: "0.9rem",
                }}
              >
                {user?.email}
              </Typography>

              <Chip
                label="Certified Salesperson"
                sx={{
                  bgcolor: "rgba(30,136,229,0.1)",
                  color: "#1e88e5",
                  fontWeight: 700,
                  border: "1px solid rgba(30,136,229,0.2)",
                  mb: 4,
                }}
              />

              <Link
                to="/welcome/fire"
                style={{ textDecoration: "none", width: "100%" }}
              >
                <StyledButton
                  fullWidth
                  variant="contained"
                  sx={{
                    py: 2,
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #1e88e5, #0d47a1)",
                    fontWeight: 700,
                  }}
                >
                  START TRAINING <RocketLaunchRounded sx={{ ml: 1.5 }} />
                </StyledButton>
              </Link>
            </Box>
          </Grid>

          {/* Progress Section: Set to flexGrow: 1 to fill the right side */}
          <Grid item xs={12} md={8} sx={{ display: "flex" }}>
            <Box
              sx={{
                flexGrow: 1,
                p: { xs: 3, md: 6 },
                background: "rgba(255, 255, 255, 0.015)",
                backdropFilter: "blur(30px)",
                display: "flex",
                flexDirection: "column",
                animation: `${fadeInUp} 0.8s ease both`,
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  color: "#fff",
                  mb: 6,
                }}
              >
                Onboarding Progress
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {stepper.map((item, idx) => (
                  <Box
                    key={item.id}
                    sx={{ display: "flex", gap: 3, position: "relative" }}
                  >
                    {/* Progress Connecting Line */}
                    {idx !== stepper.length - 1 && (
                      <Box
                        sx={{
                          position: "absolute",
                          left: 24,
                          top: 55,
                          bottom: -40,
                          width: 2,
                          background: item.completed
                            ? "#1e88e5"
                            : "rgba(255,255,255,0.1)",
                          zIndex: 0,
                        }}
                      />
                    )}

                    <Box
                      sx={{
                        zIndex: 1,
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: item.completed
                          ? "rgba(30,136,229,0.2)"
                          : "rgba(255,255,255,0.05)",
                        border: "2px solid",
                        borderColor: item.completed
                          ? "#1e88e5"
                          : "rgba(255,255,255,0.1)",
                        color: item.completed
                          ? "#7eb8ff"
                          : "rgba(255,255,255,0.3)",
                      }}
                    >
                      {item.icon}
                    </Box>

                    <Box
                      sx={{
                        flex: 1,
                        p: 3,
                        borderRadius: "20px",
                        background: item.completed
                          ? "rgba(30,136,229,0.04)"
                          : "transparent",
                        border: "1px solid",
                        borderColor: item.completed
                          ? "rgba(30,136,229,0.15)"
                          : "rgba(255,255,255,0.03)",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: item.completed
                            ? "#fff"
                            : "rgba(255,255,255,0.3)",
                          fontSize: "1.2rem",
                          mb: 0.5,
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        sx={{
                          color: "rgba(255,255,255,0.4)",
                          fontWeight: 400,
                          lineHeight: 1.6,
                        }}
                      >
                        {item.description}
                      </Typography>
                      {!item.completed && (
                        <Box
                          sx={{
                            mt: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "#1e88e5",
                            cursor: "pointer",
                            fontWeight: 700,
                          }}
                        >
                          PROCEED NOW{" "}
                          <ArrowForwardRounded sx={{ fontSize: 18 }} />
                        </Box>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
