
import React, { useMemo } from 'react';
import { UserCheck, ShieldCheck, Plus, Search, Filter, ChevronRight, UserPlus, FileCheck, Award, History, Clock, MapPin, User } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { GlobalRole } from '../../types';

const ProtocolManager: React.FC = () => {
  const { members } = useData();

  // Filter for VIPs (Admin, SG, Dieuwrine) as a mock "Guest List" for protocol
  const vipGuests = useMemo(() => {
     // Fix: Cast GlobalRole values to string for array check compatibility
     return members.filter(m => ([GlobalRole.ADMIN as string, GlobalRole.SG as string, GlobalRole.DIEUWRINE as string]).includes(m.role as string));
  }, [members]);

  return (
    <div className="space-y-8 animate-in zoom-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Poste de Commandement Protocolaire</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <UserCheck size={14} className="text-slate-600" /> Gestion des accréditations et du parcours VIP
          </p>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-4 bg-white border border-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-sm">Archive Accueil</button>
           <button className="px-8 py-4 bg-slate-800 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-3">
              <UserPlus size={18} /> Enregistrer Invité
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Live Guest Tracking */}
        <div className="lg:col-span-8 glass-card p-10 bg-white">
           <div className="flex justify-between items-center mb-10">
              <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                 <History size={24} className="text-slate-600" /> Liste de Présence Officielle (VIPs)
              </h4>
              <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-slate-800 border border-slate-100 transition-all shadow-sm"><Search size={18}/></button>
           </div>

           <div className="space-y-4">
              {vipGuests.length > 0 ? vipGuests.map((guest) => (
                <div key={guest.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-300 transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-200 text-slate-400 shadow-sm">
                         <User size={20}/>
                      </div>
                      <div>
                         <h5 className="font-black text-slate-800 text-sm">{guest.firstName} {guest.lastName}</h5>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{guest.role}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase">Présent</span>
                      <button className="p-2 text-slate-300 hover:text-slate-600"><ChevronRight size={16}/></button>
                   </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                   <UserCheck size={40} className="mb-4 opacity-20"/>
                   <p className="text-xs font-bold uppercase">Aucun invité en cours</p>
                </div>
              )}
           </div>
        </div>

        {/* Protocol Tools Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden group">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 opacity-50 flex items-center gap-2"><Award size={14}/> Accréditations Express</h4>
              <div className="space-y-6 relative z-10">
                 <div className="aspect-[4/3] bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center p-8 group-hover:bg-white/10 transition-all cursor-pointer">
                    <div className="p-4 bg-slate-700 rounded-2xl shadow-xl text-white mb-6 group-hover:rotate-6 transition-transform"><FileCheck size={32} /></div>
                    <p className="text-xs font-black uppercase tracking-widest mb-2">Générer Badge VIP</p>
                    <p className="text-[10px] opacity-40 font-medium leading-relaxed">Impression instantanée avec QR code de sécurité pour accès prioritaire.</p>
                 </div>
                 <button className="w-full py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all">Générer tout le lot</button>
              </div>
           </div>

           <div className="glass-card p-10 bg-white space-y-8">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                 <Clock size={18} /> Rappels de Vigilance
              </h4>
              <div className="space-y-4">
                 <p className="text-xs text-slate-400 italic text-center">Aucun rappel actif.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProtocolManager;
