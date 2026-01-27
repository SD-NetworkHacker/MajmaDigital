
import React from 'react';
import { LayoutDashboard, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { useCommissionContext } from '../CommissionContext';

const GenericDashboard: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm animate-in zoom-in duration-500">
      <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-300 mb-8 shadow-inner ring-8 ring-slate-50/50">
        <LayoutDashboard size={48} strokeWidth={1.5} />
      </div>
      <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight leading-none">Module en cours d'affinage</h3>
      <p className="text-sm text-slate-400 font-medium max-w-sm leading-relaxed mb-10">
        Nos ingénieurs et les Dieuwrines de cette commission collaborent pour finaliser vos outils métiers spécifiques.
      </p>
      <div className="flex items-center gap-6">
         <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
            <Sparkles size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Optimisation IA active</span>
         </div>
         <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
            <Clock size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Sortie prévue : Juin 2024</span>
         </div>
      </div>
    </div>
  );
};

export default GenericDashboard;
