import { Box, Typography, Avatar } from "@mui/material";
import {
  CheckRounded,
  SlideshowRounded,
  ArrowBackRounded,
  ArrowForwardRounded,
  AutoAwesomeRounded,
  EmojiEventsRounded,
} from "@mui/icons-material";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Questionaire, ChoiceValue, Course } from "../types/course";
import useExternalAxios from "../hooks/useExternalAxios";
import ExamResultModal from "../components/ExamResultModal";
import GlobalLoader from "../components/GlobalLoader";
import { useAppProvider } from "../providers/AppProvider";
import useAxios from "../hooks/useAxios";

interface Answer {
  question: number;
  answer: ChoiceValue;
}

interface Result {
  question: number;
  answer: ChoiceValue;
  correct: boolean;
}

const OUTFIT = "'Outfit', sans-serif";

const examStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
  * { font-family: 'Outfit', sans-serif !important; }

  @keyframes exam-fade-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes exam-shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  @keyframes exam-line-draw {
    from { width: 0; opacity: 0; }
    to   { width: 56px; opacity: 1; }
  }
  @keyframes exam-step-in {
    from { opacity: 0; transform: translateX(28px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes exam-step-back {
    from { opacity: 0; transform: translateX(-28px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes exam-soft-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(25,118,210,0.4); }
    50%       { box-shadow: 0 0 0 8px rgba(25,118,210,0); }
  }

  .exam-fade-1 { animation: exam-fade-up 0.6s ease 0.05s both; }
  .exam-fade-2 { animation: exam-fade-up 0.6s ease 0.15s both; }
  .exam-fade-3 { animation: exam-fade-up 0.6s ease 0.25s both; }
  .exam-fade-4 { animation: exam-fade-up 0.6s ease 0.35s both; }

  .exam-shimmer-title {
    background: linear-gradient(90deg, #7eb8ff 0%, #ffffff 35%, #f0d98a 50%, #ffffff 65%, #7eb8ff 100%);
    background-size: 600px 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: exam-shimmer 3.5s linear infinite;
  }

  .exam-gold-line {
    display: block;
    height: 2px;
    background: linear-gradient(90deg, #c9a84c, #f0d98a, transparent);
    width: 0;
    animation: exam-line-draw 1s cubic-bezier(0.22,1,0.36,1) 0.4s both;
    margin-top: 12px;
    margin-bottom: 0;
  }

  .exam-step-in      { animation: exam-step-in   0.35s cubic-bezier(0.22,1,0.36,1) both; }
  .exam-step-in-back { animation: exam-step-back 0.35s cubic-bezier(0.22,1,0.36,1) both; }

  .exam-choice-row {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    cursor: pointer;
    user-select: none;
    padding: 12px 16px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.07);
    background: rgba(255,255,255,0.03);
    transition: all 0.2s ease;
  }
  .exam-choice-row:hover {
    background: rgba(126,184,255,0.07);
    border-color: rgba(126,184,255,0.25);
  }
  .exam-choice-row.selected {
    background: rgba(25,118,210,0.12);
    border-color: rgba(126,184,255,0.4);
  }
`;

// ─── Header ───────────────────────────────────────────────────────────────────
function CourseHeader({
  course,
  speakers,
}: {
  course: Course;
  speakers?: { name: string; avatar: string }[];
}) {
  return (
    <Box
      sx={{
        position: "relative",
        zIndex: 1,
        py: { xs: 5, lg: 6 },
        px: { xs: 3, lg: 5 },
        textAlign: "center",
        width: "100%",
      }}
    >
      <Box sx={{ maxWidth: 380, mx: "auto" }}>
        <Box className="exam-fade-1" sx={{ mb: 0.5 }}>
          {/* Pill */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.8,
              mb: 2.5,
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
              }}
            />
            <Typography
              sx={{
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#7eb8ff",
                fontFamily: OUTFIT,
              }}
            >
              Module Exam
            </Typography>
          </Box>

          <Typography
            component="h1"
            className="exam-shimmer-title"
            sx={{
              fontSize: {
                xs: "clamp(2rem,8vw,3rem)",
                lg: "clamp(2.2rem,3.5vw,3.4rem)",
              },
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: "-0.035em",
              fontFamily: OUTFIT,
            }}
          >
            {course.title}
          </Typography>
          <span className="exam-gold-line" style={{ margin: "14px auto 0" }} />
        </Box>

        {/* Speakers */}
        {speakers && speakers.length > 0 ? (
          <Box
            className="exam-fade-2"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              gap: 2,
              mt: 3.5,
              mb: 3.5,
            }}
          >
            {speakers.map((sp) => (
              <Box
                key={sp.name}
                sx={{ display: "flex", alignItems: "center", gap: 1.4 }}
              >
                <Avatar
                  src={sp.avatar}
                  sx={{
                    width: 56,
                    height: 56,
                    border: "2.5px solid rgba(126,184,255,0.45)",
                    boxShadow: "0 6px 24px rgba(0,0,0,0.4)",
                  }}
                />
                <Box sx={{ textAlign: "left" }}>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "1.0rem",
                      color: "#ffffff",
                      fontFamily: OUTFIT,
                      lineHeight: 1.2,
                    }}
                  >
                    {sp.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      color: "#7eb8ff",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      fontFamily: OUTFIT,
                      mt: 0.2,
                    }}
                  >
                    Speaker
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Box
            className="exam-fade-2"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.8,
              mt: 3.5,
              mb: 3.5,
            }}
          >
            <Avatar
              src={course.speaker.avatar}
              sx={{
                width: 58,
                height: 58,
                border: "2.5px solid rgba(126,184,255,0.45)",
                boxShadow: "0 6px 24px rgba(0,0,0,0.4)",
              }}
            />
            <Box sx={{ textAlign: "left" }}>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: "1.05rem",
                  color: "#ffffff",
                  fontFamily: OUTFIT,
                  lineHeight: 1.2,
                }}
              >
                {course.speaker.name}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: "#7eb8ff",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontFamily: OUTFIT,
                  mt: 0.2,
                }}
              >
                Speaker
              </Typography>
            </Box>
          </Box>
        )}

        {/* Presentation link */}
        <Box className="exam-fade-3">
          <Box
            component="a"
            href={course.presentation}
            target="_blank"
            rel="noreferrer"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 2.5,
              py: 1.2,
              borderRadius: "12px",
              background:
                "linear-gradient(135deg,rgba(30,136,229,0.35),rgba(13,71,161,0.25))",
              border: "1px solid rgba(30,136,229,0.4)",
              color: "#ffffff",
              textDecoration: "none",
              fontFamily: OUTFIT,
              fontWeight: 700,
              fontSize: "0.78rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              transition: "all 0.25s ease",
              "&:hover": {
                background: "linear-gradient(135deg,#1e88e5,#0d47a1)",
                borderColor: "rgba(126,184,255,0.55)",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 28px rgba(25,118,210,0.45)",
              },
            }}
          >
            <SlideshowRounded sx={{ fontSize: 17, color: "#7eb8ff" }} />
            View Presentation
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────
type StepIndicatorProps = {
  step: number;
  total: number;
  answeredCount: number;
  selected: Record<number, ChoiceValue>;
  onJump: (i: number) => void;
  exam: Questionaire[];
};

function StepIndicator({
  step,
  total,
  answeredCount,
  selected,
  onJump,
  exam,
}: StepIndicatorProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1.2,
        }}
      >
        <Typography
          sx={{
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontFamily: OUTFIT,
          }}
        >
          Question {step + 1} of {total}
        </Typography>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.6,
            px: 1.2,
            py: 0.3,
            borderRadius: "100px",
            background:
              answeredCount === total
                ? "rgba(76,175,80,0.12)"
                : "rgba(25,118,210,0.1)",
            border: `1px solid ${
              answeredCount === total
                ? "rgba(76,175,80,0.3)"
                : "rgba(25,118,210,0.25)"
            }`,
          }}
        >
          {answeredCount === total ? (
            <EmojiEventsRounded sx={{ fontSize: 12, color: "#66bb6a" }} />
          ) : (
            <AutoAwesomeRounded sx={{ fontSize: 12, color: "#7eb8ff" }} />
          )}
          <Typography
            sx={{
              fontSize: "0.68rem",
              fontWeight: 700,
              color: answeredCount === total ? "#66bb6a" : "#7eb8ff",
              fontFamily: OUTFIT,
            }}
          >
            {answeredCount} / {total} answered
          </Typography>
        </Box>
      </Box>

      {/* Segment dots */}
      <Box sx={{ display: "flex", gap: "3px" }}>
        {exam.map((q, i) => {
          const isCurrent = i === step;
          const isAnswered = !!selected[q.id];
          return (
            <Box
              key={q.id}
              onClick={() => onJump(i)}
              sx={{
                flex: isCurrent ? "2 1 0" : "1 1 0",
                height: isCurrent ? 8 : 5,
                borderRadius: 4,
                cursor: "pointer",
                transition: "all 0.3s ease",
                background: isCurrent
                  ? "linear-gradient(90deg,#1e88e5,#7eb8ff)"
                  : isAnswered
                  ? "#4caf50"
                  : "rgba(255,255,255,0.1)",
                boxShadow: isCurrent ? "0 0 8px rgba(30,136,229,0.6)" : "none",
                alignSelf: "center",
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
}

// ─── Question card ─────────────────────────────────────────────────────────────
type QuestionCardProps = {
  q: Questionaire;
  selectedValue: ChoiceValue | undefined;
  direction: "forward" | "back";
  onSelect: (
    questionId: number,
    questionNo: number,
    value: ChoiceValue
  ) => void;
};

function QuestionCard({
  q,
  selectedValue,
  direction,
  onSelect,
}: QuestionCardProps) {
  return (
    <Box
      className={direction === "forward" ? "exam-step-in" : "exam-step-in-back"}
      sx={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "20px",
        p: { xs: 3, md: 3.5 },
        mb: 3,
      }}
    >
      {/* Question text */}
      <Typography
        sx={{
          fontSize: { xs: "0.95rem", md: "1.05rem" },
          fontWeight: 500,
          color: "#ffffff",
          fontFamily: OUTFIT,
          lineHeight: 1.85,
          mb: 3,
        }}
      >
        {q.question.split(/(_+)/).map((part, i) =>
          /^_+$/.test(part) ? (
            <Box
              key={i}
              component="span"
              sx={{
                display: "inline-block",
                width: `${Math.max(part.length * 0.55, 3)}ch`,
                borderBottom: "1.5px solid rgba(255,255,255,0.35)",
                mb: "-2px",
                mx: "2px",
              }}
            />
          ) : (
            part
          )
        )}
      </Typography>

      {/* Choices */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
        {q.choices.map((choice) => {
          const isSelected = selectedValue === choice.value;
          return (
            <Box
              key={choice.id}
              onClick={() => onSelect(q.id, q.question_number, choice.value)}
              className={`exam-choice-row${isSelected ? " selected" : ""}`}
            >
              {/* Checkbox */}
              <Box
                sx={{
                  mt: "3px",
                  width: 26,
                  height: 26,
                  borderRadius: "8px",
                  flexShrink: 0,
                  background: isSelected
                    ? "linear-gradient(135deg,#1e88e5,#0d47a1)"
                    : "rgba(255,255,255,0.06)",
                  border: isSelected
                    ? "none"
                    : "1.5px solid rgba(255,255,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: isSelected
                    ? "0 3px 12px rgba(25,118,210,0.4)"
                    : "none",
                  transition: "all 0.2s ease",
                }}
              >
                {isSelected && (
                  <CheckRounded sx={{ fontSize: 15, color: "#ffffff" }} />
                )}
              </Box>

              <Typography
                sx={{
                  fontSize: { xs: "0.88rem", md: "0.95rem" },
                  lineHeight: 1.7,
                  color: isSelected ? "#ffffff" : "rgba(255,255,255,0.65)",
                  fontWeight: isSelected ? 600 : 400,
                  fontFamily: OUTFIT,
                  transition: "all 0.2s ease",
                }}
              >
                <Box
                  component="span"
                  sx={{ fontWeight: 800, color: "#f0d98a", mr: 0.5 }}
                >
                  {choice.value}.
                </Box>
                {choice.description}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Answered indicator */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: selectedValue ? "#4caf50" : "rgba(255,255,255,0.2)",
              transition: "background 0.2s",
            }}
          />
          <Typography
            sx={{
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: selectedValue ? "#66bb6a" : "rgba(255,255,255,0.28)",
              fontFamily: OUTFIT,
              transition: "color 0.2s",
            }}
          >
            {selectedValue ? "Answered" : "Not answered"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

// ─── Nav buttons ──────────────────────────────────────────────────────────────
type NavButtonsProps = {
  step: number;
  isLast: boolean;
  answers: Answer[];
  courseId: number;
  total: number;
  createResults: (results: Result[]) => void;
  onPrev: () => void;
  onNext: () => void;
  onSubmittingChange?: (loading: boolean) => void;
  customSubmit?: (
    answers: Answer[],
    createResults: (results: Result[]) => void
  ) => Promise<void>;
};

function NavButtons({
  step,
  isLast,
  answers,
  courseId,
  total,
  createResults,
  onPrev,
  onNext,
  onSubmittingChange,
  customSubmit,
}: NavButtonsProps) {
  const [loading, setLoading] = useState(false);
  const axiosExt = useExternalAxios();
  const axios = useAxios();
  const completed = answers.length >= total;
  const { user } = useAppProvider();

  const updateFireCertCountAsync = async (total: number) => {
    try {
      await axios.post(
        "/agent/update-fire-certs-count",
        { total_passed: total },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (e) {
      // to do
    }
  };

  const handleSubmitAsync = async () => {
    try {
      setLoading(true);
      onSubmittingChange?.(true);

      if (customSubmit) {
        await customSubmit(answers, createResults);
      } else {
        const payLoad = {
          course_id: courseId,
          answers: answers,
          email: user?.email,
        };
        const response = await axiosExt.post(
          "/integration/agent/store-exam-answers",
          payLoad,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        await updateFireCertCountAsync(response.data.totalPassed);
        createResults(response.data.results);
      }
    } catch (e) {
      // to do
    } finally {
      setLoading(false);
      onSubmittingChange?.(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Previous */}
      <Box
        onClick={step > 0 ? onPrev : undefined}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.8,
          px: 2.2,
          py: 1.1,
          borderRadius: "10px",
          cursor: step === 0 ? "not-allowed" : "pointer",
          opacity: step === 0 ? 0.3 : 1,
          userSelect: "none",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          transition: "all 0.2s ease",
          "&:hover":
            step > 0
              ? {
                  background: "rgba(255,255,255,0.09)",
                  borderColor: "rgba(255,255,255,0.2)",
                  transform: "translateX(-2px)",
                }
              : {},
        }}
      >
        <ArrowBackRounded
          sx={{ fontSize: 16, color: "rgba(255,255,255,0.7)" }}
        />
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "0.78rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.7)",
            fontFamily: OUTFIT,
          }}
        >
          Previous
        </Typography>
      </Box>

      {/* Next / Submit */}
      {isLast ? (
        <Box
          onClick={handleSubmitAsync}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.8,
            px: 2.8,
            py: 1.1,
            borderRadius: "10px",
            cursor: completed ? "pointer" : "not-allowed",
            userSelect: "none",
            pointerEvents: completed && !loading ? "auto" : "none",

            background: completed
              ? "linear-gradient(135deg,#c9a84c,#a0782e)"
              : "linear-gradient(135deg,#888,#666)",

            border: "1px solid rgba(240,217,138,0.35)",

            boxShadow: completed ? "0 4px 20px rgba(201,168,76,0.35)" : "none",

            animation: completed
              ? "exam-soft-pulse 3s ease-in-out infinite"
              : "none",

            opacity: completed ? 1 : 0.6,

            transition: "all 0.25s ease",

            "&:hover": completed
              ? {
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 36px rgba(201,168,76,0.5)",
                }
              : {},
          }}
        >
          <EmojiEventsRounded sx={{ fontSize: 17, color: "#ffffff" }} />
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "0.82rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#ffffff",
              fontFamily: OUTFIT,
            }}
          >
            {loading
              ? "Submitting..."
              : completed
              ? "Submit Exam"
              : "Complete All Questions"}
          </Typography>
        </Box>
      ) : (
        <Box
          onClick={onNext}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.8,
            px: 2.8,
            py: 1.1,
            borderRadius: "10px",
            cursor: "pointer",
            userSelect: "none",
            background:
              "linear-gradient(135deg,rgba(30,136,229,0.4),rgba(13,71,161,0.3))",
            border: "1px solid rgba(30,136,229,0.45)",
            transition: "all 0.25s ease",
            "&:hover": {
              background: "linear-gradient(135deg,#1e88e5,#0d47a1)",
              borderColor: "rgba(126,184,255,0.55)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 28px rgba(25,118,210,0.5)",
            },
            "&:hover .nav-arrow": { transform: "translateX(3px)" },
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "0.82rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#ffffff",
              fontFamily: OUTFIT,
            }}
          >
            Next
          </Typography>
          <ArrowForwardRounded
            className="nav-arrow"
            sx={{
              fontSize: 16,
              color: "rgba(255,255,255,0.85)",
              transition: "transform 0.2s",
            }}
          />
        </Box>
      )}
    </Box>
  );
}

export default function Exam({
  exam,
  course,
  customSubmit,
  total: totalOverride,
  passScore,
  speakers,
}: {
  exam: Questionaire[];
  course: Course;
  customSubmit?: (
    answers: Answer[],
    createResults: (results: Result[]) => void
  ) => Promise<void>;
  total?: number;
  passScore?: number;
  speakers?: { name: string; avatar: string }[];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selected, setSelected] = useState<Record<number, ChoiceValue>>({});
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [animKey, setAnimKey] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const navigateRouter = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const total = totalOverride ?? exam.length;
  const isLast = step === total - 1;

  const createResults = (results: Result[]) => setResults(results);

  // Live canvas background
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
    if (results.length === 0) return;
    setShowResultModal(true);
  }, [results]);

  const handleSelect = (
    questionId: number,
    questionNo: number,
    value: ChoiceValue
  ) => {
    setAnswers((prev) => {
      const exists = prev.find((a) => a.question === questionNo);

      if (exists) {
        return prev.map((a) =>
          a.question === questionNo ? { ...a, answer: value } : a
        );
      }

      return [...prev, { question: questionNo, answer: value }];
    });

    setSelected((prev) => ({ ...prev, [questionId]: value }));
  };

  const navigate = (nextStep: number) => {
    setDirection(nextStep > step ? "forward" : "back");
    setAnimKey((k) => k + 1);
    setStep(nextStep);
  };

  const handleRetake = () => {
    setSelected({});
    setAnswers([]);
    setResults([]);
    setShowResultModal(false);
    setStep(0);
  };

  const handleNextModule = () => {
    const path = window.location.pathname;
    const nextPath = path.replace(
      /(\d+)(\/?$)/,
      (_m, d, rest) => `${Number(d) + 1}${rest || ""}`
    );
    navigateRouter(nextPath);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        background: "#071020",
        overflow: "hidden auto",
      }}
    >
      <style>{examStyles}</style>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
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
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          minHeight: "100vh",
        }}
      >
        {/* ── LEFT: Course info panel — sticky on desktop ── */}
        <Box
          sx={{
            width: { xs: "100%", lg: "38%" },
            flexShrink: 0,
            position: { xs: "relative", lg: "sticky" },
            top: { lg: 0 },
            height: { lg: "100vh" },
            borderRight: { lg: "1px solid rgba(255,255,255,0.07)" },
            borderBottom: {
              xs: "1px solid rgba(255,255,255,0.07)",
              lg: "none",
            },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CourseHeader course={course} speakers={speakers} />
        </Box>

        {/* ── RIGHT: Questions ── */}
        <Box
          sx={{
            flex: 1,
            px: { xs: 2, sm: 3, md: 5 },
            py: { xs: 4, md: 6 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box sx={{ maxWidth: 680, width: "100%" }}>
            <Box className="exam-fade-4">
              <StepIndicator
                step={step}
                total={total}
                answeredCount={Object.keys(selected).length}
                selected={selected}
                onJump={navigate}
                exam={exam}
              />
            </Box>

            <QuestionCard
              key={animKey}
              q={exam[step]}
              selectedValue={selected[exam[step].id]}
              direction={direction}
              onSelect={handleSelect}
            />

            <NavButtons
              step={step}
              isLast={isLast}
              answers={answers}
              courseId={course.id}
              total={total}
              createResults={createResults}
              onPrev={() => navigate(Math.max(step - 1, 0))}
              onNext={() => navigate(Math.min(step + 1, total - 1))}
              onSubmittingChange={setSubmitting}
              customSubmit={customSubmit}
            />
          </Box>
        </Box>
      </Box>

      {/* Result Modal */}
      <ExamResultModal
        open={showResultModal}
        total={total}
        results={results}
        onClose={() => setShowResultModal(false)}
        onRetake={handleRetake}
        onNextModule={handleNextModule}
        passScore={passScore}
      />

      {/* Global submit loader */}
      <GlobalLoader open={submitting} title="submitting exam" />
    </Box>
  );
}
