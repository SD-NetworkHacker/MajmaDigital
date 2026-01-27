
import React, { useState, useEffect, useMemo } from 'react';
import { Landmark, TrendingUp, CreditCard, Wallet, Plus, Download, ChevronRight, Target, Sparkles, Filter, Search, Calendar, FileText, Share2, MoreHorizontal } from 'lucide-react';
import { getSmartInsight } from '../services/geminiService';
import TransactionForm from './TransactionForm';
import MemberStatementModal from './MemberStatementModal';
import { Contribution } from '../types';
import { useData } from '../contexts/DataContext';

const CAMPAIGN_STATS = [
  { label: 'Magal Touba', budget: 10000000, current: 8200000, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { label: 'Sass Mensuel', budget: 5000000, current: 1200000, color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'Fond Social', budget: 2000000, current: 1850000, color: 'text-amber-500', bg: 'bg-amber-50' },
];

const FinanceModule: React.FC = () => {
  const { contributions, members, addContribution, totalTreasury } = useData();
  const [showForm, setShowForm] = useState(false);
  const [selectedMemberForStatement, setSelectedMemberForStatement] = useState<any | null>(null);
  const [financeInsight, setFinanceInsight] = useState<string>('Analyse des flux en cours...');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    // Petit cache pour éviter d'appeler l'IA à chaque render
    const cachedInsight = sessionStorage.getItem('financeInsight');
    if (cachedInsight) {
      setFinanceInsight(cachedInsight);
    } else {
      const fetchInsight = async () => {
        const msg = await getSmartInsight("conseils de transparence financière pour un dahira");
        setFinanceInsight(msg);
        sessionStorage.setItem('financeInsight', msg);
      };
      fetchInsight();
    }
  }, []);

  const handleAddTx = (data: any) => {
    const newTx: Contribution = {
      id: Date.now().toString(),
      memberId: data.memberId || '1',
      type: data.type as any,
      amount: Number(data.amount),
      date: data.date,
      eventLabel: data.eventLabel || 'Général',
      status: 'paid'
    };
    addContribution(newTx);
    setShowForm(false);
  };

  const filteredContributions = useMemo(() => {
    return contributions.filter(tx => {
      const member = members.find(m => m.id === tx.memberId);
      const searchStr = `${member?.firstName} ${member?.lastName} ${tx.type} ${tx.eventLabel}`.toLowerCase();
      return searchStr.includes(searchTerm.toLowerCase()) && (activeFilter === 'all' || tx.type.toLowerCase() === activeFilter.toLowerCase());
    });
  }, [contributions, members, searchTerm, activeFilter]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      {showForm && (
        <TransactionForm 
          onClose={() => setShowForm(false)} 
          onSubmit={handleAddTx} 
          members={members}
        />
      )}

      {selectedMemberForStatement && (
        <MemberStatementModal 
          member={selectedMemberForStatement}
          contributions={contributions.filter(c => c.memberId === selectedMemberForStatement.id)}
          onClose={() => setSelectedMemberForStatement(null)}
        />
      )}

      {/* Header Strategique */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Trésorerie & Collectes</h2>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <TrendingUp size={14} className="text-emerald-500" /> Flux monétaires en temps réel
          </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
             onClick={() => setShowForm(true)}
             className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-black transition-all active:scale-95"
          >
            <Plus size={18} /> Enregistrer Flux
          </button>
        </div>
      </div>

      {/* KPI Cards & AI Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-gradient-to-br from-emerald-800 via-emerald-900 to-black rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-20 opacity-5 font-arabic text-[25rem] select-none text-white rotate-12 pointer-events-none">ف</div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-16">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-50 mb-4">Total Fonds Consolidés</p>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter">
                  {totalTreasury.toLocaleString()} <span className="text-2xl opacity-30 font-bold ml-2">FCFA</span>
                </h2>
              </div>
              <div className="p-4 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/10">
                <Landmark size={40} className="text-emerald-400" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {[
                 { l: 'Adiyas', v: '450k', trend: '+12%' },
                 { l: 'Sass', v: '820k', trend: '+5%' },
                 { l: 'Diayanté', v: '310k', trend: 'Stable' },
                 { l: 'Urgence', v: '125k', trend: '-2%' }
               ].map((item, i) => (
                 <div key={i} className="p-5 bg-white/5 backdrop-blur-md rounded-3xl border border-white/5 group-hover:bg-white/10 transition-colors">
                   <p className="text-[9px] font-black uppercase opacity-40 mb-2 tracking-widest">{item.l}</p>
                   <p className="text-xl font-black mb-1">{item.v}</p>
                   <span className="text-[8px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">{item.trend}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 glass-card p-10 flex flex-col justify-between border-emerald-100/30">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-200">
                <Sparkles size={20} />
              </div>
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-900">Conseil Finance IA</h3>
            </div>
            <p className="text-sm leading-relaxed italic font-semibold text-slate-600">
              "{financeInsight}"
            </p>
          </div>
          <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-between">
             <div className="flex -space-x-3">
               {[1,2].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200"></div>)}
             </div>
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Dieuwrines Finance en ligne</p>
          </div>
        </div>
      </div>

      {/* Campagnes Actives */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {CAMPAIGN_STATS.map((camp, i) => (
          <div key={i} className="glass-card p-8 group hover:border-emerald-100 transition-all">
            <div className="flex justify-between items-start mb-8">
              <div className={`p-4 rounded-[1.5rem] ${camp.bg} ${camp.color} border border-transparent group-hover:border-current/10 transition-all`}>
                <Target size={24} />
              </div>
              <button className="p-2 text-slate-300 hover:text-emerald-600 transition-colors"><MoreHorizontal size={20} /></button>
            </div>
            <h4 className="font-black text-slate-900 text-lg mb-2">{camp.label}</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-8">Objectif: {(camp.budget/1000000).toFixed(1)}M FCFA</p>
            
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Collecté</span>
                <span className={`text-xs font-black ${camp.color}`}>{Math.round((camp.current/camp.budget)*100)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                <div className={`h-full ${camp.color.replace('text', 'bg')} transition-all duration-1000 ease-out`} style={{ width: `${(camp.current/camp.budget)*100}%` }}></div>
              </div>
              <p className="text-[14px] font-black text-slate-800 text-right mt-2">
                {camp.current.toLocaleString()} <span className="text-[10px] opacity-30">F</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Table de Transaction Style Ledger */}
      <div className="glass-card overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/20">
          <div className="flex items-center gap-3">
            <h3 className="font-black text-slate-900 text-lg flex items-center gap-3">
               <FileText size={22} className="text-emerald-600" /> Grand Livre des Flux
            </h3>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Synchronisé</span>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={16} />
               <input 
                type="text" 
                placeholder="Chercher talibé ou type..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-600 transition-colors">
              <Download size={20} />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-10 py-6">Émetteur du flux</th>
                <th className="px-10 py-6">Type d'apport</th>
                <th className="px-10 py-6">Campagne Source</th>
                <th className="px-10 py-6">Volume Financier</th>
                <th className="px-10 py-6">Horodatage</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredContributions.map((tx) => {
                const member = members.find(m => m.id === tx.memberId);
                return (
                  <tr key={tx.id} className="hover:bg-emerald-50/30 transition-all group cursor-pointer">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center font-black text-emerald-700 text-[10px] group-hover:scale-110 transition-transform">
                          {member?.firstName[0]}{member?.lastName[0]}
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800 leading-none mb-1.5">{member?.firstName} {member?.lastName}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{member?.matricule}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        tx.type === 'Adiyas' ? 'bg-amber-50 text-amber-600 border-amber-100/50' : 'bg-emerald-50 text-emerald-600 border-emerald-100/50'
                      }`}>{tx.type}</span>
                    </td>
                    <td className="px-10 py-8 text-[11px] font-bold text-slate-500 italic">{tx.eventLabel}</td>
                    <td className="px-10 py-8">
                       <p className="font-black text-slate-900 text-[15px] tracking-tight">{tx.amount.toLocaleString()} <span className="text-[10px] opacity-30">F</span></p>
                    </td>
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-2 text-slate-300 font-black text-[10px] uppercase">
                         <Calendar size={12} /> {tx.date}
                       </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                           onClick={(e) => { e.stopPropagation(); if(member) setSelectedMemberForStatement(member); }}
                           className="p-2 bg-white rounded-lg border border-slate-100 text-slate-400 hover:text-emerald-600 transition-colors shadow-sm"
                           title="Relevé individuel"
                         >
                           <FileText size={16} />
                         </button>
                         <button className="p-2 bg-white rounded-lg border border-slate-100 text-slate-400 hover:text-blue-600 transition-colors shadow-sm"><Share2 size={16} /></button>
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinanceModule;
