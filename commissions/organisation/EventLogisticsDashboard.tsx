
import React, { useMemo } from 'react';
import { Truck, CheckCircle, Clock, MapPin, ChevronRight, AlertCircle, Calendar } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { CommissionType } from '../../types';

const EventLogisticsDashboard: React.FC = () => {
  const { tasks, events } = useData();

  // Trouver le prochain événement ou l'événement en cours
  const activeEvent = useMemo(() => {
    return events
      .filter(e => new Date(e.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }, [events]);

  // Filtrer les tâches logistiques
  const logisticsTasks = useMemo(() => {
    return tasks
      .filter(t => t.commission === CommissionType.ORGANISATION && t.status !== 'done')
      .slice(0, 5); // Limiter aux 5 plus récentes
  }, [tasks]);

  return (
    <div className="space-y-6">
      {/* Carte Principale: Événement Actif */}
      <div className="glass-card p-10 bg-gradient-to-br from-purple-800 to-indigo-950 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-12">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Événement Actuel</p>
              <h2 className="text-4xl font-black tracking-tighter">{activeEvent ? activeEvent.title : 'Aucun événement planifié'}</h2>
              <div className="flex items-center gap-3 mt-4">
                <span className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2">
                  <MapPin size={10} /> {activeEvent ? activeEvent.location : 'N/A'}
                </span>
                <span className="px-3 py-1 bg-slate-700 rounded-full text-[9px] font-black uppercase tracking-widest">
                  Phase : {activeEvent ? 'Opérationnelle' : 'Repos'}
                </span>
              </div>
            </div>
            <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-xl border border-white/10">
               <Calendar size={32} />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-white/10">
             {[
               { l: 'Bénévoles', v: activeEvent ? '12/20' : '0/0' },
               { l: 'Marmites', v: activeEvent ? '5 Actives' : '0 Actives' },
               { l: 'Café Servi', v: activeEvent ? '120 tasses' : '0 tasses' },
               { l: 'Budget Log.', v: '0 utilisé' }
             ].map((item, i) => (
               <div key={i}>
                 <p className="text-[9px] font-black uppercase opacity-40 mb-1">{item.l}</p>
                 <p className="text-xl font-black">{item.v}</p>
               </div>
             ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 p-20 opacity-[0.03] font-arabic text-[20rem] pointer-events-none">و</div>
      </div>

      {/* Liste des Tâches Opérationnelles */}
      <div className="glass-card p-10 bg-white min-h-[300px] flex flex-col border border-slate-100">
        <h3 className="text-xl font-black text-slate-900 mb-10 flex items-center gap-3">
          <Truck size={22} className="text-purple-600" /> Flux Opérationnel en Direct
        </h3>
        <div className="space-y-4 flex-1">
           {logisticsTasks.length > 0 ? logisticsTasks.map(task => (
             <div key={task.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.5rem] group hover:bg-white hover:shadow-xl hover:shadow-purple-900/5 transition-all cursor-pointer border border-transparent hover:border-purple-100">
                <div className="flex items-center gap-6">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                     task.status === 'done' ? 'bg-emerald-100 text-emerald-600' : task.status === 'in_progress' ? 'bg-purple-100 text-purple-600 animate-pulse' : 'bg-white text-slate-300 shadow-sm'
                   }`}>
                      {task.status === 'done' ? <CheckCircle size={20} /> : <Clock size={20} />}
                   </div>
                   <div>
                      <p className="text-sm font-black text-slate-800">{task.title}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                         {task.assignedTo ? 'Assigné' : 'Non assigné'} • {task.priority === 'high' ? 'Urgent' : 'Normal'}
                      </p>
                   </div>
                </div>
                <ChevronRight size={18} className="text-slate-200 group-hover:text-purple-500 transition-all" />
             </div>
           )) : (
             <div className="flex flex-col items-center justify-center h-full text-slate-300">
                <Truck size={40} className="mb-4 opacity-20"/>
                <p className="text-xs font-bold uppercase">Aucune tâche logistique en cours</p>
                <p className="text-[10px] mt-1">Ajoutez des tâches dans l'onglet "Tâches"</p>
             </div>
           )}
        </div>
        <button className="w-full mt-10 py-5 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:border-purple-300 hover:text-purple-600 transition-all">
          Accéder au Bilan Post-Événement
        </button>
      </div>
    </div>
  );
};

export default EventLogisticsDashboard;
