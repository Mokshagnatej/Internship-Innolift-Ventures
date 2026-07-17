import React, { useState } from "react";
import { motion } from "motion/react";
import { useNavigate, Link } from "react-router";
import { Activity, Shield, Zap } from "lucide-react";

export default function RequestAccessPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsRegistering(true);
    try {
      const response = await fetch("http://127.0.0.1:8081/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setError(data.error || "Failed to request access.");
      }
    } catch (err) {
      console.error("Registration failed:", err);
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#080b12] text-white overflow-hidden flex flex-col justify-center items-center font-sans">
      
      {/* Background animated gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[5%] left-[10%] w-[600px] h-[600px] bg-[#00d9ff] rounded-full blur-[130px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[5%] right-[10%] w-[700px] h-[700px] bg-[#a78bfa] rounded-full blur-[160px]"
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Hero Text */}
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-6 flex justify-start"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0d1117] border border-[#00d9ff]/30 shadow-[0_0_15px_rgba(0,217,255,0.2)] text-[#00d9ff] text-sm font-medium font-mono">
                <Activity className="w-4 h-4" />
                <span>Secure Access Portal</span>
              </div>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
            >
              Request <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d9ff] to-[#a78bfa]">Platform Access</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-xl text-slate-400 max-w-xl mb-10 leading-relaxed"
            >
              Create an account to gain Viewer access to the AWS CloudWatch Anomaly Predictor dashboard. 
              Monitor EC2 instances, RDS databases, and auto-scaling groups in real-time.
            </motion.p>
          </div>

          {/* Right Column: Register Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="w-full max-w-md mx-auto lg:ml-auto"
          >
            <div className="bg-[#0d1117]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#00d9ff] to-[#a78bfa] text-transparent bg-clip-text">Get Started</h2>
                <p className="text-slate-400 text-sm">Create your Viewer account</p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2 text-left">
                  <label className="text-sm font-medium text-slate-300">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-[#111827]/70 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#00d9ff] focus:ring-2 focus:ring-[#00d9ff]/20 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2 text-left">
                  <label className="text-sm font-medium text-slate-300">Create Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#111827]/70 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#00d9ff] focus:ring-2 focus:ring-[#00d9ff]/20 transition-all"
                  />
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm px-3 py-2.5 rounded-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    {error}
                  </motion.div>
                )}

                <button 
                  type="submit"
                  disabled={isRegistering}
                  className="w-full mt-2 bg-gradient-to-r from-[#00d9ff] to-[#3b82f6] text-[#030213] font-bold py-3 rounded-xl hover:shadow-[0_10px_20px_-10px_rgba(0,217,255,0.6)] hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isRegistering ? "Creating Account..." : "Request Access"}
                </button>

                <div className="text-center mt-2">
                  <p className="text-sm text-slate-400">
                    Already have an account? <Link to="/" className="text-[#00d9ff] hover:underline">Sign In</Link>
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Feature Cards Footer */}
      <div className="relative z-10 w-full px-6 pb-10 mt-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { icon: <Zap className="w-6 h-6 text-[#00d9ff]" />, title: "Live Telemetry", desc: "Sub-second regional metrics streaming" },
            { icon: <Activity className="w-6 h-6 text-[#f59e0b]" />, title: "ML Predictor", desc: "Random Forest anomaly detection" },
            { icon: <Shield className="w-6 h-6 text-[#34d399]" />, title: "Secure Access", desc: "Role-based Viewer restrictions" }
          ].map((feature, i) => (
            <div key={i} className="bg-[#0d1117]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex items-start gap-4 transition-colors hover:bg-[#0d1117]/90 hover:border-white/10">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
