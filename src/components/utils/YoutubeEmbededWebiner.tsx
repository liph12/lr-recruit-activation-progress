import { Box, Slider, Typography } from "@mui/material";
import { SaveRounded, CheckCircleRounded } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useAppProvider } from "../../providers/AppProvider";
import useAxios from "../../hooks/useAxios";

export default function YoutubeEmbedWebinar() {
  const { user, setUserData } = useAppProvider();
  const axios = useAxios();
  const playerRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [maxWatchedPercent, setMaxWatchedPercent] = useState(0);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const STORAGE_KEY = "webinar_percent";

  const saveProgressAsync = async () => {
    try {
      setSaving(true);

      const watched = maxWatchedPercent.toFixed(0);
      const response = await axios.post(
        "/agent/save-webinar-progress",
        { watched },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { data } = response.data;

      if (data) {
        setUserData(data);
        setIsSaved(true);

        const t = setTimeout(() => {
          setIsSaved(false);
          clearTimeout(t);
        }, 1000);
      }
    } catch (e) {
      // to do
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const savedPercent = Number(localStorage.getItem(STORAGE_KEY) || 0);

    if (user) {
      setMaxWatchedPercent(
        savedPercent > user?.webinar_progress
          ? savedPercent
          : user?.webinar_progress
      );
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    (window as any).onYouTubeIframeAPIReady = () => {
      playerRef.current = new (window as any).YT.Player(iframeRef.current, {
        videoId: "BRhXiqvyXVs",
        playerVars: {
          controls: 0,
          modestbranding: 1,
        },
        events: {
          onReady: (event: any) => {
            const videoDuration = event.target.getDuration();
            setDuration(videoDuration);

            if (savedPercent) {
              const startTime = (savedPercent / 100) * videoDuration;
              event.target.seekTo(startTime, true);
              setCurrentTime(startTime);
            }

            setInterval(() => {
              const time = event.target.getCurrentTime();
              setCurrentTime(time);

              const percent = (time / videoDuration) * 100;

              setMaxWatchedPercent((prev) => {
                if (percent > prev) {
                  localStorage.setItem(STORAGE_KEY, String(percent));
                  return percent;
                }
                return prev;
              });
            }, 500);
          },
        },
      });
    };
  }, []);

  const handleSeek = (_: any, value: number | number[]) => {
    const time = value as number;
    const allowedTime = (maxWatchedPercent / 100) * duration;

    if (time > allowedTime) {
      playerRef.current.seekTo(allowedTime, true);
      setCurrentTime(allowedTime);
      return;
    }

    playerRef.current.seekTo(time, true);
    setCurrentTime(time);
  };

  return (
    <Box>
      {/* ── Top bar: Save button + progress ── */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          px: { xs: 2, sm: 2.5 },
          py: 1.5,
          background: "rgba(255,255,255,0.03)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Save button */}
        <Box
          onClick={!saving ? saveProgressAsync : undefined}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.8,
            px: 2,
            py: 0.75,
            borderRadius: "100px",
            cursor: saving ? "default" : "pointer",
            background: isSaved
              ? "rgba(76,175,80,0.15)"
              : "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)",
            border: "1px solid",
            borderColor: isSaved
              ? "rgba(76,175,80,0.45)"
              : "rgba(255,255,255,0.18)",
            backdropFilter: "blur(8px)",
            transition: "all 0.3s ease",
            userSelect: "none",
            "&:hover": !saving
              ? {
                  background: isSaved
                    ? "rgba(76,175,80,0.22)"
                    : "rgba(255,255,255,0.16)",
                  borderColor: isSaved
                    ? "rgba(76,175,80,0.6)"
                    : "rgba(255,255,255,0.35)",
                }
              : {},
          }}
        >
          {saving ? (
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.25)",
                borderTopColor: "#ffffff",
                animation: "spin 0.7s linear infinite",
                "@keyframes spin": {
                  from: { transform: "rotate(0deg)" },
                  to: { transform: "rotate(360deg)" },
                },
              }}
            />
          ) : isSaved ? (
            <CheckCircleRounded sx={{ fontSize: 15, color: "#66bb6a" }} />
          ) : (
            <SaveRounded
              sx={{ fontSize: 15, color: "rgba(255,255,255,0.8)" }}
            />
          )}
          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: isSaved ? "#66bb6a" : "rgba(255,255,255,0.85)",
              textTransform: "uppercase",
              transition: "color 0.3s",
            }}
          >
            {saving ? "Saving…" : isSaved ? "Saved" : "Save Progress"}
          </Typography>
        </Box>

        {/* Divider dot */}
        <Box
          sx={{
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            flexShrink: 0,
          }}
        />

        {/* Watched % */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
          <Typography
            sx={{
              fontSize: "0.72rem",
              fontWeight: 600,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Watched
          </Typography>
          <Typography
            sx={{
              fontSize: "0.88rem",
              fontWeight: 800,
              color: maxWatchedPercent >= 100 ? "#66bb6a" : "#f0d98a",
              letterSpacing: "-0.01em",
              transition: "color 0.3s",
            }}
          >
            {maxWatchedPercent.toFixed(0)}%
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          position: "relative",
          paddingTop: "56.25%",
          width: "100%",
        }}
      >
        <Box
          ref={iframeRef}
          component="iframe"
          src="https://www.youtube.com/embed/BRhXiqvyXVs?enablejsapi=1&controls=0&modestbranding=1"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          sx={{
            position: "absolute",
            top: 5,
            left: 0,
            width: "100%",
            height: "100%",
            border: 0,
          }}
        />
        <Slider
          size="small"
          min={0}
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            width: "100%",
            color: "#f0d98a",
            height: 3,
            padding: "0 !important",
            "& .MuiSlider-thumb": {
              width: 12,
              height: 12,
              background: "#f0d98a",
              boxShadow: "0 0 6px rgba(240,217,138,0.6)",
              "&:hover": { boxShadow: "0 0 10px rgba(240,217,138,0.8)" },
            },
            "& .MuiSlider-track": {
              background: "linear-gradient(90deg, #c9a84c, #f0d98a)",
              border: "none",
            },
            "& .MuiSlider-rail": {
              background: "rgba(255,255,255,0.12)",
            },
          }}
        />
      </Box>
    </Box>
  );
}
