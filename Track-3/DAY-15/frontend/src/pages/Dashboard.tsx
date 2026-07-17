import { useState, useRef, useEffect, useMemo } from "react";
import { motion, useSpring, useTransform, animate, AnimatePresence } from "motion/react";
import {
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  AlertTriangle,
  Bell,
  Settings,
  TrendingUp,
  Zap,
  Shield,
  ChevronUp,
  ChevronDown,
  Globe,
  Check,
  User,
  LogOut,
} from "lucide-react";

// ─── Web Audio snap sound & Haptics ──────────────────────────────────────────

function playSnapSound(on: boolean) {
  if ((window as any).__soundEnabled === false) return;

  try {
    // Attempt haptic feedback on supported devices
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(on ? [15] : [10]);
    }

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (on) {
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    } else {
      osc.frequency.setValueAtTime(700, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    }

    osc.type = "sine";
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
    setTimeout(() => ctx.close(), 200);
  } catch (_) {}
}

// ─── iOS Toggle (Enhanced) ───────────────────────────────────────────────────

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  color?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

function Toggle({ checked, onChange, color = "#00d9ff", size = "md", disabled = false }: ToggleProps) {
  const dims = {
    sm: { w: 36, h: 22, thumb: 18, pad: 2 },
    md: { w: 51, h: 31, thumb: 27, pad: 2 },
    lg: { w: 62, h: 38, thumb: 34, pad: 2 },
  }[size];

  const travel = dims.w - dims.thumb - dims.pad * 2;

  const spring = useSpring(checked ? travel : 0, {
    stiffness: 700,
    damping: 25,
    mass: 0.5,
  });

  const scaleX = useTransform(spring, [0, travel / 2, travel], [1, 1.3, 1]);
  const scaleY = useTransform(spring, [0, travel / 2, travel], [1, 0.85, 1]);

  useEffect(() => {
    spring.set(checked ? travel : 0);
  }, [checked, travel, spring]);

  const bgProgress = useTransform(spring, [0, travel], [0, 1]);
  const bgColor = useTransform(bgProgress, (p) => {
    const offR = 25, offG = 30, offB = 40;
    const onHex = color.replace("#", "");
    const onR = parseInt(onHex.slice(0, 2), 16);
    const onG = parseInt(onHex.slice(2, 4), 16);
    const onB = parseInt(onHex.slice(4, 6), 16);
    const r = Math.round(offR + (onR - offR) * p);
    const g = Math.round(offG + (onG - offG) * p);
    const b = Math.round(offB + (onB - offB) * p);
    return `rgb(${r},${g},${b})`;
  });

  return (
    <motion.button
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          const next = !checked;
          playSnapSound(next);
          onChange(next);
        }
      }}
      style={{
        width: dims.w,
        height: dims.h,
        borderRadius: dims.h / 2,
        backgroundColor: bgColor as any,
        padding: dims.pad,
        display: "flex",
        alignItems: "center",
        border: "1px solid rgba(255,255,255,0.05)",
        cursor: disabled ? "not-allowed" : "pointer",
        position: "relative",
        flexShrink: 0,
        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)",
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
      aria-checked={checked}
      role="switch"
    >
      <motion.div
        style={{
          width: dims.thumb,
          height: dims.thumb,
          borderRadius: "50%",
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 5px rgba(0,0,0,0.4), 0 1px 1px rgba(0,0,0,0.2), inset 0 -1px 1px rgba(0,0,0,0.1)",
          x: spring,
          scaleX,
          scaleY,
          transformOrigin: checked ? "right center" : "left center",
        }}
      />
    </motion.button>
  );
}

// ─── Animated Number ─────────────────────────────────────────────────────────

function AnimatedNumber({ value }: { value: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(parseFloat(node.textContent || "0"), value, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate: (v) => {
        if (node) node.textContent = v.toFixed(1);
      }
    });
    return () => controls.stop();
  }, [value]);

  return <span ref={nodeRef} className="font-mono text-3xl font-semibold text-foreground" />;
}

