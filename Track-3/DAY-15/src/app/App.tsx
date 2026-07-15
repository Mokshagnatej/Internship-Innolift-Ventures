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
} from "lucide-react";

// ─── Web Audio snap sound & Haptics ──────────────────────────────────────────

function playSnapSound(on: boolean) {
  if ((window as any).__soundEnabled === false) return;

  try {
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

// ─── iOS Toggle ───────────────────────────────────────────────────────────────
// Color values fed in from callers which read from CSS variables at runtime.

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  /** CSS var string e.g. "var(--chart-1)" or a resolved hex string */
  color?: string;
  size?: "sm" | "md" | "lg";
}

function Toggle({ checked, onChange, color = "var(--chart-1)", size = "md" }: ToggleProps) {
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

  const resolvedColor = useMemo(() => {
    if (color.startsWith("var(")) {
      const prop = color.slice(4, -1).trim();
      return getComputedStyle(document.documentElement).getPropertyValue(prop).trim() || "#00d9ff";
    }
    return color;
  }, [color]);

  const bgProgress = useTransform(spring, [0, travel], [0, 1]);
  const bgColor = useTransform(bgProgress, (p) => {
    const offR = 25, offG = 30, offB = 40;
    const hex = resolvedColor.replace("#", "");
    const onR = parseInt(hex.slice(0, 2), 16);
    const onG = parseInt(hex.slice(2, 4), 16);
    const onB = parseInt(hex.slice(4, 6), 16);
    const r = Math.round(offR + (onR - offR) * p);
    const g = Math.round(offG + (onG - offG) * p);
    const b = Math.round(offB + (onB - offB) * p);
    return `rgb(${r},${g},${b})`;
  });

  return (
    <motion.button
      onClick={() => {
        const next = !checked;
        playSnapSound(next);
        onChange(next);
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
        cursor: "pointer",
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
      onUpdate: (v) => { if (node) node.textContent = v.toFixed(1); },
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
    return { t: i, v: Math.max(0, Math.min(100, base + noise + trend + anomaly)) };
  });
}

// ─── Status helper ────────────────────────────────────────────────────────────

type Status = "normal" | "warning" | "critical";

function statusOf(v: number): Status {
  if (v >= 80) return "critical";
  if (v >= 65) return "warning";
  return "normal";
}

const STATUS_VAR: Record<Status, string> = {
  normal:   "var(--chart-2)",
  warning:  "var(--chart-3)",
  critical: "var(--chart-4)",
};
const STATUS_LABEL: Record<Status, string> = {
  normal: "Nominal", warning: "Elevated", critical: "Anomaly",
};

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
  colorVar: string;
  status: Status;
  delta: number;
  alertEnabled: boolean;
  onAlertToggle: (v: boolean) => void;
  predEnabled: boolean;
  onPredToggle: (v: boolean) => void;
  compact: boolean;
}

function MetricCard({
  label, icon, value, unit, data, colorVar, status, delta,
  alertEnabled, onAlertToggle, predEnabled, onPredToggle, compact,
}: MetricCardProps) {
  const statusColor = STATUS_VAR[status];

  return (
    <div
      className="rounded-xl border border-border bg-card flex flex-col overflow-hidden"
      style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.05)" }}
    >
      <div className={`flex items-center justify-between ${compact ? "px-3 pt-2.5 pb-1" : "px-4 pt-4 pb-2"}`}>
        <div className="flex items-center gap-2">
          <span style={{ color: `var(${colorVar.slice(4, -1)})` }} className="opacity-90">{icon}</span>
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="text-[10px] font-mono px-1.5 py-0.5 rounded"
            style={{
              backgroundColor: `color-mix(in srgb, ${statusColor} 12%, transparent)`,
              color: statusColor,
            }}
          >
            {STATUS_LABEL[status]}
          </span>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: statusColor }} />
        </div>
      </div>

      <div className={`${compact ? "px-3" : "px-4"} pb-1 flex items-end gap-2`}>
        <AnimatedNumber value={value} />
        <span className="text-muted-foreground text-sm mb-1">{unit}</span>
        <div className={`flex items-center gap-0.5 mb-1 ml-auto text-xs font-mono ${delta > 0 ? "text-rose-400" : "text-emerald-400"}`}>
          {delta > 0 ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {Math.abs(delta).toFixed(1)}%
        </div>
      </div>

      <div className={`${compact ? "h-10" : "h-16"} px-1`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colorVar} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colorVar} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke={colorVar} strokeWidth={1.5} fill={`url(#grad-${label})`} dot={false} isAnimationActive={false} />
            <Tooltip content={<ChartTooltip />} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {!compact && (
        <div className="border-t border-border px-4 py-3 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-foreground font-medium">Anomaly Alerts</div>
              <div className="text-[10px] text-muted-foreground font-mono">Push notification on spike</div>
            </div>
            <Toggle checked={alertEnabled} onChange={onAlertToggle} color="var(--chart-3)" size="sm" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-foreground font-medium">Predictive Mode</div>
              <div className="text-[10px] text-muted-foreground font-mono">ML forecast enabled</div>
            </div>
            <Toggle checked={predEnabled} onChange={onPredToggle} color={colorVar} size="sm" />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Alert Row ────────────────────────────────────────────────────────────────

const SEVERITY_VAR = {
  info: "var(--chart-1)",
  warn: "var(--chart-3)",
  crit: "var(--chart-4)",
} as const;

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
  const colorVar = SEVERITY_VAR[severity];
  return (
    <div className={`flex items-center gap-4 ${compact ? "py-2" : "py-3"} border-b border-border last:border-0`}>
      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colorVar }} />
      <div className="flex-1 min-w-0">
        <div className="text-sm text-foreground font-medium truncate">{label}</div>
        {!compact && <div className="text-[11px] text-muted-foreground font-mono truncate">{desc}</div>}
      </div>
      <div className="text-[10px] font-mono text-muted-foreground flex-shrink-0">{time}</div>
      <Toggle checked={enabled} onChange={onToggle} color={colorVar} size="sm" />
    </div>
  );
}

