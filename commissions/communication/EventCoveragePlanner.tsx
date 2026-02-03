
import React, { useMemo } from 'react';
import { Camera, Video, Users, CheckSquare, Clock, MapPin, Plus, ChevronRight, MoreHorizontal, ShieldCheck, CheckCircle, Calendar, AlertCircle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const EventCoveragePlanner: React.FC = () => {
  const { events } = useData();

  // Génération dynamique des plans de couverture basés sur les événements réels
  const coveragePlans = useMemo(() => {
    return events.map(event => ({
        id: event.id,
        title: event.title,
        date: new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        rawDate: new Date(event.date),
        location: event.location,
        team: [], // Équipe vide par défaut
        gear: [],
        workflow: new Date(event.date) > new Date() ? 'Planification' : 'Post-Prod'
    })).sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
  }, [events]);

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Planning de Couverture</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Camera size={14} className="text-amber-500" /> Gestion des équipes de tournage & Photographie
          </p>
        </div>
        <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-3 active:scale-95">
          <Plus size={18} /> Nouveau Plan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {coveragePlans.length > 0 ? coveragePlans.map(plan => (
            <div key={plan.id} className="glass-card p-1 relative overflow-hidden group">
              <div className="p-8 flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-48 h-32 bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-600 transition-all border border-transparent group-hover:border-amber-100">
                   <span className="text-2xl font-black">{plan.date.split(' ')[0]}</span>
                   <span className="text-[10px] font-black uppercase">{plan.date.split(' ').slice(1).join(' ')}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-black text-slate-900 truncate">{plan.title}</h4>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        plan.workflow === 'Post-Prod' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'
                    }`}>{plan.workflow}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-6 mb-8">
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                       <MapPin size={14} className="text-amber-500" /> {plan.location}
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                       <Users size={14} className="text-amber-500" /> {plan.team.length} Techniciens
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                    <div className="flex -space-x-3">
                      {plan.team.length > 0 ? plan.team.map((m: any, i: number) => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500">
                          {m.name[0]}
                        </div>
                      )) : <span className="text-[9px] text-slate-400 italic">Aucune équipe assignée</span>}
                    </div>
                    <button className="text-amber-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
                      Détails de mission <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center h-64 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400">
                <Calendar size={48} className="opacity-20 mb-4"/>
                <p className="text-xs font-bold uppercase">Aucun événement à couvrir</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 bg-slate-50/50 border-amber-100">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-10 flex items-center gap-3">
                <CheckSquare size={20} className="text-amber-600" /> Checklist Matériel
              </h4>
              <div className="space-y-6">
                {[
                  { label: 'Caméras chargées', status: false },
                  { label: 'Cartes SD formatées', status: false },
                  { label: 'Micros synchronisés', status: false },
                  { label: 'Trépieds vérifiés', status: false },
                  { label: 'Backup Disque Dur', status: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <span className={`text-xs font-bold ${item.status ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item.label}</span>
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${item.status ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-200 text-transparent'}`}>
                      <CheckCircle size={14} />
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 py-4 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-amber-300 hover:text-amber-600 transition-all">
                Vérifier tout l'inventaire
              </button>
           </div>

           <div className="glass-card p-8">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Statut des Workflow</h4>
              <div className="space-y-8">
                 {[
                   { l: 'Sélection Photos', p: 0 },
                   { l: 'Édition Vidéo', p: 0 },
                   { l: 'Validation Bureau', p: 0 },
                 ].map((w, i) => (
                   <div key={i} className="space-y-2">
                     <div className="flex justify-between items-center text-[9px] font-black uppercase">
                       <span>{w.l}</span>
                       <span className="text-amber-600">{w.p}%</span>
                     </div>
                     <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                        <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${w.p}%` }}></div>
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

export default EventCoveragePlanner;
