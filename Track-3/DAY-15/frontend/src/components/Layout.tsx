import { Outlet } from "react-router";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#080b12] text-white">
      <Navbar />
      <main className="pt-16 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
