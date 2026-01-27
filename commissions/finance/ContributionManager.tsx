
import React, { useState } from 'react';
// Added TrendingUp to the list of imported icons from lucide-react to fix the 'Cannot find name' error
import { Calculator, Users, Calendar, Filter, Search, ChevronRight, ArrowDownRight, CreditCard, Sparkles, TrendingUp } from 'lucide-react';

const ContributionManager: React.FC = () => {
  const [selectedType, setSelectedType] = useState('Sass');

  const memberCategories = [
    { type: 'Travailleur', base: 5000, count: 44, color: 'text-blue-600', bg: 'bg-blue-50' },
    { type: 'Étudiant', base: 2500, count: 52, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { type: 'Élève', base: 1000, count: 28, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Gestionnaire de Cotisations</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Calculator size={14} className="text-indigo-500" /> Algorithme de calcul différencié par profil
          </p>
        </div>
        <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200">
           {['Adiyas', 'Sass', 'Diayantés'].map(t => (
              <button 
                key={t} 
                onClick={() => setSelectedType(t)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedType === t ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-400 hover:text-indigo-600'
                }`}
              >
                {t}
              </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Grille Tarifaire Dynamique */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-8 border-indigo-100 bg-indigo-50/10">
             <h4 className="text-[11px] font-black text-indigo-600 uppercase tracking-widest mb-8 flex items-center gap-2">
               <Sparkles size={16} /> Barème Automatique : {selectedType}
             </h4>
             <div className="space-y-6">
                {memberCategories.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4">
                       <div className={`p-3 rounded-xl ${cat.bg} ${cat.color}`}><Users size={18}/></div>
                       <div>
                          <p className="text-xs font-black text-slate-800">{cat.type}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">{cat.count} membres</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-base font-black text-slate-900">{cat.base.toLocaleString()} <span className="text-[10px] opacity-40">F</span></p>
                       <p className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">Échéance mensuelle</p>
                    </div>
                  </div>
                ))}
             </div>
             <button className="w-full mt-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
                <Calendar size={16}/> Programmer Échéances
             </button>
          </div>

          <div className="glass-card p-8 space-y-4">
             <div className="flex justify-between items-center mb-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Projection de Recettes</h4>
                <TrendingUp size={16} className="text-emerald-500" />
             </div>
             <div className="text-center py-6">
                <p className="text-3xl font-black text-slate-900">428,000 <span className="text-sm opacity-30">F</span></p>
                <p className="text-[9px] font-black text-slate-400 uppercase mt-2">Potentiel mensuel consolidé</p>
             </div>
          </div>
        </div>

        {/* Liste des Versements & Impayés */}
        <div className="lg:col-span-8 space-y-6">
           <div className="glass-card p-6 flex items-center gap-4 border-slate-100 bg-white shadow-sm">
              <div className="relative flex-1 group">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                 <input type="text" placeholder="Rechercher un talibé par nom ou matricule..." className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-[1.5rem] text-sm font-bold shadow-sm focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none" />
              </div>
              <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm"><Filter size={20}/></button>
           </div>

           <div className="glass-card overflow-hidden">
              <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Suivi des Versements de Mai</h4>
                 <div className="flex gap-4">
                    <span className="flex items-center gap-2 text-[9px] font-black text-emerald-600 uppercase"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> 75% À jour</span>
                    <span className="flex items-center gap-2 text-[9px] font-black text-rose-600 uppercase"><div className="w-2 h-2 rounded-full bg-rose-500"></div> 25% En retard</span>
                 </div>
              </div>
              <div className="divide-y divide-slate-50 overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-white">
                          <th className="px-8 py-5">Membre</th>
                          <th className="px-8 py-5">Catégorie</th>
                          <th className="px-8 py-5">Prévu</th>
                          <th className="px-8 py-5">Statut</th>
                          <th className="px-8 py-5 text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {[
                         { name: 'Modou Diop', cat: 'Travailleur', due: '5,000', status: 'Payé', date: '02/05' },
                         { name: 'Fatou Ndiaye', cat: 'Étudiant', due: '2,500', status: 'En attente', date: '-' },
                         { name: 'Saliou Fall', cat: 'Élève', due: '1,000', status: 'Payé', date: '05/05' },
                         { name: 'Awa Sylla', cat: 'Étudiant', due: '2,500', status: 'En retard', date: '-' },
                       ].map((m, i) => (
                         <tr key={i} className="hover:bg-indigo-50/20 transition-all group">
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-xs text-slate-400">MD</div>
                                  <span className="text-xs font-black text-slate-800">{m.name}</span>
                               </div>
                            </td>
                            <td className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase">{m.cat}</td>
                            <td className="px-8 py-6 font-black text-slate-900 text-sm">{m.due} <span className="opacity-30">F</span></td>
                            <td className="px-8 py-6">
                               <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                                 m.status === 'Payé' ? 'bg-emerald-100 text-emerald-700' : m.status === 'En retard' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'
                               }`}>{m.status}</span>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <button className="p-2 text-slate-200 hover:text-indigo-600 transition-colors"><CreditCard size={18}/></button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionManager;
