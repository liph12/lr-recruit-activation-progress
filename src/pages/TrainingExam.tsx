import {
  Box,
  Typography,
  Divider,
  Container,
  Avatar,
  Grid,
} from "@mui/material";
import { useAppProvider } from "../providers/AppProvider";
import useExternalAxios from "../hooks/useExternalAxios";
import { useEffect, useState } from "react";
import type { Course, Questionaire } from "../types/course";
import { useOutletContext } from "react-router-dom";
import PageLoader from "../components/PageLoader";
import { CheckCircleRounded, StartRounded } from "@mui/icons-material";
import StyledButton from "../components/utils/StyledButton";

type OutletContextProps = {
  course_id: string;
};

export default function TrainingExam() {
  const { course_id } = useOutletContext<OutletContextProps>();
  const axios = useExternalAxios();
  const [exam, setExam] = useState<Questionaire[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const { desktop, user } = useAppProvider();

  useEffect(() => {
    const fetchExamAsync = async () => {
      try {
        const response = await axios.get(
          `/integration/agent/course-exam?id=${course_id}&email=${user?.email}`
        );
        const { exam, course } = response.data;

        setCourse(course);
        setExam(exam);
      } catch (e) {
        // to do
      } finally {
        // to do
      }
    };

    fetchExamAsync();
  }, []);

  if (!course) {
    return <PageLoader title="getting module ready" />;
  }

  return (
    <>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant={desktop ? "h4" : "h5"}>
              You are taking Module {course?.id}
            </Typography>
          </Box>
          {desktop && (
            <Box>
              <StyledButton
                variant="contained"
                size="large"
                endIcon={<StartRounded />}
              >
                Start Learning Now
              </StyledButton>
            </Box>
          )}
        </Box>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={4}>
          <Grid size={{ lg: 8, md: 12, xs: 12 }}>
            <Box>
              <Typography variant="h4">{course.title}</Typography>
              <Typography sx={{ textAlign: "justify" }}>
                {course.description}
              </Typography>
              <Box
                sx={{ mt: 2, display: "flex", gap: 2, alignItems: "center" }}
              >
                <Avatar
                  src={course.speaker.avatar}
                  sx={{ height: "auto", width: 60 }}
                />
                <Box>
                  <Typography variant="h6">{course.speaker.name}</Typography>
                  <Typography variant="h6" color="textSecondary">
                    Speaker
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ lg: 4, md: 12, xs: 12 }}>
            <Typography variant="h5">What you'll learn</Typography>
            <Box>
              {course.learning_descriptions.map((d) => (
                <Box
                  sx={{ mb: 2, display: "flex", gap: 2, alignItems: "center" }}
                >
                  <CheckCircleRounded color="info" />
                  <Typography>{d}</Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
        {!desktop && (
          <Box sx={{ my: 2 }}>
            <StyledButton
              variant="contained"
              size="large"
              endIcon={<StartRounded />}
              fullWidth
            >
              Start Learning Now
            </StyledButton>
          </Box>
        )}
      </Container>
    </>
  );
}
