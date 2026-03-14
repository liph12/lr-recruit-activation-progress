import { Typography, Box, keyframes } from "@mui/material";
import { CheckCircle, PlayArrow } from "@mui/icons-material";
import { useAppProvider } from "../providers/AppProvider";
import useAxios from "../hooks/useAxios";
import { useState } from "react";

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(36px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(-1deg); }
  50%      { transform: translateY(-14px) rotate(1deg); }
`;

const softPulse = keyframes`
  0%, 100% { box-shadow: 0 8px 32px rgba(25,118,210,0.25), inset 0 1px 0 rgba(255,255,255,0.15); }
  50%      { box-shadow: 0 12px 48px rgba(25,118,210,0.40), inset 0 1px 0 rgba(255,255,255,0.15); }
`;

const iconBounce = keyframes`
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.12); }
`;

export default function WebinarConfirmation() {
  const axios = useAxios();
  const { desktop, setUserData } = useAppProvider();
  const [hoveredBtn, setHoveredBtn] = useState<"yes" | "no" | null>(null);
  const [loading, setLoading] = useState<"yes" | "no" | null>(null);

  const handleConfirmAsync = async (status: "yes" | "no") => {
    try {
      setLoading(status);
      setUserData(null);
      const response = await axios.post(
        "/agent/confirm-nao-attendance",
        { status },
        { headers: { "Content-Type": "application/json" } }
      );
      const { data } = response.data;
      setUserData(data);
    } catch (e) {
      // TODO
    } finally {
      setLoading(null);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        minHeight: desktop ? "82vh" : "auto",
        alignItems: "center",
        px: desktop ? 4 : 2.5,
        pt: desktop ? 2 : 3,
        pb: desktop ? 4 : 3,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Ambient background ── */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: desktop ? 600 : 300,
            height: desktop ? 600 : 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(25,118,210,0.06) 0%, transparent 60%)",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: "-15%",
            left: "-10%",
            width: desktop ? 500 : 250,
            height: desktop ? 500 : 250,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(25,118,210,0.04) 0%, transparent 60%)",
          },
        }}
      />

      {/* ── Hero image — desktop only ── */}
      {/* {desktop && (
        <Box
          sx={{
            animation: `${float} 4s ease-in-out infinite, ${fadeInUp} 0.65s ease-out`,
            mb: 2.5,
            zIndex: 1,
          }}
        >
          <img
            src="/images/notify-phone-icon.png"
            width={200}
            height="auto"
            alt="Orientation"
            style={{
              filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))",
            }}
          />
        </Box>
      )} */}

      {/* ── Badge — mobile only (replaces image) ── */}
      {/* {!desktop && (
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.6,
            bgcolor: "primary.main",
            color: "#fff",
            px: 2,
            py: 0.5,
            borderRadius: 6,
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            mb: 2,
            zIndex: 1,
            animation: `${fadeInUp} 0.5s ease-out`,
          }}
        >
          Action Required
        </Box>
      )} */}

      {/* ── Heading ── */}
      <Box
        sx={{
          textAlign: "center",
          zIndex: 1,
          mb: desktop ? 1.5 : 1,
          animation: `${fadeInUp} 0.65s ease-out 0.1s both`,
        }}
      >
        <Typography
          sx={{
            fontSize: desktop
              ? "clamp(2.2rem, 4.5vw, 3.5rem)"
              : "clamp(1.6rem, 7vw, 2.2rem)",
            fontWeight: 900,
            lineHeight: 1.12,
            letterSpacing: "-0.025em",
            color: "text.primary",
          }}
        >
          Have you attended the
        </Typography>
        <Typography
          sx={{
            fontSize: desktop
              ? "clamp(2.2rem, 4.5vw, 3.5rem)"
              : "clamp(1.6rem, 7vw, 2.2rem)",
            fontWeight: 900,
            lineHeight: 1.12,
            letterSpacing: "-0.025em",
            background:
              "linear-gradient(135deg, #1976d2 0%, #0d47a1 60%, #1565c0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          New Agent's Orientation?
        </Typography>
      </Box>

      {/* ── Subtitle pill ── */}
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: desktop ? 2 : 0.8,
          bgcolor: "rgba(25,118,210,0.06)",
          border: "1px solid rgba(25,118,210,0.10)",
          borderRadius: 8,
          px: desktop ? 3 : 1.5,
          py: 0.8,
          mb: desktop ? 5 : 3,
          zIndex: 1,
          animation: `${fadeInUp} 0.65s ease-out 0.18s both`,
          flexWrap: "nowrap",
          whiteSpace: "nowrap",
        }}
      >
        <Typography
          sx={{
            fontSize: desktop ? "0.88rem" : "0.68rem",
            color: "text.secondary",
            fontWeight: 500,
          }}
        >
          🎥 <strong>NAW</strong> = Video
        </Typography>
        <Box
          sx={{
            width: 3,
            height: 3,
            borderRadius: "50%",
            bgcolor: "text.disabled",
            flexShrink: 0,
          }}
        />
        <Typography
          sx={{
            fontSize: desktop ? "0.88rem" : "0.68rem",
            color: "text.secondary",
            fontWeight: 500,
          }}
        >
          🤝 <strong>NAO</strong> = Face-to-Face
        </Typography>
      </Box>

      {/* ── CTA Cards ── */}
      <Box
        sx={{
          display: "flex",
          flexDirection: desktop ? "row" : "column-reverse",
          gap: desktop ? 3 : 1.5,
          width: "100%",
          maxWidth: desktop ? 680 : "100%",
          zIndex: 1,
          animation: `${fadeInUp} 0.65s ease-out 0.26s both`,
          alignItems: desktop ? "stretch" : "stretch",
        }}
      >
        {/* ▶ NOT YET — Secondary (LEFT desktop / BOTTOM mobile) */}
        <Box
          onClick={() => !loading && handleConfirmAsync("no")}
          onMouseEnter={() => setHoveredBtn("no")}
          onMouseLeave={() => setHoveredBtn(null)}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: desktop ? "column" : "row",
            alignItems: "center",
            justifyContent: desktop ? "center" : "flex-start",
            gap: desktop ? 1 : 2,
            py: desktop ? 5 : 2.2,
            px: desktop ? 3 : 2.5,
            borderRadius: desktop ? "20px" : "16px",
            cursor: loading ? "default" : "pointer",
            bgcolor: "background.paper",
            border: "2px solid",
            borderColor:
              hoveredBtn === "no" ? "primary.main" : "rgba(0,0,0,0.08)",
            boxShadow:
              hoveredBtn === "no"
                ? "0 16px 48px rgba(25,118,210,0.15), 0 0 0 1px rgba(25,118,210,0.1)"
                : "0 2px 12px rgba(0,0,0,0.04)",
            transform:
              hoveredBtn === "no"
                ? "translateY(-6px) scale(1.02)"
                : "none",
            transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
            userSelect: "none",
            "&:active": { transform: "translateY(1px) scale(0.98)" },
          }}
        >
          <Box
            sx={{
              width: desktop ? 64 : 48,
              height: desktop ? 64 : 48,
              borderRadius: "50%",
              bgcolor:
                hoveredBtn === "no"
                  ? "rgba(25,118,210,0.08)"
                  : "rgba(0,0,0,0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background-color 0.3s",
              animation:
                hoveredBtn === "no"
                  ? `${iconBounce} 0.5s ease`
                  : "none",
            }}
          >
            <PlayArrow
              sx={{
                fontSize: desktop ? 34 : 24,
                color:
                  hoveredBtn === "no" ? "primary.main" : "text.secondary",
                transition: "color 0.3s",
              }}
            />
          </Box>
          <Box sx={{ textAlign: desktop ? "center" : "left" }}>
            <Typography
              sx={{
                fontSize: desktop
                  ? "clamp(1.2rem, 2.2vw, 1.75rem)"
                  : "1.1rem",
                fontWeight: 800,
                lineHeight: 1.2,
                color:
                  hoveredBtn === "no" ? "primary.main" : "text.primary",
                transition: "color 0.3s",
              }}
            >
              {loading === "no" ? "Redirecting..." : "Not Yet"}
            </Typography>
            <Typography
              sx={{
                fontSize: desktop
                  ? "clamp(0.75rem, 1.1vw, 0.9rem)"
                  : "0.75rem",
                color: "text.secondary",
                fontWeight: 500,
                mt: 0.3,
              }}
            >
              Continue watching the NAW
            </Typography>
          </Box>
        </Box>

        {/* ✅ YES — Primary CTA (RIGHT desktop / TOP mobile) */}
        <Box
          onClick={() => !loading && handleConfirmAsync("yes")}
          onMouseEnter={() => setHoveredBtn("yes")}
          onMouseLeave={() => setHoveredBtn(null)}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: desktop ? "column" : "row",
            alignItems: "center",
            justifyContent: desktop ? "center" : "flex-start",
            gap: desktop ? 1 : 2,
            py: desktop ? 5 : 2.5,
            px: desktop ? 3 : 2.5,
            borderRadius: desktop ? "20px" : "16px",
            cursor: loading ? "default" : "pointer",
            background:
              "linear-gradient(150deg, #1e88e5 0%, #1565c0 50%, #0d47a1 100%)",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
            animation:
              hoveredBtn !== "yes"
                ? `${softPulse} 3s ease-in-out infinite`
                : "none",
            boxShadow:
              hoveredBtn === "yes"
                ? "0 16px 56px rgba(25,118,210,0.50)"
                : undefined,
            transform:
              hoveredBtn === "yes"
                ? "translateY(-6px) scale(1.02)"
                : "none",
            transition:
              "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease",
            userSelect: "none",
            "&:active": { transform: "translateY(1px) scale(0.98)" },
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.12) 55%, transparent 60%)",
              backgroundSize: "250% 100%",
              backgroundPosition:
                hoveredBtn === "yes" ? "100% 0" : "0% 0",
              transition: "background-position 0.6s ease",
              borderRadius: "inherit",
              pointerEvents: "none",
            },
          }}
        >
          <Box
            sx={{
              width: desktop ? 64 : 48,
              height: desktop ? 64 : 48,
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              position: "relative",
              animation:
                hoveredBtn === "yes"
                  ? `${iconBounce} 0.5s ease`
                  : "none",
            }}
          >
            <CheckCircle sx={{ fontSize: desktop ? 34 : 24 }} />
          </Box>
          <Box
            sx={{
              textAlign: desktop ? "center" : "left",
              position: "relative",
            }}
          >
            <Typography
              sx={{
                fontSize: desktop
                  ? "clamp(1.2rem, 2.2vw, 1.75rem)"
                  : "1.15rem",
                fontWeight: 800,
                lineHeight: 1.2,
              }}
            >
              {loading === "yes" ? "Confirming..." : "Yes, I Have"}
            </Typography>
            <Typography
              sx={{
                fontSize: desktop
                  ? "clamp(0.75rem, 1.1vw, 0.9rem)"
                  : "0.75rem",
                opacity: 0.75,
                fontWeight: 500,
                mt: 0.3,
              }}
            >
              I already attended the NAO
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Bottom hint ── */}
      <Typography
        sx={{
          mt: desktop ? 4 : 2.5,
          fontSize: "clamp(0.7rem, 1vw, 0.82rem)",
          color: "text.disabled",
          textAlign: "center",
          zIndex: 1,
          animation: `${fadeInUp} 0.65s ease-out 0.35s both`,
        }}
      >
        Select one to continue
      </Typography>
    </Box>
  );
}