
import React from 'react';
import { Stethoscope, Clock, Shield, AlertCircle, FileText, ChevronRight, Plus, Calendar, Pill, Search, Lock } from 'lucide-react';

interface Props { secureMode: boolean; }

const MedicalSupportHub: React.FC<Props> = ({ secureMode }) => {
  const upcomingChecks: any[] = []; // Liste vide

  if (!secureMode) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 animate-in fade-in duration-700">
         <div className="p-10 bg-slate-50 rounded-[3rem] text-slate-300 mb-8"><Lock size={64}/></div>
         <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Espace Confidentiel</h3>
         <p className="text-sm text-slate-400 font-medium max-w-sm leading-relaxed mb-10">
           Veuillez activer le <b>Mode Médical Sécurisé</b> pour accéder à vos rappels de soins, vos médications chroniques et votre carnet de santé numérique.
         </p>
         <button className="px-8 py-4 bg-teal-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all flex items-center gap-2">
           <Shield size={16}/> S'authentifier
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
                   <Shield size={24} className="text-teal-600" /> Mon Carnet de Santé Numérique
                 </h4>
                 <div className="flex gap-2">
                    <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-teal-600 transition-all border border-slate-100"><Search size={18}/></button>
                    <button className="px-5 py-2.5 bg-teal-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2"><Plus size={14}/> Ajouter Document</button>
                 </div>
              </div>

              <div className="space-y-4">
                 <p className="text-xs text-slate-400 italic text-center py-10">Aucun document médical archivé.</p>
              </div>
           </div>

           <div className="glass-card p-10 bg-teal-50/50 border-teal-100 relative overflow-hidden group">
              <h4 className="text-xl font-black text-teal-900 mb-8 flex items-center gap-3 relative z-10">
                 <Pill size={24} className="text-teal-600" /> Suivi Traitement Chronique
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                 {/* Empty State */}
                 <div className="col-span-2 text-center text-teal-700/50 text-xs font-bold py-8">
                    Aucun traitement en cours.
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
                 <p className="text-xs text-slate-400 italic text-center">Aucun rendez-vous planifié.</p>
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
