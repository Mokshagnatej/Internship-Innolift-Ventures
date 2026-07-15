import { motion } from "motion/react";
import { Link } from "react-router";
import { Activity, Shield, Zap, ChevronRight } from "lucide-react";

export default function HeroPage() {
  return (
    <div className="relative min-h-screen bg-[#080b12] text-white overflow-hidden flex flex-col justify-center items-center">
      
      {/* Background animated gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-[#00d9ff] rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[10%] right-[20%] w-[600px] h-[600px] bg-[#a78bfa] rounded-full blur-[150px]"
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 text-center pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0d1117] border border-[#00d9ff]/30 shadow-[0_0_15px_rgba(0,217,255,0.2)] text-[#00d9ff] text-sm font-medium font-mono">
            <Activity className="w-4 h-4" />
            <span>AWS Infrastructure Monitoring</span>
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8"
        >
          CloudWatch <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d9ff] to-[#a78bfa]">Anomaly Predictor</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Seamlessly integrate with AWS CloudWatch to monitor EC2 instances, RDS databases, 
          and auto-scaling groups in real-time. Catch resource anomalies before they trigger outages.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
        >
          <Link to="/dashboard" className="inline-block">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#00d9ff] text-[#080b12] font-bold text-lg rounded-xl overflow-hidden transition-shadow hover:shadow-[0_0_40px_-10px_rgba(0,217,255,0.8)]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
              <span className="relative">Enter Dashboard</span>
              <ChevronRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
      
      {/* Feature Cards Footer */}
      <div className="relative z-10 w-full px-6 pb-12 mt-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { icon: <Zap className="w-6 h-6 text-[#00d9ff]" />, title: "Live Telemetry", desc: "Sub-second regional metrics streaming" },
            { icon: <Activity className="w-6 h-6 text-[#f59e0b]" />, title: "ML Predictor", desc: "Random Forest anomaly detection" },
            { icon: <Shield className="w-6 h-6 text-[#34d399]" />, title: "Dark Ops UI", desc: "Premium iOS-style interactions" }
          ].map((feature, i) => (
            <div key={i} className="bg-[#0d1117]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex items-start gap-4 transition-colors hover:bg-[#0d1117] hover:border-white/10">
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
