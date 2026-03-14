import { Box, Typography, Avatar } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useState } from "react";
import type { Questionaire, ChoiceValue, Course } from "../types/course";
import examData from "../../exam.json";

const course: Course = {
  ...examData.course,
  status: "pending",
  learning_descriptions: examData.course.learning_descriptions,
};

const questions: Questionaire[] = examData.exam.map((item) => ({
  id: item.id,
  question: item.question,
  answer: item.answer as ChoiceValue,
  choices: item.choices.map((c) => ({
    id: c.id,
    description: c.choiceDesc,
    value: c.choice as ChoiceValue,
  })),
}));

// ─── Sub-components ───────────────────────────────────────────────────────────

function CourseHeader() {
  return (
    <Box
      sx={{
        position: "relative",
        zIndex: 1,
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(201,168,76,0.2)",
        py: { xs: 6, md: 8 },
        px: 3,
        textAlign: "center",
      }}
    >
      <Box sx={{
        position: "absolute", top: 0, left: 0, right: 0, height: 4,
        background: "linear-gradient(90deg, var(--blue-deep), var(--blue-bright), var(--gold))",
      }} />

      <Box sx={{ maxWidth: 720, mx: "auto" }}>
        <Box className="exam-fade-1">
          <Typography
            component="h1"
            sx={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: { xs: "2rem", md: "clamp(2.2rem,3.5vw,3.2rem)" },
              fontWeight: 700,
              lineHeight: 1.12,
              color: "var(--text-dark)",
              mb: 0,
            }}
          >
            <Box component="span" className="exam-shimmer-text">
              {course.title}
            </Box>
          </Typography>
          <span className="exam-gold-line" style={{ margin: "10px auto 18px" }} />
        </Box>

        <Box
          className="exam-fade-2"
          sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, mb: 2.5 }}
        >
          <Avatar
            src={course.speaker.avatar}
            alt={course.speaker.name}
            sx={{ width: 48, height: 48, border: "2px solid var(--gold)", boxShadow: "0 4px 14px rgba(0,53,128,0.18)" }}
          />
          <Box sx={{ textAlign: "left" }}>
            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "1rem", color: "var(--text-dark)", lineHeight: 1.2 }}>
              {course.speaker.name}
            </Typography>
            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "var(--gold)", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Speaker
            </Typography>
          </Box>
        </Box>

        <Box className="exam-fade-3">
          <a href={course.presentation} target="_blank" rel="noreferrer" className="exam-presentation-btn">
            <SlideshowIcon sx={{ fontSize: 18 }} />
            View Presentation
          </a>
        </Box>
      </Box>
    </Box>
  );
}

type StepIndicatorProps = {
  step: number;
  total: number;
  answeredCount: number;
  selected: Record<number, ChoiceValue>;
  onJump: (i: number) => void;
};

