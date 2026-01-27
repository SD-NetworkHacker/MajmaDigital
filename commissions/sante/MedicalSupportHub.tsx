
import React from 'react';
import { Stethoscope, Clock, ShieldPlus, AlertCircle, FileText, ChevronRight, Plus, Calendar, Pill, Search, Lock } from 'lucide-react';

interface Props { secureMode: boolean; }

const MedicalSupportHub: React.FC<Props> = ({ secureMode }) => {
  const upcomingChecks = [
    { title: 'Contrôle Glycémie', date: 'Demain 09h00', location: 'Dr. Diop', status: 'Rappel' },
    { title: 'Renouvellement Ordonnance', date: '12 Juin', location: 'Pharmacie Majma', status: 'À prévoir' },
  ];

  if (!secureMode) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 animate-in fade-in duration-700">
         <div className="p-10 bg-slate-50 rounded-[3rem] text-slate-300 mb-8"><Lock size={64}/></div>
         <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Espace Confidentiel</h3>
         <p className="text-sm text-slate-400 font-medium max-w-sm leading-relaxed mb-10">
           Veuillez activer le <b>Mode Médical Sécurisé</b> pour accéder à vos rappels de soins, vos médications chroniques et votre carnet de santé numérique.
         </p>
         <button className="px-8 py-4 bg-teal-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all flex items-center gap-2">
           <ShieldPlus size={16}/> S'authentifier
         </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in zoom-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Support Area */}
        <div className="lg:col-span-8 space-y-6">
           <div className="glass-card p-10 bg-white">
              <div className="flex justify-between items-center mb-12">
                 <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                   <ShieldPlus size={24} className="text-teal-600" /> Mon Carnet de Santé Numérique
                 </h4>
                 <div className="flex gap-2">
                    <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-teal-600 transition-all border border-slate-100"><Search size={18}/></button>
                    <button className="px-5 py-2.5 bg-teal-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2"><Plus size={14}/> Ajouter Document</button>
                 </div>
              </div>

              <div className="space-y-4">
                 {[
                   { title: 'Bilan Sanguin Annuel', date: '15 Mars 2024', type: 'PDF', doctor: 'Dr. I. Diop' },
                   { title: 'Carnet Vaccination', date: '02 Janv 2024', type: 'Image', doctor: 'Centre Santé X' },
                   { title: 'Compte-rendu Ophtalmo', date: '12 Nov 2023', type: 'PDF', doctor: 'Dr. Fall' },
                 ].map((doc, i) => (
                   <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:border-teal-100 transition-all group">
                      <div className="flex items-center gap-6">
                         <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-sm group-hover:scale-110 transition-transform">
                            <FileText size={22} />
                         </div>
                         <div>
                            <p className="text-sm font-black text-slate-800 leading-none mb-2">{doc.title}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{doc.date} • {doc.doctor}</p>
                         </div>
                      </div>
                      <div className="flex gap-3">
                         <span className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[8px] font-black uppercase text-slate-400">{doc.type}</span>
                         <button className="p-2 text-slate-300 hover:text-teal-600 transition-colors"><ChevronRight size={18}/></button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="glass-card p-10 bg-teal-50/50 border-teal-100 relative overflow-hidden group">
              <h4 className="text-xl font-black text-teal-900 mb-8 flex items-center gap-3 relative z-10">
                 <Pill size={24} className="text-teal-600" /> Suivi Traitement Chronique
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                 <div className="p-6 bg-white rounded-3xl border border-teal-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                       <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded text-[8px] font-black uppercase tracking-tighter">Matin • Soir</span>
                       <button className="text-slate-300 hover:text-teal-600 transition-colors"><Clock size={14}/></button>
                    </div>
                    <h5 className="font-black text-slate-800">Amlodipine 5mg</h5>
                    <p className="text-[10px] text-slate-400 font-medium">Suivi Tension Artérielle. Prochain renouvellement dans 12 jours.</p>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-teal-500" style={{ width: '65%' }}></div>
                    </div>
                 </div>
                 <div className="p-6 bg-white rounded-3xl border border-teal-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                       <span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded text-[8px] font-black uppercase tracking-tighter">Midi</span>
                       <button className="text-slate-300 hover:text-teal-600 transition-colors"><Clock size={14}/></button>
                    </div>
                    <h5 className="font-black text-slate-800">Metformine 1000mg</h5>
                    <p className="text-[10px] text-slate-400 font-medium">Gestion Glycémie. Rappel automatique activé.</p>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500" style={{ width: '85%' }}></div>
                    </div>
                 </div>
              </div>
              <div className="absolute -right-6 -bottom-6 opacity-[0.03] font-arabic text-9xl">ش</div>
           </div>
        </div>

        {/* Reminders Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 border-teal-100">
              <h4 className="text-[11px] font-black text-teal-800 uppercase tracking-widest mb-10 flex items-center gap-3">
                 <Calendar size={20} className="text-teal-600" /> Échéances de Santé
              </h4>
              <div className="space-y-6">
                 {upcomingChecks.map((check, i) => (
                   <div key={i} className="flex items-start gap-4 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 group hover:border-teal-300 transition-all cursor-pointer">
                      <div className="p-3 bg-white rounded-xl text-teal-600 shadow-sm group-hover:scale-110 transition-transform"><Clock size={16}/></div>
                      <div className="min-w-0 flex-1">
                         <p className="text-xs font-black text-slate-800 truncate mb-1">{check.title}</p>
                         <p className="text-[9px] text-slate-400 font-bold uppercase">{check.date}</p>
                         <span className="text-[8px] font-black text-teal-600 uppercase mt-2 block">{check.status} avec {check.location}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden group">
              <div className="relative z-10">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 opacity-50 flex items-center gap-2"><AlertCircle size={14}/> Guide Premiers Secours</h4>
                 <div className="flex items-center gap-4 text-emerald-400 mb-6 group-hover:scale-105 transition-transform duration-500">
                    <FileText size={40} />
                    <p className="text-sm font-medium leading-relaxed italic opacity-80">"Consultez les procédures Majma pour la gestion des malaises lors des événements."</p>
                 </div>
                 <button className="w-full py-4 bg-teal-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Ouvrir le Guide</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalSupportHub;
