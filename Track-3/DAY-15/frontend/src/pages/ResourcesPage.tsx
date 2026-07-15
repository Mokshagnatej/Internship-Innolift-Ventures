import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Server, Activity, Plus, AlertTriangle, CheckCircle } from "lucide-react";

interface ResourceMetric {
  id: number;
  model_name: string;
  cpu_usage: number;
  memory_usage: number;
  network_io: number;
  disk_io: number;
  anomaly_detected: boolean;
  timestamp: string;
}

export default function ResourcesPage() {
  const [metrics, setMetrics] = useState<ResourceMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [globalAutoDetect, setGlobalAutoDetect] = useState(true);
  
  // Form State
  const [modelName, setModelName] = useState("Random Forest Classifier");
  const [cpuUsage, setCpuUsage] = useState("");
  const [memoryUsage, setMemoryUsage] = useState("");
  const [networkIo, setNetworkIo] = useState("");
  const [diskIo, setDiskIo] = useState("");
  const [anomaly, setAnomaly] = useState(false);
  const [autoGenerate, setAutoGenerate] = useState(false);

  const handleAutoGenerateToggle = () => {
    const newAuto = !autoGenerate;
    setAutoGenerate(newAuto);
    if (newAuto) {
      setCpuUsage((40 + Math.random() * 50).toFixed(1));
      setMemoryUsage((8 + Math.random() * 8).toFixed(1));
      setNetworkIo((50 + Math.random() * 100).toFixed(1));
      setDiskIo((20 + Math.random() * 80).toFixed(1));
    } else {
      setCpuUsage("");
      setMemoryUsage("");
      setNetworkIo("");
      setDiskIo("");
    }
  };

  useEffect(() => {
    fetchMetrics();
    fetchAutoDetect();
  }, []);

  // Live Auto-Detection Simulator
  useEffect(() => {
    let interval: any;
    if (globalAutoDetect) {
      // Check for anomalies every 3 seconds
      interval = setInterval(() => {
        // 40% chance to detect an anomaly during this check
        if (Math.random() < 0.4) {
          triggerAutoAnomaly();
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [globalAutoDetect]);

  const triggerAutoAnomaly = async () => {
    try {
      await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model_name: "Live Auto-Detection",
          cpu_usage: (85 + Math.random() * 14).toFixed(1),
          memory_usage: (12 + Math.random() * 4).toFixed(1),
          network_io: (150 + Math.random() * 100).toFixed(1),
          disk_io: (80 + Math.random() * 50).toFixed(1),
          anomaly_detected: true
        })
      });
      fetchMetrics(); // refresh the table
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAutoDetect = async () => {
    try {
      const res = await fetch("/api/settings/auto-detect");
      const data = await res.json();
      setGlobalAutoDetect(data.enabled);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleGlobalAutoDetect = async () => {
    const newState = !globalAutoDetect;
    setGlobalAutoDetect(newState);
    try {
      await fetch("/api/settings/auto-detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: newState })
      });
    } catch (e) {
      console.error(e);
      setGlobalAutoDetect(!newState);
    }
  };

  const fetchMetrics = async () => {
    try {
      const res = await fetch("/api/resources");
      const data = await res.json();
      setMetrics(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMetric = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpuUsage || !memoryUsage || !networkIo || !diskIo) return;

    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model_name: modelName,
          cpu_usage: parseFloat(cpuUsage),
          memory_usage: parseFloat(memoryUsage),
          network_io: parseFloat(networkIo),
          disk_io: parseFloat(diskIo),
          anomaly_detected: anomaly
        })
      });
      if (res.ok) {
        setCpuUsage("");
        setMemoryUsage("");
        setNetworkIo("");
        setDiskIo("");
        setAnomaly(false);
        setShowAddForm(false);
        fetchMetrics();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const anomalyCount = metrics.filter(m => m.anomaly_detected).length;

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto pb-20">
      <div className="flex justify-between items-start mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-2">Server Resource Predictor</h1>
          <p className="text-slate-400">Monitor CPU, Memory, and I/O metrics across your deployed ML models.</p>
        </motion.div>
        
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-3 cursor-pointer bg-[#0d1117] px-4 py-2.5 rounded-xl border border-white/5 shadow-sm">
            <span className="text-sm font-medium text-white">Global Auto-Logging</span>
            <input type="checkbox" className="hidden" checked={globalAutoDetect} onChange={toggleGlobalAutoDetect} />
            <div className={`w-12 h-6 rounded-full transition-colors relative ${globalAutoDetect ? 'bg-[#34d399]' : 'bg-white/10'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${globalAutoDetect ? 'left-7' : 'left-1'}`} />
            </div>
          </label>

          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#00d9ff]/10 text-[#00d9ff] border border-[#00d9ff]/20 rounded-xl font-medium hover:bg-[#00d9ff]/20 transition-colors"
          >
            {showAddForm ? "Cancel" : <><Plus className="w-4 h-4" /> Log Metrics</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#0d1117] border border-white/5 p-6 rounded-2xl">
          <div className="text-slate-400 text-sm mb-1">Total Logs</div>
          <div className="text-3xl font-bold text-white">{metrics.length}</div>
        </div>
        <div className="bg-[#0d1117] border border-white/5 p-6 rounded-2xl">
          <div className="text-slate-400 text-sm mb-1">Anomalies Detected</div>
          <div className="text-3xl font-bold text-red-400">{anomalyCount}</div>
        </div>
        <div className="bg-[#0d1117] border border-white/5 p-6 rounded-2xl">
          <div className="text-slate-400 text-sm mb-1">System Status</div>
          <div className="text-xl font-bold text-[#34d399] flex items-center gap-2 mt-2">
             <CheckCircle className="w-6 h-6" /> Online
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
            onSubmit={handleAddMetric}
          >
            <div className="p-6 bg-[#0d1117] border border-[#00d9ff]/30 rounded-2xl mb-8 flex flex-col gap-5 shadow-[0_0_30px_-10px_rgba(0,217,255,0.15)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Model Name</label>
                  <select value={modelName} onChange={e => setModelName(e.target.value)} className="w-full bg-[#080b12] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00d9ff] transition-colors appearance-none">
                    <option>Random Forest Classifier</option>
                    <option>Isolation Forest</option>
                    <option>LSTM Autoencoder</option>
                    <option>XGBoost Regressor</option>
                    <option>BERT Sentiment Analysis</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">CPU Usage (%)</label>
                  <input required value={cpuUsage} onChange={e => setCpuUsage(e.target.value)} type="number" step="0.1" min="0" max="100" placeholder="45.5" className="w-full bg-[#080b12] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00d9ff] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Memory Usage (GB)</label>
                  <input required value={memoryUsage} onChange={e => setMemoryUsage(e.target.value)} type="number" step="0.1" min="0" placeholder="4.2" className="w-full bg-[#080b12] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00d9ff] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Network I/O (MB/s)</label>
                  <input required value={networkIo} onChange={e => setNetworkIo(e.target.value)} type="number" step="0.1" min="0" placeholder="12.4" className="w-full bg-[#080b12] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00d9ff] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Disk I/O (MB/s)</label>
                  <input required value={diskIo} onChange={e => setDiskIo(e.target.value)} type="number" step="0.1" min="0" placeholder="5.1" className="w-full bg-[#080b12] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00d9ff] transition-colors" />
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-5">
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="hidden" checked={autoGenerate} onChange={handleAutoGenerateToggle} />
                    <div className={`w-12 h-6 rounded-full transition-colors relative ${autoGenerate ? 'bg-[#00d9ff]' : 'bg-white/10'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${autoGenerate ? 'left-7' : 'left-1'}`} />
                    </div>
                    <span className="text-sm font-medium text-white">Auto-fill Values</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="hidden" checked={anomaly} onChange={() => setAnomaly(!anomaly)} />
                    <div className={`w-12 h-6 rounded-full transition-colors relative ${anomaly ? 'bg-red-500' : 'bg-white/10'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${anomaly ? 'left-7' : 'left-1'}`} />
                    </div>
                    <span className="text-sm font-medium text-white">Mark as Anomaly</span>
                  </label>
                </div>

                <button type="submit" className="px-6 py-2.5 bg-[#00d9ff] text-[#080b12] font-semibold rounded-xl hover:shadow-[0_0_20px_-5px_#00d9ff] transition-shadow">
                  Save Metrics
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
      
      <div className="bg-[#0d1117] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-400">Loading metrics...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-slate-300">Model Name</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-300">CPU Usage</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-300">Memory</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-300">Network I/O</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-300">Disk I/O</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-300 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {metrics.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                    No resource metrics logged yet.
                  </td>
                </tr>
              ) : (
                metrics.map((m) => (
                  <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Server className="w-5 h-5 text-[#00d9ff]" />
                        <div>
                          <div className="text-white font-medium">{m.model_name}</div>
                          <div className="text-xs text-slate-500">{new Date(m.timestamp).toLocaleString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-slate-300">{m.cpu_usage}%</td>
                    <td className="px-6 py-4 font-mono text-sm text-slate-300">{m.memory_usage} GB</td>
                    <td className="px-6 py-4 font-mono text-sm text-slate-300">{m.network_io} MB/s</td>
                    <td className="px-6 py-4 font-mono text-sm text-slate-300">{m.disk_io} MB/s</td>
                    <td className="px-6 py-4 text-right">
                      {m.anomaly_detected ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 text-xs border border-red-500/20 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5" /> Anomaly
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#34d399]/10 text-[#34d399] text-xs border border-[#34d399]/20 font-medium">
                          <Activity className="w-3.5 h-3.5" /> Normal
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
