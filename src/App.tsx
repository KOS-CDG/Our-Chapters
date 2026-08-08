import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CoverPage } from "./pages/CoverPage";
import { ChapterListPage } from "./pages/ChapterListPage";
import { ChapterReaderPage } from "./pages/ChapterReaderPage";
import { PlaceholderToggle } from "./components/PlaceholderToggle";
import { PenguinWidget } from "./components/PenguinWidget";

export function App() {
  return (
    <BrowserRouter>
      {/* Background Video */}
      <div style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: -10, overflow: "hidden" }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{ position: "absolute", minWidth: "100%", minHeight: "100%", width: "auto", height: "auto", objectFit: "cover", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        >
          <source src="/videos/birthday-vertical.mp4" type="video/mp4" />
        </video>
      </div>

      <div style={{ position: "relative", zIndex: 0 }}>
        <Routes>
          <Route path="/" element={<CoverPage />} />
          <Route path="/chapters" element={<ChapterListPage />} />
          <Route path="/chapters/:slug" element={<ChapterReaderPage />} />
        </Routes>
        {import.meta.env.DEV && <PlaceholderToggle />}
        <PenguinWidget />
      </div>
    </BrowserRouter>
  );
}

