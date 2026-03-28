import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import {
  EmojiEventsRounded,
  ReplayRounded,
  VisibilityRounded,
  SentimentDissatisfiedRounded,
} from "@mui/icons-material";
import type { ChoiceValue } from "../types/course";
import confetti from "canvas-confetti";

export type ExamResult = {
  question: number;
  answer: ChoiceValue;
  correct: boolean;
};

type Props = {
  open: boolean;
  total: number;
  results: ExamResult[];
  onClose: () => void;
  onRetake: () => void;
  onNextModule?: () => void;
  /** Optional explicit passing score (e.g. 12 for 12/15). If omitted, defaults to 7 when total=10, otherwise ceil(total*0.7). */
  passScore?: number;
};

export default function ExamResultModal({
  open,
  total,
  results,
  onClose,
  onRetake,
  onNextModule,
  passScore,
}: Props) {
  const [showDetails, setShowDetails] = useState(false);

  const score = useMemo(
    () => results.filter((r) => r.correct).length,
    [results]
  );
  const wrong = total - score;
  const required = useMemo(() => {
    if (typeof passScore === "number" && !Number.isNaN(passScore))
      return passScore;
    // Preserve historical behavior: 7/10 when total is 10; else 70% rounded up
    return total === 10 ? 7 : Math.ceil(total * 0.7);
  }, [passScore, total]);
  const passed = score >= required;

  // Subtle celebration when passed
  useEffect(() => {
    if (!open || !passed) return;
    const burst = () =>
      confetti({
        particleCount: 70,
        spread: 60,
        startVelocity: 32,
        gravity: 0.9,
        origin: { y: 0.25 },
        colors: ["#f0d98a", "#c9a84c", "#7eb8ff", "#1e88e5"],
      });
    const t1 = setTimeout(burst, 220);
    const t2 = setTimeout(burst, 520);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [open, passed]);

  const OUTFIT = "'Outfit', sans-serif";

  const styles = `
    @keyframes popIn { from { transform: scale(.96); opacity:.0 } to { transform: scale(1); opacity:1 } }
    @keyframes softPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(30,136,229,.35) } 60% { box-shadow: 0 0 0 14px rgba(30,136,229,0) } }
    .result-shimmer { background: linear-gradient(90deg,#7eb8ff, #ffffff 40%, #f0d98a 50%, #ffffff 60%, #7eb8ff); background-size: 600px 100%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 3.5s linear infinite }
    @keyframes shimmer { 0% { background-position: -600px 0 } 100% { background-position: 600px 0 } }
  `;

  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        onClose();
      }}
      fullWidth
      maxWidth="sm"
      scroll="body"
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          overflow: "hidden",
          borderRadius: 3,
          background:
            "linear-gradient(180deg, rgba(18,40,80,1) 0%, rgba(14,34,68,1) 100%)",
          border: "1px solid rgba(126,184,255,0.22)",
          color: "#fff",
          animation: "popIn .18s ease-out",
          position: "relative",
          "::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: passed
              ? "radial-gradient(800px 200px at 10% -10%, rgba(240,217,138,.18), transparent 60%), radial-gradient(800px 200px at 110% -10%, rgba(126,184,255,.16), transparent 60%)"
              : "radial-gradient(800px 200px at 10% -10%, rgba(255,97,97,.1), transparent 60%)",
          },
          fontFamily: OUTFIT,
        },
      }}
      slotProps={{ backdrop: { sx: { backgroundColor: "rgba(0,0,0,.45)" } } }}
    >
      <style>{styles}</style>

      <DialogTitle sx={{ pb: 1.5 }}>
        <Box display="flex" alignItems="center" gap={1.2}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: passed
                ? "linear-gradient(135deg,#c9a84c,#f0d98a)"
                : "linear-gradient(135deg,#ef5350,#c62828)",
              color: passed ? "#0b1222" : "#fff",
              boxShadow: passed
                ? "0 6px 22px rgba(201,168,76,.42)"
                : "0 6px 20px rgba(239,83,80,.35)",
            }}
          >
            {passed ? (
              <EmojiEventsRounded fontSize="small" />
            ) : (
              <SentimentDissatisfiedRounded fontSize="small" />
            )}
          </Box>
          <Typography
            fontWeight={900}
            sx={{
              letterSpacing: "-.01em",
              textTransform: "uppercase",
              fontSize: { xs: "1.15rem", sm: "1.3rem" },
            }}
          >
            {passed ? "You Passed!".toUpperCase() : "You Failed".toUpperCase()}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ overflowY: "visible" }}>
        {/* Score */}
        <Box display="flex" alignItems="baseline" gap={1} mb={1}>
          <Typography
            variant="h3"
            fontWeight={900}
            sx={{
              background: passed
                ? "linear-gradient(135deg,#f0d98a,#c9a84c)"
                : "linear-gradient(135deg,#ff8a80,#ff5252)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1,
            }}
          >
            {score}/{total}
          </Typography>
          <Typography color="rgba(255,255,255,.65)">score</Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{ color: "rgba(255,255,255,.7)", mb: 2 }}
        >
          {passed
            ? `Great work — you met the passing score (${required}/${total}).`
            : `You'll need ${required}/${total} to pass. Give it another try.`}
        </Typography>

        {/* Progress bar */}
        <Box mb={2}>
          <Box
            sx={{
              height: 10,
              borderRadius: 999,
              background: "rgba(255,255,255,.08)",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,.12)",
            }}
          >
            <Box
              sx={{
                width: `${(score / total) * 100}%`,
                height: "100%",
                background: passed
                  ? "linear-gradient(90deg,#1e88e5,#7eb8ff)"
                  : "linear-gradient(90deg,#ef5350,#ff8a80)",
                boxShadow: passed ? "0 0 12px rgba(30,136,229,.6)" : "none",
                transition: "width .4s ease",
              }}
            />
          </Box>
        </Box>

        {/* Summary cards */}
        <Stack direction="row" spacing={2} mb={showDetails ? 2 : 0}>
          <Box
            flex={1}
            p={1.5}
            borderRadius={2}
            sx={{
              background: "rgba(76,175,80,.08)",
              border: "1px solid rgba(76,175,80,.25)",
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,.65)" }}
            >
              Correct
            </Typography>
            <Typography fontWeight={900}>{score}</Typography>
          </Box>
          <Box
            flex={1}
            p={1.5}
            borderRadius={2}
            sx={{
              background: "rgba(244,67,54,.08)",
              border: "1px solid rgba(244,67,54,.25)",
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,.65)" }}
            >
              Wrong
            </Typography>
            <Typography fontWeight={900}>{wrong}</Typography>
          </Box>
        </Stack>

        {showDetails && (
          <Box>
            <Divider sx={{ my: 1.5, borderColor: "rgba(255,255,255,.1)" }} />
            <Typography variant="subtitle2" fontWeight={800} gutterBottom>
              Question Results
            </Typography>
            <Stack spacing={1.2}>
              {results.map((r) => (
                <Box
                  key={r.question}
                  display="flex"
                  justifyContent="space-between"
                  px={1}
                  py={0.75}
                  borderRadius={1.5}
                  sx={{
                    background: r.correct
                      ? "linear-gradient(90deg, rgba(76,175,80,.12), rgba(76,175,80,.06))"
                      : "linear-gradient(90deg, rgba(244,67,54,.12), rgba(244,67,54,.06))",
                    border: r.correct
                      ? "1px solid rgba(76,175,80,.25)"
                      : "1px solid rgba(244,67,54,.25)",
                  }}
                >
                  <Typography fontWeight={800}>Q{r.question}</Typography>
                  <Typography
                    color={r.correct ? "#66bb6a" : "#ef5350"}
                    fontWeight={800}
                  >
                    {r.correct ? "Correct" : "Wrong"} ({r.answer})
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          variant="text"
          startIcon={<VisibilityRounded />}
          onClick={() => setShowDetails((s) => !s)}
          sx={{ color: "#7eb8ff" }}
        >
          {showDetails ? "Hide Result" : "View Result"}
        </Button>
        <Box flexGrow={1} />
        {passed ? (
          <Button
            variant="contained"
            onClick={onNextModule}
            sx={{
              background: "linear-gradient(135deg,#c9a84c,#f0d98a)",
              color: "#0b1222",
              fontWeight: 800,
              "&:hover": { filter: "brightness(1.05)" },
            }}
          >
            Next Module
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={onRetake}
            sx={{
              background: "linear-gradient(135deg,#1e88e5,#0d47a1)",
              boxShadow: "0 6px 20px rgba(25,118,210,.45)",
              fontWeight: 800,
              "&:hover": { filter: "brightness(1.05)" },
            }}
            endIcon={<ReplayRounded />}
          >
            Retake
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
