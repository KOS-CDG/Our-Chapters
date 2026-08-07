import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CoverPage } from "./pages/CoverPage";
import { ChapterListPage } from "./pages/ChapterListPage";
import { ChapterReaderPage } from "./pages/ChapterReaderPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CoverPage />} />
        <Route path="/chapters" element={<ChapterListPage />} />
        <Route path="/chapters/:slug" element={<ChapterReaderPage />} />
      </Routes>
    </BrowserRouter>
  );
}
