// ============================================================
//  RentPHTraining.tsx
//  Page that handles 3 things in sequence:
//   1. Landing screen  → user clicks "Start Learning Now"
//   2. Video screen    → user watches training videos, then clicks "Ready to Take Quiz?"
//   3. Exam screen     → user answers questions, submits, sees results
// ============================================================

import useExternalAxios from "../hooks/useExternalAxios";
import { useEffect, useRef, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { PlayArrowRounded, ArrowBackRounded, ArrowForwardRounded } from "@mui/icons-material";
import { keyframes } from "@mui/material";
import { useAppProvider } from "../providers/AppProvider";
import PageLoader from "../components/PageLoader";
import ExamResultModal from "../components/ExamResultModal";
import type { Course, Questionaire, ChoiceValue } from "../types/course";
import type { ExamResult as ExamResultType } from "../components/ExamResultModal";
import Exam from "./Exam";


// ─── Types ───────────────────────────────────────────────────────────────────

/** Raw question shape returned by the API */
interface Question {
  id: number;
  question: string;
  choices: string[]; 
}

/** A single answer the user submits: which question number + which letter (A/B/C/D) */
type AnswerSubmit = { question: number; answer: ChoiceValue };


// ─── Constants ───────────────────────────────────────────────────────────────

/** Training videos shown on the video screen. User can navigate between them. */
const TRAINING_VIDEOS = [
  {
    title: "CREATING RENTAL OPPORTUNITIES AMIDST COVID19",
    video: "https://www.youtube.com/embed/FPTwL4WOQ-o?si=CVgl4ycqD3vtl9TL",
  },
  {
    title: "PROPERTY RENTAL MANAGEMENT",
    video: "https://realestatetraining.ph/video/eduardoManahan.mp4",
  },
  {
    title: "RENT MANAGER OPPORTUNITY",
    video: "https://realestatetraining.ph/video/eduardoManahan.mp4",
  },
];

/**
 * Static course metadata for this module.
 * Defined outside the component so it's not re-created on every render.
 */
const RENT_COURSE: Course = {
  id: 12,
  title: "Become a Rent Manager",
  description: "",
  learning_descriptions: [],
  speaker: { name: "Rent PH", avatar: "/images/rent-ph.png", contact: "" },
  presentation: "",
  video: "",
  status: "pending",
  scores: [],
};


// ─── Animations (MUI keyframes) ───────────────────────────────────────────────

/** Slides content up + fades it in — used on first render */
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/** Moving shimmer effect across the gradient title text */
const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
`;

/** Gold underline that "draws itself" under the title */
const shimmerLine = keyframes`
  from { width: 0; opacity: 0; }
  to   { width: 56px; opacity: 1; }
`;

/** Subtle pulsing glow on the CTA button */
const softPulse = keyframes`
  0%, 100% { box-shadow: 0 8px 32px rgba(25,118,210,0.35); }
  50%       { box-shadow: 0 12px 48px rgba(25,118,210,0.55); }
`;


// ─── Shared style objects ─────────────────────────────────────────────────────
// Keeping repeated sx props as plain objects avoids duplication and makes
// the JSX much easier to read at a glance.

/** The "MODULE 12" pill badge that appears at the top of both screens */
const modulePillSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: 0.8,
  px: 1.6,
  py: 0.5,
  borderRadius: "100px",
  border: "1px solid rgba(126,184,255,0.35)",
  background: "rgba(25,118,210,0.12)",
  mb: 2,
};

/** The animated gradient title text (used on both landing and video screens) */
const gradientTitleSx = {
  fontWeight: 900,
  lineHeight: 1.06,
  letterSpacing: "-0.02em",
  backgroundImage:
    "linear-gradient(90deg,#7eb8ff 0%,#ffffff 35%,#f0d98a 50%,#ffffff 65%,#7eb8ff 100%)",
  backgroundSize: "600px 100%",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  animation: `${shimmer} 4s linear infinite`,
  mb: 1,
};

/** Gold underline accent below the title */
const accentLineSx = {
  height: "2px",
  background: "linear-gradient(90deg,#c9a84c,#f0d98a,transparent)",
  animation: `${shimmerLine} 1s cubic-bezier(0.22,1,0.36,1) 0.3s both`,
  width: 0,
};

/** Base styles for both CTA buttons (Start Learning / Ready to Take Quiz) */
const ctaButtonBaseSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: 1,
  px: 3.2,
  py: 1.4,
  borderRadius: "12px",
  cursor: "pointer",
  userSelect: "none",
  background: "linear-gradient(135deg,rgba(30,136,229,0.35),rgba(13,71,161,0.25))",
  border: "1px solid rgba(30,136,229,0.4)",
  animation: `${softPulse} 3s ease-in-out infinite`,
  transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
  boxShadow: "0 18px 46px rgba(25,118,210,0.35)",
  "&:hover": {
    background: "linear-gradient(135deg,#1e88e5,#0d47a1)",
    borderColor: "rgba(126,184,255,0.55)",
    transform: "translateY(-2px)",
    animation: "none",
    boxShadow: "0 18px 46px rgba(25,118,210,0.55)",
  },
};


// ─── Component ────────────────────────────────────────────────────────────────

export default function RentPHTraining() {
  const { user } = useAppProvider();
  const axios = useExternalAxios();

  // ── State ──
  const [exam, setExam] = useState<Question[]>([]);             // raw API data (kept for reference)
  const [examQ, setExamQ] = useState<Questionaire[]>([]);       // normalized data used by <Exam />
  const [results, setResults] = useState<ExamResultType[]>([]);

  const [loading, setLoading] = useState(false);                // shows PageLoader while fetching
  const [showResultModal, setShowResultModal] = useState(false);

  // Screen flow flags:
  //   isTaking=false              → Landing screen
  //   isTaking=true, showExam=false → Video screen
  //   isTaking=true, showExam=true  → Exam screen
  const [isTaking, setIsTaking] = useState(false);
  const [showExam, setShowExam] = useState(false);

  // Which video is currently playing (index into TRAINING_VIDEOS)
  const [videoIndex, setVideoIndex] = useState(0);

  // Canvas ref for the animated background (floating blobs)
  const canvasRef = useRef<HTMLCanvasElement>(null);


  // ── Derived values ──

  const currentVideo = TRAINING_VIDEOS[videoIndex];

  // YouTube embeds use <iframe>; direct mp4 links use <video>
  const isYouTube = /youtube\.com\/embed/.test(currentVideo.video);


  // ── Helpers ──

  /**
   * Converts the API's result format into the shape ExamResultModal expects.
   *
   * The API returns: { id, question, choice (text description), correct }
   * We need:        { question (number), answer (letter A/B/C/D), correct }
   */
  const normalizeResults = (
    data: Array<{ id: number; question: string; choice: string; correct: boolean }>
  ): ExamResultType[] => {
    return data.map((result) => {
      // Find the matching question object using either id or question text
      const matchedQuestion = examQ.find(
        (q) => q.id === result.id || q.question === result.question
      );

      // Convert the choice description back to its letter value (A/B/C/D)
      const choiceLetter =
        matchedQuestion?.choices.find((c) => c.description === result.choice)?.value ?? "A";

      return {
        question: matchedQuestion ? matchedQuestion.question_number : 0,
        answer: choiceLetter as ChoiceValue,
        correct: Boolean(result.correct),
      };
    });
  };

  /**
   * Custom submit handler passed into <Exam />.
   *
   * <Exam /> gives us answers as { question: number, answer: letter }.
   * We reverse-map those back to the text descriptions the API expects,
   * POST to the server, then normalize and pass results back to <Exam />.
   */
  const handleExamSubmit = async (
    answers: AnswerSubmit[],
    createResults: (results: ExamResultType[]) => void
  ) => {
    // Build the payload the API expects: { id, question (text), choice (text) }
    const payload = answers.map((answer) => {
      const matchedQuestion = examQ.find((q) => q.question_number === answer.question);
      const choiceDescription =
        matchedQuestion?.choices.find((c) => c.value === answer.answer)?.description ?? "";

      return {
        id: matchedQuestion?.id,
        question: matchedQuestion?.question?.trim(), // ✅ trim whitespace so backend lookup doesn't fail
        answer: choiceDescription,
      };
    });

    try {
      const response = await axios.post(
        "/integration/agent/submit-rent-exam",
        { answers: payload },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data as Array<{
        id: number;
        question: string;
        choice: string;
        correct: boolean;
      }>;

      const normalized = normalizeResults(data);

      // Tell <Exam /> about the results so it can show its own result UI
      createResults(normalized);
    } catch (error) {
      console.error("Exam submit error:", error);
      throw error; // let <Exam /> handle the error state
    }
  };


  // ── Side Effects ──

  /**
   * Fetch exam questions from the API when the user is available.
   * Maps the raw API format into the Questionaire[] format <Exam /> needs.
   */
  useEffect(() => {
    if (!user) return;

    const fetchExam = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/integration/agent/rent-exam");
        const rawQuestions = response.data as Question[];
        setExam(rawQuestions);

        // Transform each raw question into the Questionaire shape
        const normalized: Questionaire[] = rawQuestions.map((q, index) => ({
          id: q.id,
          question: q.question,
          question_number: index + 1,  // 1-based numbering
          choices: q.choices
            .slice(0, 4)                // only use first 4 choices
            .map((choiceText, i) => ({
              id: i + 1,
              description: choiceText,
              value: "ABCD"[i] as ChoiceValue,   // map index → A, B, C, D
            })),
        }));

        setExamQ(normalized);
      } catch (error) {
        console.error("Fetch exam error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [user, axios]);

  /**
   * Draws the animated background: dark navy base + 4 slow-moving color blobs.
   * Uses requestAnimationFrame for smooth 60fps rendering.
   * Cleans up the animation loop when the component unmounts.
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    // Handle high-DPI screens (retina displays) so the canvas looks sharp
    const fitCanvasToContainer = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    fitCanvasToContainer();

    // Re-fit whenever the canvas is resized (e.g. window resize)
    const resizeObserver = new ResizeObserver(fitCanvasToContainer);
    resizeObserver.observe(canvas);

    // Each blob: normalized position (0–1), radius (fraction of canvas size),
    // phase offsets (ox/oy) and speed for the sine/cosine drift animation
    const blobs = [
      { x: 0.15, y: 0.15, r: 0.55, ox: 0, oy: 0, speed: 0.000035, color: [0, 85, 179]   as [number,number,number] },
      { x: 0.82, y: 0.70, r: 0.50, ox: 1, oy: 2, speed: 0.000025, color: [0, 55, 140]   as [number,number,number] },
      { x: 0.50, y: 0.50, r: 0.42, ox: 2, oy: 1, speed: 0.00002,  color: [220, 235, 255] as [number,number,number] },
      { x: 0.20, y: 0.80, r: 0.38, ox: 3, oy: 3, speed: 0.000015, color: [200, 218, 255] as [number,number,number] },
    ];

    let tick = 0;

    const drawFrame = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;

      // Dark navy background
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#071020";
      ctx.fillRect(0, 0, W, H);

      // Draw each blob as a radial gradient that slowly drifts
      blobs.forEach((blob) => {
        const cx = (blob.x + Math.sin(tick * blob.speed * 1000 + blob.ox) * 0.1) * W;
        const cy = (blob.y + Math.cos(tick * blob.speed * 800  + blob.oy) * 0.08) * H;
        const radius = blob.r * Math.max(W, H);
        const [r, g, b] = blob.color;

        // Light-colored blobs are more transparent so they don't overpower the dark background
        const peakOpacity = r > 150 ? 0.06 : 0.2;

        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        gradient.addColorStop(0,    `rgba(${r},${g},${b},${peakOpacity})`);
        gradient.addColorStop(0.45, `rgba(${r},${g},${b},${peakOpacity * 0.35})`);
        gradient.addColorStop(1,    `rgba(${r},${g},${b},0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);
      });

      tick++;
      animationId = requestAnimationFrame(drawFrame);
    };

    drawFrame();

    // Cleanup: stop the animation and disconnect the observer when unmounting
    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, []);


  // ── Reset helpers ──
  // Called by ExamResultModal buttons to go back to a previous screen

  const handleRetake = () => {
    setResults([]);
    setShowResultModal(false);
    setShowExam(false);
    setVideoIndex(0);
  };

  const handleNextModule = () => {
    setShowResultModal(false);
    setIsTaking(false);
    setShowExam(false);
    setVideoIndex(0);
  };


  // ── Early return ──
  if (loading) return <PageLoader title="loading exam" />;


  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ minHeight: "100vh", position: "relative", background: "#071020" }}>

      {/* Google Fonts import — Outfit is used everywhere */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        * { font-family: 'Outfit', sans-serif !important; }
      `}</style>

      {/* Animated canvas background (sits behind all content) */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          zIndex: 0, pointerEvents: "none",
        }}
      />

      {/*
        Main content wrapper.
        When on the video screen (isTaking && !showExam), we want full-width layout.
        Otherwise, constrain to 1100px and add padding.
      */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          ...(isTaking && !showExam
            ? { maxWidth: "100%", mx: 0, px: 0, py: 0 }
            : { maxWidth: 1100, mx: "auto", px: { xs: 2, md: 4 }, py: { xs: 5, md: 7 } }),
        }}
      >

        {/* ── SCREEN 1: Landing ─────────────────────────────────────────── */}
        {!isTaking && (
          <LandingScreen onStart={() => setIsTaking(true)} />
        )}

        {/* ── SCREEN 2: Video ───────────────────────────────────────────── */}
        {isTaking && !showExam && (
          <VideoScreen
            currentVideo={currentVideo}
            isYouTube={isYouTube}
            videoIndex={videoIndex}
            totalVideos={TRAINING_VIDEOS.length}
            onPrevVideo={() => setVideoIndex((v) => Math.max(0, v - 1))}
            onNextVideo={() => setVideoIndex((v) => Math.min(TRAINING_VIDEOS.length - 1, v + 1))}
            onStartQuiz={() => setShowExam(true)}
          />
        )}

        {/* ── SCREEN 3: Exam ────────────────────────────────────────────── */}
        {isTaking && showExam && (
          examQ.length > 0
            ? <Exam exam={examQ} course={RENT_COURSE} customSubmit={handleExamSubmit} />
            : <PageLoader title="loading questions" />
        )}

      </Box>

      {/* Result modal — shown after exam is submitted (controlled by <Exam />) */}
      <ExamResultModal
        open={showResultModal}
        total={examQ.length}
        results={results}
        onClose={() => setShowResultModal(false)}
        onRetake={handleRetake}
        onNextModule={handleNextModule}
      />
    </Box>
  );
}


// ─── Sub-components ───────────────────────────────────────────────────────────
// Extracted from the original monolith to make each screen easy to read/reason about.

// ── Landing Screen ──

interface LandingScreenProps {
  onStart: () => void;
}

function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        gap: { xs: 3, md: 6 },
        animation: `${fadeInUp} 0.6s ease both`,
      }}
    >
      {/* Left side: module badge + title + description */}
      <Box sx={{ flex: 1, minWidth: 0, pr: { md: 3 } }}>
        <ModuleBadge />
        <AnimatedTitle fontSize={{ xs: "clamp(2.2rem,7vw,3rem)", md: "clamp(3.2rem,3.6vw,3.6rem)" }} />
        <Typography sx={{ color: "rgba(255,255,255,0.72)", mt: 2, maxWidth: 760 }}>
          Complete this module to unlock your Rent Manager opportunities and learn essential rental property management skills.
        </Typography>
      </Box>

      {/* Right side: CTA button */}
      <Box sx={{ alignSelf: { xs: "flex-start", md: "center" } }}>
        <Box onClick={onStart} sx={ctaButtonBaseSx}>
          <PlayArrowRounded sx={{ fontSize: 20, color: "#ffffff" }} />
          <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#ffffff" }}>
            Start Learning Now
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}


// ── Video Screen ──

interface VideoScreenProps {
  currentVideo: typeof TRAINING_VIDEOS[number];
  isYouTube: boolean;
  videoIndex: number;
  totalVideos: number;
  onPrevVideo: () => void;
  onNextVideo: () => void;
  onStartQuiz: () => void;
}

function VideoScreen({
  currentVideo,
  isYouTube,
  videoIndex,
  totalVideos,
  onPrevVideo,
  onNextVideo,
  onStartQuiz,
}: VideoScreenProps) {
  return (
    // No canvas here — the parent's canvas already covers the full viewport
    <Box
      sx={{
        position: "relative",
        height: "calc(100vh - 100px)",
        overflow: "hidden",
        background: "transparent",
        display: "flex",
        flexDirection: "column",
      }}
    >

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          px: { xs: 2, sm: 3, md: 6 },
          pt: { xs: 3, md: 5 },
          pb: { xs: 1.5, md: 2 },
          gap: { xs: 2, md: 5 },
          overflow: "hidden",
        }}
      >
        {/* Left panel: title + quiz CTA + video nav controls */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flexShrink: 0,
            width: { xs: "100%", md: "25%" },
            gap: { xs: 2, md: 2.5 },
            animation: `${fadeInUp} 0.5s ease both`,
          }}
        >
          <ModuleBadge compact />
          <AnimatedTitle fontSize={{ xs: "clamp(1.8rem,7vw,2.4rem)", md: "clamp(3.5rem,3.8vw,3rem)" }} />

          {/* "Ready to Take Quiz?" button */}
          <Box
            onClick={onStartQuiz}
            sx={{
              ...ctaButtonBaseSx,
              alignSelf: "flex-start",
              px: 2.8,
              "&:hover .cta-arrow": { transform: "translateX(3px)" },
            }}
          >
            <PlayArrowRounded sx={{ fontSize: 20, color: "#fff" }} />
            <Typography sx={{ fontWeight: 800, fontSize: "1.4rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#fff" }}>
              Ready to Take Quiz?
            </Typography>
            <ArrowForwardRounded
              className="cta-arrow"
              sx={{ fontSize: 15, color: "rgba(255,255,255,0.7)", transition: "transform 0.2s" }}
            />
          </Box>

          {/* Previous / title / Next video navigation */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 1 }}>
            <IconButton
              onClick={onPrevVideo}
              disabled={videoIndex === 0}
              sx={{ color: "#7eb8ff", p: 1 }}
            >
              <ArrowBackRounded fontSize="small" />
            </IconButton>

            <Typography sx={{ color: "#c9a84c", fontWeight: 700, fontSize: "0.85rem", flex: 1 }}>
              {currentVideo.title}
            </Typography>

            <IconButton
              onClick={onNextVideo}
              disabled={videoIndex === totalVideos - 1}
              sx={{ color: "#7eb8ff", p: 1 }}
            >
              <ArrowForwardRounded fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Right panel: video player */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            display: "flex",
            alignItems: "stretch",
            justifyContent: "stretch",
            animation: `${fadeInUp} 0.55s ease 0.1s both`,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: "100%",
              aspectRatio: "16 / 9",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
            }}
          >
            {isYouTube ? (
              <iframe
                src={currentVideo.video}
                title={currentVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
                style={{ width: "100%", height: "100%", border: 0 }}
              />
            ) : (
              <video src={currentVideo.video} style={{ width: "100%", height: "100%" }} controls />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}


// ─── Tiny reusable pieces ─────────────────────────────────────────────────────

/** The "• MODULE 12" pill badge */
function ModuleBadge({ compact = false }: { compact?: boolean }) {
  return (
    <Box sx={{ ...modulePillSx, px: compact ? 1.4 : 1.6, py: compact ? 0.4 : 0.5, mb: compact ? 0 : 2 }}>
      <Box sx={{ width: compact ? 6 : 7, height: compact ? 6 : 7, borderRadius: "50%", background: "#7eb8ff" }} />
      <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#7eb8ff" }}>
        Module 12
      </Typography>
    </Box>
  );
}

/** Gradient shimmer title + gold underline — reused on both screens */
function AnimatedTitle({ fontSize }: { fontSize: object }) {
  return (
    <Box>
      <Typography sx={{ ...gradientTitleSx, fontSize }}>
        Become a Rent Manager
      </Typography>
      <Box sx={accentLineSx} />
    </Box>
  );
}