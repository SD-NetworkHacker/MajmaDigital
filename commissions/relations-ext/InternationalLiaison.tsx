
import React from 'react';
import { Globe, Users, Heart, Sparkles, MapPin, ChevronRight, MessageCircle, ExternalLink, GraduationCap, Briefcase, Plus, PlaneLanding } from 'lucide-react';

const InternationalLiaison: React.FC = () => {
  const hubs: any[] = [];

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Bureau International & Diaspora</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Globe size={14} className="text-slate-600" /> Coordination transnationale et soutien aux expatriés
          </p>
        </div>
        <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-3 active:scale-95 transition-all">
           <PlaneLanding size={18}/> Support Nouveaux Arrivants
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* World Presence Map Preview / List */}
        <div className="lg:col-span-8 glass-card p-10 bg-white relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-[0.02] font-arabic text-[20rem] rotate-12 pointer-events-none">ص</div>
           <div className="relative z-10">
              <div className="flex justify-between items-center mb-12">
                 <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    <Globe size={24} className="text-blue-600" /> Kurels Hors-Frontières
                 </h4>
                 <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100 hover:bg-white transition-all">Liste</button>
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Carte Monde</button>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                 {hubs.length > 0 ? hubs.map((hub, i) => (
                   <div key={i}></div>
                 )) : (
                   <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
                      <MapPin size={40} className="mb-4 opacity-20"/>
                      <p className="text-xs font-bold uppercase">Aucun hub international enregistré</p>
                   </div>
                 )}
              </div>
           </div>
        </div>

        {/* Diaspora Support Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 bg-slate-900 text-white flex flex-col h-full relative overflow-hidden">
              <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-10 flex items-center gap-3">
                 <Heart size={18} /> Support Desk Diaspora
              </h4>
              <div className="space-y-6 flex-1 relative z-10">
                 <div className="space-y-4">
                    <h5 className="text-[9px] font-black uppercase opacity-30 border-b border-white/5 pb-2">Dernières Demandes Support</h5>
                    <p className="text-xs text-slate-500 italic">Aucune demande en cours.</p>
                 </div>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-[0.05] font-arabic text-[12rem] rotate-12">ص</div>
           </div>

           <div className="glass-card p-8 bg-blue-50/20 border-blue-100">
              <div className="flex items-center gap-3 mb-6 text-blue-700">
                 <Sparkles size={22} />
                 <h4 className="font-black text-xs uppercase tracking-widest">IA Diaspora Match</h4>
              </div>
              <p className="text-[12px] font-medium text-slate-700 leading-relaxed italic">
                "En attente de données pour proposer des mises en relation."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default InternationalLiaison;
