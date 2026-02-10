import React, { useState } from 'react';
import { HeartPulse, Activity, Stethoscope, ShieldPlus, Clock, ChevronRight, Apple, Pill, AlertCircle, Plus, Thermometer, UserCheck, Calendar, ArrowLeft, Phone } from 'lucide-react';
// Fixed: AuthContext path updated to contexts/
import { useAuth } from '../contexts/AuthContext';

const HealthModule: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'manager' || user?.role === 'Super Admin';
  
  const [view, setView] = useState<'dashboard' | 'appointment' | 'record'>('dashboard');

  const [alerts] = useState<any[]>([]);
  const checkups: any[] = [];
  const stocks: any[] = [];

  const handleBookAppointment = () => {
      // Simulation prise de RDV
      alert("Demande de RDV envoyée à la commission médicale.");
      setView('dashboard');
  };

  // --- VUE MEMBRE ---
  if (!isAdmin) {
      if (view === 'appointment') {
          return (
             <div className="max-w-xl mx-auto animate-in slide-in-from-right-4">
                <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold uppercase text-xs tracking-widest mb-6 transition-colors">
                    <ArrowLeft size={16} /> Retour
                </button>
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
                   <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                      <Calendar size={24} className="text-teal-600"/> Demande de Consultation
                   </h3>
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-slate-400">Type de soin</label>
                         <select className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold text-slate-800 outline-none">
                            <option>Consultation Générale</option>
                            <option>Dentaire</option>
                            <option>Ophtalmologie</option>
                            <option>Autre</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-slate-400">Disponibilité préférée</label>
                         <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold text-slate-800 outline-none" placeholder="Ex: Samedi matin" />
                      </div>
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                         <p className="text-xs text-amber-800 font-medium">Note : Ce service est assuré par les médecins bénévoles du Dahira. Une confirmation vous sera envoyée.</p>
                      </div>
                      <button onClick={handleBookAppointment} className="w-full py-4 bg-teal-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-teal-700 transition-all">
                         Envoyer la demande
                      </button>
                   </div>
                </div>
             </div>
          );
      }

      return (
        <div className="space-y-8 animate-in fade-in pb-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Ma Santé</h2>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                        <HeartPulse size={14} className="text-teal-500" /> Prévention & Accès aux soins
                    </p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-rose-100 shadow-sm hover:bg-rose-100 transition-all" onClick={() => alert("Contact urgence: 77 000 00 00")}>
                    <Phone size={14}/> SOS Médecin
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div onClick={() => setView('appointment')} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-teal-200 transition-all cursor-pointer group">
                   <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Calendar size={28}/>
                   </div>
                   <h3 className="text-lg font-black text-slate-900 mb-2">Prendre Rendez-vous</h3>
                   <p className="text-xs text-slate-500 leading-relaxed">Consultez nos spécialistes bénévoles lors des journées de consultation.</p>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer group">
                   <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Activity size={28}/>
                   </div>
                   <h3 className="text-lg font-black text-slate-900 mb-2">Mon Carnet Digital</h3>
                   <p className="text-xs text-slate-500 leading-relaxed">Historique de vos constantes et documents médicaux sécurisés.</p>
                </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
               <div className="relative z-10">
                  <h4 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-3">
                     <Apple size={18} className="text-emerald-400"/> Conseil Santé du Jour
                  </h4>
                  <p className="text-lg font-medium italic opacity-90 max-w-2xl leading-relaxed">
                     "Buvez au moins 1.5L d'eau par jour, surtout en période de chaleur, pour maintenir votre énergie spirituelle et physique."
                  </p>
               </div>
               <div className="absolute -right-10 -bottom-10 opacity-10 text-emerald-500"><HeartPulse size={150}/></div>
            </div>
        </div>
      );
  }

  // --- VUE ADMIN (Legacy) ---
  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight leading-none">Santé & Bien-être</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Cellule Médicale • Vue Administrateur</p>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-black transition-all active:scale-95">
            <Stethoscope size={18} />
            Nouvelle Fiche
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          {/* Vigilance Panel */}
          <div className="bg-rose-50/50 border border-rose-100 rounded-[3rem] p-10 overflow-hidden relative group">
            <div className="relative z-10">
              <h3 className="font-black text-rose-800 mb-8 flex items-center gap-3 text-sm uppercase tracking-widest">
                <AlertCircle size={22} className="text-rose-600" />
                Alertes de Vigilance Médicale
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {alerts.length > 0 ? alerts.map(alert => (
                  <div key={alert.id}></div>
                )) : (
                  <div className="col-span-2 text-center text-slate-400 italic text-xs py-8">
                     Aucune alerte médicale en cours.
                  </div>
                )}
              </div>
            </div>
            <HeartPulse className="absolute -right-10 -bottom-10 text-rose-500/5 group-hover:scale-110 transition-transform duration-1000" size={200} />
          </div>

          {/* History Table */}
          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
              <h3 className="font-black text-gray-800 flex items-center gap-3">
                <UserCheck size={22} className="text-emerald-600" />
                Journal des Consultations
              </h3>
              <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Accéder aux Archives</button>
            </div>
            <div className="divide-y divide-gray-50">
               <div className="py-12 text-center text-slate-400 text-xs italic">
                   Aucune consultation récente.
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Pharmacy Management */}
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-10">
               <div className="p-3 bg-gray-900 text-white rounded-2xl shadow-xl"><Pill size={22} /></div>
               <div>
                  <h3 className="font-black text-[10px] uppercase tracking-widest text-gray-400">Pharmacie</h3>
                  <p className="text-xs font-bold text-gray-800">Gestion Stock</p>
               </div>
            </div>
            <div className="space-y-4 mb-8 flex-1">
                <p className="text-xs text-slate-400 italic text-center">Inventaire pharmacie vide.</p>
            </div>
            <button className="w-full py-4 bg-[#2E8B57] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 group">
              <Plus size={16} className="group-hover:rotate-90 transition-transform" />
              Réapprovisionner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthModule;