import { Routes, Route } from "react-router";
import HeroPage from "../pages/HeroPage";
import RequestAccessPage from "../pages/RequestAccessPage";
import Dashboard from "../pages/Dashboard";
import ModelsPage from "../pages/ModelsPage";
import SettingsPage from "../pages/SettingsPage";
import DatabasePage from "../pages/DatabasePage";
import ResourcesPage from "../pages/ResourcesPage";
import Layout from "../components/Layout";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HeroPage />} />
      <Route path="/request-access" element={<RequestAccessPage />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/models" element={<ModelsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/databases" element={<DatabasePage />} />
        <Route path="/resources" element={<ResourcesPage />} />
      </Route>
    </Routes>
  );
}
