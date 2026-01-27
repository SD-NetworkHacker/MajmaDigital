
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
              <h4 className="text-3xl font-black text-slate-900">8.5 <span className="text-sm opacity-30 tracking-tight">KG</span></h4>
              <p className="text-[9px] text-emerald-600 font-bold uppercase mt-2">Prêt pour Thiant de samedi</p>
           </div>
        </div>
        <div className="glass-card p-10 bg-white border-blue-100 flex flex-col justify-between h-full">
           <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-8"><RotateCw size={24} /></div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Rotations (Shifts)</p>
              <h4 className="text-3xl font-black text-slate-900">12 <span className="text-sm opacity-30 tracking-tight">Talibés</span></h4>
              <p className="text-[9px] text-blue-600 font-bold uppercase mt-2">Affectés au service 24/24</p>
           </div>
        </div>
        <div className="glass-card p-10 bg-white border-purple-100 flex flex-col justify-between h-full">
           <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl w-fit mb-8"><Activity size={24} /></div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">État Équipement</p>
              <h4 className="text-3xl font-black text-slate-900">100 <span className="text-sm opacity-30 tracking-tight">%</span></h4>
              <p className="text-[9px] text-emerald-600 font-bold uppercase mt-2">Maintenance machines OK</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 glass-card p-10 bg-white">
           <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-10 flex items-center gap-3">
              <RotateCw size={20} className="text-purple-600" /> Planning de Rotation Équipe Café
           </h4>
           <div className="space-y-6">
              {[
                { name: 'Modou Ndiaye', shift: '08:00 - 12:00', status: 'Posté' },
                { name: 'Bakary Sow', shift: '12:00 - 16:00', status: 'En route' },
                { name: 'Saliou Fall', shift: '16:00 - 20:00', status: 'Repos' },
              ].map((m, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-emerald-600 shadow-sm">{m.name[0]}</div>
                      <div>
                         <p className="text-xs font-black text-slate-800">{m.name}</p>
                         <p className="text-[9px] text-slate-400 font-bold uppercase">{m.shift}</p>
                      </div>
                   </div>
                   <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${
                     m.status === 'Posté' ? 'bg-emerald-100 text-emerald-700' : m.status === 'En route' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-400'
                   }`}>{m.status}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-5 glass-card p-10 bg-amber-50/50 border-amber-100">
           <h4 className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-8 flex items-center gap-3">
              <Package size={18} /> Liste de Courses Pôle Café
           </h4>
           <div className="space-y-4">
              {[
                { label: 'Sucre (Cartons x5)', check: true },
                { label: 'Lait en poudre (5kg)', check: true },
                { label: 'Gobelets jetables (x1000)', check: false },
                { label: 'Thé Menthe (x10 packs)', check: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                   <span className={`text-[11px] font-bold ${item.check ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item.label}</span>
                   <div className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${item.check ? 'bg-amber-500 text-white' : 'bg-white border-2 border-slate-200 text-transparent'}`}>
                      <CheckCircle size={12} />
                   </div>
                </div>
              ))}
           </div>
           <button className="w-full mt-10 py-4 bg-amber-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-amber-900/10">Valider Achats</button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeSubModule;
