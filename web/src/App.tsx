import { Navigate, Route, Routes } from "react-router-dom";
import HubLayout from "@/components/HubLayout";
import HomePage from "@/pages/HomePage";
import LolPage from "@/pages/LolPage";
import TftPage from "@/pages/TftPage";
import ValorantPage from "@/pages/ValorantPage";
import LorPage from "@/pages/LorPage";

export default function App() {
  return (
    <Routes>
      <Route element={<HubLayout />}>
        <Route index element={<HomePage />} />
      </Route>
      <Route path="lol" element={<LolPage />} />
      <Route path="tft" element={<TftPage />} />
      <Route path="valorant" element={<ValorantPage />} />
      <Route path="lor" element={<LorPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
