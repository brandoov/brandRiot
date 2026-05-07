import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import LolPage from "@/pages/LolPage";
import TftPage from "@/pages/TftPage";
import ValorantPage from "@/pages/ValorantPage";
import LorPage from "@/pages/LorPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="lol" element={<LolPage />} />
        <Route path="tft" element={<TftPage />} />
        <Route path="valorant" element={<ValorantPage />} />
        <Route path="lor" element={<LorPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
