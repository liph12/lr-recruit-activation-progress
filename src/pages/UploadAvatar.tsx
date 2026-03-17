import { useState, useCallback, useEffect } from "react";
import { UploadRounded, CloseRounded, CheckCircle } from "@mui/icons-material";
import { Box, Typography, Avatar, Alert, IconButton } from "@mui/material";
import axios from "axios";
import { useAppProvider } from "../providers/AppProvider";
import { keyframes } from "@mui/material";

const OUTFIT = "'Outfit', sans-serif";

const logoSlideIn = keyframes`
  from { opacity: 0; transform: translateX(30px); }
  to   { opacity: 1; transform: translateX(0); }
`;
const logoSlideOut = keyframes`
  from { opacity: 1; transform: translateX(0); }
  to   { opacity: 0; transform: translateX(-30px); }
`;
const LOGOS = [
  { src: "/images/rentph-logo-white.png", alt: "Rent.ph" },
  { src: "/images/lr-logo-white.png", alt: "Leuterio Realty & Brokerage" },
  { src: "/images/fh-logo-white.png", alt: "Filipino Homes" },
];

const softPulse = keyframes`
  0%, 100% { box-shadow: 0 8px 32px rgba(25,118,210,0.35); }
  50%       { box-shadow: 0 12px 48px rgba(25,118,210,0.55); }
`;

export default function UploadAvatar() {
  const { desktop, authToken, setUserData, user } = useAppProvider();
  const [logoIndex, setLogoIndex] = useState(0);
  const [logoAnim, setLogoAnim] = useState<"in" | "out">("in");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleFile = (selected: File) => {
    if (!selected.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    setError("");
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) handleFile(droppedFile);
  }, []);

  const handleUploadAsync = async () => {
    if (!file) {
      setError("Avatar is required.");
      return;
    }

    const URL = "https://api.leuteriorealty.com/lr/v2/public/api/upload-avatar";
    const fd = new FormData();

    if (user?.agent_id) {
      fd.append("photo", file);
      fd.append("memberId", user.agent_id.toString());
    }

    setUploading(true);
    try {
      const res = await axios.post(URL, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const { data } = res.data;
      setUserData(data.agent);
      setUploaded(true);
      setTimeout(() => setUploaded(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  // ── cycle logos on mobile ───────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setLogoAnim("out");
      setTimeout(() => {
        setLogoIndex((prev) => (prev + 1) % LOGOS.length);
        setLogoAnim("in");
      }, 420);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Box
        sx={{
          display: desktop ? "none" : "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: 12,
          left: 0,
          right: 0,
          zIndex: 2,
          width: "100%",
          overflow: "hidden",
          minHeight: 70,
          pointerEvents: "none",
        }}
      >
        <Box
          component="img"
          key={`logo-${logoIndex}`}
          src={LOGOS[logoIndex].src}
          alt={LOGOS[logoIndex].alt}
          sx={{
            height: 80,
            maxWidth: 230,
            width: "auto",
            objectFit: "contain",
            filter: "drop-shadow(0 2px 8px rgba(0,53,128,0.12))",
            animation:
              logoAnim === "in"
                ? `${logoSlideIn} 0.5s cubic-bezier(0.22,1,0.36,1) both`
                : `${logoSlideOut} 0.4s cubic-bezier(0.55,0,0.78,0) both`,
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: desktop ? 4 : 2.5,
          pt: desktop ? 5 : 15,
          background: "#071020",
          gap: 2,
        }}
      >
        <Typography variant={desktop ? "h3" : "h4"} color="#fff">
          Update your Profile
        </Typography>
        <Typography variant="h6" color="#fff">
          Drag & drop or click to upload (JPG, PNG)
        </Typography>
        <Box
          sx={{
            width: "100%",
            maxWidth: 400,
          }}
        >
          <Box
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            component="label"
            sx={{
              height: 180,
              border: "2px dashed",
              borderColor: dragging ? "#90caf9" : "#555",
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "0.2s",
              backgroundColor: dragging
                ? "rgba(144,202,249,0.08)"
                : "transparent",
              "&:hover": {
                borderColor: "#90caf9",
              },
            }}
          >
            <input
              type="file"
              hidden
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
            />

            {/* Preview inside the same upload box */}
            {preview ? (
              <>
                <Avatar
                  src={preview}
                  sx={{
                    width: 120,
                    height: 120,
                  }}
                />
                {/* Remove button */}
                <IconButton
                  onClick={() => {
                    setPreview(null);
                    setFile(null);
                  }}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    color: "#fff",
                    backgroundColor: "rgba(0,0,0,0.3)",
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
                  }}
                  size="small"
                >
                  <CloseRounded />
                </IconButton>
              </>
            ) : (
              <>
                <UploadRounded fontSize="large" sx={{ color: "#fff", mb: 1 }} />
                <Typography variant="body1" color="#fff">
                  {dragging ? "Drop your image here..." : "Click or drag file"}
                </Typography>
              </>
            )}
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
          <Box
            sx={{
              mt: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.2,
              width: "100%",
              py: 1.8,
              borderRadius: "14px",
              cursor: "pointer",
              userSelect: "none",
              background: "linear-gradient(135deg,#1e88e5,#0d47a1)",
              border: "1px solid rgba(126,184,255,0.3)",
              animation: `${softPulse} 3s ease-in-out infinite`,
            }}
            onClick={handleUploadAsync}
          >
            {uploaded ? (
              <CheckCircle fontSize="large" color="success" />
            ) : (
              <UploadRounded fontSize="large" sx={{ color: "#fff" }} />
            )}
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#ffffff",
                fontFamily: OUTFIT,
              }}
            >
              {uploading
                ? "Uploading..."
                : uploaded
                ? "Uploaded!"
                : "Upload Photo"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
}
