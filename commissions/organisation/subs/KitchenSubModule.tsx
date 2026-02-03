
import React, { useState } from 'react';
import { UtensilsCrossed, Calculator, Scale, AlertCircle, ShoppingCart, Users, ChevronRight, Zap } from 'lucide-react';

const KitchenSubModule: React.FC = () => {
  const [participants, setParticipants] = useState(0);

  // Simple scaling logic (kg per 100 people)
  const calculateQty = (base: number) => ((base / 100) * participants).toFixed(1);

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recipe Scaler */}
        <div className="lg:col-span-8 glass-card p-10 bg-white">
           <div className="flex justify-between items-start mb-12">
              <div>
                 <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                   <Calculator size={24} className="text-purple-600" /> Calculateur de Masse IA
                 </h4>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Ajustement automatique des quantités par participants</p>
              </div>
              <div className="flex items-center gap-3 bg-purple-50 p-2 rounded-2xl border border-purple-100">
                 <Users size={16} className="text-purple-600 ml-2" />
                 <input 
                  type="number" 
                  value={participants} 
                  onChange={(e) => setParticipants(parseInt(e.target.value) || 0)}
                  className="w-20 bg-transparent border-none outline-none font-black text-purple-700" 
                  placeholder="0"
                 />
                 <span className="text-[10px] font-black text-purple-400 uppercase mr-2 pr-2">Talibés</span>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Riz (Parfumé)', base: 25, unit: 'KG', color: 'text-amber-600' },
                { label: 'Viande / Poisson', base: 15, unit: 'KG', color: 'text-rose-600' },
                { label: 'Huile', base: 5, unit: 'L', color: 'text-emerald-600' },
                { label: 'Oignons', base: 8, unit: 'KG', color: 'text-indigo-600' },
              ].map((item, i) => (
                <div key={i} className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 text-center relative group overflow-hidden">
                   <div className="relative z-10">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-4 tracking-widest">{item.label}</p>
                      <h5 className={`text-2xl font-black ${item.color}`}>{calculateQty(item.base)} <span className="text-[10px] opacity-40">{item.unit}</span></h5>
                   </div>
                   <div className={`absolute -right-4 -bottom-4 opacity-5 scale-150 ${item.color}`}><Scale size={80} /></div>
                </div>
              ))}
           </div>

           <div className="mt-12 p-8 bg-emerald-50/50 border border-emerald-100 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8">
              <div className="p-4 bg-white rounded-2xl shadow-xl text-emerald-600"><Zap size={32} /></div>
              <div className="flex-1">
                 <h5 className="text-sm font-black text-emerald-900 mb-1">Optimisation des Stocks (IA)</h5>
                 <p className="text-[12px] font-medium text-emerald-700/80 leading-relaxed italic">
                   "Entrez un nombre de participants pour obtenir des suggestions d'optimisation."
                 </p>
              </div>
              <button className="px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Appliquer</button>
           </div>
        </div>

        {/* Food Safety & Logistics */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 opacity-50 flex items-center gap-2"><AlertCircle size={14}/> Food Safety Checklist</h4>
              <div className="space-y-4">
                 {[
                   'Vérification péremption huiles',
                   'Nettoyage cuves à eau',
                   'Température conservation viande',
                   'Entretien foyers gaz'
                 ].map((check, i) => (
                   <div key={i} className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-5 h-5 border-2 border-white/20 rounded flex items-center justify-center"><div className="w-2 h-2 bg-emerald-400 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"></div></div>
                      <span className="text-[11px] font-bold opacity-80">{check}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="glass-card p-10 flex flex-col h-full bg-white">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Missions Critiques Cuisine</h4>
              <div className="space-y-4 flex-1 text-center flex items-center justify-center">
                 <p className="text-xs text-slate-400 italic">Aucune mission en cours</p>
              </div>
              <button className="w-full mt-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3"><ShoppingCart size={16}/> Générer Liste d'Achat</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenSubModule;
