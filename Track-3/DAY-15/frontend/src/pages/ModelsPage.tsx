import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Brain, Database, Network, Play, Square, RefreshCw, Plus, Search } from "lucide-react";

type ModelStatus = "Active" | "Training" | "Standby";

interface Model {
  id: number;
  name: string;
  status: ModelStatus;
  accuracy: string;
  region: string;
  icon: string;
}

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([
    { id: 1, name: "Random Forest Classifier", status: "Active", accuracy: "98.4%", region: "us-east-1", icon: "brain" },
    { id: 2, name: "Isolation Forest", status: "Training", accuracy: "--", region: "eu-west-1", icon: "database" },
    { id: 3, name: "LSTM Autoencoder", status: "Standby", accuracy: "96.1%", region: "Global", icon: "network" },
    { id: 4, name: "XGBoost Regressor", status: "Active", accuracy: "94.2%", region: "ap-northeast-1", icon: "database" },
    { id: 5, name: "BERT Sentiment Analysis", status: "Active", accuracy: "99.1%", region: "us-east-1", icon: "brain" },
    { id: 6, name: "K-Means Clustering", status: "Standby", accuracy: "88.5%", region: "eu-west-1", icon: "network" }
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const [showDeployForm, setShowDeployForm] = useState(false);
  const [newModelName, setNewModelName] = useState("");
  const [newModelRegion, setNewModelRegion] = useState("us-east-1");

  const toggleModelStatus = (id: number) => {
    setModels(models.map(m => {
      if (m.id === id) {
        if (m.status === "Active") return { ...m, status: "Standby" };
        if (m.status === "Standby") return { ...m, status: "Active" };
      }
      return m;
    }));
  };

  const retrainModel = (id: number) => {
    setModels(models.map(m => {
      if (m.id === id) {
        return { ...m, status: "Training", accuracy: "--" };
      }
      return m;
    }));
    
    // Simulate training completion
    setTimeout(() => {
      setModels(prev => prev.map(m => {
        if (m.id === id) {
          return { ...m, status: "Active", accuracy: (95 + Math.random() * 4).toFixed(1) + "%" };
        }
        return m;
      }));
    }, 3000);
  };

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModelName) return;
    
    setModels([...models, {
      id: Date.now(),
      name: newModelName,
      status: "Training",
      accuracy: "--",
      region: newModelRegion,
      icon: "network"
    }]);
    
    // Simulate training
    setTimeout(() => {
      setModels(prev => prev.map(m => m.name === newModelName ? { ...m, status: "Active", accuracy: (94 + Math.random() * 5).toFixed(1) + "%" } : m));
    }, 3000);
    
    setNewModelName("");
    setNewModelRegion("us-east-1");
    setShowDeployForm(false);
  };

  const getIcon = (type: string) => {
    if (type === "brain") return <Brain className="text-[#a78bfa] w-6 h-6" />;
    if (type === "database") return <Database className="text-[#00d9ff] w-6 h-6" />;
    return <Network className="text-[#f59e0b] w-6 h-6" />;
  };

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-2">Machine Learning Models</h1>
          <p className="text-slate-400">Manage and deploy your CloudWatch anomaly detection models.</p>
        </motion.div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search models..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0d1117] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00d9ff] transition-colors text-sm"
            />
          </div>
          <button 
            onClick={() => setShowDeployForm(!showDeployForm)}
            className="flex items-center justify-center w-full sm:w-auto gap-2 px-5 py-2.5 bg-[#00d9ff]/10 text-[#00d9ff] border border-[#00d9ff]/20 rounded-xl font-medium hover:bg-[#00d9ff]/20 transition-colors"
          >
            {showDeployForm ? "Cancel" : <><Plus className="w-4 h-4" /> Deploy Model</>}
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {showDeployForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
            onSubmit={handleDeploy}
          >
            <div className="p-6 bg-[#0d1117] border border-[#00d9ff]/30 rounded-2xl mb-8 flex flex-wrap gap-5 items-end shadow-[0_0_30px_-10px_rgba(0,217,255,0.15)]">
              <div className="flex-1 min-w-[250px]">
                <label className="block text-sm font-medium text-slate-300 mb-2">Model Architecture Name</label>
                <input required value={newModelName} onChange={e => setNewModelName(e.target.value)} type="text" placeholder="e.g. DeepAR Forecaster" className="w-full bg-[#080b12] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00d9ff] transition-colors" />
              </div>
              <div className="w-[200px]">
                <label className="block text-sm font-medium text-slate-300 mb-2">Target Region</label>
                <select value={newModelRegion} onChange={e => setNewModelRegion(e.target.value)} className="w-full bg-[#080b12] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00d9ff] transition-colors appearance-none">
                  <option>us-east-1</option>
                  <option>eu-west-1</option>
                  <option>ap-northeast-1</option>
                  <option>Global</option>
                </select>
              </div>
              <button type="submit" className="px-6 py-2.5 bg-[#00d9ff] text-[#080b12] font-semibold rounded-xl hover:shadow-[0_0_20px_-5px_#00d9ff] transition-shadow">
                Start Training
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase())).map((model, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={model.id} 
            className="group bg-[#0d1117] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors relative overflow-hidden"
          >
            {model.status === 'Training' && (
              <div className="absolute top-0 left-0 w-full h-1 bg-[#00d9ff]/20 overflow-hidden">
                <motion.div 
                  className="h-full bg-[#00d9ff]" 
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
              </div>
            )}
            
            <div className="flex justify-between items-start mb-5">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:scale-110 transition-transform duration-300">
                {getIcon(model.icon)}
              </div>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                model.status === 'Active' ? 'bg-[#34d399]/10 text-[#34d399] border-[#34d399]/20' :
                model.status === 'Training' ? 'bg-[#00d9ff]/10 text-[#00d9ff] border-[#00d9ff]/20 animate-pulse' :
                'bg-slate-500/10 text-slate-400 border-slate-500/20'
              }`}>
                {model.status}
              </span>
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-1">{model.name}</h3>
            <p className="text-sm text-slate-400 mb-6 font-mono">Region: {model.region}</p>
            
            <div className="flex items-center justify-between pt-5 border-t border-white/5">
              <div>
                <div className="text-xs text-slate-500 mb-0.5">Accuracy</div>
                <div className="font-mono text-[#00d9ff] text-lg font-medium">{model.accuracy}</div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleModelStatus(model.id)}
                  disabled={model.status === 'Training'}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors disabled:opacity-50"
                  title={model.status === 'Active' ? 'Stop Model' : 'Start Model'}
                >
                  {model.status === 'Active' ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => retrainModel(model.id)}
                  disabled={model.status === 'Training'}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#00d9ff] transition-colors disabled:opacity-50"
                  title="Retrain Model"
                >
                  <RefreshCw className={`w-4 h-4 ${model.status === 'Training' ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
