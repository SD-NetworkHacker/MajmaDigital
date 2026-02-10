import React, { useState, useEffect, useMemo } from 'react';
import { Landmark, TrendingUp, CreditCard, Wallet, Plus, Download, ChevronRight, Target, Sparkles, Filter, Search, Calendar, FileText, Share2, MoreHorizontal, Edit, Trash2, Smartphone } from 'lucide-react';
import { getSmartInsight } from '../services/geminiService';
import TransactionForm from './TransactionForm';
import MemberStatementModal from './MemberStatementModal';
import { Contribution } from '../types';
import { useData } from '../contexts/DataContext';
// Fixed: AuthContext path updated to contexts/
import { useAuth } from '../contexts/AuthContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import MemberFinancePortal from '../commissions/finance/MemberFinancePortal';
import { formatDate } from '../utils/date';

const FinanceModule: React.FC = () => {
  const { contributions, members, addContribution, updateContribution, deleteContribution, totalTreasury } = useData();
  const { user } = useAuth(); 
  const { isMobile } = useMediaQuery();

  const [showForm, setShowForm] = useState(false);
  const [selectedMemberForStatement, setSelectedMemberForStatement] = useState<any | null>(null);
  const [editingTx, setEditingTx] = useState<Contribution | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const isManager = user?.role === 'admin' || user?.role === 'manager' || user?.role === 'Super Admin' || user?.role === 'DIEUWRINE';

  const filteredContributions = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return contributions.filter(tx => {
      const member = members.find(m => m.id === tx.memberId);
      const searchStr = `${member?.firstName || ''} ${member?.lastName || ''} ${tx.type || ''}`.toLowerCase();
      return searchStr.includes(term);
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [contributions, members, searchTerm]);

  if (!isManager) return <MemberFinancePortal />;

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-12">
      {showForm && (
        <TransactionForm onClose={() => { setShowForm(false); setEditingTx(null); }} onSubmit={(data) => { addContribution(data); setShowForm(false); }} members={members} />
      )}

      {/* MOBILE OPTIMIZED KPI */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
         <div className="lg:col-span-8 bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-3">Trésorerie Dahira</p>
               <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
                  {totalTreasury.toLocaleString()} <span className="text-xl opacity-30 font-bold ml-1">F</span>
               </h2>
               
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                     <p className="text-[8px] font-bold text-slate-400 uppercase">Cotisations</p>
                     <p className="text-lg font-black">{contributions.filter(c => c.type === 'Sass').length}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                     <p className="text-[8px] font-bold text-slate-400 uppercase">Dons (Adiyas)</p>
                     <p className="text-lg font-black">{contributions.filter(c => c.type === 'Adiyas').length}</p>
                  </div>
               </div>
            </div>
            <div className="absolute top-0 right-0 p-12 opacity-5 font-arabic text-[15rem] pointer-events-none">ف</div>
         </div>

         <div className="lg:col-span-4 flex flex-col gap-3">
            <button onClick={() => setShowForm(true)} className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                <Plus size={20}/> Nouveau Versement
            </button>
            <button className="w-full py-5 bg-white border border-slate-200 text-slate-600 rounded-3xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all">
                <Download size={20}/> Exporter Registre
            </button>
         </div>
      </div>

      {/* SMART LIST / TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
         <div className="p-6 border-b border-slate-50 bg-slate-50/20 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-black text-slate-800 flex items-center gap-3">
               <FileText size={20} className="text-emerald-600" /> Flux de Caisse
            </h3>
            <div className="relative group w-full sm:w-64">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
               <input 
                type="text" 
                placeholder="Chercher..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
         </div>

         {isMobile ? (
            <div className="p-4 space-y-4">
               {filteredContributions.map(tx => {
                  const m = members.find(mem => mem.id === tx.memberId);
                  return (
                     <div key={tx.id} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 flex justify-between items-center active:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-xs font-black text-emerald-600 uppercase shadow-sm">
                              {m ? m.firstName[0] : '?'}
                           </div>
                           <div>
                              <p className="text-sm font-black text-slate-800 leading-none">{m ? `${m.firstName} ${m.lastName}` : 'Inconnu'}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{tx.type} • {formatDate(tx.date)}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-sm font-black text-emerald-700">{tx.amount.toLocaleString()} F</p>
                           <button className="text-[9px] font-black uppercase text-slate-400 mt-1 hover:text-emerald-600 transition-colors">Détails</button>
                        </div>
                     </div>
                  );
               })}
               {filteredContributions.length === 0 && <p className="py-10 text-center text-xs text-slate-400 italic">Aucun flux enregistré</p>}
            </div>
         ) : (
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                     <tr>
                        <th className="px-10 py-6">Donateur</th>
                        <th className="px-10 py-6">Type</th>
                        <th className="px-10 py-6">Date</th>
                        <th className="px-10 py-6 text-right">Montant</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {filteredContributions.map(tx => {
                        const m = members.find(mem => mem.id === tx.memberId);
                        return (
                           <tr key={tx.id} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                              <td className="px-10 py-6">
                                 <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase group-hover:bg-emerald-600 group-hover:text-white transition-all">{m?.firstName[0]}</div>
                                    <span className="text-xs font-bold text-slate-800">{m ? `${m.firstName} ${m.lastName}` : 'Inconnu'}</span>
                                 </div>
                              </td>
                              <td className="px-10 py-6"><span className="text-[10px] font-black uppercase text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">{tx.type}</span></td>
                              <td className="px-10 py-6 text-xs text-slate-400 font-bold">{formatDate(tx.date)}</td>
                              <td className="px-10 py-6 text-right font-black text-emerald-600">{tx.amount.toLocaleString()} F</td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
         )}
      </div>
    </div>
  );
};

export default FinanceModule;