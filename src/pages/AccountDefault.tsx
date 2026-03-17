import { useAppProvider } from "../providers/AppProvider";
import useExternalAxios from "../hooks/useExternalAxios";
import { Box, Typography, Avatar, Grid, Container, Chip } from "@mui/material";
import { EventAvailableRounded, ScheduleRounded } from "@mui/icons-material";
import StyledButton from "../components/utils/StyledButton";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type StepperItem = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
};

const DEFAULT_STEPPER: StepperItem[] = [
  {
    id: 0,
    title: "Welcome to Leuterio Realty Portal",
    description:
      "Congratulations! You have just registered, please follow up additional requirements.",
    completed: true,
  },
];

export default function AccountDefault() {
  const axios = useExternalAxios();
  const [stepper, setStepper] = useState<StepperItem[]>(DEFAULT_STEPPER);
  const { user, desktop } = useAppProvider();

  useEffect(() => {
    if (user) {
      if (user.webinar_progress === 100) {
        setStepper((prev) => {
          const exist = prev.find((s) => s.id === 1);

          if (!exist) {
            return [
              ...prev,
              {
                id: 1,
                title: "New Agents Orientation/Webinar",
                description:
                  "Congratulations! New Agents Orientation/Webinar completed. Please proceed to the next step.",
                completed: true,
              },
              {
                id: 2,
                title: "Get Started with FIRE",
                description: "Please take the Modules 1, 2 and 3 courses.",
                completed: false,
              },
            ];
          }

          return [...prev];
        });
      }
    }

    const getFireCertsAsync = async () => {};
  }, []);

  return (
    <Box sx={{ py: 2 }}>
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          <Grid size={{ lg: 3, md: 12, xs: 12 }}>
            <Box
              sx={{
                border: "1px solid #555",
                height: "auto",
                width: "100%",
                borderRadius: 5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: "column",
                  textAlign: "center",
                  alignItems: "center",
                  p: 3,
                }}
              >
                <Avatar
                  src={user?.photo ?? ""}
                  sx={{
                    height: "auto",
                    width: desktop ? 80 : 50,
                    border: "2px solid #555",
                  }}
                />
                <Box>
                  <Typography color="#fff" variant="h6">
                    {user?.name}
                  </Typography>
                  <Typography color="#fff">{user?.email}</Typography>
                  <Chip
                    sx={{ mt: 2 }}
                    label="Salesperson"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </Box>
            <Link to="/welcome/fire" style={{ textDecoration: "none" }}>
              <StyledButton fullWidth variant="contained" sx={{ mt: 2 }}>
                Get Started with FIRE
              </StyledButton>
            </Link>
          </Grid>
          <Grid size={{ lg: 9, md: 12, xs: 12 }}>
            <Box
              sx={{
                border: "1px solid #555",
                height: "auto",
                minHeight: 600,
                overflow: "auto",
                width: "100%",
                borderRadius: 5,
                px: desktop ? 5 : 0,
              }}
            >
              <Box sx={{ py: 3 }}>
                {stepper.map((item, k) => (
                  <Box
                    sx={{
                      mb: 2,
                      mx: 2,
                      gap: 2,
                      display: "flex",
                      alignItems: "center",
                    }}
                    key={k}
                  >
                    {item.completed ? (
                      <EventAvailableRounded
                        sx={{ color: "#00b0ff", fontSize: 30 }}
                      />
                    ) : (
                      <ScheduleRounded color="warning" sx={{ fontSize: 30 }} />
                    )}
                    <Box>
                      <Typography color="#fff">{item.title}</Typography>
                      <Typography color="#aaa" variant="body2">
                        {item.description}
                      </Typography>
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