// ─── Region Selector ──────────────────────────────────────────────────────────

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
          open ? "border-primary/50 text-primary bg-primary/10" : "border-border text-muted-foreground hover:text-foreground"
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
                <span className="text-sm font-semibold text-foreground">Select Region</span>
              </div>
              <div className="p-1.5 flex flex-col">
                {regions.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => { playSnapSound(true); onChange(r.id); setOpen(false); }}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                      r.id === value ? "bg-primary/10 text-primary" : "hover:bg-muted/40 text-foreground"
                    }`}
                  >
                    <span className="text-xs font-mono">{r.id}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">{r.label}</span>
                      {r.id === value && <Check size={12} />}
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

// ─── Static data ──────────────────────────────────────────────────────────────

const METRICS = [
  { id: "cpu",  label: "CPU Usage",   icon: <Cpu size={14} />,       baseVal: 67.4, unit: "%",    colorVar: "var(--chart-1)", spike: 28 },
  { id: "mem",  label: "Memory",      icon: <Activity size={14} />,  baseVal: 82.1, unit: "%",    colorVar: "var(--chart-5)", spike: 35 },
  { id: "net",  label: "Network I/O", icon: <Wifi size={14} />,      baseVal: 34.9, unit: "MB/s", colorVar: "var(--chart-2)", spike: undefined },
  { id: "disk", label: "Disk I/O",    icon: <HardDrive size={14} />, baseVal: 51.7, unit: "%",    colorVar: "var(--chart-3)", spike: 22 },
] as const;

const REGIONS = [
  { id: "us-east-1",      label: "N. Virginia", cluster: "prod-api",      instances: 6, factor: 1.00 },
  { id: "us-west-2",      label: "Oregon",       cluster: "prod-api-west", instances: 4, factor: 0.82 },
  { id: "eu-west-1",      label: "Ireland",      cluster: "prod-eu",       instances: 8, factor: 1.14 },
  { id: "ap-southeast-1", label: "Singapore",    cluster: "prod-apac",     instances: 3, factor: 0.70 },
  { id: "ap-northeast-1", label: "Tokyo",        cluster: "prod-apac-ne",  instances: 5, factor: 0.90 },
] as const;

const ALERTS_INIT = [
  { id: "a1", label: "CPU threshold breach",      desc: "i-09f3d2a1 exceeded 85% for 3m",     severity: "crit" as const, time: "2m ago",   enabled: true  },
  { id: "a2", label: "Memory pressure detected",  desc: "prod-db-02 RSS at 14.2 GB / 16 GB",  severity: "crit" as const, time: "7m ago",   enabled: true  },
  { id: "a3", label: "Unusual network egress",    desc: "us-east-1 outbound spike 4.2x",       severity: "warn" as const, time: "15m ago",  enabled: true  },
  { id: "a4", label: "Disk queue depth elevated", desc: "vol-0a9f1c3e4 avg QD > 32",           severity: "warn" as const, time: "31m ago",  enabled: false },
  { id: "a5", label: "Prediction: CPU spike ~8m", desc: "Model confidence 94% - i-09f3d2a1",  severity: "info" as const, time: "just now", enabled: true  },
  { id: "a6", label: "Auto-scaling triggered",    desc: "ASG prod-api scaled from 4->6 nodes", severity: "info" as const, time: "3m ago",   enabled: false },
];

const PRED_MODELS = [
  { id: "lstm",     label: "LSTM Anomaly Model",       sub: "Trained on 90d rolling window", colorVar: "var(--chart-5)" },
  { id: "thresh",   label: "Threshold Baselines",      sub: "Dynamic +/-2o band detection",  colorVar: "var(--chart-1)" },
  { id: "seasonal", label: "Seasonal Decomp",          sub: "Weekly cycle correction",       colorVar: "var(--chart-2)" },
  { id: "corr",     label: "Cross-metric Correlation", sub: "CPU<>Mem causality graph",      colorVar: "var(--chart-3)" },
];

function buildRegionData(factor: number) {
  return Object.fromEntries(
    METRICS.map((m) => [m.id, generateTimeSeries(Math.min(98, m.baseVal * factor), 15, 40, m.spike)])
  ) as Record<string, { t: number; v: number }[]>;
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
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
          const old = prev[m.id];
          const lastT = old[old.length - 1].t;
          const noise = (Math.random() - 0.5) * 10;
          const trend = Math.sin(lastT * 0.3) * 5;
          const val = Math.max(0, Math.min(100, m.baseVal * currentRegion.factor + noise + trend));
          next[m.id] = [...old.slice(1), { t: lastT + 1, v: val }];
          newVals[m.id] = val;
        }
        setCurrentVals(newVals);
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [globalMonitor, currentRegion.factor]);

  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.style.setProperty("--border", "rgba(255,255,255,0.32)");
      root.style.setProperty("--muted-foreground", "#c3cfe0");
      root.style.setProperty("--foreground", "#ffffff");
      root.style.setProperty("--card", "#10151f");
    } else {
      root.style.removeProperty("--border");
      root.style.removeProperty("--muted-foreground");
      root.style.removeProperty("--foreground");
      root.style.removeProperty("--card");
    }
  }, [highContrast]);

  const summary = useMemo(() => {
    let anomalies = 0, warnings = 0;
    for (const m of METRICS) {
      const s = statusOf(currentVals[m.id] ?? m.baseVal);
      if (s === "critical") anomalies++;
      else if (s === "warning") warnings++;
    }
    const predictions = mlEnabled ? Object.values(metricPred).filter(Boolean).length : 0;
    return { anomalies, warnings, predictions };
  }, [currentVals, mlEnabled, metricPred]);

  const mainPad = compactMode ? "px-4 md:px-6 py-4 space-y-4" : "px-4 md:px-6 py-8 space-y-8";
  const gridGap = compactMode ? "gap-2.5" : "gap-4";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header
        className="border-b border-border flex items-center justify-between px-6 py-3 sticky top-0 z-40"
        style={{ backgroundColor: "rgba(8,11,18,0.92)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-6 h-6 rounded flex items-center justify-center"
            style={{
              backgroundColor: "color-mix(in srgb, var(--chart-1) 12%, transparent)",
              border: "1px solid color-mix(in srgb, var(--chart-1) 25%, transparent)",
            }}
          >
            <Zap size={13} style={{ color: "var(--chart-1)" }} />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">CloudWatch</span>
          <span className="text-muted-foreground text-sm">/</span>
          <span className="text-xs font-mono text-muted-foreground">Anomaly Predictor</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-5">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono text-muted-foreground">Monitor</span>
              <Toggle checked={globalMonitor} onChange={setGlobalMonitor} color="var(--chart-1)" size="sm" />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono text-muted-foreground">ML Engine</span>
              <Toggle checked={mlEnabled} onChange={setMlEnabled} color="var(--chart-5)" size="sm" />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono text-muted-foreground">Auto-remediate</span>
              <Toggle checked={autoRemediate} onChange={setAutoRemediate} color="var(--chart-2)" size="sm" />
            </div>
          </div>

          <RegionSelector regions={REGIONS} value={region} onChange={changeRegion} />

          <div className="hidden sm:flex items-center gap-2">
            <div
              className={`w-1.5 h-1.5 rounded-full ${globalMonitor ? "animate-pulse" : ""}`}
              style={{ backgroundColor: globalMonitor ? "var(--chart-2)" : "var(--muted-foreground)" }}
            />
            <span className="text-[11px] font-mono text-muted-foreground">
              {globalMonitor ? "LIVE" : "PAUSED"}
            </span>
          </div>

          <button className="p-1.5 rounded border border-border text-muted-foreground hover:text-foreground transition-colors">
            <Bell size={14} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-1.5 rounded border transition-colors ${
                showSettings ? "border-primary/50 text-primary bg-primary/10" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Settings size={14} className={showSettings ? "animate-[spin_4s_linear_infinite]" : ""} />
            </button>

            <AnimatePresence>
              {showSettings && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-xl z-50 overflow-hidden flex flex-col"
                    style={{ boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)" }}
                  >
                    <div className="px-4 py-3 border-b border-border bg-muted/20">
                      <span className="text-sm font-semibold text-foreground">Dashboard Settings</span>
                    </div>
                    <div className="px-4 py-3 border-b border-border">
                      <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mb-2">Active Region</div>
                      <div className="flex flex-col gap-1">
                        {REGIONS.map((r) => (
                          <button
                            key={r.id}
                            onClick={() => changeRegion(r.id)}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                              r.id === region ? "bg-primary/10 text-primary" : "hover:bg-muted/40 text-foreground"
                            }`}
                          >
                            <div>
                              <span className="text-xs font-mono">{r.id}</span>
                              <span className="text-[10px] text-muted-foreground ml-2">{r.label}</span>
                            </div>
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
                          onChange={(v) => { if (!v) playSnapSound(false); setSoundEnabled(v); (window as any).__soundEnabled = v; }}
                          color="var(--chart-1)"
                          size="sm"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-foreground font-medium">Compact Mode</div>
                          <div className="text-[10px] text-muted-foreground font-mono">Reduce padding</div>
                        </div>
                        <Toggle checked={compactMode} onChange={setCompactMode} color="var(--chart-5)" size="sm" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-foreground font-medium">High Contrast</div>
                          <div className="text-[10px] text-muted-foreground font-mono">Accessibility</div>
                        </div>
                        <Toggle checked={highContrast} onChange={setHighContrast} color="var(--chart-2)" size="sm" />
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <main className={`max-w-7xl mx-auto ${mainPad}`}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Server Resource Anomaly Predictor
            </h1>
            <p className="text-muted-foreground text-sm mt-1 font-mono">
              Region: <span style={{ color: "var(--chart-1)" }}>{currentRegion.id}</span>
              {" · "}Cluster: {currentRegion.cluster}
              {" · "}{currentRegion.instances} instances
              {" · "}Updated <span className="text-foreground">just now</span>
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {[
              { label: "Anomalies",   val: summary.anomalies,   colorVar: "var(--chart-4)" },
              { label: "Warnings",    val: summary.warnings,    colorVar: "var(--chart-3)" },
              { label: "Predictions", val: summary.predictions, colorVar: "var(--chart-5)" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-border bg-card px-3 py-2 text-center min-w-[80px]">
                <div className="font-mono text-xl font-semibold" style={{ color: s.colorVar }}>{s.val}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 ${gridGap}`}>
          {METRICS.map((m) => {
            const val = currentVals[m.id];
            const baseline = m.baseVal * currentRegion.factor;
            const delta = ((val - baseline) / baseline) * 100;
            return (
              <MetricCard
                key={m.id}
                label={m.label}
                icon={m.icon}
                value={val}
                unit={m.unit}
                data={seriesData[m.id]}
                colorVar={m.colorVar}
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

        <div className={`grid grid-cols-1 lg:grid-cols-5 ${gridGap}`}>
          <div className="lg:col-span-3 rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} style={{ color: "var(--chart-3)" }} />
                <span className="text-sm font-semibold text-foreground">Alert Feed</span>
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

          <div className={`lg:col-span-2 flex flex-col ${gridGap}`}>
            <div
              className="rounded-xl border border-border bg-card overflow-hidden flex-1 relative transition-all"
              style={{
                boxShadow: mlEnabled
                  ? "0 0 24px color-mix(in srgb, var(--chart-5) 18%, transparent), inset 0 1px 0 rgba(255,255,255,0.05)"
                  : "none",
                opacity: mlEnabled ? 1 : 0.65,
              }}
            >
              {mlEnabled && (
                <div
                  className="absolute top-0 left-0 right-0 h-[1px] opacity-50"
                  style={{ background: "linear-gradient(to right, transparent, var(--chart-5), transparent)" }}
                />
              )}
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border">
                <TrendingUp
                  size={14}
                  style={{ color: mlEnabled ? "var(--chart-5)" : "var(--muted-foreground)" }}
                  className={mlEnabled ? "animate-pulse" : ""}
                />
                <span className="text-sm font-semibold text-foreground">Predictor Engine</span>
                {!mlEnabled && (
                  <span className="ml-auto text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Offline</span>
                )}
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
                      color={item.colorVar}
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border">
                <Shield size={14} style={{ color: "var(--chart-1)" }} />
                <span className="text-sm font-semibold text-foreground">iOS Toggle Demo</span>
              </div>
              <div className="px-5 py-4 flex items-center justify-around">
                {(["sm", "md", "lg"] as const).map((sz) => (
                  <div key={sz} className="flex flex-col items-center gap-2">
                    <Toggle
                      checked={demoToggles[sz]}
                      onChange={(v) => setDemoToggles((p) => ({ ...p, [sz]: v }))}
                      color="var(--chart-1)"
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
