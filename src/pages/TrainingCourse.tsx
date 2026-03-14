import {
  Box,
  Typography,
  Divider,
  Container,
  ButtonGroup,
} from "@mui/material";
import { useAppProvider } from "../providers/AppProvider";
import { useState } from "react";
import type { Course } from "../types/course";
import {
  StartRounded,
  SubscriptionsRounded,
  AutoStoriesRounded,
} from "@mui/icons-material";
import StyledButton from "../components/utils/StyledButton";
import PresentationPDF from "../components/PresentationPDF";

interface CourseProps {
  course: Course;
  takeCourse: () => void;
}

export default function TrainingCourse({ course, takeCourse }: CourseProps) {
  const { desktop, user } = useAppProvider();
  const [isVideo, setIsVideo] = useState(true);
  const iframeString = course.video
    .replace(/width="\d+px"/, 'width="100%"')
    .replace(/height="\d+px"/, 'height="100%"');

  return (
    <Box sx={{ height: "50vh" }}>
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
              {course.title}
            </Typography>
          </Box>{" "}
          {desktop && (
            <Box>
              <StyledButton
                variant="contained"
                size="large"
                endIcon={<StartRounded />}
                onClick={takeCourse}
              >
                Ready to Take Quiz?
              </StyledButton>
            </Box>
          )}
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box>
          <ButtonGroup size="large">
            <StyledButton
              onClick={() => setIsVideo(true)}
              variant={isVideo ? "contained" : "outlined"}
              startIcon={<SubscriptionsRounded />}
            >
              Video
            </StyledButton>
            <StyledButton
              onClick={() => setIsVideo(false)}
              variant={isVideo ? "outlined" : "contained"}
              startIcon={<AutoStoriesRounded />}
            >
              Powerpoint
            </StyledButton>
          </ButtonGroup>
        </Box>
        {isVideo ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60vh",
            }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: iframeString }}
              style={{
                width: 700,
                height: desktop ? 350 : 300,
              }}
            />
          </Box>
        ) : (
          <>
            <PresentationPDF
              document={`https://socket.leuteriorealty.com/proxy?url=${course.presentation}`}
            />
          </>
        )}
        {!desktop && (
          <Box sx={{ my: 2 }}>
            <StyledButton
              variant="contained"
              size="large"
              endIcon={<StartRounded />}
              fullWidth
              onClick={takeCourse}
            >
              Start Learning Now
            </StyledButton>
          </Box>
        )}
      </Container>
    </Box>
  );
}
