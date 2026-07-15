import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, CreditCard, Plus } from "lucide-react";

interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  payment_mode: string;
  expense_date: string;
  description: string;
}

export default function BillingPage() {
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
        fetchExpenses(); // Refresh list
      }
    } catch (e) {
      console.error(e);
    }
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto pb-20">
      <div className="flex justify-between items-start mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-2">Cloud Infrastructure Billing</h1>
          <p className="text-slate-400">Track and manage your AWS usage costs and ML inference expenses.</p>
        </motion.div>
        
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#00d9ff]/10 text-[#00d9ff] border border-[#00d9ff]/20 rounded-xl font-medium hover:bg-[#00d9ff]/20 transition-colors"
        >
          {showAddForm ? "Cancel" : <><Plus className="w-4 h-4" /> Log Expense</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#0d1117] border border-white/5 p-6 rounded-2xl">
          <div className="text-slate-400 text-sm mb-1">Total Tracked Costs</div>
          <div className="text-3xl font-bold text-white">${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="bg-[#0d1117] border border-white/5 p-6 rounded-2xl">
          <div className="text-slate-400 text-sm mb-1">Total Entries</div>
          <div className="text-3xl font-bold text-white">{expenses.length}</div>
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
            <div className="p-6 bg-[#0d1117] border border-[#00d9ff]/30 rounded-2xl mb-8 flex flex-wrap gap-5 items-end shadow-[0_0_30px_-10px_rgba(0,217,255,0.15)]">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-slate-300 mb-2">Expense Title</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} type="text" placeholder="e.g. SageMaker Training Instance" className="w-full bg-[#080b12] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00d9ff] transition-colors" />
              </div>
              <div className="w-[150px]">
                <label className="block text-sm font-medium text-slate-300 mb-2">Amount ($)</label>
                <input required value={amount} onChange={e => setAmount(e.target.value)} type="number" step="0.01" min="0" placeholder="125.50" className="w-full bg-[#080b12] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00d9ff] transition-colors" />
              </div>
              <div className="w-[200px]">
                <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[#080b12] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00d9ff] transition-colors appearance-none">
                  <option>EC2 Compute</option>
                  <option>RDS Database</option>
                  <option>ML Inference (SageMaker)</option>
                  <option>S3 Storage</option>
                  <option>Other</option>
                </select>
              </div>
              <button type="submit" className="px-6 py-2.5 bg-[#00d9ff] text-[#080b12] font-semibold rounded-xl hover:shadow-[0_0_20px_-5px_#00d9ff] transition-shadow">
                Save Cost
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
      
      <div className="bg-[#0d1117] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-400">Loading expenses...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-slate-300">Description</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-300">Category</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-300">Date</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-300 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                    No infrastructure expenses recorded yet.
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-white/[0.02] transition-colors">
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
