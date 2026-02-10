import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, TrendingUp, Calendar, Sparkles, 
  Clock, ChevronRight, Zap, 
  BellRing, FileText,
  Activity, Wallet, UserPlus, CreditCard, MessageSquare,
  PieChart as PieIcon, RefreshCcw, Bus, BookOpen, Heart, Timer,
  ShieldCheck, VenetianMask, Crown, Briefcase, User, Search, X, Cpu, HardDrive, Wifi, Database, AlertTriangle, Power,
  Loader2, Check, AlertCircle, Terminal, ScanFace
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getSmartInsight } from '../../services/geminiService';
import { Member, Event, Contribution, GlobalRole } from '../../types';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../context/AuthContext';

interface AdminDashboardProps {
  members: Member[];
  events: Event[];
  contributions: Contribution[];
  setActiveTab: (tab: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ setActiveTab }) => {
  const { reports, members, contributions, events, totalTreasury, activeMembersCount } = useData();
  const { impersonate, user } = useAuth();
  
  const [insight, setInsight] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  
  const [performanceData] = useState([
    { time: '10:00', load: 12, ai: 45 },
    { time: '10:05', load: 15, ai: 30 },
    { time: '10:10', load: 14, ai: 60 },
    { time: '10:15', load: 18, ai: 40 },
    { time: '10:20', load: 13, ai: 85 },
    { time: '10:25', load: 16, ai: 50 },
  ]);
  
  const [simSearch, setSimSearch] = useState('');
  const [simTab, setSimTab] = useState<'presets' | 'search'>('presets');

  const [adminActionStatus, setAdminActionStatus] = useState<Record<string, 'idle' | 'loading' | 'success'>>({
    backup: 'idle',
    maintenance: 'idle',
    roles: 'idle',
    reboot: 'idle'
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 5) setGreeting('Bonne nuit');
    else if (hour < 12) setGreeting('Bonjour');
    else if (hour < 18) setGreeting('Bon après-midi');
    else setGreeting('Bonsoir');
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchInsight = async () => {
      const cachedInsight = sessionStorage.getItem('dashboard_insight');
      if (cachedInsight) {
        if (isMounted) setInsight(cachedInsight);
        return;
      }

      if ((members?.length || 0) === 0 && (contributions?.length || 0) === 0) {
        if (isMounted) setInsight("Bienvenue sur MajmaDigital. Commencez par inscrire des membres ou enregistrer des cotisations pour activer l'intelligence artificielle.");
        return;
      }
      
      if (isAiLoading) return; // Prevent overlapping requests

      if (isMounted) setIsAiLoading(true);
      try {
        const context = `${members?.length || 0} membres actifs, ${contributions?.length || 0} transactions récentes.`;
        const msg = await getSmartInsight(`Génère une phrase courte, stratégique et motivante pour le gestionnaire d'un Dahira (association spirituelle) basée sur ces données : ${context}. Ton : Professionnel et fraternel.`);
        
        if (isMounted) {
          setInsight(msg);
          sessionStorage.setItem('dashboard_insight', msg);
        }
      } catch (error) {
        console.error("Failed to fetch admin insight:", error);
      } finally {
        if (isMounted) setIsAiLoading(false);
      }
    };
    
    fetchInsight();

    return () => {
      isMounted = false;
    };
  }, [members?.length, contributions?.length]); // Use lengths to stabilize the effect dependencies

  const refreshInsight = async () => {
      setIsAiLoading(true);
      try {
        const msg = await getSmartInsight(`Donne un conseil de gestion rapide ou une citation spirituelle mouride courte en lien avec le travail et la discipline.`);
        setInsight(msg);
        sessionStorage.setItem('dashboard_insight', msg);
      } catch (error) {
        console.error("Refresh insight error:", error);
      } finally {
        setIsAiLoading(false);
      }
  };

  const triggerAdminAction = async (action: string) => {
    setAdminActionStatus(prev => ({ ...prev, [action]: 'loading' }));
    
    if (action === 'backup') {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const backupData = { members, contributions, events, date: new Date().toISOString() };
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `majma_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else if (action === 'maintenance') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMaintenanceMode(prev => !prev);
    } else if (action === 'roles') {
        await new Promise(resolve => setTimeout(resolve, 800));
        setActiveTab('members');
    } else if (action === 'reboot') {
        sessionStorage.removeItem('dashboard_insight');
        await refreshInsight();
    } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    setAdminActionStatus(prev => ({ ...prev, [action]: 'success' }));
    setTimeout(() => {
      setAdminActionStatus(prev => ({ ...prev, [action]: 'idle' }));
    }, 2500);
  };

  const nextEvent = useMemo(() => {
    const now = new Date();
    return (events || [])
      .filter(e => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }, [events]);

  const majorEvent = useMemo(() => {
    const now = new Date();
    return (events || [])
      .filter(e => (e.type === 'Magal' || e.type === 'Ziar' || e.type === 'Gott') && new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }, [events]);

  const daysToMajorEvent = useMemo(() => {
    if (!majorEvent) return null;
    const diff = new Date(majorEvent.date).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  }, [majorEvent]);

  const simulationProfiles = useMemo(() => {
    const mList = members || [];
    const leader = mList.find(m => ([GlobalRole.SG as string, GlobalRole.ADJOINT_SG as string, GlobalRole.DIEUWRINE as string]).includes(m.role as string));
    const commissioned = mList.find(m => (m.commissions?.length || 0) > 0 && !(([GlobalRole.SG as string, GlobalRole.ADJOINT_SG as string, GlobalRole.DIEUWRINE as string]).includes(m.role as string)));
    const simple = mList.find(m => (m.commissions?.length || 0) === 0 && m.role === GlobalRole.MEMBRE);
    return { leader, commissioned, simple };
  }, [members]);

  const simSearchResults = useMemo(() => {
    if (!simSearch.trim()) return [];
    const term = simSearch.toLowerCase();
    return (members || []).filter(m => 
      (m.firstName || '').toLowerCase().includes(term) || 
      (m.lastName || '').toLowerCase().includes(term) ||
      (m.matricule || '').toLowerCase().includes(term) ||
      (m.email || '').toLowerCase().includes(term)
    ).slice(0, 5);
  }, [simSearch, members]);

  const showSimulationConsole = (user?.role === 'admin' || user?.role === 'Super Admin');

  const chartData = useMemo(() => {
    const today = new Date();
    const data = [];
    const contribList = contributions || [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthLabel = d.toLocaleString('fr-FR', { month: 'short' });
        const year = d.getFullYear();
        const month = d.getMonth();
        
        const total = contribList.filter(c => {
            const cDate = new Date(c.date);
            return cDate.getMonth() === month && cDate.getFullYear() === year;
        }).reduce((acc, curr) => acc + curr.amount, 0);
        
        data.push({ name: monthLabel, val: total });
    }
    return data;
  }, [contributions]);

  const activityFeed = useMemo(() => {
    const feed = [
      ...(contributions || []).map(c => {
        const m = (members || []).find(u => u.id === c.memberId);
        return { 
            id: `c-${c.id}`,
            type: 'finance', 
            date: new Date(c.date), 
            label: `Versement ${c.type}`, 
            sub: `${c.amount.toLocaleString()} F - ${m ? m.firstName : 'Anonyme'}`, 
            icon: Wallet,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        }
      }),
      ...(members || []).map(m => ({ 
        id: `m-${m.id}`,
        type: 'member', 
        date: new Date(m.joinDate), 
        label: 'Nouveau Membre', 
        sub: `${m.firstName} ${m.lastName}`, 
        icon: UserPlus,
        color: 'text-blue-600', 
        bg: 'bg-blue-50'
      })),
      ...(reports || []).map(r => ({
        id: `r-${r.id}`,
        type: 'report',
        date: new Date(r.date), 
        label: 'Compte Rendu', 
        sub: r.title,
        icon: FileText,
        color: 'text-purple-600',
        bg: 'bg-purple-50'
      }))
    ];
    return feed.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);
  }, [contributions, members, reports]);

  const commissionPulseData = [
    { id: 'transport', label: 'Transport', icon: Bus, value: 'Flotte prête', action: 'transport', color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'social', label: 'Social', icon: Heart, value: '1 Projet', action: 'social', color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: 'pedagogy', label: 'Pédagogie', icon: BookOpen, value: '3 Cours', action: 'pedagogy', color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { id: 'admin', label: 'Admin', icon: ShieldCheck, value: 'RAS', action: 'admin', color: 'text-slate-500', bg: 'bg-slate-100' },
  ];

  const getRoleIcon = (role: GlobalRole | string) => {
    switch(role) {
      case GlobalRole.DIEUWRINE: return <Crown size={12} className="text-amber-400" />;
      case GlobalRole.SG: return <ShieldCheck size={12} className="text-purple-400" />;
      default: return <User size={12} className="text-blue-400" />;
    }
  };

  return (
    <div className="space-y-10 h-full flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-12">
      
      {maintenanceMode && (
         <div className="bg-amber-500 text-white px-6 py-3 rounded-2xl flex items-center justify-between shadow-lg animate-in slide-in-from-top">
            <div className="flex items-center gap-3">
               <AlertTriangle size={20} className="animate-pulse"/>
               <span className="font-black text-sm uppercase tracking-widest">Mode Maintenance Actif</span>
            </div>
            <button onClick={() => setMaintenanceMode(false)} className="bg-white/20 hover:bg-white/30 p-1 rounded-full"><X size={16}/></button>
         </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
            {greeting}, <span className="text-emerald-600">{user?.firstName || 'Admin'}</span>
          </h2>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
            <Activity size={14} className="text-emerald-500" /> Système Opérationnel • {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
           <span className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Zap size={12} className="text-amber-400 fill-current" /> Édition Pro
           </span>
           <span className="px-4 py-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              v3.1.0
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: 'Effectif Actif', value: activeMembersCount.toLocaleString(), sub: `/ ${members?.length || 0} Total`, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', action: () => setActiveTab('members') },
          { label: 'Trésorerie', value: `${(totalTreasury / 1000000).toFixed(2)}M`, sub: 'FCFA Disponibles', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50', action: () => setActiveTab('finance') },
          { label: 'Prochain Event', value: nextEvent ? new Date(nextEvent.date).toLocaleDateString('fr-FR', {day: '2-digit', month: 'short'}) : '--', sub: nextEvent ? nextEvent.title : 'Aucun prévu', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50', action: () => setActiveTab('events') },
          { label: 'Santé Dahira', value: '98%', sub: 'Score Performance', icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50', action: () => setActiveTab('admin') },
        ].map((stat, i) => (
          <div key={i} onClick={stat.action} className="glass-card p-6 cursor-pointer group hover:-translate-y-1 transition-all duration-300 border-2 border-transparent hover:border-slate-100 relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 shadow-sm`}>
                    <stat.icon size={22} strokeWidth={2.5} />
                </div>
                <div className="bg-slate-50 rounded-full px-2 py-1 text-[10px] font-black text-slate-400 group-hover:bg-white group-hover:text-slate-600 transition-colors">
                    <ChevronRight size={14} />
                </div>
                </div>
                <div>
                <h4 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{stat.value}</h4>
                <div className="flex justify-between items-end">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
                    <p className="text-[9px] font-medium text-slate-400">{stat.sub}</p>
                </div>
                </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-8">
           <div className="glass-card p-8 bg-white group border border-slate-100/60">
              <div className="flex justify-between items-center mb-8">
                 <div>
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                       <TrendingUp size={24} className="text-emerald-500" /> Dynamique Financière
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Flux de cotisations (6 derniers mois)</p>
                 </div>
                 <div className="flex gap-2">
                    <button className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 hover:bg-emerald-100 transition-colors">Recettes</button>
                    <button className="px-4 py-2 bg-white border border-slate-100 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-slate-600 transition-colors">Dépenses</button>
                 </div>
              </div>
              
              <div className="h-[320px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: '800' }} dy={10} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }} 
                      itemStyle={{ color: '#065f46', fontWeight: 'bold', fontSize: '12px' }}
                      formatter={(value: number) => [`${value.toLocaleString()} FCFA`, 'Montant']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="val" 
                      stroke="#10b981" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#chartGradient)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2 px-1">
                 <Activity size={16} className="text-slate-400" /> Pulse des Commissions
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {commissionPulseData.map((comm) => (
                    <div 
                      key={comm.id} 
                      onClick={() => setActiveTab(comm.action)}
                      className={`p-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-3 hover:shadow-lg transition-all cursor-pointer group hover:border-${comm.color.split('-')[1]}`}
                    >
                       <div className={`p-2.5 rounded-xl ${comm.bg} ${comm.color} group-hover:scale-110 transition-transform`}>
                          <comm.icon size={18} />
                       </div>
                       <div className="min-w-0">
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider truncate">{comm.label}</p>
                          <p className="text-xs font-bold text-slate-800 truncate">{comm.value}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="xl:col-span-4 space-y-8">
           {showSimulationConsole && (
             <div className="glass-card p-6 bg-slate-900 text-white relative overflow-hidden group border border-slate-800 shadow-2xl ring-1 ring-white/10">
               <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-black z-0"></div>
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 z-0"></div>
               
               <div className="relative z-10">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-amber-500/20 rounded-xl backdrop-blur-md border border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                        <ScanFace size={24} />
                      </div>
                      <div>
                        <h4 className="font-black text-sm uppercase tracking-widest text-amber-100">Matrice d'Identité</h4>
                        <p className="text-[9px] font-bold text-slate-500 mt-0.5">Accès Super-Admin</p>
                      </div>
                    </div>
                    <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/10">
                       <button onClick={() => setSimTab('presets')} className={`px-3 py-1.5 rounded-md text-[8px] font-black uppercase transition-all ${simTab === 'presets' ? 'bg-amber-50 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-white'}`}>Rapide</button>
                       <button onClick={() => setSimTab('search')} className={`px-3 py-1.5 rounded-md text-[8px] font-black uppercase transition-all ${simTab === 'search' ? 'bg-amber-50 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-white'}`}>Chercher</button>
                    </div>
                 </div>

                 {simTab === 'presets' ? (
                   <div className="space-y-3">
                      <button onClick={() => simulationProfiles.leader && impersonate(simulationProfiles.leader)} disabled={!simulationProfiles.leader} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group/btn disabled:opacity-50 hover:border-purple-500/50 relative overflow-hidden">
                         <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                         <div className="flex items-center gap-4 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]"><Crown size={16} /></div>
                            <div className="text-left">
                               <p className="text-[10px] font-black uppercase tracking-widest text-purple-200">Responsable</p>
                               <p className="text-[10px] text-slate-400 truncate max-w-[140px] font-medium">{simulationProfiles.leader ? `${simulationProfiles.leader.firstName} ${simulationProfiles.leader.lastName}` : 'Aucun'}</p>
                            </div>
                         </div>
                         <ChevronRight size={16} className="text-slate-600 group-hover/btn:text-purple-400 transition-colors relative z-10" />
                      </button>
                      
                      <button onClick={() => simulationProfiles.commissioned && impersonate(simulationProfiles.commissioned)} disabled={!simulationProfiles.commissioned} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group/btn disabled:opacity-50 hover:border-emerald-500/50 relative overflow-hidden">
                         <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                         <div className="flex items-center gap-4 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]"><Briefcase size={16} /></div>
                            <div className="text-left">
                               <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200">Membre Actif</p>
                               <p className="text-[10px] text-slate-400 truncate max-w-[140px] font-medium">{simulationProfiles.commissioned ? `${simulationProfiles.commissioned.firstName} ${simulationProfiles.commissioned.lastName}` : 'Aucun'}</p>
                            </div>
                         </div>
                         <ChevronRight size={16} className="text-slate-600 group-hover/btn:text-emerald-400 transition-colors relative z-10" />
                      </button>
                      
                      <button onClick={() => simulationProfiles.simple && impersonate(simulationProfiles.simple)} disabled={!simulationProfiles.simple} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group/btn disabled:opacity-50 hover:border-blue-500/50 relative overflow-hidden">
                         <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                         <div className="flex items-center gap-4 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]"><User size={16} /></div>
                            <div className="text-left">
                               <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Membre Simple</p>
                               <p className="text-[10px] text-slate-400 truncate max-w-[140px] font-medium">{simulationProfiles.simple ? `${simulationProfiles.simple.firstName} ${simulationProfiles.simple.lastName}` : 'Aucun'}</p>
                            </div>
                         </div>
                         <ChevronRight size={16} className="text-slate-600 group-hover/btn:text-blue-400 transition-colors relative z-10" />
                      </button>
                   </div>
                 ) : (
                   <div className="space-y-4">
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                        <input type="text" placeholder="Rechercher nom, matricule..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-all font-medium" value={simSearch} onChange={(e) => setSimSearch(e.target.value)} />
                        {simSearch && <button onClick={() => setSimSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"><X size={12} /></button>}
                      </div>
                      <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
                         {simSearchResults.length > 0 ? simSearchResults.map(m => (
                           <button key={m.id} onClick={() => impersonate(m)} className="w-full flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors group text-left border border-transparent hover:border-white/5">
                              <div className="flex items-center gap-3 overflow-hidden">
                                 <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${m.status === 'active' ? 'bg-emerald-50/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>{getRoleIcon(m.role as string)}</div>
                                 <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-200 truncate">{m.firstName} {m.lastName}</p>
                                    <p className="text-[9px] text-slate-500 flex items-center gap-1">{m.category} • <span className="opacity-70">{m.matricule}</span></p>
                                 </div>
                              </div>
                              <ChevronRight size={12} className="text-slate-600 group-hover:text-amber-400"/>
                           </button>
                         )) : <div className="text-center py-6 text-slate-500 flex flex-col items-center">
                            <Search size={24} className="mb-2 opacity-20"/>
                            <p className="text-[10px] italic">{simSearch ? 'Aucun résultat' : 'Recherchez pour simuler'}</p>
                         </div>}
                      </div>
                   </div>
                 )}
               </div>
             </div>
           )}

           <div className="glass-card p-8 bg-white h-full flex flex-col min-h-[400px]">
              <div className="flex justify-between items-center mb-8">
                 <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2"><Clock size={16} className="text-slate-400"/> Flux d'Activité</h4>
                 <button className="text-[10px] font-black text-emerald-600 hover:underline uppercase">Tout voir</button>
              </div>
              
              <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                 {activityFeed.length > 0 ? activityFeed.map((item, i) => (
                   <div key={item.id} className="flex gap-4 group">
                      <div className="flex flex-col items-center">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.bg} ${item.color} shadow-sm group-hover:scale-110 transition-transform`}><item.icon size={18} /></div>
                         {i !== activityFeed.length - 1 && <div className="w-0.5 h-full bg-slate-100 my-2 rounded-full"></div>}
                      </div>
                      <div className="pb-4">
                         <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">{item.date.toLocaleDateString()}</p>
                         <h5 className="text-xs font-black text-slate-800">{item.label}</h5>
                         <p className="text-[11px] text-slate-500 font-medium mt-1 truncate max-w-[180px]">{item.sub}</p>
                      </div>
                   </div>
                 )) : (
                   <div className="flex flex-col items-center justify-center h-40 text-slate-300">
                      <BellRing size={32} className="mb-2 opacity-50"/>
                      <p className="text-xs font-bold uppercase">Aucune activité récente</p>
                   </div>
                 )}
              </div>
           </div>
           
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;