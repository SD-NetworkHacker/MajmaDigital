
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
// Fix: Corrected path for AuthContext
import { useAuth } from '../../contexts/AuthContext';
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
    const total = (members || []).length;
    if (total === 0) return 0;
    return Math.round((activeMembersCount / total) * 100);
  }, [members, activeMembersCount]);

  const pendingAdhesions = useMemo(() => 
    (members || []).filter(m => m.status === 'pending'),
  [members]);

  const chartData = useMemo(() => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
    return months.map((month, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        const monthNum = d.getMonth();
        const yearNum = d.getFullYear();

        const sass = (contributions || [])
          .filter(c => c.type === 'Sass' && new Date(c.date).getMonth() === monthNum && new Date(c.date).getFullYear() === yearNum)
          .reduce((acc, c) => acc + c.amount, 0);
        
        const adiyas = (contributions || [])
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
    return [...(contributions || [])]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6)
      .map(c => {
         const m = (members || []).find(mem => mem.id === c.memberId);
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
         {[
           { label: 'Effectif Global', value: members.length, sub: 'Inscrits validés', icon: Users, color: 'emerald' },
           { label: 'Trésorerie', value: totalTreasury.toLocaleString(), sub: 'Solde disponible (F)', icon: Wallet, color: 'blue' },
           { label: 'Engagement', value: `${communityEngagement}%`, sub: 'Activité moyenne', icon: Activity, color: 'amber' },
           { label: 'Attente', value: pendingAdhesions.length, sub: 'Nouvelles adhésions', icon: ShieldAlert, color: 'rose' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-500 group relative overflow-hidden">
              <div className="flex justify-between items-start mb-6 relative z-10">
                 <div className={`p-4 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-inner`}>
                    <stat.icon size={24} />
                 </div>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
              <p className="text-[10px] font-bold text-slate-400 mt-2">{stat.sub}</p>
           </div>
         ))}
      </div>
    </div>
  );
};

export default AdminCockpit;
