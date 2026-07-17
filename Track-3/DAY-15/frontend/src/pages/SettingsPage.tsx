import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { Bell, Key, Shield, User, Database, Cpu, Save, CheckCircle2, DollarSign, Clock, CreditCard, Plus } from "lucide-react";

type TabId = "aws" | "alerts" | "users" | "security" | "models" | "billing";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("aws");
  const [saved, setSaved] = useState(false);

  // Route Protection: Prevent Viewers from accessing Settings
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role === 'viewer') {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [navigate]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: "aws", title: "AWS Credentials", icon: <Key className="w-5 h-5" /> },
    { id: "alerts", title: "Alert Routing", icon: <Bell className="w-5 h-5" /> },
    { id: "models", title: "Model Parameters", icon: <Cpu className="w-5 h-5" /> },
    { id: "users", title: "User Management", icon: <User className="w-5 h-5" /> },
    { id: "billing", title: "Billing & Costs", icon: <DollarSign className="w-5 h-5" /> },
    { id: "security", title: "Security & Audit", icon: <Shield className="w-5 h-5" /> },
  ] as const;

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto min-h-[calc(100vh-4rem)] flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Platform Settings</h1>
        <p className="text-slate-400">Configure your integrations, alerts, and system preferences.</p>
      </motion.div>
      
      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        {/* Sidebar Navigation */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-72 flex-shrink-0"
        >
          <nav className="flex flex-col gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabId)}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    isActive 
                      ? "text-white bg-[#00d9ff]/10 shadow-[inset_4px_0_0_0_#00d9ff]" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className={isActive ? "text-[#00d9ff]" : ""}>{tab.icon}</span>
                  <span className="font-medium">{tab.title}</span>
                </button>
              );
            })}
          </nav>
        </motion.div>

        {/* Settings Content Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 bg-[#0d1117] border border-white/5 rounded-3xl p-8 relative overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00d9ff]/5 rounded-full blur-[100px] pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="relative z-10"
            >
              {activeTab === "aws" && <AwsSettings />}
              {activeTab === "alerts" && <AlertSettings />}
              {activeTab === "models" && <ModelSettings />}
              {activeTab === "users" && <UserSettings />}
              {activeTab === "billing" && <BillingSettings />}
              {activeTab === "security" && <SecuritySettings />}
            </motion.div>
          </AnimatePresence>

          {/* Global Save Action */}
          <div className="absolute bottom-0 left-0 w-full p-6 border-t border-white/5 bg-[#0d1117]/80 backdrop-blur-md flex justify-end">
            <button 
              onClick={handleSave}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                saved 
                  ? "bg-[#34d399]/20 text-[#34d399] border border-[#34d399]/50" 
                  : "bg-[#00d9ff] text-[#080b12] hover:shadow-[0_0_20px_-5px_#00d9ff]"
              }`}
            >
              {saved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              {saved ? "Saved" : "Save Changes"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// --- Sub-components for each Settings Tab ---

function AwsSettings() {
  return (
    <div className="pb-20 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">AWS Credentials</h2>
        <p className="text-slate-400 text-sm mb-6">Connect your AWS account to pull CloudWatch metrics securely.</p>
      </div>
      
      <div className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">IAM Access Key ID</label>
          <input 
            type="text" 
            defaultValue="AKIAIOSFODNN7EXAMPLE" 
            className="w-full bg-[#080b12] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00d9ff] focus:ring-1 focus:ring-[#00d9ff] transition-all font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Secret Access Key</label>
          <input 
            type="password" 
            defaultValue="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" 
            className="w-full bg-[#080b12] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00d9ff] focus:ring-1 focus:ring-[#00d9ff] transition-all font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Default Region</label>
          <select className="w-full bg-[#080b12] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00d9ff] transition-all appearance-none">
            <option>us-east-1 (N. Virginia)</option>
            <option>eu-west-1 (Ireland)</option>
            <option>ap-northeast-1 (Tokyo)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function AlertSettings() {
  const [alerts, setAlerts] = useState([
    { id: 1, name: "Slack Integration", desc: "Send alerts to #ops-alerts", active: true },
    { id: 2, name: "PagerDuty", desc: "Trigger high-priority incidents", active: true },
    { id: 3, name: "Email Notifications", desc: "Daily summary reports", active: false },
    { id: 4, name: "SMS Alerts", desc: "For critical infrastructure only", active: false },
  ]);

  const toggleAlert = (id: number) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  return (
    <div className="pb-20 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Alert Routing</h2>
        <p className="text-slate-400 text-sm mb-6">Configure where anomaly notifications should be sent.</p>
      </div>

      <div className="space-y-4 max-w-2xl">
        {alerts.map((alert) => (
          <div 
            key={alert.id} 
            onClick={() => toggleAlert(alert.id)}
            className="flex items-center justify-between p-4 bg-[#080b12] border border-white/5 rounded-xl cursor-pointer hover:bg-white/[0.02] transition-colors"
          >
            <div>
              <h3 className="text-white font-medium">{alert.name}</h3>
              <p className="text-sm text-slate-400">{alert.desc}</p>
            </div>
            <button className={`w-12 h-6 rounded-full relative transition-colors ${alert.active ? 'bg-[#00d9ff]' : 'bg-slate-700'}`}>
              <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${alert.active ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModelSettings() {
  const [sensitivity, setSensitivity] = useState(85);
  const [autoRetrain, setAutoRetrain] = useState(true);

  let label = "Normal";
  if (sensitivity > 80) label = "High";
  else if (sensitivity < 40) label = "Low";

  return (
    <div className="pb-20 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Model Parameters</h2>
        <p className="text-slate-400 text-sm mb-6">Fine-tune the sensitivity of the Random Forest predictor.</p>
      </div>

      <div className="space-y-8 max-w-2xl">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-slate-300">Anomaly Detection Sensitivity</label>
            <span className="text-[#00d9ff] font-mono text-sm">{label} ({(sensitivity / 100).toFixed(2)})</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={sensitivity}
            onChange={(e) => setSensitivity(parseInt(e.target.value))}
            className="w-full accent-[#00d9ff]" 
          />
          <p className="text-xs text-slate-500 mt-2">Higher sensitivity detects more anomalies but may increase false positives.</p>
        </div>

        <div className="flex items-center justify-between p-4 bg-[#080b12] border border-white/5 rounded-xl cursor-pointer hover:bg-white/[0.02] transition-colors" onClick={() => setAutoRetrain(!autoRetrain)}>
          <div>
            <h3 className="text-white font-medium">Auto-Retraining</h3>
            <p className="text-sm text-slate-400">Retrain models weekly on new telemetry data</p>
          </div>
          <button className={`w-12 h-6 rounded-full relative transition-colors ${autoRetrain ? 'bg-[#00d9ff]' : 'bg-slate-700'}`}>
            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${autoRetrain ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

function UserSettings() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8081/api/users");
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const [showInviteForm, setShowInviteForm] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("Viewer");
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;
    
    setIsInviting(true);
    setInviteError("");

    try {
      const response = await fetch("http://127.0.0.1:8081/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newUserEmail,
          role: newUserRole.toLowerCase()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send invite");
      }

      setUsers([...users, {
        id: Date.now(),
        name: newUserName,
        email: newUserEmail,
        role: newUserRole,
        status: "Pending"
      }]);
      
      setNewUserName("");
      setNewUserEmail("");
      setNewUserRole("Viewer");
      setShowInviteForm(false);
    } catch (err: any) {
      setInviteError(err.message);
    } finally {
      setIsInviting(false);
    }
  };

  const removeUser = async (id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8081/api/users/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        setUsers(users.filter(u => u.id !== id));
      } else {
        const errData = await response.json();
        console.error("Failed to delete user:", errData.error);
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  return (
    <div className="pb-20 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">User Management</h2>
          <p className="text-slate-400 text-sm mb-6">Manage team access and RBAC roles.</p>
        </div>
        <button 
          onClick={() => setShowInviteForm(!showInviteForm)}
          className="px-4 py-2 border border-white/10 rounded-lg text-sm text-white hover:bg-white/5 transition-colors"
        >
          {showInviteForm ? "Cancel" : "+ Invite Team Member"}
        </button>
      </div>

      <AnimatePresence>
        {showInviteForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
            onSubmit={handleInvite}
          >
            <div className="p-5 bg-[#080b12] border border-white/5 rounded-xl mb-6 flex flex-wrap gap-4 items-end max-w-4xl">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
                <input required value={newUserName} onChange={e => setNewUserName(e.target.value)} type="text" placeholder="Jane Doe" className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00d9ff] text-sm" />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
                <input required value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} type="email" placeholder="jane@ops.inc" className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00d9ff] text-sm" />
              </div>
              <div className="w-[150px]">
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Role</label>
                <select value={newUserRole} onChange={e => setNewUserRole(e.target.value)} className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00d9ff] text-sm appearance-none">
                  <option>Admin</option>
                  <option>Editor</option>
                  <option>Viewer</option>
                </select>
              </div>
              <button type="submit" disabled={isInviting} className="px-5 py-2 bg-[#00d9ff] text-[#080b12] font-medium rounded-lg hover:shadow-[0_0_15px_-3px_#00d9ff] transition-shadow text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                {isInviting ? "Sending..." : "Send Invite"}
              </button>
              {inviteError && (
                <div className="w-full mt-2 text-rose-400 text-sm bg-rose-500/10 px-3 py-2 rounded border border-rose-500/20">
                  {inviteError}
                </div>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="bg-[#080b12] border border-white/5 rounded-xl overflow-hidden max-w-4xl">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/5">
            <tr>
              <th className="px-6 py-3 text-sm font-medium text-slate-300">User</th>
              <th className="px-6 py-3 text-sm font-medium text-slate-300">Role</th>
              <th className="px-6 py-3 text-sm font-medium text-slate-300">Status</th>
              <th className="px-6 py-3 text-sm font-medium text-slate-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user) => (
              <tr key={user.id} className="group transition-colors hover:bg-white/[0.02]">
                <td className="px-6 py-4">
                  <div className="text-white font-medium">{user.name || "Team Member"}</div>
                  <div className="text-sm text-slate-500">{user.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    user.role === 'Admin' ? 'border-[#a78bfa]/30 text-[#a78bfa] bg-[#a78bfa]/10' :
                    'border-slate-500/30 text-slate-400 bg-slate-500/10'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">
                  <span className={`flex items-center gap-1.5 ${user.status === 'Active' ? 'text-[#34d399]' : 'text-[#f59e0b]'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-[#34d399]' : 'bg-[#f59e0b]'}`}></span>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => removeUser(user.id)} className="text-sm text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:underline">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && !isLoading && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500 text-sm">
                  No users found.
                </td>
              </tr>
            )}
            {isLoading && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500 text-sm">
                  Loading users...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SecuritySettings() {
  const [require2FA, setRequire2FA] = useState(true);
  const [timeout, setTimeoutVal] = useState("1 Hour");

  return (
    <div className="pb-20 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Security & Audit</h2>
        <p className="text-slate-400 text-sm mb-6">Configure platform security constraints.</p>
      </div>

      <div className="space-y-4 max-w-2xl">
        <div 
          onClick={() => setRequire2FA(!require2FA)}
          className="flex items-center justify-between p-4 bg-[#080b12] border border-white/5 rounded-xl cursor-pointer hover:bg-white/[0.02] transition-colors"
        >
          <div>
            <h3 className="text-white font-medium">Require Two-Factor Auth (2FA)</h3>
            <p className="text-sm text-slate-400">Enforce MFA for all team members.</p>
          </div>
          <button className={`w-12 h-6 rounded-full relative transition-colors ${require2FA ? 'bg-[#00d9ff]' : 'bg-slate-700'}`}>
            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${require2FA ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="p-4 bg-[#080b12] border border-white/5 rounded-xl">
          <h3 className="text-white font-medium mb-4">Session Timeout</h3>
          <select 
            value={timeout}
            onChange={(e) => setTimeoutVal(e.target.value)}
            className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00d9ff]"
          >
            <option>15 Minutes</option>
            <option>30 Minutes</option>
            <option>1 Hour</option>
            <option>24 Hours</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// --- Billing Sub-component ---
interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  payment_mode: string;
  expense_date: string;
  description: string;
}

function BillingSettings() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("EC2 Compute");

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await fetch("/api/expenses");
      const data = await res.json();
      setExpenses(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          amount: parseFloat(amount),
          category,
          payment_mode: "AWS Credits",
          expense_date: new Date().toISOString().split('T')[0],
          description: "Logged via Ops Center"
        })
      });
      if (res.ok) {
        setTitle("");
        setAmount("");
        setShowAddForm(false);
        fetchExpenses();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="pb-20 space-y-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Cloud Infrastructure Billing</h2>
          <p className="text-slate-400 text-sm">Track and manage your AWS usage costs and ML inference expenses.</p>
        </div>
        
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-lg text-sm text-white hover:bg-white/5 transition-colors"
        >
          {showAddForm ? "Cancel" : <><Plus className="w-4 h-4" /> Log Expense</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 max-w-4xl">
        <div className="bg-[#080b12] border border-white/5 p-5 rounded-xl">
          <div className="text-slate-400 text-sm mb-1">Total Tracked Costs</div>
          <div className="text-2xl font-bold text-white">${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="bg-[#080b12] border border-white/5 p-5 rounded-xl">
          <div className="text-slate-400 text-sm mb-1">Total Entries</div>
          <div className="text-2xl font-bold text-white">{expenses.length}</div>
        </div>
      </div>
      
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
            onSubmit={handleAddExpense}
          >
            <div className="p-5 bg-[#080b12] border border-[#00d9ff]/30 rounded-xl mb-6 flex flex-wrap gap-4 items-end max-w-4xl shadow-[0_0_20px_-10px_rgba(0,217,255,0.1)]">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Expense Title</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} type="text" placeholder="e.g. SageMaker Training Instance" className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00d9ff] text-sm" />
              </div>
              <div className="w-[120px]">
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Amount ($)</label>
                <input required value={amount} onChange={e => setAmount(e.target.value)} type="number" step="0.01" min="0" placeholder="125.50" className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00d9ff] text-sm" />
              </div>
              <div className="w-[180px]">
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00d9ff] text-sm appearance-none">
                  <option>EC2 Compute</option>
                  <option>RDS Database</option>
                  <option>ML Inference (SageMaker)</option>
                  <option>S3 Storage</option>
                  <option>Other</option>
                </select>
              </div>
              <button type="submit" className="px-5 py-2 bg-[#00d9ff] text-[#080b12] font-medium rounded-lg hover:shadow-[0_0_15px_-3px_#00d9ff] transition-shadow text-sm">
                Save Cost
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
      
      <div className="bg-[#080b12] border border-white/5 rounded-xl overflow-hidden max-w-4xl">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading expenses...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-6 py-3 text-sm font-medium text-slate-300">Description</th>
                <th className="px-6 py-3 text-sm font-medium text-slate-300">Category</th>
                <th className="px-6 py-3 text-sm font-medium text-slate-300">Date</th>
                <th className="px-6 py-3 text-sm font-medium text-slate-300 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500 text-sm">
                    No infrastructure expenses recorded yet.
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{expense.title}</div>
                      <div className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                        <CreditCard className="w-3 h-3" /> {expense.payment_mode}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md bg-white/5 text-slate-300 text-xs border border-white/10">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> {expense.expense_date}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono text-[#34d399] font-medium">
                        ${expense.amount.toFixed(2)}
                      </span>
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
