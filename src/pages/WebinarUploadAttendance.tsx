import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useAppProvider } from "../providers/AppProvider";
import {
  UploadRounded,
  CheckCircleRounded,
  ImageRounded,
  CalendarTodayRounded,
  NotesRounded,
  CropRounded,
  CloseRounded,
  ZoomInRounded,
  ZoomOutRounded,
} from "@mui/icons-material";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import confetti from "canvas-confetti";
import { keyframes } from "@mui/material";

// ── Keyframes ──────────────────────────────────────────────────────────────
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
`;
const shimmerLine = keyframes`
  from { width: 0; opacity: 0; }
  to   { width: 56px; opacity: 1; }
`;
const softPulse = keyframes`
  0%, 100% { box-shadow: 0 8px 32px rgba(25,118,210,0.3); }
  50%       { box-shadow: 0 12px 48px rgba(25,118,210,0.5); }
`;

const OUTFIT = "'Outfit', sans-serif";

// Inject Outfit font from Google Fonts
const outfitFontStyle = `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');`;

interface Confirmation {
  photo: File | null;
  attended: string | null;
  description: string;
}

// ── Crop Modal ─────────────────────────────────────────────────────────────
interface CropModalProps {
  src: string;
  onCrop: (file: File, preview: string) => void;
  onCancel: () => void;
}

function CropModal({ src, onCrop, onCancel }: CropModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });

  // Draw the image + crop overlay onto the canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const CROP = Math.min(W, H) * 0.78; // crop square size
    const cx = (W - CROP) / 2;
    const cy = (H - CROP) / 2;

    // Scale image to fill canvas at zoom=1
    const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight) * zoom;
    const iw = img.naturalWidth * scale;
    const ih = img.naturalHeight * scale;
    const ix = (W - iw) / 2 + offset.x;
    const iy = (H - ih) / 2 + offset.y;

    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(img, ix, iy, iw, ih);

    // Dark overlay outside crop area
    ctx.fillStyle = "rgba(7,16,32,0.72)";
    ctx.fillRect(0, 0, W, H);

    // Cut out the crop square — show image inside
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(cx, cy, CROP, CROP, 12);
    ctx.clip();
    ctx.drawImage(img, ix, iy, iw, ih);
    ctx.restore();

    // Crop border
    ctx.strokeStyle = "rgba(126,184,255,0.8)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(cx, cy, CROP, CROP, 12);
    ctx.stroke();

    // Rule-of-thirds grid
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(cx + (CROP / 3) * i, cy);
      ctx.lineTo(cx + (CROP / 3) * i, cy + CROP);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, cy + (CROP / 3) * i);
      ctx.lineTo(cx + CROP, cy + (CROP / 3) * i);
      ctx.stroke();
    }

    // Corner handles
    const HL = 18;
    ctx.strokeStyle = "#7eb8ff";
    ctx.lineWidth = 3;
    const corners = [
      [cx, cy, 1, 1],
      [cx + CROP, cy, -1, 1],
      [cx, cy + CROP, 1, -1],
      [cx + CROP, cy + CROP, -1, -1],
    ];
    corners.forEach(([x, y, dx, dy]) => {
      ctx.beginPath();
      ctx.moveTo(x + dx * HL, y);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y + dy * HL);
      ctx.stroke();
    });
  }, [zoom, offset]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      draw();
    };
    img.src = src;
  }, [src]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Mouse / touch drag
  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    dragStart.current = {
      mx: e.clientX,
      my: e.clientY,
      ox: offset.x,
      oy: offset.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setOffset({
      x: dragStart.current.ox + (e.clientX - dragStart.current.mx),
      y: dragStart.current.oy + (e.clientY - dragStart.current.my),
    });
  };
  const onPointerUp = () => setDragging(false);

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.min(4, Math.max(0.5, z - e.deltaY * 0.001)));
  };

  // Apply crop → produce a File
  const applyCrop = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const W = canvas.width;
    const H = canvas.height;
    const CROP = Math.min(W, H) * 0.78;
    const cx = (W - CROP) / 2;
    const cy = (H - CROP) / 2;

    const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight) * zoom;
    const iw = img.naturalWidth * scale;
    const ih = img.naturalHeight * scale;
    const ix = (W - iw) / 2 + offset.x;
    const iy = (H - ih) / 2 + offset.y;

    // Output at 900×900
    const OUT = 900;
    const out = document.createElement("canvas");
    out.width = OUT;
    out.height = OUT;
    const ctx2 = out.getContext("2d")!;

    const srcX = (cx - ix) / scale;
    const srcY = (cy - iy) / scale;
    const srcS = CROP / scale;

    ctx2.drawImage(img, srcX, srcY, srcS, srcS, 0, 0, OUT, OUT);

    out.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
        const preview = out.toDataURL("image/jpeg", 0.92);
        onCrop(file, preview);
      },
      "image/jpeg",
      0.92,
    );
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(4,9,20,0.92)",
        backdropFilter: "blur(16px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, sm: 3 },
        fontFamily: OUTFIT,
      }}
    >
      <style>{outfitFontStyle}</style>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 2.5,
          width: "100%",
          maxWidth: 580,
        }}
      >
        <CropRounded sx={{ color: "#7eb8ff", fontSize: 22 }} />
        <Typography
          sx={{
            fontFamily: OUTFIT,
            fontWeight: 800,
            color: "#ffffff",
            fontSize: "1.1rem",
            flex: 1,
          }}
        >
          Crop Your Photo
        </Typography>
        <Box
          onClick={onCancel}
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            "&:hover": { background: "rgba(255,255,255,0.13)" },
          }}
        >
          <CloseRounded sx={{ fontSize: 18, color: "rgba(255,255,255,0.7)" }} />
        </Box>
      </Box>

      {/* Canvas */}
      <Box
        sx={{
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
          cursor: dragging ? "grabbing" : "grab",
          touchAction: "none",
          width: "100%",
          maxWidth: 580,
        }}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <canvas
          ref={canvasRef}
          width={580}
          height={460}
          style={{ display: "block", width: "100%", height: "auto" }}
        />
      </Box>

      {/* Hint */}
      <Typography
        sx={{
          fontSize: "0.72rem",
          color: "rgba(255,255,255,0.35)",
          mt: 1.5,
          mb: 2,
        }}
      >
        Drag to reposition · Scroll or pinch to zoom
      </Typography>

      {/* Zoom controls + buttons */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          width: "100%",
          maxWidth: 580,
          flexWrap: "wrap",
        }}
      >
        {/* Zoom strip */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
          <Box
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
            sx={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              "&:hover": { background: "rgba(255,255,255,0.13)" },
            }}
          >
            <ZoomOutRounded
              sx={{ fontSize: 18, color: "rgba(255,255,255,0.7)" }}
            />
          </Box>
          <Box
            sx={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: "rgba(255,255,255,0.10)",
              position: "relative",
              cursor: "pointer",
            }}
            onClick={(e) => {
              const rect = (e.target as HTMLElement).getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              setZoom(0.5 + pct * 3.5);
            }}
          >
            <Box
              sx={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: `${((zoom - 0.5) / 3.5) * 100}%`,
                background: "linear-gradient(90deg, #1e88e5, #7eb8ff)",
                borderRadius: 2,
                transition: "width 0.1s",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                transform: "translate(-50%,-50%)",
                left: `${((zoom - 0.5) / 3.5) * 100}%`,
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "#7eb8ff",
                boxShadow: "0 0 8px rgba(126,184,255,0.6)",
                transition: "left 0.1s",
              }}
            />
          </Box>
          <Box
            onClick={() => setZoom((z) => Math.min(4, z + 0.1))}
            sx={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              "&:hover": { background: "rgba(255,255,255,0.13)" },
            }}
          >
            <ZoomInRounded
              sx={{ fontSize: 18, color: "rgba(255,255,255,0.7)" }}
            />
          </Box>
        </Box>

        {/* Cancel */}
        <Box
          onClick={onCancel}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.8,
            px: 2.5,
            py: 1.1,
            borderRadius: "12px",
            cursor: "pointer",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            "&:hover": { background: "rgba(255,255,255,0.10)" },
          }}
        >
          <Typography
            sx={{
              fontFamily: OUTFIT,
              fontWeight: 700,
              fontSize: "0.82rem",
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "0.06em",
            }}
          >
            Cancel
          </Typography>
        </Box>

        {/* Apply crop */}
        <Box
          onClick={applyCrop}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2.5,
            py: 1.1,
            borderRadius: "12px",
            cursor: "pointer",
            background: "linear-gradient(135deg, #1e88e5 0%, #0d47a1 100%)",
            border: "1px solid rgba(100,180,255,0.3)",
            boxShadow: "0 4px 20px rgba(25,118,210,0.4)",
            "&:hover": {
              boxShadow: "0 6px 28px rgba(25,118,210,0.6)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.25s ease",
          }}
        >
          <CropRounded sx={{ fontSize: 17, color: "#ffffff" }} />
          <Typography
            sx={{
              fontFamily: OUTFIT,
              fontWeight: 800,
              fontSize: "0.82rem",
              color: "#ffffff",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Apply Crop
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function WebinarUploadAttendance() {
  const { desktop, setUserData, authToken, user } = useAppProvider();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [confirmation, setConfirmation] = useState<Confirmation>({
    photo: null,
    attended: null,
    description: "",
  });
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null); // raw src for cropper
  const [pendingFile, setPendingFile] = useState<File | null>(null); // original file name

  // ── Live canvas background ─────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
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
        x: 0.2,
        y: 0.18,
        r: 0.55,
        ox: 0,
        oy: 0,
        speed: 0.000035,
        color: [0, 85, 179] as [number, number, number],
      },
      {
        x: 0.78,
        y: 0.72,
        r: 0.5,
        ox: 1,
        oy: 2,
        speed: 0.000025,
        color: [0, 55, 140] as [number, number, number],
      },
      {
        x: 0.55,
        y: 0.45,
        r: 0.42,
        ox: 2,
        oy: 1,
        speed: 0.00002,
        color: [220, 235, 255] as [number, number, number],
      },
      {
        x: 0.15,
        y: 0.78,
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

  const fireworkAnimation = () => {
    const duration = 3000,
      animEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 9999,
    };
    const rnd = (a: number, b: number) => Math.random() * (b - a) + a;
    const iv: any = setInterval(() => {
      const left = animEnd - Date.now();
      if (left <= 0) return clearInterval(iv);
      const pc = 50 * (left / duration);
      confetti({
        ...defaults,
        particleCount: pc,
        origin: { x: rnd(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount: pc,
        origin: { x: rnd(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  // Open cropper when a file is picked
  const openCropper = (file: File) => {
    setPendingFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setCropSrc(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  // After crop is applied
  const handleCropDone = (croppedFile: File, preview: string) => {
    // Preserve original filename
    const named = new File([croppedFile], pendingFile?.name ?? "photo.jpg", {
      type: "image/jpeg",
    });
    setConfirmation((prev) => ({ ...prev, photo: named }));
    setPreviewUrl(preview);
    setCropSrc(null);
    setPendingFile(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const key = e.target.name;
    setConfirmation((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) openCropper(file);
    e.target.value = ""; // reset so same file can be re-picked
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png"))
      openCropper(file);
  };

  const uploadAsync = async () => {
    if (!confirmation.photo || !confirmation.attended) return;
    const URL =
      "https://api.leuteriorealty.com/lr/v2/public/api/upload-nao-proof-of-attendance";
    const fd = new FormData();
    fd.append("photo", confirmation.photo);
    fd.append("attended", confirmation.attended);
    fd.append("description", confirmation.description);
    if (user) fd.append("memberId", user.agent_id.toString());
    setConfirming(true);
    try {
      const res = await axios.post(URL, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const { data } = res.data;
      setUserData(data.agent);
      setConfirmed(true);
      fireworkAnimation();
      setTimeout(() => setConfirmed(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setConfirming(false);
    }
  };

  const isReady = !!confirmation.attended && !!confirmation.photo;

  return (
    <>
      {/* Crop modal overlay */}
      {cropSrc && (
        <CropModal
          src={cropSrc}
          onCrop={handleCropDone}
          onCancel={() => {
            setCropSrc(null);
            setPendingFile(null);
          }}
        />
      )}

      <Box
        sx={{
          minHeight: "100.5vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          background: "#071020",
          px: { xs: 2, sm: 4, md: 6 },
          py: { xs: 4, sm: 5 },
          boxSizing: "border-box",
          fontFamily: OUTFIT,
        }}
      >
        <style>{outfitFontStyle}</style>
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        <Grid
          container
          spacing={{ xs: 3, md: 5 }}
          sx={{
            maxWidth: 1800,
            width: "100%",
            position: "relative",
            zIndex: 1,
            alignItems: "stretch",
          }}
        >
          {/* ══════ LEFT — form ══════ */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ animation: `${fadeInUp} 0.6s ease both` }}>
              {/* Pill */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.8,
                  mb: 2,
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
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "0.7rem",
                    fontFamily: OUTFIT,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#7eb8ff",
                    whiteSpace: "nowrap",
                  }}
                >
                  NAO Attendance
                </Typography>
              </Box>

              {/* Headline */}
              <Typography
                sx={{
                  fontSize: {
                    xs: "clamp(2rem,9vw,2.8rem)",
                    sm: "clamp(2.4rem,6vw,3.4rem)",
                    md: "clamp(2.2rem,4vw,3rem)",
                  },
                  fontFamily: OUTFIT,
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  color: "#ffffff",
                  mb: 0.3,
                }}
              >
                Submit Your
              </Typography>
              <Typography
                sx={{
                  fontSize: {
                    xs: "clamp(2rem,9vw,2.8rem)",
                    sm: "clamp(2.4rem,6vw,3.4rem)",
                    md: "clamp(2.2rem,4vw,3rem)",
                  },
                  fontFamily: OUTFIT,
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  backgroundImage:
                    "linear-gradient(90deg,#7eb8ff 0%,#ffffff 35%,#f0d98a 50%,#ffffff 65%,#7eb8ff 100%)",
                  backgroundSize: "600px 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: `${shimmer} 3.5s linear infinite`,
                }}
              >
                Proof of Attendance
              </Typography>

              {/* Gold line */}
              <Box
                sx={{
                  height: "2px",
                  background:
                    "linear-gradient(90deg,#c9a84c,#f0d98a,transparent)",
                  mt: 1.5,
                  mb: 3,
                  animation: `${shimmerLine} 1s cubic-bezier(0.22,1,0.36,1) 0.4s both`,
                  width: 0,
                }}
              />

              {/* File note */}
              <Typography
                sx={{
                  fontSize: "0.78rem",
                  color: "rgba(255,255,255,0.42)",
                  mb: 3,
                  lineHeight: 1.6,
                }}
              >
                Accepted:{" "}
                <Box
                  component="span"
                  sx={{ color: "#f0d98a", fontWeight: 600 }}
                >
                  JPG, PNG
                </Box>{" "}
                · Max size:{" "}
                <Box
                  component="span"
                  sx={{ color: "#f0d98a", fontWeight: 600 }}
                >
                  5MB
                </Box>
              </Typography>

              {/* Date */}
              <Box
                sx={{ mb: 3, animation: `${fadeInUp} 0.65s ease 0.1s both` }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    mb: 1.2,
                  }}
                >
                  <CalendarTodayRounded
                    sx={{ fontSize: 15, color: "#7eb8ff" }}
                  />
                  <Typography
                    sx={{
                      fontSize: { xs: "0.8rem", md: "0.85rem" },
                      fontFamily: OUTFIT,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#7eb8ff",
                    }}
                  >
                    Date Attended
                  </Typography>
                </Box>
                <Box
                  component="input"
                  type="date"
                  name="attended"
                  onChange={handleChange}
                  sx={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    borderRadius: "14px",
                    color: "#ffffff",
                    fontSize: { xs: "0.95rem", md: "1rem" },
                    fontFamily: OUTFIT,
                    fontWeight: 500,
                    px: "18px",
                    py: "14px",
                    outline: "none",
                    colorScheme: "dark",
                    transition:
                      "border-color 0.25s,background 0.25s,box-shadow 0.25s",
                    "&:focus": {
                      borderColor: "rgba(126,184,255,0.55)",
                      background: "rgba(255,255,255,0.09)",
                      boxShadow: "0 0 0 3px rgba(126,184,255,0.10)",
                    },
                    "&::-webkit-calendar-picker-indicator": {
                      filter: "invert(1)",
                      opacity: 0.5,
                      cursor: "pointer",
                    },
                  }}
                />
              </Box>

              {/* Description */}
              <Box
                sx={{ mb: 3.5, animation: `${fadeInUp} 0.65s ease 0.16s both` }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    mb: 1.2,
                  }}
                >
                  <NotesRounded sx={{ fontSize: 15, color: "#7eb8ff" }} />
                  <Typography
                    sx={{
                      fontSize: { xs: "0.8rem", md: "0.85rem" },
                      fontFamily: OUTFIT,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#7eb8ff",
                    }}
                  >
                    Description{" "}
                    <Box
                      component="span"
                      sx={{
                        color: "rgba(255,255,255,0.35)",
                        fontFamily: OUTFIT,
                        fontWeight: 500,
                        textTransform: "none",
                        letterSpacing: 0,
                        fontSize: "0.78rem",
                      }}
                    >
                      (optional)
                    </Box>
                  </Typography>
                </Box>
                <Box
                  component="textarea"
                  name="description"
                  onChange={handleChange}
                  placeholder="Enter details about your attendance…"
                  rows={5}
                  sx={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    borderRadius: "14px",
                    color: "#ffffff",
                    fontSize: { xs: "0.95rem", md: "1rem" },
                    fontFamily: OUTFIT,
                    fontWeight: 400,
                    lineHeight: 1.65,
                    px: "18px",
                    py: "14px",
                    outline: "none",
                    resize: "none",
                    transition:
                      "border-color 0.25s,background 0.25s,box-shadow 0.25s",
                    "&::placeholder": { color: "rgba(255,255,255,0.25)" },
                    "&:focus": {
                      borderColor: "rgba(126,184,255,0.55)",
                      background: "rgba(255,255,255,0.09)",
                      boxShadow: "0 0 0 3px rgba(126,184,255,0.10)",
                    },
                  }}
                />
              </Box>

              {/* Submit */}
              <Box sx={{ animation: `${fadeInUp} 0.65s ease 0.22s both` }}>
                <Box
                  onClick={isReady && !confirming ? uploadAsync : undefined}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1.2,
                    py: 1.8,
                    px: 3,
                    borderRadius: "14px",
                    cursor: isReady && !confirming ? "pointer" : "not-allowed",
                    userSelect: "none",
                    background: confirmed
                      ? "linear-gradient(135deg,rgba(76,175,80,0.25) 0%,rgba(46,125,50,0.2) 100%)"
                      : isReady
                        ? "linear-gradient(135deg,#1e88e5 0%,#0d47a1 100%)"
                        : "rgba(255,255,255,0.05)",
                    border: "1px solid",
                    borderColor: confirmed
                      ? "rgba(76,175,80,0.45)"
                      : isReady
                        ? "rgba(100,180,255,0.35)"
                        : "rgba(255,255,255,0.08)",
                    opacity: !isReady && !confirmed ? 0.6 : 1,
                    transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                    animation:
                      isReady && !confirmed && !confirming
                        ? `${softPulse} 3s ease-in-out infinite`
                        : "none",
                    boxShadow:
                      isReady && !confirmed
                        ? "0 8px 32px rgba(25,118,210,0.35)"
                        : "none",
                    "&:hover":
                      isReady && !confirming
                        ? {
                            transform: "translateY(-2px)",
                            boxShadow: "0 12px 40px rgba(25,118,210,0.5)",
                          }
                        : {},
                    "&:active": isReady ? { transform: "translateY(0)" } : {},
                  }}
                >
                  {confirming ? (
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        border: "2.5px solid rgba(255,255,255,0.25)",
                        borderTopColor: "#ffffff",
                        animation: "spin 0.7s linear infinite",
                        "@keyframes spin": {
                          from: { transform: "rotate(0deg)" },
                          to: { transform: "rotate(360deg)" },
                        },
                      }}
                    />
                  ) : confirmed ? (
                    <CheckCircleRounded
                      sx={{ fontSize: 20, color: "#66bb6a" }}
                    />
                  ) : (
                    <UploadRounded sx={{ fontSize: 20, color: "#ffffff" }} />
                  )}
                  <Typography
                    sx={{
                      fontFamily: OUTFIT,
                      fontWeight: 800,
                      fontSize: { xs: "0.88rem", md: "0.95rem" },
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: confirmed ? "#66bb6a" : "#ffffff",
                      transition: "color 0.3s",
                    }}
                  >
                    {confirming
                      ? "Uploading…"
                      : confirmed
                        ? "Upload Successful"
                        : "Submit Attendance"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* ══════ RIGHT — upload + preview ══════ */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                height: "100%",
                minHeight: { xs: 260, md: 500 },
                animation: `${fadeInUp} 0.7s ease 0.12s both`,
              }}
            >
              <Box
                component="label"
                onDragOver={(e: React.DragEvent) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                  minHeight: { xs: 260, md: 500 },
                  borderRadius: "20px",
                  border: "1.5px dashed",
                  borderColor: dragOver
                    ? "rgba(126,184,255,0.7)"
                    : confirmation.photo
                      ? "rgba(76,175,80,0.45)"
                      : "rgba(255,255,255,0.14)",
                  background: dragOver
                    ? "rgba(126,184,255,0.06)"
                    : confirmation.photo
                      ? "transparent"
                      : "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(8px)",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "rgba(126,184,255,0.5)",
                    background: previewUrl
                      ? "transparent"
                      : "rgba(255,255,255,0.05)",
                  },
                }}
              >
                {previewUrl ? (
                  <>
                    <Box
                      component="img"
                      src={previewUrl}
                      alt="Preview"
                      sx={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "20px",
                      }}
                    />
                    {/* Hover overlay */}
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(7,16,32,0.55)",
                        borderRadius: "20px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1.5,
                        opacity: 0,
                        transition: "opacity 0.3s",
                        "&:hover": { opacity: 1 },
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 1.5 }}>
                        {/* Re-crop */}
                        <Box
                          onClick={(e) => {
                            e.preventDefault();
                            if (pendingFile)
                              openCropper(
                                URL.createObjectURL(pendingFile) as any,
                              );
                          }}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.8,
                            px: 2,
                            py: 1,
                            borderRadius: "10px",
                            background: "rgba(255,255,255,0.12)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            cursor: "pointer",
                            "&:hover": { background: "rgba(255,255,255,0.2)" },
                          }}
                        >
                          <CropRounded
                            sx={{ fontSize: 16, color: "#7eb8ff" }}
                          />
                          <Typography
                            sx={{
                              fontSize: "0.78rem",
                              fontFamily: OUTFIT,
                              fontWeight: 700,
                              color: "#ffffff",
                            }}
                          >
                            Re-crop
                          </Typography>
                        </Box>
                        {/* Replace */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.8,
                            px: 2,
                            py: 1,
                            borderRadius: "10px",
                            background: "rgba(255,255,255,0.12)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            "&:hover": { background: "rgba(255,255,255,0.2)" },
                          }}
                        >
                          <UploadRounded
                            sx={{
                              fontSize: 16,
                              color: "rgba(255,255,255,0.8)",
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: "0.78rem",
                              fontFamily: OUTFIT,
                              fontWeight: 700,
                              color: "#ffffff",
                            }}
                          >
                            Replace
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    {/* File badge */}
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 12,
                        left: 12,
                        right: 12,
                        background: "rgba(7,16,32,0.75)",
                        backdropFilter: "blur(8px)",
                        borderRadius: "10px",
                        px: 1.5,
                        py: 0.8,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <CheckCircleRounded
                        sx={{ fontSize: 16, color: "#66bb6a", flexShrink: 0 }}
                      />
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          fontFamily: OUTFIT,
                          fontWeight: 600,
                          color: "#ffffff",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flex: 1,
                        }}
                      >
                        {confirmation.photo?.name}
                      </Typography>
                      <CropRounded
                        sx={{ fontSize: 13, color: "#7eb8ff", flexShrink: 0 }}
                      />
                      <Typography
                        sx={{
                          fontSize: "0.65rem",
                          color: "#7eb8ff",
                          fontFamily: OUTFIT,
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        Cropped
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ textAlign: "center", px: 3 }}>
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 2.5,
                      }}
                    >
                      <ImageRounded
                        sx={{ fontSize: 34, color: "rgba(255,255,255,0.3)" }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: OUTFIT,
                        fontWeight: 700,
                        color: "#ffffff",
                        fontSize: "0.95rem",
                        mb: 0.8,
                      }}
                    >
                      Drop your photo here
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.78rem",
                        color: "rgba(255,255,255,0.38)",
                        mb: 2,
                      }}
                    >
                      or click to browse — photo will be cropped
                    </Typography>
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.8,
                        px: 2,
                        py: 0.7,
                        borderRadius: "100px",
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.14)",
                      }}
                    >
                      <CropRounded sx={{ fontSize: 14, color: "#7eb8ff" }} />
                      <Typography
                        sx={{
                          fontSize: "0.72rem",
                          fontFamily: OUTFIT,
                          fontWeight: 600,
                          color: "rgba(255,255,255,0.6)",
                          letterSpacing: "0.06em",
                        }}
                      >
                        JPG or PNG · crop before upload
                      </Typography>
                    </Box>
                  </Box>
                )}

                <input
                  type="file"
                  name="photo"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileInput}
                  style={{ display: "none" }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
