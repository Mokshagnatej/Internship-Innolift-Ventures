import { Link, useLocation } from "react-router";
import { Activity, BarChart2, Settings, Shield, Database, DollarSign, Cpu } from "lucide-react";
import { motion } from "motion/react";

export default function Navbar() {
  const location = useLocation();
  
  // Read user from local storage
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isViewer = user?.role === 'viewer';
  
  const allNavItems = [
    { name: "Live Telemetry", path: "/dashboard", icon: <Activity className="w-4 h-4" /> },
    { name: "ML Models", path: "/models", icon: <Shield className="w-4 h-4" /> },
    { name: "Databases", path: "/databases", icon: <Database className="w-4 h-4" /> },
    { name: "Server Metrics", path: "/resources", icon: <Cpu className="w-4 h-4" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="w-4 h-4" /> },
  ];

  // Filter out settings for viewers
  const navItems = isViewer ? allNavItems.filter(item => item.name !== "Settings") : allNavItems;

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0d1117]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00d9ff]/10 rounded-lg">
              <BarChart2 className="w-5 h-5 text-[#00d9ff]" />
            </div>
            <div className="flex items-center gap-2">
              <Link to="/" className="text-white font-semibold text-lg tracking-tight hover:text-[#00d9ff] transition-colors">
                CloudWatch Predictor
              </Link>
              {user && (
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border ${
                  isViewer 
                    ? 'bg-slate-500/10 border-slate-500/30 text-slate-400' 
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                }`}>
                  {user.role}
                </span>
              )}
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive ? "text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-[-15px] left-0 right-0 h-0.5 bg-[#00d9ff]"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
