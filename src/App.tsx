import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { CoverPage } from "./pages/CoverPage";
import { ChapterListPage } from "./pages/ChapterListPage";
import { ChapterReaderPage } from "./pages/ChapterReaderPage";
import { PlaceholderToggle } from "./components/PlaceholderToggle";
import { PenguinWidget } from "./components/PenguinWidget";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
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
