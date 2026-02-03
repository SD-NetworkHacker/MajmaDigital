
import React from 'react';
import { Handshake, Target, Clock, CheckCircle, AlertTriangle, Plus, ChevronRight, FileText, Landmark, Award } from 'lucide-react';

const PartnershipWorkflow: React.FC = () => {
  const agreements: any[] = [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Cycle de Vie des Conventions</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Handshake size={14} className="text-slate-600" /> Administration des accords juridiques et protocolaires
          </p>
        </div>
        <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-3 active:scale-95 transition-all">
          <Plus size={18} /> Initialiser Accord
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Partnership Pipeline */}
        <div className="lg:col-span-8 space-y-6">
           {agreements.length > 0 ? agreements.map((agreement, i) => (
             <div key={i}></div>
           )) : (
             <div className="flex flex-col items-center justify-center h-64 bg-white/50 rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400">
                <Handshake size={48} className="opacity-20 mb-4"/>
                <p className="text-xs font-bold uppercase">Aucune convention en cours</p>
             </div>
           )}
        </div>

        {/* Evaluation & Compliance Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 bg-slate-50/50 border-slate-200">
              <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center gap-3">
                <Target size={22} className="text-slate-600" /> Évaluation d'Impact
              </h4>
              <div className="space-y-6">
                 {[
                   { l: 'Bénéfice Communauté', p: 0, c: 'bg-emerald-500' },
                   { l: 'Respect Engagements', p: 0, c: 'bg-blue-500' },
                   { l: 'Visibilité Institutionnelle', p: 0, c: 'bg-indigo-500' },
                 ].map((stat, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase">
                         <span className="text-slate-500">{stat.l}</span>
                         <span>{stat.p}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white rounded-full overflow-hidden shadow-inner border border-slate-100">
                         <div className={`h-full ${stat.c} transition-all duration-1000`} style={{ width: `${stat.p}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Générer Rapport ROI</button>
           </div>

           <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden group shadow-2xl">
              <div className="relative z-10">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 opacity-50 flex items-center gap-2"><AlertTriangle size={14}/> Alertes Renouvellement</h4>
                 <div className="p-4 bg-white/5 border border-white/10 rounded-2xl mb-8 space-y-2">
                    <p className="text-xs font-black text-slate-400">Aucune alerte</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PartnershipWorkflow;
