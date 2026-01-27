
import React from 'react';
// Added Heart to the lucide-react imports
import { Siren, Phone, MapPin, UserCheck, ShieldAlert, Zap, ChevronRight, Activity, AlertTriangle, ShieldCheck, Heart } from 'lucide-react';

const EmergencyResponse: React.FC = () => {
  const firstResponders = [
    { name: 'Saliou Fall', zone: 'Médina', status: 'En service', spec: 'Infirmier / Secouriste' },
    { name: 'Fatou Ndiaye', zone: 'Plateau', status: 'Pause', spec: 'Médecin Urgentiste' },
    { name: 'Modou Cissé', zone: 'Grand Yoff', status: 'En service', spec: 'Pompier Volontaire' },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-top-4 duration-700 pb-10">
      {/* Critical Status Header */}
      <div className="bg-rose-600 p-8 rounded-[3rem] text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl animate-pulse">
        <div className="flex items-center gap-8">
           <div className="w-24 h-24 bg-white/20 rounded-[2.5rem] backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
              <Siren size={48} />
           </div>
           <div>
              <h2 className="text-3xl font-black tracking-tight leading-none mb-4">Centre de Réponse d'Urgence</h2>
              <div className="flex items-center gap-3">
                 <span className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/20">Alerte Réseau : Active</span>
                 <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              </div>
           </div>
        </div>
        <div className="flex gap-4">
           <button className="px-10 py-5 bg-white text-rose-600 rounded-[2rem] font-black uppercase text-sm tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4">
              <Phone size={24}/> Appeler Urgence Majma
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Procedures & Protocols */}
        <div className="lg:col-span-8 space-y-8">
           <div className="glass-card p-10 bg-white">
              <div className="flex justify-between items-center mb-12">
                 <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                   <ShieldAlert size={24} className="text-rose-600" /> Procédures d'Intervention Cruciales
                 </h4>
                 <button className="text-[10px] font-black text-rose-600 hover:underline uppercase tracking-widest">Toutes les fiches</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {[
                   { title: 'Gestion du Malaise Vagual', icon: Activity, desc: 'Position latérale de sécurité (PLS), vérification pouls.' },
                   { title: 'Évacuation de Foule', icon: Zap, desc: 'Signalisation des sorties Nord/Sud du Gott Touba.' },
                   { title: 'Réanimation (DAE)', icon: Heart, desc: 'Localisation du défibrillateur et massage cardiaque.' },
                   { title: 'Alerte Proche Malade', icon: AlertTriangle, desc: 'Transmission rapide du matricule à la commission.' },
                 ].map((proc, i) => (
                   <div key={i} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-rose-50 hover:border-rose-200 transition-all group cursor-pointer flex flex-col justify-between h-56">
                      <div className="flex justify-between items-start">
                         <div className="p-4 bg-white rounded-2xl shadow-sm text-rose-500 group-hover:scale-110 transition-transform"><proc.icon size={28} /></div>
                         <ChevronRight size={20} className="text-slate-200 group-hover:text-rose-400 transition-all"/>
                      </div>
                      <div>
                         <h5 className="font-black text-slate-800 text-lg mb-2 leading-tight">{proc.title}</h5>
                         <p className="text-xs text-slate-500 leading-relaxed italic">{proc.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden">
              <div className="flex justify-between items-center mb-10 relative z-10">
                 <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                    <MapPin size={22} className="text-rose-500" /> Secouristes de Zone (GPS)
                 </h4>
                 <button className="px-4 py-2 bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest">Rafraîchir</button>
              </div>
              <div className="space-y-4 relative z-10">
                 {firstResponders.map((s, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center font-black text-white shadow-lg">SF</div>
                         <div>
                            <p className="text-sm font-black text-white">{s.name}</p>
                            <p className="text-[9px] text-rose-400 font-bold uppercase tracking-widest">{s.spec} • {s.zone}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter">{s.status}</span>
                         <div className={`w-2 h-2 rounded-full ${s.status === 'En service' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></div>
                      </div>
                   </div>
                 ))}
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-5 font-arabic text-[12rem] rotate-12">ص</div>
           </div>
        </div>

        {/* Emergency Contacts Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 border-rose-100 bg-rose-50/20">
              <h4 className="text-[11px] font-black text-rose-800 uppercase tracking-widest mb-10 flex items-center gap-3">
                 <Phone size={18} className="text-rose-600" /> Contacts Rapides (Sénégal)
              </h4>
              <div className="space-y-4">
                 {[
                   { l: 'Sapeurs Pompiers', v: '18', c: 'bg-rose-600' },
                   { l: 'Police Secours', v: '17', c: 'bg-blue-600' },
                   { l: 'SAMU (Dakar)', v: '1515', c: 'bg-indigo-600' },
                   { l: 'SOS Médecin', v: '33 889 15 15', c: 'bg-teal-600' },
                 ].map((contact, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-rose-100 group hover:scale-105 transition-transform cursor-pointer">
                      <span className="text-xs font-black text-slate-700">{contact.l}</span>
                      <span className={`px-4 py-1.5 rounded-xl text-[12px] font-black text-white ${contact.c}`}>{contact.v}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="glass-card p-10 bg-white">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 flex items-center gap-3">
                 <ShieldCheck size={18} className="text-emerald-500" /> Plan d'Évacuation Gott
              </h4>
              <div className="aspect-square bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-8 group hover:bg-rose-50 transition-all cursor-pointer">
                 <div className="p-4 bg-white rounded-2xl shadow-xl text-slate-300 mb-6 group-hover:text-rose-500 transition-all duration-500"><MapPin size={40} /></div>
                 <h5 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2">Charger le Plan 2024</h5>
                 <p className="text-[10px] text-slate-400 font-medium">Localisation des sorties de secours, points d'eau et ambulances.</p>
              </div>
              <button className="w-full mt-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all">Consulter Offline</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyResponse;
