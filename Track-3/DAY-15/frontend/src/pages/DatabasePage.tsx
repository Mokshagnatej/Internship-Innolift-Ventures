import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Database, HardDrive, Server, RefreshCw, Plus, Activity, AlertTriangle } from "lucide-react";

type DbStatus = "Available" | "Backing Up" | "Degraded";

interface DatabaseItem {
  id: number;
  name: string;
  type: string;
  status: DbStatus;
  storage: string;
  iops: string;
}

export default function DatabasePage() {
  const [databases, setDatabases] = useState<DatabaseItem[]>([
    { id: 1, name: "prod-telemetry-rds", type: "Amazon RDS (PostgreSQL)", status: "Available", storage: "1.2 TB / 2 TB", iops: "12,000" },
    { id: 2, name: "user-sessions-ddb", type: "Amazon DynamoDB", status: "Available", storage: "Auto-Scaling", iops: "On-Demand" },
    { id: 3, name: "archive-metrics-redshift", type: "Amazon Redshift", status: "Backing Up", storage: "4.5 TB / 10 TB", iops: "N/A" }
  ]);

  const [showAddDb, setShowAddDb] = useState(false);
  const [newDbName, setNewDbName] = useState("");
  const [newDbType, setNewDbType] = useState("Amazon RDS (PostgreSQL)");

  const handleAddDb = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDbName) return;
    
    setDatabases([...databases, {
      id: Date.now(),
      name: newDbName,
      type: newDbType,
      status: "Backing Up",
      storage: "Provisioning...",
      iops: "Provisioning..."
    }]);

    setTimeout(() => {
      setDatabases(prev => prev.map(db => db.name === newDbName ? { ...db, status: "Available", storage: "50 GB / 100 GB", iops: "3,000" } : db));
    }, 4000);

    setNewDbName("");
    setShowAddDb(false);
  };

  const syncDatabase = (id: number) => {
    setDatabases(databases.map(db => db.id === id ? { ...db, status: "Backing Up" } : db));
    setTimeout(() => {
      setDatabases(prev => prev.map(db => db.id === id ? { ...db, status: "Available" } : db));
    }, 2000);
  };

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto pb-20">
      <div className="flex justify-between items-start mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-2">Databases</h1>
          <p className="text-slate-400">Manage your connected data sources and monitor storage clusters.</p>
        </motion.div>
        
        <button 
          onClick={() => setShowAddDb(!showAddDb)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#00d9ff]/10 text-[#00d9ff] border border-[#00d9ff]/20 rounded-xl font-medium hover:bg-[#00d9ff]/20 transition-colors"
        >
          {showAddDb ? "Cancel" : <><Plus className="w-4 h-4" /> Add Database</>}
        </button>
      </div>
      
      <AnimatePresence>
        {showAddDb && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
            onSubmit={handleAddDb}
          >
            <div className="p-6 bg-[#0d1117] border border-[#00d9ff]/30 rounded-2xl mb-8 flex flex-wrap gap-5 items-end shadow-[0_0_30px_-10px_rgba(0,217,255,0.15)]">
              <div className="flex-1 min-w-[250px]">
                <label className="block text-sm font-medium text-slate-300 mb-2">Database Identifier</label>
                <input required value={newDbName} onChange={e => setNewDbName(e.target.value)} type="text" placeholder="e.g. dev-cluster-1" className="w-full bg-[#080b12] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00d9ff] transition-colors" />
              </div>
              <div className="w-[300px]">
                <label className="block text-sm font-medium text-slate-300 mb-2">Engine Type</label>
                <select value={newDbType} onChange={e => setNewDbType(e.target.value)} className="w-full bg-[#080b12] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00d9ff] transition-colors appearance-none">
                  <option>Amazon RDS (PostgreSQL)</option>
                  <option>Amazon RDS (MySQL)</option>
                  <option>Amazon DynamoDB</option>
                  <option>Amazon Redshift</option>
                  <option>Amazon ElastiCache</option>
                </select>
              </div>
              <button type="submit" className="px-6 py-2.5 bg-[#00d9ff] text-[#080b12] font-semibold rounded-xl hover:shadow-[0_0_20px_-5px_#00d9ff] transition-shadow">
                Provision
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {databases.map((db, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={db.id} 
            className="group bg-[#0d1117] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors relative overflow-hidden"
          >
            {db.status === 'Backing Up' && (
              <div className="absolute top-0 left-0 w-full h-1 bg-[#f59e0b]/20 overflow-hidden">
                <motion.div 
                  className="h-full bg-[#f59e0b]" 
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                />
              </div>
            )}
            
            <div className="flex justify-between items-start mb-5">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:scale-110 transition-transform duration-300">
                <Database className="text-[#00d9ff] w-6 h-6" />
              </div>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full border flex items-center gap-1.5 ${
                db.status === 'Available' ? 'bg-[#34d399]/10 text-[#34d399] border-[#34d399]/20' :
                db.status === 'Backing Up' ? 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20 animate-pulse' :
                'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                {db.status === 'Backing Up' && <RefreshCw className="w-3 h-3 animate-spin" />}
                {db.status === 'Degraded' && <AlertTriangle className="w-3 h-3" />}
                {db.status === 'Available' && <Activity className="w-3 h-3" />}
                {db.status}
              </span>
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-1">{db.name}</h3>
            <p className="text-sm text-slate-400 mb-6 font-mono">{db.type}</p>
            
            <div className="grid grid-cols-2 gap-4 pt-5 border-t border-white/5 mb-5">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <HardDrive className="w-3.5 h-3.5" /> Storage
                </div>
                <div className="font-mono text-white text-sm">{db.storage}</div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Server className="w-3.5 h-3.5" /> IOPS / Activity
                </div>
                <div className="font-mono text-white text-sm">{db.iops}</div>
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-white/5">
                <button 
                  onClick={() => syncDatabase(db.id)}
                  disabled={db.status === 'Backing Up'}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors disabled:opacity-50 text-sm font-medium"
                >
                  <RefreshCw className={`w-4 h-4 ${db.status === 'Backing Up' ? 'animate-spin text-[#f59e0b]' : ''}`} />
                  {db.status === 'Backing Up' ? 'Syncing...' : 'Force Sync / Backup'}
                </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
