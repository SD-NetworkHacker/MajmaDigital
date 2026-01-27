
import React from 'react';
import { Handshake, Target, Clock, CheckCircle, AlertTriangle, Plus, ChevronRight, FileText, Landmark, Award } from 'lucide-react';

const PartnershipWorkflow: React.FC = () => {
  const agreements = [
    { title: 'Convention Gott 2024 - Mairie', status: 'En négociation', progress: 65, color: 'bg-indigo-500' },
    { title: 'Accord-cadre Santé - Hôpital X', status: 'Validé', progress: 100, color: 'bg-emerald-500' },
    { title: 'Jumelage Diaspora - Lyon', status: 'Prospection', progress: 20, color: 'bg-slate-300' },
    { title: 'Partenariat Logistique - Express S.A', status: 'À renouveler', progress: 95, color: 'bg-rose-500' },
  ];

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
           {agreements.map((agreement, i) => (
             <div key={i} className="glass-card p-1 relative overflow-hidden group">
                <div className="p-8 flex flex-col gap-8">
                   <div className="flex justify-between items-start">
                      <div className="flex items-center gap-6">
                         <div className="p-5 bg-slate-50 text-slate-600 rounded-2xl shadow-xl group-hover:bg-slate-800 group-hover:text-white transition-all">
                            <Handshake size={32} />
                         </div>
                         <div>
                            <h4 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-3">{agreement.title}</h4>
                            <div className="flex items-center gap-3">
                               <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                 agreement.status === 'Validé' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                               }`}>{agreement.status}</span>
                               <span className="text-[10px] text-slate-400 font-bold uppercase">Créé le 12 Mars 2024</span>
                            </div>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-black text-slate-300 uppercase mb-2">Cycle de Validation</p>
                         <div className="flex gap-1 justify-end">
                            {[1,2,3,4].map(s => <div key={s} className={`w-4 h-1 rounded-full ${s*25 <= agreement.progress ? 'bg-slate-800' : 'bg-slate-100'}`}></div>)}
                         </div>
                      </div>
                   </div>

                   <div className="pt-8 border-t border-slate-50 flex justify-between items-center">
                      <div className="flex items-center gap-4 text-slate-400">
                         <div className="flex items-center gap-2"><FileText size={14} /> <span className="text-[10px] font-black uppercase">v2.1</span></div>
                         <div className="flex items-center gap-2"><Clock size={14} /> <span className="text-[10px] font-black uppercase">Next: Sign. Bureau</span></div>
                      </div>
                      <button className="text-[10px] font-black text-slate-800 uppercase flex items-center gap-2 hover:gap-4 transition-all">Gérer Documents <ChevronRight size={14}/></button>
                   </div>
                </div>
             </div>
           ))}
        </div>

        {/* Evaluation & Compliance Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 bg-slate-50/50 border-slate-200">
              <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center gap-3">
                <Target size={22} className="text-slate-600" /> Évaluation d'Impact
              </h4>
              <div className="space-y-6">
                 {[
                   { l: 'Bénéfice Communauté', p: 85, c: 'bg-emerald-500' },
                   { l: 'Respect Engagements', p: 92, c: 'bg-blue-500' },
                   { l: 'Visibilité Institutionnelle', p: 68, c: 'bg-indigo-500' },
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
                    <p className="text-xs font-black text-rose-400">Contrat Express S.A</p>
                    <p className="text-[10px] opacity-60 leading-relaxed italic">"Expire dans 12 jours. Le renouvellement automatique est désactivé. Action requise."</p>
                 </div>
                 <button className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all border border-rose-500">Ouvrir Dossier</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PartnershipWorkflow;
