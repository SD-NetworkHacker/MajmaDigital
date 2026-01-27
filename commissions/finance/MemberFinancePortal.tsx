
import React from 'react';
import { History, CreditCard, Download, ShieldCheck, Calendar, Bell, ChevronRight, User, Wallet, Sparkles, CheckCircle } from 'lucide-react';

const MemberFinancePortal: React.FC = () => {
  const contributions = [
    { date: '15 Mai', type: 'Adiyas Ziar', amount: '25,000 F', status: 'Confirmé', hash: '0x4e...21' },
    { date: '01 Mai', type: 'Sass Mensuel', amount: '5,000 F', status: 'Confirmé', hash: '0x9a...8b' },
    { date: '15 Avr', type: 'Diayanté Gott', amount: '10,000 F', status: 'Confirmé', hash: '0xf2...7d' },
  ];

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="flex items-center gap-8">
           <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-indigo-400 font-black text-4xl shadow-2xl relative overflow-hidden border-4 border-white">
              MN
              <div className="absolute bottom-0 right-0 p-1 bg-emerald-500 rounded-full border-2 border-white"><CheckCircle size={10} className="text-white"/></div>
           </div>
           <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-3">Modou Ndiaye</h2>
              <div className="flex items-center gap-3">
                 <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100">Matricule: MAJ-24-001</span>
                 <span className="text-[10px] text-slate-400 font-bold uppercase">Profil: Travailleur</span>
              </div>
           </div>
        </div>
        <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-900/10 flex items-center gap-3 active:scale-95 transition-all">
           <Wallet size={18}/> Effectuer un Versement
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Status & Next Dues */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 bg-gradient-to-br from-indigo-800 to-indigo-950 text-white relative overflow-hidden shadow-2xl">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-12 opacity-50">Solde Contribution 2024</h4>
              <h2 className="text-5xl font-black tracking-tighter">145,000 <span className="text-xl opacity-30">F</span></h2>
              <div className="mt-10 flex items-center gap-4 text-emerald-400">
                 <CheckCircle size={20} />
                 <span className="text-[11px] font-black uppercase tracking-widest">À jour de toutes cotisations</span>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-5 font-arabic text-8xl">ق</div>
           </div>

           <div className="glass-card p-10 border-indigo-100">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-10 flex items-center gap-3">
                 <Calendar size={18} className="text-indigo-600" /> Échéances à venir
              </h4>
              <div className="space-y-6">
                 <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                       <p className="text-xs font-black text-slate-800 uppercase">Sass Juin</p>
                       <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Dû le 05/06/2024</p>
                    </div>
                    <span className="text-sm font-black text-slate-900">5,000 F</span>
                 </div>
                 <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 opacity-60">
                    <div>
                       <p className="text-xs font-black text-slate-800 uppercase">Adiyas Magal</p>
                       <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Libre participation</p>
                    </div>
                    <span className="text-sm font-black text-slate-900">-</span>
                 </div>
              </div>
           </div>
        </div>

        {/* History of Flows */}
        <div className="lg:col-span-8 space-y-8">
           <div className="glass-card overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                 <h4 className="font-black text-slate-800 flex items-center gap-3">
                    <History size={22} className="text-indigo-600" /> Historique Certifié
                 </h4>
                 <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b-2 border-indigo-100">Exporter Historique</button>
              </div>
              <div className="divide-y divide-slate-50 overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-white">
                          <th className="px-8 py-5">Date</th>
                          <th className="px-8 py-5">Catégorie</th>
                          <th className="px-8 py-5">Montant</th>
                          <th className="px-8 py-5">Audit Hash</th>
                          <th className="px-8 py-5 text-right">Justificatif</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {contributions.map((c, i) => (
                         <tr key={i} className="hover:bg-indigo-50/20 transition-all group">
                            <td className="px-8 py-6 text-xs font-bold text-slate-500">{c.date}</td>
                            <td className="px-8 py-6 text-[10px] font-black text-slate-800 uppercase">{c.type}</td>
                            <td className="px-8 py-6 font-black text-indigo-600 text-sm">{c.amount}</td>
                            <td className="px-8 py-6"><span className="px-2 py-0.5 bg-slate-50 text-slate-300 rounded font-mono text-[8px]">{c.hash}</span></td>
                            <td className="px-8 py-6 text-right">
                               <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 shadow-sm transition-all"><Download size={16}/></button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Security Note Portal */}
           <div className="p-8 bg-emerald-50/50 border border-emerald-100 rounded-[2rem] flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
              <div className="p-4 bg-white rounded-2xl shadow-xl text-emerald-600 border border-emerald-50"><ShieldCheck size={32}/></div>
              <div className="flex-1">
                 <h5 className="text-base font-black text-emerald-900 mb-1">Protection des Données Financières</h5>
                 <p className="text-[12px] font-medium text-emerald-700/80 leading-relaxed">
                   Vos informations de versement sont chiffrées. MajmaDigital utilise une architecture d'audit trail décentralisée pour garantir qu'aucune transaction ne peut être modifiée une fois validée.
                 </p>
              </div>
              <div className="absolute -right-6 -bottom-6 opacity-5 text-emerald-900 font-arabic text-8xl">ص</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MemberFinancePortal;
