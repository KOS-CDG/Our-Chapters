import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CoverPage } from "./pages/CoverPage";
import { ChapterListPage } from "./pages/ChapterListPage";
import { ChapterReaderPage } from "./pages/ChapterReaderPage";
import { BackdropVideo } from "./components/BackdropVideo";
import { PlaceholderToggle } from "./components/PlaceholderToggle";
import { PenguinWidget } from "./components/PenguinWidget";

export function App() {
  return (
    <BrowserRouter>
      {/* Still mounted globally until the cover page owns it (C7). */}
      <BackdropVideo />

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
