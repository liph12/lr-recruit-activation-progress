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

const animationStyles = `
  @keyframes bgShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  /* Make pagination text and controls highly visible */
  .react-pdf__Document {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }

  .react-pdf__Page {
    display: flex;
    justify-content: center;
  }

  /* Pagination controls styling */
  .react-pdf__Document > div:last-child {
    background: rgba(201, 168, 76, 0.15) !important;
    border: 1px solid rgba(201, 168, 76, 0.4) !important;
    border-radius: 8px !important;
    padding: 12px 16px !important;
    margin-top: 12px !important;
    text-align: center;
    color: #c9a84c !important;
    font-weight: 600 !important;
    font-size: 14px !important;
  }

  /* Page number text */
  .react-pdf__Document__controls {
    color: #c9a84c !important;
    font-weight: 700 !important;
  }

  /* Navigation buttons inside pagination */
  .react-pdf__Document button,
  button[aria-label*="Previous"],
  button[aria-label*="Next"] {
    color: #c9a84c !important;
    background: rgba(201, 168, 76, 0.2) !important;
    border: 1px solid #c9a84c !important;
    border-radius: 6px !important;
    padding: 6px 10px !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
    filter: brightness(1.3) !important;
  }

  .react-pdf__Document button:hover,
  button[aria-label*="Previous"]:hover,
  button[aria-label*="Next"]:hover {
    background: rgba(201, 168, 76, 0.35) !important;
    box-shadow: 0 0 12px rgba(201, 168, 76, 0.5) !important;
  }

  .react-pdf__Document button svg,
  button[aria-label*="Previous"] svg,
  button[aria-label*="Next"] svg {
    stroke: #c9a84c !important;
    fill: #c9a84c !important;
  }

  /* Make pagination/next arrows highly visible */
  button[aria-label*="next"],
  button[aria-label*="Next"],
  button[aria-label*="previous"],
  button[aria-label*="Previous"],
  [class*="pagination"] button,
  [class*="nav"] button {
    color: #c9a84c !important;
    background: rgba(201, 168, 76, 0.2) !important;
    border-color: #c9a84c !important;
    filter: brightness(2) !important;
  }

  button[aria-label*="next"] svg,
  button[aria-label*="Next"] svg,
  button[aria-label*="previous"] svg,
  button[aria-label*="Previous"] svg,
  [class*="pagination"] button svg,
  [class*="nav"] button svg {
    stroke: #c9a84c !important;
    fill: #c9a84c !important;
    filter: brightness(2) !important;
  }
`;

interface CourseProps {
  course: Course;
  takeCourse: () => void;
}

export default function TrainingCourse({ course, takeCourse }: CourseProps) {
  const { desktop, user } = useAppProvider();
  const [isVideo, setIsVideo] = useState(true);

  // Tighten navbar height to avoid triggering page scroll
  const NAVBAR_HEIGHT = desktop ? 57 : 48;

  const iframeString = course.video
    .replace(/width="\d+px"/, 'width="100%"')
    .replace(/height="\d+px"/, 'height="100%"');

  return (
    <>
      <style>{animationStyles}</style>
      <Box
        sx={{
          position: "relative",
          height: `calc(100vh - ${NAVBAR_HEIGHT}px - 8px)`,
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #0a1628 0%, #001a45 25%, #0d1f3c 50%, #001233 75%, #0a0f1e 100%)",
          backgroundSize: "400% 400%",
          animation: "bgShift 14s ease infinite",
          display: "flex",
          flexDirection: "column",
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundImage: `
              radial-gradient(1px 1px at 18% 22%, rgba(255,255,255,0.18) 0%, transparent 100%),
              radial-gradient(1px 1px at 72% 11%, rgba(255,255,255,0.12) 0%, transparent 100%),
              radial-gradient(1.5px 1.5px at 45% 68%, rgba(201,168,76,0.25) 0%, transparent 100%),
              radial-gradient(1px 1px at 88% 55%, rgba(255,255,255,0.10) 0%, transparent 100%),
              radial-gradient(1px 1px at 30% 82%, rgba(255,255,255,0.14) 0%, transparent 100%),
              radial-gradient(1.5px 1.5px at 62% 38%, rgba(201,168,76,0.18) 0%, transparent 100%),
              radial-gradient(1px 1px at 10% 58%, rgba(255,255,255,0.09) 0%, transparent 100%),
              radial-gradient(1px 1px at 93% 78%, rgba(255,255,255,0.13) 0%, transparent 100%)
            `,
            pointerEvents: "none",
            zIndex: 0,
            opacity: 0.7,
          },
          "@keyframes bgShift": {
            "0%": { backgroundPosition: "0% 50%" },
            "50%": { backgroundPosition: "100% 50%" },
            "100%": { backgroundPosition: "0% 50%" },
          },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            px: 1,
            py: 0.5,
            overflow: "hidden",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Header Row */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 0.5,
              flexShrink: 0,
            }}
          >
          <Typography
            variant={desktop ? "h4" : "h5"}
            sx={{ fontWeight: 700, color: "#ffffff" }}
          >
            {course.title}
          </Typography>

          {desktop && (
            <StyledButton
              variant="contained"
              size="large"
              endIcon={<StartRounded />}
              onClick={takeCourse}
            >
              Ready to Take Quiz?
            </StyledButton>
          )}
          </Box>

          <Divider
            sx={{ mb: 0.8, borderColor: "rgba(255,255,255,0.15)", flexShrink: 0 }}
          />

          {/* Toggle Buttons */}
          <Box sx={{ mb: 0.8, flexShrink: 0 }}>
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

        {/* Content Area */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.08)",
            p: isVideo ? 0.5 : 0,
            minHeight: 0,
            boxSizing: "border-box",
          }}
        >
          {isVideo ? (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 0,
              }}
            >
              <div
                dangerouslySetInnerHTML={{ __html: iframeString }}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                "& > *": {
                  flex: 1,
                  height: "100% !important",
                  width: "calc(100% + 80px) !important",
                  maxWidth: "none !important",
                  maxHeight: "100% !important",
                  marginLeft: "-40px !important",
                },
                "& canvas, & img": {
                  width: "100% !important",
                  height: "auto !important",
                  maxHeight: "100% !important",
                  objectFit: "contain",
                },
              }}
            >
              <PresentationPDF
                document={`https://socket.leuteriorealty.com/proxy?url=${course.presentation}`}
              />
            </Box>
          )}
        </Box>

        {/* Mobile CTA */}
        {!desktop && (
          <Box sx={{ mt: 0, p: 0, flexShrink: 0 }}>
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
    </>
  );
}