function StepIndicator({ step, total, answeredCount, selected, onJump }: StepIndicatorProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Question {step + 1} of {total}
        </Typography>
        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "var(--blue-deep)" }}>
          {answeredCount} / {total} answered
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        {questions.map((q, i) => {
          const isCurrent = i === step;
          return (
            <Box
              key={q.id}
              onClick={() => onJump(i)}
              sx={{
                flex: isCurrent ? "2 1 0" : "1 1 0",
                height: 10,
                borderRadius: 5,
                cursor: "pointer",
                transition: "all 0.3s ease",
                background: isCurrent
                  ? "linear-gradient(90deg, var(--blue-mid), var(--blue-bright))"
                  : selected[q.id]
                  ? "var(--gold)"
                  : "rgba(0,85,179,0.15)",
                boxShadow: isCurrent ? "0 2px 8px rgba(0,85,179,0.35)" : "none",
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
}

type QuestionCardProps = {
  q: Questionaire;
  selectedValue: ChoiceValue | undefined;
  direction: "forward" | "back";
  onSelect: (questionId: number, value: ChoiceValue) => void;
};

function QuestionCard({ q, selectedValue, direction, onSelect }: QuestionCardProps) {
  return (
    <Box
      className={direction === "forward" ? "step-in" : "step-in-back"}
      sx={{
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(201,168,76,0.18)",
        borderRadius: 3,
        p: { xs: 3, md: 4 },
        boxShadow: "0 8px 32px rgba(0,53,128,0.08)",
        mb: 4,
      }}
    >
      <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: { xs: 16, md: 17 }, fontWeight: 500, color: "var(--text-dark)", lineHeight: 1.9, mb: 3, textAlign: "justify" }}>
        {q.question.split(/(_+)/).map((part, i) =>
          /^_+$/.test(part) ? (
            <Box key={i} component="span" sx={{ display: "inline-block", width: `${Math.max(part.length * 0.55, 3)}ch`, borderBottom: "1.5px solid var(--text-dark)", mb: "-2px", mx: "2px" }} />
          ) : part
        )}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {q.choices.map((choice) => {
          const isSelected = selectedValue === choice.value;
          return (
            <Box key={choice.id} onClick={() => onSelect(q.id, choice.value)} className={`exam-choice-row${isSelected ? " selected" : ""}`}>
              <Box sx={{
                mt: "3px", width: 26, height: 26, borderRadius: "6px", flexShrink: 0,
                background: isSelected ? "linear-gradient(135deg, var(--blue-mid) 0%, var(--blue-deep) 100%)" : "rgba(0,85,179,0.06)",
                border: isSelected ? "none" : "1.5px solid rgba(0,85,179,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: isSelected ? "0 3px 10px rgba(0,53,128,0.25)" : "none",
                transition: "all 0.2s ease",
              }}>
                {isSelected && <CheckIcon sx={{ fontSize: 16, color: "white" }} />}
              </Box>
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: { xs: 15, md: 16 }, lineHeight: 1.75, color: isSelected ? "var(--blue-deep)" : "var(--text-muted)", fontWeight: isSelected ? 600 : 400, transition: "all 0.2s ease" }}>
                <Box component="span" sx={{ fontWeight: 700, color: "var(--gold)", mr: 0.5 }}>{choice.value}.</Box>{" "}
                {choice.description}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, pr: 1 }}>
        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: selectedValue ? "var(--blue-mid)" : "rgba(0,0,0,0.25)", transition: "color 0.2s ease" }}>
          {selectedValue ? "✓ Answered" : "Not answered"}
        </Typography>
      </Box>
    </Box>
  );
}

type NavButtonsProps = {
  step: number;
  isLast: boolean;
  onPrev: () => void;
  onNext: () => void;
};

function NavButtons({ step, isLast, onPrev, onNext }: NavButtonsProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <button className="exam-nav-btn secondary" onClick={onPrev} disabled={step === 0}>
        <ArrowBackIcon sx={{ fontSize: 18 }} />
        Previous
      </button>
      {isLast ? (
        <button className="exam-nav-btn submit">Submit Exam</button>
      ) : (
        <button className="exam-nav-btn primary" onClick={onNext}>
          Next
          <ArrowForwardIcon sx={{ fontSize: 18 }} />
        </button>
      )}
    </Box>
  );
}

const examStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --blue-deep: #003580;
    --blue-mid: #0055b3;
    --blue-bright: #0077e6;
    --blue-light: #e8f2ff;
    --gold: #c9a84c;
    --gold-light: #f0d98a;
    --white: #ffffff;
    --text-dark: #0a1628;
    --text-muted: #4a5d7a;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes orbFloat1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50%       { transform: translate(30px, -20px) scale(1.05); }
  }

  @keyframes orbFloat2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50%       { transform: translate(-20px, 30px) scale(1.08); }
  }

  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }

  @keyframes lineDraw {
    from { width: 0; }
    to   { width: 64px; }
  }

  .exam-fade-1 { animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
  .exam-fade-2 { animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
  .exam-fade-3 { animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.4s both; }

  .exam-orb-1 { animation: orbFloat1 9s ease-in-out infinite; }
  .exam-orb-2 { animation: orbFloat2 11s ease-in-out infinite; }

  .exam-shimmer-text {
    background: linear-gradient(
      90deg,
      var(--blue-deep) 0%,
      var(--blue-bright) 40%,
      var(--gold) 50%,
      var(--blue-bright) 60%,
      var(--blue-deep) 100%
    );
    background-size: 800px 100%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 4s linear infinite;
  }

  .exam-gold-line {
    display: block;
    height: 2px;
    background: linear-gradient(90deg, var(--gold), var(--gold-light), transparent);
    animation: lineDraw 1.2s cubic-bezier(0.22,1,0.36,1) 0.6s both;
    width: 0;
    margin-top: 10px;
    margin-bottom: 18px;
  }

  .exam-presentation-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, var(--blue-mid) 0%, var(--blue-deep) 100%);
    color: white;
    border: none;
    border-radius: 6px;
    padding: 10px 22px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    text-decoration: none;
    cursor: pointer;
    box-shadow: 0 4px 18px rgba(0,53,128,0.28), inset 0 1px 0 rgba(255,255,255,0.15);
    transition: all 0.35s cubic-bezier(0.22,1,0.36,1);
    position: relative;
    overflow: hidden;
  }

  .exam-presentation-btn::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent);
    transition: left 0.45s ease;
  }

  .exam-presentation-btn:hover::before { left: 100%; }

  .exam-presentation-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 32px rgba(0,53,128,0.4), inset 0 1px 0 rgba(255,255,255,0.2);
  }

  .exam-choice-row {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    cursor: pointer;
    user-select: none;
    padding: 10px 14px;
    border-radius: 8px;
    border: 1px solid transparent;
    transition: all 0.2s ease;
  }

  .exam-choice-row:hover {
    background: rgba(0,85,179,0.04);
    border-color: rgba(201,168,76,0.25);
  }

  .exam-choice-row.selected {
    background: rgba(0,85,179,0.06);
    border-color: rgba(0,85,179,0.25);
  }

  @keyframes stepIn {
    from { opacity: 0; transform: translateX(32px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  @keyframes stepInBack {
    from { opacity: 0; transform: translateX(-32px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .step-in      { animation: stepIn     0.38s cubic-bezier(0.22,1,0.36,1) both; }
  .step-in-back { animation: stepInBack 0.38s cubic-bezier(0.22,1,0.36,1) both; }

  .exam-nav-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: none;
    border-radius: 6px;
    padding: 11px 26px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
    position: relative;
    overflow: hidden;
  }

  .exam-nav-btn.primary {
    background: linear-gradient(135deg, var(--blue-mid) 0%, var(--blue-deep) 100%);
    color: white;
    box-shadow: 0 4px 18px rgba(0,53,128,0.28), inset 0 1px 0 rgba(255,255,255,0.15);
  }

  .exam-nav-btn.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 32px rgba(0,53,128,0.4);
  }

  .exam-nav-btn.secondary {
    background: rgba(0,85,179,0.07);
    color: var(--blue-mid);
    border: 1.5px solid rgba(0,85,179,0.2);
    box-shadow: none;
  }

  .exam-nav-btn.secondary:hover {
    background: rgba(0,85,179,0.12);
    border-color: rgba(0,85,179,0.35);
    transform: translateY(-1px);
  }

  .exam-nav-btn.submit {
    background: linear-gradient(135deg, var(--gold) 0%, #a0782e 100%);
    color: white;
    box-shadow: 0 4px 18px rgba(201,168,76,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
  }

  .exam-nav-btn.submit:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 32px rgba(201,168,76,0.45);
  }

  .exam-nav-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    transform: none !important;
  }

  body {
    background-image: url('/images/lr-main-bg.png');
    background-size: cover;
    background-position: center top;
    background-repeat: no-repeat;
    background-attachment: fixed;
    min-height: 100vh;
  }
`;

// ─── Main component ───────────────────────────────────────────────────────────

export default function Exam() {
  const [selected, setSelected] = useState<Record<number, ChoiceValue>>({});
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [animKey, setAnimKey] = useState(0);

  const total = questions.length;
  const isLast = step === total - 1;

  const handleSelect = (questionId: number, value: ChoiceValue) =>
    setSelected((prev) => ({ ...prev, [questionId]: value }));

  const navigate = (nextStep: number) => {
    setDirection(nextStep > step ? "forward" : "back");
    setAnimKey((k) => k + 1);
    setStep(nextStep);
  };

  const goNext = () => navigate(Math.min(step + 1, total - 1));
  const goPrev = () => navigate(Math.max(step - 1, 0));

  return (
    <>
      <style>{examStyles}</style>

      {/* Page background overlay */}

      <CourseHeader />

      <Box sx={{ position: "relative", zIndex: 1, maxWidth: 800, mx: "auto", px: { xs: 2, md: 4 }, py: 5 }}>
        <StepIndicator
          step={step}
          total={total}
          answeredCount={Object.keys(selected).length}
          selected={selected}
          onJump={navigate}
        />

        <QuestionCard
          key={animKey}
          q={questions[step]}
          selectedValue={selected[questions[step].id]}
          direction={direction}
          onSelect={handleSelect}
        />

        <NavButtons step={step} isLast={isLast} onPrev={goPrev} onNext={goNext} />
      </Box>
    </>
  );
}
