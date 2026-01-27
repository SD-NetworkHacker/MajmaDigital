
import React from 'react';
import { Globe, Users, Heart, Sparkles, MapPin, ChevronRight, MessageCircle, ExternalLink, GraduationCap, Briefcase, Plus, PlaneLanding } from 'lucide-react';

const InternationalLiaison: React.FC = () => {
  const hubs = [
    { city: 'Paris', country: 'France', members: 154, activity: 'Élevé', leader: 'Omar Fall' },
    { city: 'New York', country: 'USA', members: 42, activity: 'Moyen', leader: 'Awa Ndiaye' },
    { city: 'Casablanca', country: 'Maroc', members: 88, activity: 'En hausse', leader: 'Saliou Diop' },
    { city: 'Milan', country: 'Italie', members: 67, activity: 'Stable', leader: 'Modou Cissé' },
  ];

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
                 {hubs.map((hub, i) => (
                   <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:bg-white hover:border-blue-200 transition-all cursor-pointer">
                      <div className="flex justify-between items-start mb-6">
                         <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <MapPin size={24} />
                         </div>
                         <div className="text-right">
                            <span className="text-[8px] font-black uppercase bg-white border border-slate-100 px-2 py-1 rounded-lg text-slate-400">Activité: {hub.activity}</span>
                         </div>
                      </div>
                      <h5 className="text-lg font-black text-slate-800 leading-tight mb-1">{hub.city}, {hub.country}</h5>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">{hub.members} Talibés enregistrés</p>
                      
                      <div className="pt-6 border-t border-slate-100/50 flex justify-between items-center">
                         <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-black">AD</div>
                            <span className="text-[9px] font-black text-slate-500 uppercase">{hub.leader}</span>
                         </div>
                         <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors"><ChevronRight size={18}/></button>
                      </div>
                   </div>
                 ))}
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
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                    <p className="text-[10px] font-black uppercase opacity-40">Prochain Webinar International</p>
                    <h5 className="text-base font-black">"Intégration & Valeurs : Le défi des études à l'étranger"</h5>
                    <div className="flex items-center gap-3 text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                       <PlaneLanding size={12}/> Samedi 18h GMT • Zoom
                    </div>
                    <button className="w-full py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">M'inscrire</button>
                 </div>
                 
                 <div className="space-y-4">
                    <h5 className="text-[9px] font-black uppercase opacity-30 border-b border-white/5 pb-2">Dernières Demandes Support</h5>
                    {[
                      { l: 'Visa Étudiant - France', s: 'Traitement' },
                      { l: 'Aide Logement - Casa', s: 'Finalisé' },
                      { l: 'Transport Kurels Magal', s: 'Ouvert' },
                    ].map((req, i) => (
                      <div key={i} className="flex items-center justify-between group cursor-pointer">
                         <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${req.s === 'Finalisé' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                            <span className="text-[11px] font-black leading-none">{req.l}</span>
                         </div>
                         <ChevronRight size={14} className="opacity-20 group-hover:opacity-100 text-emerald-400 transition-opacity" />
                      </div>
                    ))}
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
                "Nous avons identifié 3 membres à Paris ayant le même parcours académique qu'Abdourahmane Fall qui vient d'arriver. Souhaitez-vous déclencher une mise en relation ?"
              </p>
              <button className="mt-6 text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest">Connecter maintenant</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default InternationalLiaison;
