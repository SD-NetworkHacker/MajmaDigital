
import React, { useMemo } from 'react';
// Added Activity to the imports from lucide-react
import { X, FileText, Download, Printer, TrendingUp, Calendar, CreditCard, User, Landmark, Sparkles, Activity } from 'lucide-react';
import { Member, Contribution } from '../types';

interface MemberStatementModalProps {
  member: Member;
  contributions: Contribution[];
  onClose: () => void;
}

const MemberStatementModal: React.FC<MemberStatementModalProps> = ({ member, contributions, onClose }) => {
  const stats = useMemo(() => {
    const total = contributions.reduce((acc, c) => acc + c.amount, 0);
    const byType = contributions.reduce((acc, c) => {
      acc[c.type] = (acc[c.type] || 0) + c.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total,
      count: contributions.length,
      byType,
      latest: contributions.length > 0 ? contributions[0].date : 'N/A'
    };
  }, [contributions]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col h-[90vh] border border-white/20 print:h-auto print:shadow-none print:static">
        
        {/* Header Relevé */}
        <div className="p-10 bg-slate-900 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shrink-0 print:bg-white print:text-black print:p-6 print:border-b-2 print:border-slate-200">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/10 flex items-center justify-center text-white font-black text-4xl shadow-inner print:bg-slate-100 print:text-slate-800">
              {member.firstName[0]}{member.lastName[0]}
            </div>
            <div>
              <h3 className="text-3xl font-black tracking-tighter leading-none mb-2">{member.firstName} {member.lastName}</h3>
              <p className="text-emerald-400 font-bold uppercase text-[11px] tracking-[0.2em] print:text-slate-600">
                Matricule: {member.matricule} • {member.category}
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 print:hidden">
            <button 
              onClick={handlePrint}
              className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all text-white/80 border border-white/10 flex items-center gap-2"
            >
              <Printer size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">Imprimer</span>
            </button>
            <button 
              onClick={onClose}
              className="p-4 bg-white/10 hover:bg-rose-500 hover:text-white rounded-2xl transition-all text-white/80 border border-white/10"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-slate-50/40 print:overflow-visible print:p-6 print:bg-white">
          <div className="max-w-3xl mx-auto space-y-12">
            
            {/* Titre Document */}
            <div className="flex flex-col items-center text-center space-y-4">
               <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl print:hidden">
                 <FileText size={28} />
               </div>
               <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Relevé de Contributions Consolidé</h2>
               <div className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest print:border-none">
                 Édité le {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
               </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm print:border print:shadow-none">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Volume Total</p>
                 <h4 className="text-3xl font-black text-slate-900 leading-none">{stats.total.toLocaleString()} <span className="text-sm opacity-30">F</span></h4>
                 <div className="mt-4 flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase">
                    <TrendingUp size={14} /> Baraka Active
                 </div>
               </div>
               <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm print:border print:shadow-none">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Nombre d'apports</p>
                 <h4 className="text-3xl font-black text-slate-900 leading-none">{stats.count} <span className="text-sm opacity-30">Transactions</span></h4>
                 <div className="mt-4 flex items-center gap-2 text-blue-600 text-[10px] font-black uppercase">
                    <Calendar size={14} /> {stats.count > 0 ? 'Régulier' : 'Inactif'}
                 </div>
               </div>
               <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm print:border print:shadow-none">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Dernier Versement</p>
                 <h4 className="text-lg font-black text-slate-900 leading-none truncate">{stats.latest}</h4>
                 <div className="mt-4 flex items-center gap-2 text-amber-600 text-[10px] font-black uppercase">
                    <Sparkles size={14} /> État : À jour
                 </div>
               </div>
            </div>

            {/* Breakdown by Type */}
            <div className="space-y-6">
               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                 <Landmark size={14} className="text-emerald-500" /> Répartition Sectorielle
               </h4>
               <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm print:border">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                     {Object.entries(stats.byType).map(([type, amount]) => (
                       <div key={type} className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{type}</p>
                          {/* Fix: amount might be inferred as any, explicitly casting to number for toLocaleString and following operations */}
                          <p className="text-lg font-black text-slate-800">{(amount as number).toLocaleString()} <span className="text-[10px] opacity-20">F</span></p>
                          <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                             {/* Fix: amount cast to number to resolve arithmetic operation type error; also handled division by zero */}
                             <div className="h-full bg-emerald-500" style={{ width: `${stats.total > 0 ? ((amount as number) / stats.total) * 100 : 0}%` }}></div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Transaction History Table */}
            <div className="space-y-6 pb-12">
               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                 <Activity size={14} className="text-emerald-500" /> Chronologie des Flux
               </h4>
               <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden print:border">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/80 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] print:bg-white print:border-b">
                      <tr>
                        <th className="px-8 py-5">Date</th>
                        <th className="px-8 py-5">Catégorie</th>
                        <th className="px-8 py-5">Motif / Campagne</th>
                        <th className="px-8 py-5 text-right">Montant</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {contributions.length > 0 ? contributions.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase">{c.date}</td>
                          <td className="px-8 py-5">
                            <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${c.type === 'Adiyas' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                              {c.type}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-xs font-bold text-slate-600">{c.eventLabel || 'Versement Général'}</td>
                          <td className="px-8 py-5 text-right font-black text-slate-800 text-sm">
                            {c.amount.toLocaleString()} <span className="text-[10px] opacity-30">F</span>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={4} className="px-8 py-20 text-center text-slate-300 font-black uppercase text-xs tracking-widest">
                            Aucune transaction trouvée
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
               </div>
            </div>

            {/* Footer / Certification */}
            <div className="pt-12 border-t border-slate-100 flex flex-col items-center text-center space-y-6 print:pt-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-100 print:hidden">
                    <span className="text-white font-black text-xl font-arabic">م</span>
                  </div>
                  <div className="text-left">
                    <h5 className="text-sm font-black text-slate-800">Dahira Majmahoun Nourayni</h5>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Commission Finance • Certification Digitale</p>
                  </div>
               </div>
               <p className="text-[9px] text-slate-300 font-medium max-w-xs leading-relaxed uppercase tracking-tighter">
                 Ce relevé est une copie authentifiée générée par MajmaDigital. Toute falsification est passible de sanctions administratives.
               </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberStatementModal;
