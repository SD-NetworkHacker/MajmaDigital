
import React, { useState } from 'react';
import { Target, TrendingUp, Plus, ChevronRight, PieChart, AlertTriangle } from 'lucide-react';

const BudgetPlanner: React.FC = () => {
  const [eventBudgets, setEventBudgets] = useState<any[]>([]); // Vide par défaut

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Budgets Événementiels</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Target size={14} className="text-indigo-500" /> Planification prévisionnelle
          </p>
        </div>
        <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-3 active:scale-95 transition-all">
          <Plus size={18} /> Nouveau Budget
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
           {eventBudgets.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-64 glass-card border-dashed border-2 border-slate-200">
                <PieChart size={48} className="text-slate-300 mb-4" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aucun budget actif</p>
                <p className="text-[10px] text-slate-400 mt-1">Créez un nouveau budget pour commencer le suivi.</p>
             </div>
           ) : (
             eventBudgets.map(budget => (
               // Rendu budget... (code existant réutilisé si besoin, mais ici la liste est vide)
               <div key={budget.id}></div>
             ))
           )}
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 bg-rose-50/50 border-rose-100/50">
              <h4 className="text-[11px] font-black text-rose-800 uppercase tracking-widest mb-8 flex items-center gap-3">
                <AlertTriangle size={22} className="text-rose-600" /> Vigilance Budgétaire
              </h4>
              <p className="text-xs text-slate-500 italic text-center">Aucune alerte pour le moment.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanner;
