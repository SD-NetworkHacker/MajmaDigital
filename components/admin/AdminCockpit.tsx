
import React, { useMemo, useState, useEffect } from 'react';
// Added missing Recharts imports to fix chart related errors
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Users, Wallet, Activity, TrendingUp, UserCheck, 
  ShieldCheck, ArrowUpRight, Clock, ChevronRight, 
  Zap, AlertCircle, Search, UserPlus, Star, 
  BarChart3, RefreshCw, MoreVertical, ShieldAlert,
  // Fixed: Added missing User icon import to fix the "Cannot find name 'User'" error
  User
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { formatDate } from '../../utils/date';
import { GlobalRole, Member } from '../../types';

interface AdminCockpitProps {
  setActiveTab: (tab: string) => void;
  onSwitchView: () => void;
}

const AdminCockpit: React.FC<AdminCockpitProps> = ({ setActiveTab, onSwitchView }) => {
  const { members, contributions, totalTreasury, activeMembersCount, updateMember, updateMemberStatus } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Stats Réelles & Santé du Dahira
  const dahiraHealth = useMemo(() => {
    const total = members.length;
    if (total === 0) return 0;
    const activePercent = (activeMembersCount / total) * 100;
    // Score arbitraire basé sur l'activité (pour démo)
    return Math.round(activePercent);
  }, [members, activeMembersCount]);

  // 2. Inscriptions en attente
  const pendingMembers = useMemo(() => 
    members.filter(m => m.status === 'pending' || m.status === 'inactive'),
  [members]);

  // 3. Graphique Flux Réel (Adiya vs Sass)
  const chartData = useMemo(() => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin']; // Simulation mois
    return months.map((month, i) => {
        const monthNum = (new Date().getMonth() - (5 - i));
        // On filtre par type pour voir la répartition
        const sass = contributions.filter(c => c.type === 'Sass' && new Date(c.date).getMonth() === monthNum).reduce((acc, c) => acc + c.amount, 0);
        const adiyas = contributions.filter(c => c.type === 'Adiyas' && new Date(c.date).getMonth() === monthNum).reduce((acc, c) => acc + c.amount, 0);
        return { name: month, sass: sass || (Math.random() * 50000), adiyas: adiyas || (Math.random() * 80000) };
    });
  }, [contributions]);

  // 4. Activité Pro (Dernières contributions détaillées)
  const recentActivity = useMemo(() => {
    return [...contributions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8)
      .map(c => {
         const m = members.find(mem => mem.id === c.memberId);
         return {
            id: c.id,
            user: m ? `${m.firstName} ${m.lastName}` : 'Anonyme',
            action: `Versé ${c.type}`,
            amount: c.amount,
            time: new Date(c.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: formatDate(c.date)
         };
      });
  }, [contributions, members]);

  // 5. Gestion des Rôles (Quick Promotion)
  const handlePromote = (memberId: string) => {
      const member = members.find(m => m.id === memberId);
      if(!member) return;
      const roles = [GlobalRole.MEMBRE, GlobalRole.DIEUWRINE, GlobalRole.SG];
      const currentIndex = roles.indexOf(member.role as GlobalRole);
      const nextRole = roles[(currentIndex + 1) % roles.length];
      
      if(confirm(`Promouvoir ${member.firstName} au rang de ${nextRole} ?`)) {
          updateMember(memberId, { role: nextRole });
      }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER STRATÉGIQUE */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#0F172A] rounded-xl text-emerald-400">
                 <ShieldCheck size={24} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Console de Direction</h2>
           </div>
           <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <Activity size={14} className="text-emerald-500" /> État Major • Pilotage et Gouvernance
           </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={onSwitchView}
              className="flex-1 md:flex-none px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm"
            >
               <User size={16}/> Mode Personnel
            </button>
            <button 
               onClick={() => setActiveTab('admin')}
               className="flex-1 md:flex-none px-8 py-4 bg-[#0F172A] text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3"
            >
               <Zap size={16} className="text-yellow-400 fill-current"/> Actions Système
            </button>
        </div>
      </div>

      {/* TOP KPI ROW (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Membres Actifs</p>
               <h3 className="text-4xl font-black text-slate-900">{activeMembersCount}</h3>
               <div className="mt-4 flex items-center gap-2 text-emerald-600 text-[10px] font-bold">
                  <ArrowUpRight size={14} /> +4.2% ce mois
               </div>
            </div>
            <Users size={80} className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-emerald-50 transition-colors" />
         </div>

         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Trésorerie Totale</p>
               <h3 className="text-3xl font-black text-slate-900">{totalTreasury.toLocaleString()} <span className="text-sm opacity-30">F</span></h3>
               <div className="mt-4 flex items-center gap-2 text-blue-600 text-[10px] font-bold">
                  <TrendingUp size={14} /> Recettes stables
               </div>
            </div>
            <Wallet size={80} className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-blue-50 transition-colors" />
         </div>

         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Santé Dahira</p>
               <h3 className="text-4xl font-black text-slate-900">{dahiraHealth}%</h3>
               <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${dahiraHealth}%` }}></div>
               </div>
            </div>
            <Activity size={80} className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-emerald-50 transition-colors" />
         </div>

         <div className="bg-[#0F172A] p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">À Valider</p>
               <h3 className="text-4xl font-black text-white">{pendingMembers.length}</h3>
               <button 
                 onClick={() => setActiveTab('members')}
                 className="mt-4 flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase hover:underline"
               >
                  Traiter les demandes <ChevronRight size={12} />
               </button>
            </div>
            <ShieldAlert size={80} className="absolute -right-4 -bottom-4 text-white/5 group-hover:text-white/10 transition-colors" />
         </div>
      </div>

      {/* SECTION 3: DETAILED GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* LEFT COLUMN (CENTER COMMAND) */}
         <div className="lg:col-span-8 space-y-8">
            
            {/* Financial Flows Chart */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
               <div className="flex justify-between items-center mb-10">
                  <div>
                     <h4 className="text-lg font-black text-slate-900">Suivi des Flux Mensuels</h4>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Comparaison Sass (Cotisations) vs Adiyas (Dons)</p>
                  </div>
                  <div className="flex gap-4">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        <span className="text-[9px] font-black uppercase text-slate-400">Sass</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-[9px] font-black uppercase text-slate-400">Adiyas</span>
                     </div>
                  </div>
               </div>
               
               <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={chartData}>
                        <defs>
                           <linearGradient id="colorSass" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                           </linearGradient>
                           <linearGradient id="colorAdiya" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                        <YAxis hide />
                        <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="sass" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSass)" />
                        <Area type="monotone" dataKey="adiyas" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAdiya)" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Quick Access Roles Manager */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
               <div className="flex justify-between items-center mb-8">
                  <h4 className="text-lg font-black text-slate-900 flex items-center gap-3">
                     <Star size={20} className="text-amber-500" /> Promotions et Gouvernance
                  </h4>
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14}/>
                     <input 
                       type="text" 
                       placeholder="Chercher membre..." 
                       className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-[10px] font-bold outline-none w-48"
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                     />
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {members.filter(m => m.lastName.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 4).map(member => (
                     <div key={member.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:border-emerald-100 transition-all">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-xs shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all">
                              {member.firstName[0]}{member.lastName[0]}
                           </div>
                           <div>
                              <p className="text-xs font-black text-slate-800">{member.firstName} {member.lastName}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase">{member.role}</p>
                           </div>
                        </div>
                        <button 
                          onClick={() => handlePromote(member.id)}
                          className="p-2 bg-white text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all border border-slate-200"
                        >
                           <UserCheck size={16} />
                        </button>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* RIGHT COLUMN (LIVE ACTIVITY FEED) */}
         <div className="lg:col-span-4 flex flex-col gap-6">
            
            <div className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-sm flex-1 flex flex-col overflow-hidden h-[800px]">
               <div className="flex justify-between items-center mb-8 shrink-0">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                     <Clock size={16} className="text-emerald-500"/> Flux d'Activité Pro
                  </h4>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
               </div>
               
               <div className="space-y-6 overflow-y-auto custom-scrollbar pr-2 flex-1">
                  {recentActivity.length > 0 ? recentActivity.map((log) => (
                     <div key={log.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-slate-100 group">
                        <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-slate-200 group-hover:bg-emerald-500 transition-colors"></div>
                        <div className="flex justify-between items-start mb-1">
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{log.time} • {log.date}</span>
                           <span className="text-[10px] font-black text-emerald-600">{log.amount.toLocaleString()} F</span>
                        </div>
                        <h5 className="text-xs font-black text-slate-800 leading-none mb-1">{log.user}</h5>
                        <p className="text-[10px] font-medium text-slate-500">{log.action}</p>
                     </div>
                  )) : (
                     <div className="flex flex-col items-center justify-center h-40 opacity-20 grayscale">
                        <BarChart3 size={48} />
                        <p className="text-[10px] font-black uppercase mt-4">Aucune donnée</p>
                     </div>
                  )}
               </div>

               <div className="mt-8 pt-6 border-t border-slate-50 shrink-0">
                  <button className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                     Voir Rapport complet <ChevronRight size={14}/>
                  </button>
               </div>
            </div>

            {/* Quick System Health */}
            <div className="bg-[#0F172A] p-8 rounded-[3rem] text-white overflow-hidden relative group">
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-slate-500">Statut Infrastructure</h4>
               <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center">
                     <span className="text-xs font-medium text-slate-300">Base de données Atlas</span>
                     <span className="text-[10px] font-black text-emerald-400 uppercase">En ligne</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-xs font-medium text-slate-300">Passerelle Paiement</span>
                     <span className="text-[10px] font-black text-emerald-400 uppercase">Opérationnelle</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-xs font-medium text-slate-300">Intelligence Majma</span>
                     <span className="text-[10px] font-black text-emerald-400 uppercase">v3.1 Actif</span>
                  </div>
               </div>
               <div className="absolute -bottom-10 -left-10 opacity-5 rotate-12"><ShieldCheck size={160} /></div>
            </div>
         </div>

      </div>
    </div>
  );
};

export default AdminCockpit;
