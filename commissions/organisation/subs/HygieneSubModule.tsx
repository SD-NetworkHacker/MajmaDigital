
import React from 'react';
import { Sparkles, ShieldCheck, Clock, Trash2, Droplets, AlertTriangle, CheckSquare } from 'lucide-react';

const HygieneSubModule: React.FC = () => {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { l: 'Dernière Ronde', v: '09h30', c: 'text-blue-600', icon: Clock },
          { l: 'Score Propreté', v: '98%', c: 'text-emerald-600', icon: ShieldCheck },
          { l: 'Stock Détergent', v: 'Bas', c: 'text-rose-600', icon: Droplets },
          { l: 'Zones Traitées', v: '12/15', c: 'text-purple-600', icon: Sparkles },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-8 group hover:border-blue-100 transition-all flex flex-col justify-between">
             <div className="flex justify-between items-start mb-6">
                <div className={`p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-all`}>
                  <stat.icon size={20} />
                </div>
                <span className="text-[8px] font-black uppercase opacity-40">Live Status</span>
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.l}</p>
                <h4 className={`text-3xl font-black ${stat.c}`}>{stat.v}</h4>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 glass-card p-10 bg-white">
           <h4 className="text-xl font-black text-slate-900 flex items-center gap-3 mb-10">
              <CheckSquare size={24} className="text-emerald-500" /> Plan de Nettoyage Stratégique
           </h4>
           <div className="space-y-4">
              {[
                { zone: 'Espace Prière (Mosquée)', freq: 'Toutes les 2h', status: 'Terminé', leader: 'Awa N.' },
                { zone: 'Sanitaires Hommes/Femmes', freq: 'Continu', status: 'Action requise', leader: 'Ibou F.' },
                { zone: 'Zone Restauration (Cour)', freq: 'Après chaque repas', status: 'En attente', leader: 'Khady D.' },
                { zone: 'Dortoirs Talibés', freq: 'Chaque matin', status: 'Terminé', leader: 'Saliou S.' },
              ].map((zone, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white transition-all group">
                   <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                        zone.status === 'Terminé' ? 'bg-emerald-100 text-emerald-600' : zone.status === 'Action requise' ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-white text-slate-300'
                      }`}>
                         <Droplets size={24} />
                      </div>
                      <div>
                         <p className="text-sm font-black text-slate-800">{zone.zone}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Fréquence : {zone.freq} • Responsable : {zone.leader}</p>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm transition-all ${
                        zone.status === 'Terminé' ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-200 text-slate-400 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}>Valider Nettoyage</button>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 bg-rose-50/50 border-rose-100/50">
              <h4 className="text-[11px] font-black text-rose-800 uppercase tracking-widest mb-8 flex items-center gap-3">
                 <AlertTriangle size={22} className="text-rose-600" /> Gestion des Déchets
              </h4>
              <div className="space-y-6">
                 <div className="p-4 bg-white rounded-2xl shadow-sm space-y-2 border border-rose-100">
                    <p className="text-[10px] font-black text-rose-600 uppercase">Collecte Camion</p>
                    <p className="text-[12px] font-medium text-slate-700 leading-relaxed italic">Le passage de la voirie est prévu à 17h00. Veuillez centraliser les sacs à l'entrée Nord.</p>
                 </div>
                 <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3"><Trash2 size={16}/> Signaler Zone Saturée</button>
              </div>
           </div>

           <div className="glass-card p-10 bg-white">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Fournitures Hygiène</h4>
              <div className="space-y-6">
                 {[
                   { l: 'Savon liquide', p: 15, c: 'bg-rose-500' },
                   { l: 'Papier Hygiénique', p: 85, c: 'bg-emerald-500' },
                   { l: 'Sacs Poubelle', p: 40, c: 'bg-amber-500' },
                 ].map((pole, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[9px] font-black uppercase">
                         <span>{pole.l}</span>
                         <span className={pole.p < 20 ? 'text-rose-600 font-black' : ''}>{pole.p}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                         <div className={`h-full ${pole.c}`} style={{ width: `${pole.p}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HygieneSubModule;
