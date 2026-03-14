import { Box, Slider, Typography, Divider } from "@mui/material";
import { SaveRounded, CheckCircleRounded } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useAppProvider } from "../../providers/AppProvider";
import StyledButton from "./StyledButton";
import useAxios from "../../hooks/useAxios";

export default function YoutubeEmbedWebinar() {
  const { desktop, user, setUserData } = useAppProvider();
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
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <StyledButton
          variant="contained"
          size="small"
          startIcon={isSaved ? <CheckCircleRounded /> : <SaveRounded />}
          loading={saving}
          disabled={saving}
          onClick={saveProgressAsync}
          color={isSaved ? "success" : "primary"}
        >
          {isSaved ? "Saved" : "Save"}
        </StyledButton>
        <Divider sx={{ height: 20 }} orientation="vertical" />
        <Typography sx={{ mt: desktop ? 0 : 1 }}>
          Watched: {maxWatchedPercent.toFixed(0)}%
        </Typography>
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
            height: "95%",
            border: 0,
          }}
        />
        <Slider
          size="medium"
          min={0}
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          sx={{ position: "absolute", bottom: desktop ? 0 : -10 }}
          color="error"
        />
      </Box>
    </Box>
  );
}
