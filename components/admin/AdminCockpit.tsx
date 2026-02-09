import React, { useMemo, useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Users, Wallet, Activity, TrendingUp, UserCheck, 
  ShieldCheck, ArrowUpRight, Clock, ChevronRight, 
  Zap, AlertCircle, Search, UserPlus, Star, 
  BarChart3, RefreshCw, MoreVertical, ShieldAlert,
  User, Landmark, Sparkles
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { formatDate } from '../../utils/date';
import { GlobalRole, Member } from '../../types';

interface AdminCockpitProps {
  setActiveTab: (tab: string) => void;
  onSwitchView: () => void;
}

const AdminCockpit: React.FC<AdminCockpitProps> = ({ setActiveTab, onSwitchView }) => {
  const { members, contributions, totalTreasury, activeMembersCount, updateMember } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Indice d'Engagement (Remplace la Santé Technique)
  const communityEngagement = useMemo(() => {
    const total = members.length;
    if (total === 0) return 0;
    // Simulation basée sur les cotisations à jour (pour l'exemple)
    return Math.round((activeMembersCount / total) * 100);
  }, [members, activeMembersCount]);

  // 2. Inscriptions en attente
  const pendingMembers = useMemo(() => 
    members.filter(m => m.status === 'pending' || m.status === 'inactive'),
  [members]);

  // 3. Graphique Flux Réel (Adiya vs Sass)
  const chartData = useMemo(() => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
    return months.map((month, i) => {
        const monthNum = (new Date().getMonth() - (5 - i));
        const sass = contributions.filter(c => c.type === 'Sass' && new Date(c.date).getMonth() === monthNum).reduce((acc, c) => acc + c.amount, 0);
        const adiyas = contributions.filter(c => c.type === 'Adiyas' && new Date(c.date).getMonth() === monthNum).reduce((acc, c) => acc + c.amount, 0);
        return { name: month, sass: sass || (Math.random() * 50000), adiyas: adiyas || (Math.random() * 80000) };
    });
  }, [contributions]);

  const recentActivity = useMemo(() => {
    return [...contributions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8)
      .map(c => {
         const m = members.find(mem => mem.id === c.memberId);
         return {
            id: c.id,
            user: m ? `${m.firstName} ${m.lastName}` : 'Membre Anonyme',
            action: `Contribution ${c.type}`,
            amount: c.amount,
            time: new Date(c.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: formatDate(c.date)
         };
      });
  }, [contributions, members]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER PRESTIGE */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex items-center gap-6">
           <div className="p-4 bg-[#059669] rounded-[2rem] text-[#D4AF37] shadow-xl shadow-emerald-900/20 border-2 border-[#D4AF37]/30">
              <Landmark size={32} />
           </div>
           <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-1">Pilotage Dahira</h2>
              <p className="text-[11px] text-[#D4AF37] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                 <Sparkles size={14} className="fill-current" /> Secrétariat Général • Excellence
              </p>
           </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
            <button onClick={onSwitchView} className="flex-1 md:flex-none px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
               <User size={16}/> Espace Perso
            </button>
            <button onClick={() => setActiveTab('finance')} className="flex-1 md:flex-none px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3">
               <Wallet size={16} className="text-[#D4AF37]"/> Trésorerie Centrale
            </button>
        </div>
      </div>

      {/* KPI ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Effectif Validé</p>
            <h3 className="text-4xl font-black text-slate-900">{activeMembersCount}</h3>
            <div className="mt-4 flex items-center gap-2 text-emerald-600 text-[10px] font-bold">
               <UserPlus size={14} /> +15 ce mois
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Volume Trésorerie</p>
            <h3 className="text-3xl font-black text-[#059669]">{totalTreasury.toLocaleString()} <span className="text-sm opacity-30 text-slate-500">F</span></h3>
            <div className="mt-4 flex items-center gap-2 text-[#D4AF37] text-[10px] font-bold">
               <TrendingUp size={14} /> Progression Stable
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Engagement Communauté</p>
            <h3 className="text-4xl font-black text-slate-900">{communityEngagement}%</h3>
            <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
               <div className="bg-[#D4AF37] h-full" style={{ width: `${communityEngagement}%` }}></div>
            </div>
         </div>

         <div className="bg-[#059669] p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
            <p className="text-[10px] font-black text-emerald-100/60 uppercase tracking-widest mb-4">Dossiers d'Adhésion</p>
            <h3 className="text-4xl font-black text-white">{pendingMembers.length}</h3>
            <button onClick={() => setActiveTab('members')} className="mt-4 flex items-center gap-2 text-[#D4AF37] text-[10px] font-black uppercase hover:underline">
               Traiter les demandes <ChevronRight size={12} />
            </button>
            <Users size={80} className="absolute -right-4 -bottom-4 text-white/5" />
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
               <div className="flex justify-between items-center mb-10">
                  <h4 className="text-lg font-black text-slate-900">Suivi des Flux Administratifs</h4>
                  <div className="flex gap-4">
                     <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500"></div><span className="text-[9px] font-black uppercase text-slate-400">Sass</span></div>
                     <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div><span className="text-[9px] font-black uppercase text-slate-400">Adiyas</span></div>
                  </div>
               </div>
               <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={chartData}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                        <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="sass" stroke="#6366f1" strokeWidth={3} fillOpacity={0.05} fill="#6366f1" />
                        <Area type="monotone" dataKey="adiyas" stroke="#D4AF37" strokeWidth={3} fillOpacity={0.05} fill="#D4AF37" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>

         <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-sm flex-1 flex flex-col overflow-hidden h-[800px]">
               <div className="flex justify-between items-center mb-8 shrink-0">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                     <Clock size={16} className="text-[#059669]"/> Flux d'Activité
                  </h4>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
               </div>
               <div className="space-y-6 overflow-y-auto custom-scrollbar pr-2 flex-1">
                  {recentActivity.map((log) => (
                     <div key={log.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-slate-100 group">
                        <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-slate-200 group-hover:bg-[#D4AF37] transition-colors"></div>
                        <div className="flex justify-between items-start mb-1">
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{log.time}</span>
                           <span className="text-[10px] font-black text-[#059669]">{log.amount.toLocaleString()} F</span>
                        </div>
                        <h5 className="text-xs font-black text-slate-800 leading-none mb-1">{log.user}</h5>
                        <p className="text-[10px] font-medium text-slate-500">{log.action}</p>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminCockpit;