
import React from 'react';
import { Coffee, RotateCw, Activity, Package, CheckCircle, Clock } from 'lucide-react';

const CoffeeSubModule: React.FC = () => {
  return (
    <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-10 bg-white border-amber-100 flex flex-col justify-between h-full">
           <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl w-fit mb-8"><Package size={24} /></div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Stock Actuel</p>
              <h4 className="text-3xl font-black text-slate-900">0.0 <span className="text-sm opacity-30 tracking-tight">KG</span></h4>
              <p className="text-[9px] text-slate-400 font-bold uppercase mt-2">En attente d'approvisionnement</p>
           </div>
        </div>
        <div className="glass-card p-10 bg-white border-blue-100 flex flex-col justify-between h-full">
           <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-8"><RotateCw size={24} /></div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Rotations (Shifts)</p>
              <h4 className="text-3xl font-black text-slate-900">0 <span className="text-sm opacity-30 tracking-tight">Talibés</span></h4>
              <p className="text-[9px] text-slate-400 font-bold uppercase mt-2">Aucun shift actif</p>
           </div>
        </div>
        <div className="glass-card p-10 bg-white border-purple-100 flex flex-col justify-between h-full">
           <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl w-fit mb-8"><Activity size={24} /></div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">État Équipement</p>
              <h4 className="text-3xl font-black text-slate-900">-- <span className="text-sm opacity-30 tracking-tight">%</span></h4>
              <p className="text-[9px] text-slate-400 font-bold uppercase mt-2">En attente d'inspection</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 glass-card p-10 bg-white flex flex-col justify-center items-center text-center">
           <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-3">
              <RotateCw size={20} className="text-purple-600" /> Planning de Rotation Équipe Café
           </h4>
           <div className="space-y-6 w-full">
              <p className="text-xs text-slate-400 italic">Aucune rotation planifiée.</p>
           </div>
        </div>

        <div className="lg:col-span-5 glass-card p-10 bg-amber-50/50 border-amber-100">
           <h4 className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-8 flex items-center gap-3">
              <Package size={18} /> Liste de Courses Pôle Café
           </h4>
           <div className="space-y-4">
              {/* Liste vide par défaut */}
              <p className="text-xs text-slate-400 italic">Aucun article à acheter.</p>
           </div>
           <button className="w-full mt-10 py-4 bg-amber-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-amber-900/10">Créer Liste</button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeSubModule;
