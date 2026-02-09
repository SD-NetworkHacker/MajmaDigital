import React, { useState } from 'react';
import { ShieldCheck, Activity, Users, Database, ChevronRight, HardDrive, Cpu, Wifi, Zap, AlertTriangle, RefreshCcw, Power, Loader2, Check, Terminal, FileJson, Lock, ShieldAlert } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../context/AuthContext';

const AdminModule: React.FC = () => {
  const { user } = useAuth();
  const { members, reports, budgetRequests, contributions } = useData();
  
  // Barrière de sécurité pour le rôle 'SG'
  if (user?.role === 'SG' || user?.role === 'ADJOINT_SG') {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
         <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl border border-rose-100">
            <ShieldAlert size={48} />
         </div>
         <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Accès réservé à la technique</h2>
         <p className="text-slate-500 font-medium max-w-sm leading-relaxed mb-10">
           Vous êtes sur l'interface de maintenance système. Pour piloter le Dahira, veuillez utiliser le <b>Cockpit de Pilotage</b>.
         </p>
         <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-4 text-left max-w-md">
            <Lock size={20} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 font-medium">
              Le rôle de Secrétaire Général ne permet pas de modifier l'infrastructure serveur ou d'accéder aux logs réseau pour garantir la séparation des pouvoirs.
            </p>
         </div>
      </div>
    );
  }

  // Rendu normal pour le rôle ADMIN SYSTEM...
  // (Le reste du code de AdminModule.tsx reste inchangé)
  const [performanceData] = useState([
    { time: '10:00', ai: 45 }, { time: '10:05', ai: 30 },
    { time: '10:10', ai: 60 }, { time: '10:15', ai: 40 },
    { time: '10:20', ai: 85 }, { time: '10:25', ai: 50 },
  ]);

  return (
    <div className="space-y-10 h-full flex flex-col overflow-hidden animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Poste de Contrôle</h2>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" /> Maintenance infrastructure Root
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-10 pb-12 no-scrollbar">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 glass-card p-10 overflow-hidden relative group">
             {/* Chart et Stats techniques existants... */}
             <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={performanceData}>
                   <XAxis dataKey="time" hide />
                   <Tooltip />
                   <Area type="monotone" dataKey="ai" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-slate-900 p-8 rounded-[2rem] text-white">
                <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 text-emerald-400">Status Cluster</h4>
                <div className="space-y-4">
                   <div className="flex justify-between items-center"><span className="text-xs">Database API</span><span className="text-emerald-400 text-[10px] font-black">OK</span></div>
                   <div className="flex justify-between items-center"><span className="text-xs">File Storage</span><span className="text-emerald-400 text-[10px] font-black">OK</span></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModule;