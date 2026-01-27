
import React, { useState } from 'react';
import { Vote, Plus, History } from 'lucide-react';

const DecisionHub: React.FC = () => {
  const [proposals, setProposals] = useState<any[]>([]);

  return (
    <div className="space-y-8 animate-in zoom-in duration-500">
      <div className="flex justify-between items-end">
         <h3 className="text-2xl font-black text-slate-100 uppercase tracking-widest">Chambre de Décision</h3>
         <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg transition-all">
            <Plus size={16} /> Nouvelle Résolution
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Vote size={16}/> Votes en Cours</h4>
            {proposals.length === 0 ? (
               <div className="bg-slate-900 border-dashed border-2 border-slate-800 rounded-2xl p-12 text-center text-slate-500">
                  <p className="text-xs font-black uppercase">Aucune proposition soumise au vote</p>
               </div>
            ) : (
               proposals.map((p, i) => <div key={i}></div>)
            )}
         </div>

         <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8 h-fit">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><History size={16}/> Historique Décisions</h4>
            <div className="text-center text-[10px] text-slate-600 uppercase font-mono py-10">
               Archive vide
            </div>
         </div>
      </div>
    </div>
  );
};

export default DecisionHub;
