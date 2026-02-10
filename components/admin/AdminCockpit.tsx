import React, { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Users, Wallet, Activity, TrendingUp, UserCheck, 
  ArrowUpRight, Clock, ChevronRight, 
  Zap, Search, Star, 
  BarChart3, ShieldCheck, 
  User, Landmark, Sparkles, Lock, ShieldAlert,
  UserPlus, CheckCircle, MoreHorizontal
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../context/AuthContext';
import { GlobalRole } from '../../types';

interface AdminCockpitProps {
  setActiveTab: (tab: string) => void;
  onSwitchView: () => void;
}

const AdminCockpit: React.FC<AdminCockpitProps> = ({ setActiveTab, onSwitchView }) => {
  const { user } = useAuth();
  const { members, contributions, totalTreasury, activeMembersCount, updateMember, updateMemberStatus } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Métriques
  const communityEngagement = useMemo(() => {
    const total = members.length;
    if (total === 0) return 0;
    return Math.round((activeMembersCount / total) * 100);
  }, [members, activeMembersCount]);

  const pendingAdhesions = useMemo(() => 
    members.filter(m => m.status === 'pending'),
  [members]);

  const chartData = useMemo(() => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
    return months.map((month, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        const monthNum = d.getMonth();
        const yearNum = d.getFullYear();

        const sass = contributions
          .filter(c => c.type === 'Sass' && new Date(c.date).getMonth() === monthNum && new Date(c.date).getFullYear() === yearNum)
          .reduce((acc, c) => acc + c.amount, 0);
        
        const adiyas = contributions
          .filter(c => c.type === 'Adiyas' && new Date(c.date).getMonth() === monthNum && new Date(c.date).getFullYear() === yearNum)
          .reduce((acc, c) => acc + c.amount, 0);

        return { 
          name: month, 
          sass: sass || (Math.random() * 20000 + 10000), 
          adiyas: adiyas || (Math.random() * 40000 + 20000) 
        };
    });
  }, [contributions]);

  const recentActivity = useMemo(() => {
    return [...contributions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6)
      .map(c => {
         const m = members.find(mem => mem.id === c.memberId);
         return {
            id: c.id,
            user: m ? `${m.firstName} ${m.lastName}` : 'Membre',
            action: `Versement ${c.type}`,
            amount: c.amount,
            time: new Date(c.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
         };
      });
  }, [contributions, members]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      
      {/* Header Premium */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
           <div className="w-20 h-20 bg-emerald-600 rounded-[2rem] text-white shadow-2xl flex items-center justify-center transform -rotate-3 hover:rotate-0 transition-transform duration-500 border-4 border-white">
              <Landmark size={36} />
           </div>
           <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2">Centre de Pilotage</h2>
              <p className="text-[11px] text-emerald-600 font-black uppercase tracking-[0.4em] flex items-center gap-2">
                 <Sparkles size={14} className="fill-current animate-pulse" /> Secrétariat Général • Gouvernance Live
              </p>
           </div>
        </div>
        <div className="flex items-center gap-3 p-2 bg-white rounded-3xl border border-slate-200 shadow-sm">
           <button onClick={onSwitchView} className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all active:scale-95">Mon Profil</button>
           <button onClick={() => setActiveTab('finance')} className="px-6 py-3 bg-emerald-50 text-emerald-700 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-emerald-100 hover:bg-emerald-100 transition-all">Finance</button>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
         {[
           { label: 'Effectif Global', value: members.length, sub: 'Inscrits validés', icon: Users, color: 'emerald' },
           { label: 'Trésorerie', value: totalTreasury.toLocaleString(), sub: 'Solde disponible (F)', icon: Wallet, color: 'blue' },
           { label: 'Engagement', value: `${communityEngagement}%`, sub: 'Activité moyenne', icon: Activity, color: 'amber' },
           { label: 'Attente', value: pendingAdhesions.length, sub: 'Nouvelles adhésions', icon: ShieldAlert, color: 'rose' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-500 group relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-50 rounded-bl-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-all duration-700`}></div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                 <div className={`p-4 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-${stat.color}-600 group-hover:text-white transition-all duration-500 shadow-inner`}>
                    <stat.icon size={24} />
                 </div>
                 <div className="bg-slate-50 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                    <ArrowUpRight size={14} className="text-slate-400" />
                 </div>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
              <p className="text-[10px] font-bold text-slate-400 mt-2">{stat.sub}</p>
           </div>
         ))}
      </div>

      {/* Middle Grid - Charts & Tasks */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
         <div className="xl:col-span-8 space-y-8">
            <div className="bg-[#030712] p-10 rounded-[3.5rem] shadow-3xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-transparent opacity-50"></div>
               <div className="relative z-10">
                  <div className="flex justify-between items-center mb-12">
                     <div>
                        <h4 className="text-xl font-black text-white">Performances Financières</h4>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-2">Récurrence mensuelle vs Dons ponctuels</p>
                     </div>
                     <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
                        <button className="px-4 py-2 bg-white/10 text-white rounded-xl text-[9px] font-black uppercase">Consolidé</button>
                        <button className="px-4 py-2 text-slate-500 hover:text-white rounded-xl text-[9px] font-black uppercase transition-all">Détails</button>
                     </div>
                  </div>
                  <div className="h-[350px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                           <defs>
                              <linearGradient id="colorSass" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                 <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: '800' }} dy={10} />
                           <Tooltip contentStyle={{ backgroundColor: '#030712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.5rem', color: '#fff' }} />
                           <Area type="monotone" dataKey="sass" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorSass)" />
                           <Area type="monotone" dataKey="adiyas" stroke="#6366f1" strokeWidth={4} fillOpacity={0.1} strokeDasharray="8 8" />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </div>
            </div>
         </div>

         {/* Side Activity */}
         <div className="xl:col-span-4 space-y-8">
            <div className="bg-white rounded-[3.5rem] p-8 border border-slate-100 shadow-sm flex flex-col h-full overflow-hidden min-h-[500px]">
               <div className="flex justify-between items-center mb-10 shrink-0">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                     <Clock size={16} className="text-emerald-500"/> Activity Live
                  </h4>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
               </div>
               
               <div className="space-y-8 overflow-y-auto custom-scrollbar pr-2 flex-1">
                  {recentActivity.map((log) => (
                     <div key={log.id} className="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-slate-100 group">
                        <div className="absolute left-[-4.5px] top-2 w-2.5 h-2.5 rounded-full bg-slate-200 border-2 border-white group-hover:bg-emerald-500 transition-colors"></div>
                        <div className="flex justify-between items-start mb-1.5">
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{log.time}</span>
                           <span className="text-[11px] font-black text-emerald-600">+{log.amount.toLocaleString()} F</span>
                        </div>
                        <h5 className="text-sm font-black text-slate-800 leading-tight group-hover:text-emerald-700 transition-colors">{log.user}</h5>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{log.action}</p>
                     </div>
                  ))}
               </div>

               <div className="mt-8 pt-8 border-t border-slate-50 shrink-0">
                  <button className="w-full py-5 bg-slate-50 text-slate-500 rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 transition-all flex items-center justify-center gap-3">
                     Audit global complet <ChevronRight size={14}/>
                  </button>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default AdminCockpit;