import React, { useState } from 'react';
import { Cpu, Database, Activity, Terminal, ShieldAlert, User, Zap, RefreshCcw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface TechnicalDashboardProps {
  onSwitchView: () => void;
}

const TechnicalDashboard: React.FC<TechnicalDashboardProps> = ({ onSwitchView }) => {
  const [performanceData] = useState([
    { time: '10:00', ai: 45 }, { time: '10:05', ai: 30 },
    { time: '10:10', ai: 60 }, { time: '10:15', ai: 40 },
    { time: '10:20', ai: 85 }, { time: '10:25', ai: 50 },
  ]);

  return (
    <div className="space-y-8 animate-in fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-slate-900 rounded-xl text-emerald-400">
                 <Terminal size={24} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Root Console</h2>
           </div>
           <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <Cpu size={14} className="text-blue-500" /> Infrastructure • Performance • Logs
           </p>
        </div>
        <button onClick={onSwitchView} className="px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3 shadow-sm">
           <User size={16}/> Mode Personnel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Charge CPU</p>
            <h3 className="text-4xl font-black text-slate-900">12%</h3>
            <div className="mt-4 flex items-center gap-2 text-emerald-600 text-[10px] font-bold">
               <Activity size={14} /> Système Stable
            </div>
            <Cpu size={80} className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-blue-50 transition-colors" />
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Uptime</p>
            <h3 className="text-4xl font-black text-slate-900">99.9%</h3>
            <div className="mt-4 flex items-center gap-2 text-blue-600 text-[10px] font-bold">
               <RefreshCcw size={14} /> Dernier reboot : 12j
            </div>
            <Zap size={80} className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-yellow-50 transition-colors" />
         </div>
         <div className="bg-[#0F172A] p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">DB Atlas</p>
            <h3 className="text-4xl font-black text-white">45ms</h3>
            <p className="mt-4 text-emerald-400 text-[10px] font-black uppercase tracking-widest">Connecté</p>
            <Database size={80} className="absolute -right-4 -bottom-4 text-white/5 group-hover:text-white/10 transition-colors" />
         </div>
      </div>

      <div className="glass-card p-10 bg-white border-slate-100">
         <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-10 flex items-center gap-3">
            <Terminal size={20} className="text-indigo-600" /> Logs Temps Réel
         </h4>
         <div className="bg-slate-900 rounded-2xl p-6 font-mono text-[10px] text-emerald-400 space-y-2 max-h-64 overflow-y-auto">
            <p className="opacity-60">[10:45:12] AUTH_SUCCESS: User sidy@majma.sn connected</p>
            <p className="opacity-60">[10:45:15] DB_QUERY: Fetching contributions (0.1ms)</p>
            <p className="opacity-80 text-blue-400">[10:46:01] SYSTEM_BACKUP: Cloud storage sync completed</p>
            <p className="opacity-60">[10:46:22] AI_REQ: Translation requested for "Mawahibou"</p>
            <p className="animate-pulse">_</p>
         </div>
      </div>
    </div>
  );
};

export default TechnicalDashboard;