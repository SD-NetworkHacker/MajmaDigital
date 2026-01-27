
import React, { useState } from 'react';
import { HeartPulse, Activity, Stethoscope, ShieldPlus, Clock, ChevronRight, Apple, Pill, AlertCircle, Plus, Thermometer, UserCheck } from 'lucide-react';

const HealthModule: React.FC = () => {
  const [alerts] = useState([
    { id: 1, member: 'Omar Gueye', issue: 'Suivi Tension Artérielle', priority: 'high', time: '10:45' },
    { id: 2, member: 'Fatou Sylla', issue: 'Bilan Post-Opératoire', priority: 'medium', time: 'Hier' },
  ]);

  const checkups = [
    { id: 1, member: 'Modou Diagne', date: '10 Mai', type: 'Contrôle Glycémie', status: 'Terminé' },
    { id: 2, member: 'Aissatou Ba', date: '22 Mai', type: 'Visite Prénatale', status: 'À venir' },
    { id: 3, member: 'Ibrahima Fall', date: '25 Mai', type: 'Consultation Générale', status: 'À venir' },
  ];

  const stocks = [
    { name: 'Paracétamol', qty: '15 B.', status: 'OK', c: 'text-emerald-500' },
    { name: 'Pansements Stériles', qty: '4 U.', status: 'BAS', c: 'text-rose-500 animate-pulse' },
    { name: 'Tensiomètre Digital', qty: '2 U.', status: 'OK', c: 'text-emerald-500' },
    { name: 'Masques Chirurgicaux', qty: '100 U.', status: 'OK', c: 'text-emerald-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight leading-none">Santé & Bien-être</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Cellule Médicale • Prévention & Assistance</p>
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
                {alerts.map(alert => (
                  <div key={alert.id} className="bg-white p-6 rounded-3xl shadow-sm border border-rose-100 flex justify-between items-center group/alert hover:border-rose-300 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${alert.priority === 'high' ? 'bg-rose-500 text-white animate-pulse' : 'bg-rose-100 text-rose-600'}`}>
                        <Thermometer size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-800">{alert.member}</p>
                        <p className="text-[10px] text-rose-500 font-bold uppercase tracking-tight mt-1">{alert.issue}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[9px] font-black text-gray-300 uppercase mb-2">{alert.time}</p>
                       <ChevronRight size={18} className="text-rose-200 group-hover/alert:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
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
              {checkups.map((check) => (
                <div key={check.id} className="p-8 hover:bg-emerald-50/20 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-50 shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <Activity size={24} />
                    </div>
                    <div>
                      <p className="text-base font-black text-gray-800 mb-1 leading-none">{check.member}</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2">{check.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="text-right">
                      <p className="text-xs font-black text-gray-500 mb-1">{check.date}</p>
                      <p className={`text-[9px] font-black uppercase tracking-widest ${check.status === 'Terminé' ? 'text-emerald-500' : 'text-amber-500'}`}>{check.status}</p>
                    </div>
                    <button className="p-3 bg-gray-50 text-gray-300 rounded-xl group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                       <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              ))}
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
              {stocks.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-gray-50 rounded-[1.5rem] border border-gray-50 hover:border-emerald-100 hover:bg-white transition-all group">
                  <div>
                    <p className="text-xs font-black text-gray-800">{item.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">Quantité: {item.qty}</p>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${item.c}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full py-4 bg-[#2E8B57] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 group">
              <Plus size={16} className="group-hover:rotate-90 transition-transform" />
              Réapprovisionner
            </button>
          </div>

          {/* Spiritual Quote Section */}
          <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col h-full">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 w-fit mb-8">
                <Apple size={24} className="text-emerald-300" />
              </div>
              <h4 className="font-black text-[10px] uppercase tracking-widest opacity-60 mb-6">Sunna & Santé</h4>
              <p className="text-sm font-medium leading-loose italic opacity-90">
                "L'estomac est la demeure de toutes les maladies, et la tempérance est le chef de tous les remèdes."
              </p>
            </div>
            <div className="absolute -left-10 -bottom-10 text-white/5 font-arabic text-8xl">ش</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthModule;
