import { useState, useRef, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCloudinaryUrl, setCustomPhoto, clearCustomPhoto, getCustomPhoto } from "../lib/cloudinary";
import type { Panel as PanelData } from "../types/chapter";

export interface FrameInspectorModalProps {
  panel: PanelData | null;
  onClose: () => void;
}

export function FrameInspectorModal({ panel, onClose }: FrameInspectorModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [customVersion, setCustomVersion] = useState(0);

  if (!panel) return null;

  const publicId = panel.cloudinaryPublicId;
  const currentPhoto = getCustomPhoto(publicId);
  const imageUrl = getCloudinaryUrl(publicId, { width: 1080, height: 1200 });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomPhoto(publicId, event.target.result as string);
          setCustomVersion((v) => v + 1);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomPhoto(publicId, event.target.result as string);
          setCustomVersion((v) => v + 1);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    clearCustomPhoto(publicId);
    setCustomVersion((v) => v + 1);
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          background: "rgba(30, 15, 25, 0.75)",
          backdropFilter: "blur(8px)",
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: 580,
            maxHeight: "90vh",
            overflowY: "auto",
            background: "rgb(var(--surface-raised))",
            borderRadius: 28,
            boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
            border: `3px solid rgb(var(--line))`,
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <span
                style={{
                  display: "inline-block",
                  background: "rgb(var(--line))",
                  color: "rgb(var(--accent))",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "1px",
                  padding: "4px 10px",
                  borderRadius: 999,
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                Frame Inspector • Panel {panel.id}
              </span>
              <h2 style={{ margin: 0, fontFamily: "var(--font-display)", color: "rgb(var(--ink))", fontSize: 22 }}>
                {panel.size.toUpperCase()} Height Frame ({panel.variant})
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 36,
                height: 36,
                borderRadius: 999,
                border: `2px solid rgb(var(--line))`,
                background: "rgb(var(--surface-sunken))",
                color: "rgb(var(--accent))",
                fontWeight: 800,
                fontSize: 18,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>

          {/* Frame Preview Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
              position: "relative",
              width: "100%",
              height: 280,
              borderRadius: 20,
              overflow: "hidden",
              border: dragOver ? `3px dashed rgb(var(--accent))` : `2px solid rgb(var(--line))`,
              background: dragOver ? "rgb(var(--surface-sunken))" : "#FAFAFC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              key={customVersion}
              src={imageUrl}
              alt={panel.alt}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />

            <div
              style={{
                position: "absolute",
                bottom: 12,
                left: 12,
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(6px)",
                padding: "6px 12px",
                borderRadius: 999,
                fontFamily: "var(--font-body)",
                fontSize: 12,
                fontWeight: 800,
                color: "rgb(var(--accent))",
                border: `1px solid rgb(var(--line))`,
              }}
            >
              {currentPhoto ? "📷 Custom Test Photo Active" : "⬜ White Image Frame Placeholder"}
            </div>
          </div>

          {/* Caption & Metadata details */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, background: "rgb(var(--surface-sunken))", padding: 16, borderRadius: 18 }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, color: "rgb(var(--ink-muted))" }}>
              Caption / Overlay:
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 800, color: "rgb(var(--ink))", fontStyle: "italic" }}>
              {panel.caption ? `"${panel.caption}"` : "(No overlay caption)"}
            </div>
          </div>

          {/* Controls: Test Photo Upload & Reset */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                flex: 1,
                minWidth: 180,
                background: "rgb(var(--accent))",
                color: "#fff",
                border: "none",
                borderRadius: 14,
                padding: "12px 20px",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "var(--shadow-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              📤 Upload Test Photo
            </button>

            {currentPhoto && (
              <button
                onClick={handleReset}
                style={{
                  background: "rgb(var(--surface-raised))",
                  color: "rgb(var(--accent))",
                  border: `2px solid rgb(var(--accent))`,
                  borderRadius: 14,
                  padding: "12px 18px",
                  fontFamily: "var(--font-body)",
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                🔄 Reset to White Frame
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
