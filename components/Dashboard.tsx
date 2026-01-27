
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, TrendingUp, Calendar, Landmark, Sparkles, 
  ArrowUpRight, Clock, ChevronRight, Zap, Target, 
  BellRing, Plus, FileText, Share2, MoreHorizontal,
  ArrowRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getSmartInsight } from '../services/geminiService';
import { Member, Event, Contribution } from '../types';

interface DashboardProps {
  members: Member[];
  events: Event[];
  contributions: Contribution[];
}

const Dashboard: React.FC<DashboardProps> = ({ members, events, contributions }) => {
  const [insight, setInsight] = useState<string>('En attente de données pour analyse...');
  const [activeStat, setActiveStat] = useState<number>(0);

  useEffect(() => {
    const fetchInsight = async () => {
      if (members.length === 0 && contributions.length === 0) {
        setInsight("Bienvenue sur MajmaDigital. Commencez par inscrire des membres ou enregistrer des cotisations pour activer l'intelligence artificielle.");
        return;
      }
      const context = `${members.length} membres et ${contributions.length} transactions.`;
      const msg = await getSmartInsight(`Donne un conseil court pour le démarrage d'un Dahira avec ces données : ${context}`);
      setInsight(msg);
    };
    fetchInsight();
  }, [members.length, contributions.length]);

  const totalFinance = useMemo(() => contributions.reduce((acc, curr) => acc + curr.amount, 0), [contributions]);
  
  const stats = [
    { label: 'Total Membres', value: members.length.toLocaleString(), trend: members.length > 0 ? 'Actif' : 'N/A', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100/50' },
    { label: 'Trésorerie', value: `${totalFinance.toLocaleString()} F`, trend: contributions.length > 0 ? 'Flux entrants' : 'N/A', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100/50' },
    { label: 'Agenda Actif', value: events.length.toString(), trend: events.length > 0 ? 'Planifié' : 'Vide', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50/50', border: 'border-amber-100/50' },
    { label: 'Commissions', value: '10', trend: 'Structure', icon: Landmark, color: 'text-purple-600', bg: 'bg-purple-50/50', border: 'border-purple-100/50' },
  ];

  // Données de graphique dynamiques (ou vides si pas de données)
  const chartData = useMemo(() => {
    if (contributions.length === 0) return [];
    // Regroupement simple par mois (mocké pour la structure, mais basé sur data réelle si existante)
    return contributions.slice(-6).map((c, i) => ({
        name: new Date(c.date).toLocaleDateString('fr-FR', { month: 'short' }),
        val: c.amount
    }));
  }, [contributions]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* SECTION 1: WELCOME & INSIGHT */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Banner */}
        <div className="xl:col-span-8 relative group overflow-hidden rounded-[3rem] shadow-2xl shadow-emerald-900/10">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 via-emerald-900 to-black"></div>
          <div className="relative p-10 md:p-14 text-white z-10 flex flex-col justify-center h-full min-h-[400px]">
            <div className="flex items-center gap-3 mb-8">
              <div className="px-4 py-1.5 bg-white/10 backdrop-blur-xl rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#34d399]"></div>
                Système Initialisé
              </div>
            </div>

            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-[1.1] tracking-tighter">
              Plateforme <br/>
              <span className="text-emerald-400 italic">MajmaDigital</span> v3.0
            </h2>
            
            <p className="text-emerald-100/60 max-w-xl mb-10 text-sm md:text-lg leading-relaxed font-medium">
              Votre espace de gestion est prêt. Commencez par configurer les membres et les premières activités.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-white text-emerald-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-emerald-50 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3">
                <Plus size={18} /> Inscrire un Membre
              </button>
            </div>
          </div>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 p-10 opacity-[0.03] font-arabic text-[30rem] select-none rotate-12 pointer-events-none">م</div>
        </div>

        {/* AI Insight */}
        <div className="xl:col-span-4 glass-card p-10 flex flex-col border-emerald-100/30 relative overflow-hidden h-full min-h-[400px] group/ai">
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-600 text-white rounded-[1.25rem] shadow-lg shadow-emerald-200">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="font-black text-xs uppercase tracking-[0.15em] text-slate-900 leading-none">Majma Assistant</h3>
                <p className="text-[9px] font-bold text-emerald-600 mt-1 uppercase">Intelligence</p>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center relative z-10">
            <div className="relative p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100/50">
              <div className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed italic font-semibold">
                "{insight}"
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            onMouseEnter={() => setActiveStat(i)}
            className={`glass-card p-8 group cursor-pointer border-transparent hover:border-emerald-100 transition-all duration-500 ${activeStat === i ? 'ring-2 ring-emerald-500/5 translate-y-[-4px]' : ''}`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-[1.5rem] ${stat.bg} ${stat.color} transition-all duration-500 group-hover:scale-110 shadow-sm border ${stat.border}`}>
                <stat.icon size={26} strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.15em] mb-2">{stat.label}</p>
              <h4 className="text-4xl font-black text-slate-900 tracking-tighter">
                {stat.value}
              </h4>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 3: ANALYTICS & FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Chart */}
        <div className="lg:col-span-8 glass-card p-10 group/chart">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h3 className="font-black text-slate-900 text-2xl tracking-tight flex items-center gap-3">
                <Target size={24} className="text-emerald-600" /> Flux de Cotisations
              </h3>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2">Évolution des apports</p>
            </div>
          </div>
          
          <div className="h-[300px] w-full flex items-center justify-center bg-slate-50/50 rounded-3xl border border-slate-100">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: '800' }} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ borderRadius: '24px', border: 'none' }} />
                  <Area type="monotone" dataKey="val" stroke="#10b981" strokeWidth={5} fillOpacity={1} fill="url(#chartGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
                <div className="text-center text-slate-400">
                    <p className="text-xs font-bold uppercase">Aucune donnée financière</p>
                    <p className="text-[10px] opacity-60">Enregistrez une cotisation pour voir le graphique</p>
                </div>
            )}
          </div>
        </div>

        {/* Feed */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-card p-10 flex flex-col h-full overflow-hidden min-h-[400px]">
            <div className="flex items-center justify-between mb-10">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-3">
                <Clock size={22} className="text-emerald-600" /> Activité Récente
              </h3>
            </div>
            
            <div className="space-y-8 flex-1 overflow-y-auto no-scrollbar pr-1">
              {contributions.length > 0 ? contributions.slice(0, 5).map((act, i) => (
                <div key={i} className="flex items-start gap-5">
                  <div className="shrink-0 w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <FileText size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-black text-slate-800">{act.amount.toLocaleString()} F</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase truncate">{act.type} • {act.date}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center text-slate-400 py-10">
                    <p className="text-xs font-bold uppercase">Aucune activité</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