// ─── Sparkline data generator ─────────────────────────────────────────────────

function generateTimeSeries(base: number, variance: number, points = 40, spike?: number) {
  return Array.from({ length: points }, (_, i) => {
    const anomaly = spike && i === spike ? base * 1.7 : 0;
    const noise = (Math.random() - 0.5) * variance;
    const trend = Math.sin(i * 0.3) * variance * 0.4;
    return {
      t: i,
      v: Math.max(0, Math.min(100, base + noise + trend + anomaly)),
    };
  });
}

// ─── Dynamic status helpers ────────────────────────────────────────────────────

type Status = "normal" | "warning" | "critical";

function statusOf(v: number): Status {
  if (v >= 80) return "critical";
  if (v >= 65) return "warning";
  return "normal";
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded px-2 py-1 text-xs font-mono text-foreground">
      {payload[0].value.toFixed(1)}%
    </div>
  );
}

// ─── Metric Card ──────────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  icon: React.ReactNode;
  value: number;
  unit: string;
  data: { t: number; v: number }[];
  color: string;
  status: Status;
  delta: number;
  alertEnabled: boolean;
  onAlertToggle: (v: boolean) => void;
  predEnabled: boolean;
  onPredToggle: (v: boolean) => void;
  compact: boolean;
}

function MetricCard({
  label, icon, value, unit, data, color, status, delta,
  alertEnabled, onAlertToggle, predEnabled, onPredToggle, compact,
}: MetricCardProps) {
  const statusColor = {
    normal: "#34d399",
    warning: "#f59e0b",
    critical: "#f43f5e",
  }[status];

  const statusLabel = {
    normal: "Nominal",
    warning: "Elevated",
    critical: "Anomaly",
  }[status];

  const px = compact ? "px-3" : "px-4";

  return (
    <div
      className="rounded-xl border border-border bg-card flex flex-col overflow-hidden"
      style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.05)` }}
    >
      {/* Header */}
      <div className={`flex items-center justify-between ${px} ${compact ? "pt-2.5 pb-1" : "pt-4 pb-2"}`}>
        <div className="flex items-center gap-2">
          <div style={{ color }} className="opacity-90">{icon}</div>
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="text-[10px] font-mono px-1.5 py-0.5 rounded"
            style={{ backgroundColor: `${statusColor}18`, color: statusColor }}
          >
            {statusLabel}
          </span>
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: statusColor }}
          />
        </div>
      </div>

      {/* Value */}
      <div className={`${px} pb-1 flex items-end gap-2`}>
        <AnimatedNumber value={value} />
        <span className="text-muted-foreground text-sm mb-1">{unit}</span>
        <div className={`flex items-center gap-0.5 mb-1 ml-auto text-xs font-mono ${delta > 0 ? "text-rose-400" : "text-emerald-400"}`}>
          {delta > 0 ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {Math.abs(delta).toFixed(1)}%
        </div>
      </div>

      {/* Sparkline */}
      <div className={`${compact ? "h-10" : "h-16"} px-1`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={1.5}
              fill={`url(#grad-${label})`}
              dot={false}
              isAnimationActive={false}
            />
            <Tooltip content={<ChartTooltip />} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Toggle Controls */}
      {!compact && (
        <div className="border-t border-border px-4 py-3 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-foreground font-medium">Anomaly Alerts</div>
              <div className="text-[10px] text-muted-foreground font-mono">Push notification on spike</div>
            </div>
            <Toggle checked={alertEnabled} onChange={onAlertToggle} color="#f59e0b" size="sm" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-foreground font-medium">Predictive Mode</div>
              <div className="text-[10px] text-muted-foreground font-mono">ML forecast enabled</div>
            </div>
            <Toggle checked={predEnabled} onChange={onPredToggle} color={color} size="sm" />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Alert Row ────────────────────────────────────────────────────────────────

interface AlertRowProps {
  label: string;
  desc: string;
  severity: "info" | "warn" | "crit";
  time: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  compact: boolean;
}

function AlertRow({ label, desc, severity, time, enabled, onToggle, compact }: AlertRowProps) {
  const sev = {
    info: { color: "#00d9ff", bg: "#00d9ff18", dot: "bg-cyan-400" },
    warn: { color: "#f59e0b", bg: "#f59e0b18", dot: "bg-amber-400" },
    crit: { color: "#f43f5e", bg: "#f43f5e18", dot: "bg-rose-400" },
  }[severity];

  return (
    <div className={`flex items-center gap-4 ${compact ? "py-2" : "py-3"} border-b border-border last:border-0`}>
      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sev.dot}`} />
      <div className="flex-1 min-w-0">
        <div className="text-sm text-foreground font-medium truncate">{label}</div>
        {!compact && <div className="text-[11px] text-muted-foreground font-mono truncate">{desc}</div>}
      </div>
      <div className="text-[10px] font-mono text-muted-foreground flex-shrink-0">{time}</div>
      <Toggle checked={enabled} onChange={onToggle} color={sev.color} size="sm" />
    </div>
  );
}

// ─── Region Selector ────────────────────────────────────────────────────────────

interface RegionSelectorProps {
  regions: typeof REGIONS;
  value: string;
  onChange: (id: string) => void;
}

function RegionSelector({ regions, value, onChange }: RegionSelectorProps) {
  const [open, setOpen] = useState(false);
  const current = regions.find((r) => r.id === value)!;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded border transition-colors ${
          open ? "border-cyan-500/50 text-cyan-400 bg-cyan-500/10" : "border-border text-muted-foreground hover:text-foreground"
        }`}
      >
        <Globe size={13} />
        <span className="text-xs font-mono">{current.id}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-xl z-50 overflow-hidden"
              style={{ boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)" }}
            >
              <div className="px-4 py-3 border-b border-border bg-muted/20">
                <span className="text-sm font-semibold">Select Region</span>
              </div>
              <div className="p-1.5 flex flex-col">
                {regions.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      playSnapSound(true);
                      onChange(r.id);
                      setOpen(false);
                    }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      r.id === value ? "bg-cyan-500/10" : "hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-foreground">{r.id}</span>
                        {r.id === value && <Check size={12} className="text-cyan-400" />}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">{r.label} · {r.instances} instances</div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────

const METRICS = [
  { id: "cpu", label: "CPU Usage", icon: <Cpu size={14} />, baseVal: 67.4, unit: "%", color: "#00d9ff", spike: 28 },
  { id: "mem", label: "Memory", icon: <Activity size={14} />, baseVal: 82.1, unit: "%", color: "#a78bfa", spike: 35 },
  { id: "net", label: "Network I/O", icon: <Wifi size={14} />, baseVal: 34.9, unit: "MB/s", color: "#34d399", spike: undefined },
  { id: "disk", label: "Disk I/O", icon: <HardDrive size={14} />, baseVal: 51.7, unit: "%", color: "#f59e0b", spike: 22 },
] as const;

const REGIONS = [
  { id: "us-east-1", label: "US East (N. Virginia)", cluster: "prod-api", instances: 6, factor: 1.0 },
  { id: "us-west-2", label: "US West (Oregon)", cluster: "prod-api-west", instances: 4, factor: 0.82 },
  { id: "eu-west-1", label: "EU (Ireland)", cluster: "prod-eu", instances: 8, factor: 1.14 },
  { id: "eu-central-1", label: "EU (Frankfurt)", cluster: "prod-eu-central", instances: 5, factor: 0.95 },
  { id: "ap-southeast-1", label: "Asia Pacific (Singapore)", cluster: "prod-apac", instances: 3, factor: 0.7 },
] as const;

const ALERTS_INIT = [
  { id: "a1", label: "CPU threshold breach", desc: "i-09f3d2a1 exceeded 85% for 3m", severity: "crit" as const, time: "2m ago", enabled: true },
  { id: "a2", label: "Memory pressure detected", desc: "prod-db-02 RSS at 14.2 GB / 16 GB", severity: "crit" as const, time: "7m ago", enabled: true },
  { id: "a3", label: "Unusual network egress", desc: "us-east-1 outbound spike 4.2×", severity: "warn" as const, time: "15m ago", enabled: true },
  { id: "a4", label: "Disk queue depth elevated", desc: "vol-0a9f1c3e4 avg QD > 32", severity: "warn" as const, time: "31m ago", enabled: false },
  { id: "a5", label: "Prediction: CPU spike in ~8m", desc: "Model confidence 94% — i-09f3d2a1", severity: "info" as const, time: "just now", enabled: true },
  { id: "a6", label: "Auto-scaling triggered", desc: "ASG prod-api scaled from 4→6 nodes", severity: "info" as const, time: "3m ago", enabled: false },
];

const PRED_MODELS = [
  { id: "lstm", label: "LSTM Anomaly Model", sub: "Trained on 90d rolling window", color: "#a78bfa" },
  { id: "thresh", label: "Threshold Baselines", sub: "Dynamic ±2σ band detection", color: "#00d9ff" },
  { id: "seasonal", label: "Seasonal Decomp", sub: "Weekly cycle correction", color: "#34d399" },
  { id: "corr", label: "Cross-metric Correlation", sub: "CPU↔Mem causality graph", color: "#f59e0b" },
];

function buildRegionData(factor: number) {
  return Object.fromEntries(
    METRICS.map((m) => [m.id, generateTimeSeries(Math.min(98, m.baseVal * factor), 15, 40, m.spike)])
  ) as Record<string, { t: number; v: number }[]>;
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const navigate = () => window.location.href = "/login";
  const [alertToggles, setAlertToggles] = useState<Record<string, boolean>>(
    () => Object.fromEntries(ALERTS_INIT.map((a) => [a.id, a.enabled]))
  );
  const [metricAlerts, setMetricAlerts] = useState<Record<string, boolean>>(
    () => Object.fromEntries(METRICS.map((m) => [m.id + "_alert", true]))
  );
  const [metricPred, setMetricPred] = useState<Record<string, boolean>>(
    () => Object.fromEntries(METRICS.map((m) => [m.id + "_pred", m.id === "cpu" || m.id === "mem"]))
  );
  const [predModels, setPredModels] = useState<Record<string, boolean>>(
    () => ({ lstm: true, thresh: true, seasonal: false, corr: true })
  );
  const [demoToggles, setDemoToggles] = useState<Record<string, boolean>>(
    () => ({ sm: false, md: true, lg: true })
  );

  const [globalMonitor, setGlobalMonitor] = useState(true);
  const [autoRemediate, setAutoRemediate] = useState(false);
  const [mlEnabled, setMlEnabled] = useState(true);
  const [autoScaling, setAutoScaling] = useState(false);
  const [anomalyMode, setAnomalyMode] = useState(false);
  
  // Read user role
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isViewer = user?.role === 'viewer';
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [region, setRegion] = useState<string>("us-east-1");

  const currentRegion = REGIONS.find((r) => r.id === region)!;

  const [seriesData, setSeriesData] = useState<Record<string, { t: number; v: number }[]>>(
    () => buildRegionData(1.0)
  );
  const [currentVals, setCurrentVals] = useState<Record<string, number>>(() =>
    Object.fromEntries(METRICS.map((m) => [m.id, m.baseVal]))
  );

  // Regenerate all data when region changes
  function changeRegion(id: string) {
    const r = REGIONS.find((x) => x.id === id)!;
    setRegion(id);
    const fresh = buildRegionData(r.factor);
    setSeriesData(fresh);
    setCurrentVals(
      Object.fromEntries(METRICS.map((m) => [m.id, fresh[m.id][fresh[m.id].length - 1].v]))
    );
  }

  useEffect(() => {
    if (!globalMonitor) return;

    const interval = setInterval(() => {
      setSeriesData((prev) => {
        const next = { ...prev };
        const newVals: Record<string, number> = {};

        for (const m of METRICS) {
          const oldSeries = prev[m.id];
          const lastT = oldSeries[oldSeries.length - 1].t;
          const noise = (Math.random() - 0.5) * 10;
          const trend = Math.sin(lastT * 0.3) * 5;
          const val = Math.max(0, Math.min(100, m.baseVal * currentRegion.factor + noise + trend));

          next[m.id] = [...oldSeries.slice(1), { t: lastT + 1, v: val }];
          newVals[m.id] = val;
        }

        setCurrentVals(newVals);
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [globalMonitor, currentRegion.factor]);

  // Derived summary counts (dynamic + reactive to region / live data)
  const summary = useMemo(() => {
    let anomalies = 0, warnings = 0;
    for (const m of METRICS) {
      const s = statusOf(currentVals[m.id] ?? m.baseVal);
      if (s === "critical") anomalies++;
      else if (s === "warning") warnings++;
    }
    const predictions = mlEnabled
      ? Object.values(metricPred).filter(Boolean).length
      : 0;
    return { anomalies, warnings, predictions };
  }, [currentVals, mlEnabled, metricPred]);

  // Compact mode spacing helpers
  const mainPad = compactMode ? "px-0 py-4 space-y-4" : "px-0 py-8 space-y-8";
  const gridGap = compactMode ? "gap-2.5" : "gap-4";

  return (
    <div
      className={`min-h-screen bg-background text-foreground ${highContrast ? "hc-mode" : ""}`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* High-contrast overrides: brighter borders + text for accessibility */}
      <style>{`
        .hc-mode {
          --border: rgba(255,255,255,0.32);
          --muted-foreground: #c3cfe0;
          --foreground: #ffffff;
          --card: #10151f;
        }
        .hc-mode .bg-card { box-shadow: 0 0 0 1px rgba(255,255,255,0.12) !important; }
      `}</style>

      {/* Top bar */}
      <header
        className="border-b border-border flex items-center justify-between px-6 py-3 sticky top-0 z-40"
        style={{ backgroundColor: highContrast ? "rgba(6,9,15,0.98)" : "rgba(8,11,18,0.92)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-6 h-6 rounded flex items-center justify-center"
            style={{ backgroundColor: "#00d9ff18", border: "1px solid #00d9ff40" }}
          >
            <Zap size={13} className="text-cyan-400" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">CloudWatch</span>
          <span className="text-muted-foreground text-sm">/</span>
          <span className="text-xs font-mono text-muted-foreground">Anomaly Predictor</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Global controls */}
          <div className="hidden md:flex items-center gap-5">
            <div className="flex items-center gap-2.5">
              <span className={`text-xs font-mono ${isViewer ? 'text-slate-500' : 'text-muted-foreground'}`}>Monitor</span>
              <Toggle checked={globalMonitor} onChange={setGlobalMonitor} color="#00d9ff" size="sm" disabled={isViewer} />
            </div>
            <div className="flex items-center gap-2.5">
              <span className={`text-xs font-mono ${isViewer ? 'text-slate-500' : 'text-muted-foreground'}`}>ML Engine</span>
              <Toggle checked={mlEnabled} onChange={setMlEnabled} color="#a78bfa" size="sm" disabled={isViewer} />
            </div>
            <div className="flex items-center gap-2.5">
              <span className={`text-xs font-mono ${isViewer ? 'text-slate-500' : 'text-muted-foreground'}`}>Auto-remediate</span>
              <Toggle checked={autoRemediate} onChange={setAutoRemediate} color="#34d399" size="sm" disabled={isViewer} />
            </div>
            
            {isViewer && (
              <div className="flex items-center gap-1.5 text-xs text-amber-500/80 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20 ml-2">
                <Shield className="w-3 h-3" />
                View Only
              </div>
            )}
          </div>

          {/* Region selector */}
          <RegionSelector regions={REGIONS} value={region} onChange={changeRegion} />

          <div className="hidden sm:flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${globalMonitor ? "bg-emerald-400 animate-pulse" : "bg-muted-foreground"}`} />
            <span className="text-[11px] font-mono text-muted-foreground">{globalMonitor ? "LIVE" : "PAUSED"}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/50 transition-colors hover:border-cyan-500/30">
            <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              <User size={12} />
            </div>
            <span className="text-xs font-medium text-foreground">admin@example.com</span>
            <button 
              onClick={navigate}
              className="ml-2 text-muted-foreground hover:text-rose-400 transition-colors"
              title="Logout"
            >
              <LogOut size={13} />
            </button>
          </div>

          <button className="p-1.5 rounded border border-border text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors">
            <Bell size={14} />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-1.5 rounded border transition-colors ${showSettings ? "border-cyan-500/50 text-cyan-400 bg-cyan-500/10" : "border-border text-muted-foreground hover:text-foreground"}`}
            >
              <Settings size={14} className={showSettings ? "animate-[spin_4s_linear_infinite]" : ""} />
            </button>

            {/* Settings Dropdown */}
            <AnimatePresence>
              {showSettings && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSettings(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-xl z-50 overflow-hidden flex flex-col"
                    style={{ boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)" }}
                  >
                    <div className="px-4 py-3 border-b border-border bg-muted/20">
                      <span className="text-sm font-semibold">Dashboard Settings</span>
                    </div>

                    {/* Region section inside settings */}
                    <div className="px-4 py-3 border-b border-border">
                      <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mb-2">Active Region</div>
                      <div className="flex flex-col gap-1">
                        {REGIONS.map((r) => (
                          <button
                            key={r.id}
                            onClick={() => changeRegion(r.id)}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                              r.id === region ? "bg-cyan-500/10 text-cyan-400" : "hover:bg-muted/40 text-foreground"
                            }`}
                          >
                            <span className="text-xs font-mono">{r.id}</span>
                            {r.id === region && <Check size={12} />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-foreground font-medium">Sound Effects</div>
                          <div className="text-[10px] text-muted-foreground font-mono">Haptics & audio</div>
                        </div>
                        <Toggle
                          checked={soundEnabled}
                          onChange={(v) => {
                            if (!v) playSnapSound(false); // Play one last time before turning off
                            setSoundEnabled(v);
                            (window as any).__soundEnabled = v;
                          }}
                          color="#00d9ff"
                          size="sm"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-foreground font-medium">Compact Mode</div>
                          <div className="text-[10px] text-muted-foreground font-mono">Reduce padding</div>
                        </div>
                        <Toggle checked={compactMode} onChange={setCompactMode} color="#a78bfa" size="sm" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-foreground font-medium">High Contrast</div>
                          <div className="text-[10px] text-muted-foreground font-mono">Accessibility</div>
                        </div>
                        <Toggle checked={highContrast} onChange={setHighContrast} color="#34d399" size="sm" />
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <main className={`w-full ${mainPad}`}>
        {/* Page title */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
              Server Resource Anomaly Predictor
            </h1>
            <p className="text-muted-foreground text-sm mt-1 font-mono">
              Region: <span className="text-cyan-400">{currentRegion.id}</span> · Cluster: {currentRegion.cluster} · {currentRegion.instances} instances · Updated <span className="text-foreground">just now</span>
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            {[
              { label: "Anomalies", val: summary.anomalies, color: "#f43f5e" },
              { label: "Warnings", val: summary.warnings, color: "#f59e0b" },
              { label: "Predictions", val: summary.predictions, color: "#a78bfa" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-border bg-card px-3 py-2 text-center min-w-[80px]"
              >
                <div className="font-mono text-xl font-semibold" style={{ color: s.color }}>{s.val}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Metric cards */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 ${gridGap}`}>
          {METRICS.map((m) => {
            const val = currentVals[m.id];
            const delta = ((val - m.baseVal * currentRegion.factor) / (m.baseVal * currentRegion.factor)) * 100;
            return (
              <MetricCard
                key={m.id}
                label={m.label}
                icon={m.icon}
                value={val}
                unit={m.unit}
                data={seriesData[m.id]}
                color={m.color}
                status={statusOf(val)}
                delta={delta}
                alertEnabled={metricAlerts[m.id + "_alert"]}
                onAlertToggle={(v) => setMetricAlerts((p) => ({ ...p, [m.id + "_alert"]: v }))}
                predEnabled={metricPred[m.id + "_pred"]}
                onPredToggle={(v) => setMetricPred((p) => ({ ...p, [m.id + "_pred"]: v }))}
                compact={compactMode}
              />
            );
          })}
        </div>

        {/* Bottom section: alerts + toggle demo */}
        <div className={`grid grid-cols-1 lg:grid-cols-5 ${gridGap}`}>
          {/* Alert feed */}
          <div className="lg:col-span-3 rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-400" />
                <span className="text-sm font-semibold">Alert Feed</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Toggle to mute</span>
            </div>
            <div className="px-5">
              {ALERTS_INIT.map((a) => (
                <AlertRow
                  key={a.id}
                  label={a.label}
                  desc={a.desc}
                  severity={a.severity}
                  time={a.time}
                  enabled={alertToggles[a.id]}
                  onToggle={(v) => setAlertToggles((p) => ({ ...p, [a.id]: v }))}
                  compact={compactMode}
                />
              ))}
            </div>
          </div>

          {/* Toggle showcase panel */}
          <div className={`lg:col-span-2 flex flex-col ${gridGap}`}>
            {/* Predictor Engine card */}
            <div
              className="rounded-xl border border-border bg-card overflow-hidden flex-1 relative transition-all"
              style={{ boxShadow: mlEnabled ? "0 0 20px rgba(167, 139, 250, 0.18), inset 0 1px 0 rgba(255,255,255,0.05)" : "none", opacity: mlEnabled ? 1 : 0.7 }}
            >
              {mlEnabled && (
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
              )}
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border relative">
                <TrendingUp size={14} style={{ color: mlEnabled ? "#a78bfa" : "#6b7280" }} className={mlEnabled ? "animate-pulse" : ""} />
                <span className="text-sm font-semibold">Predictor Engine</span>
                {!mlEnabled && <span className="ml-auto text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Offline</span>}
              </div>
              <div className="px-5 py-4 space-y-5">
                {PRED_MODELS.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-foreground truncate">{item.label}</div>
                      <div className="text-[10px] text-muted-foreground font-mono truncate">{item.sub}</div>
                    </div>
                    <Toggle
                      checked={mlEnabled && predModels[item.id]}
                      onChange={(v) => setPredModels((p) => ({ ...p, [item.id]: v }))}
                      color={item.color}
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Toggle demo card */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border">
                <Shield size={14} className="text-cyan-400" />
                <span className="text-sm font-semibold">iOS Toggle Demo</span>
              </div>
              <div className="px-5 py-4 flex items-center justify-around">
                {(["sm", "md", "lg"] as const).map((sz) => (
                  <div key={sz} className="flex flex-col items-center gap-2">
                    <Toggle
                      checked={demoToggles[sz]}
                      onChange={(v) => setDemoToggles((p) => ({ ...p, [sz]: v }))}
                      color="#00d9ff"
                      size={sz}
                    />
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">{sz}</span>
                  </div>
                ))}
              </div>
              <div className="px-5 pb-4 text-[10px] font-mono text-muted-foreground text-center">
                Spring stiffness 700 · damping 25 · elastic thumb squish
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
