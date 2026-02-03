
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, ArrowRight, Music, Mic, PenTool, X, Bell, Info, CheckCircle, Share2 } from 'lucide-react';
import { CulturalActivity } from '../../types';
import { getCulturalActivities } from '../../services/cultureService';

const CulturalCalendar: React.FC = () => {
  const [activities, setActivities] = useState<CulturalActivity[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CulturalActivity | null>(null);
  const [reminderSet, setReminderSet] = useState(false);

  useEffect(() => {
    getCulturalActivities().then(setActivities);
  }, []);

  const handleSetReminder = () => {
    setReminderSet(true);
    setTimeout(() => {
        setReminderSet(false);
        alert(`Rappel programmé pour : ${selectedEvent?.title}`);
    }, 1500);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'khassaide': return <Music size={20} />;
      case 'conference': return <Mic size={20} />;
      case 'atelier': return <PenTool size={20} />;
      default: return <Calendar size={20} />;
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 relative">
      
      {/* EVENT DETAIL MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 relative flex flex-col max-h-[90vh]">
                
                {/* Header Image / Pattern */}
                <div className="h-32 bg-indigo-900 relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 to-purple-900"></div>
                    <div className="absolute -right-10 -bottom-20 text-white/10 rotate-12">
                        {getTypeIcon(selectedEvent.type)}
                    </div>
                    <button 
                        onClick={() => setSelectedEvent(null)} 
                        className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all backdrop-blur-md"
                    >
                        <X size={20} />
                    </button>
                    <div className="absolute bottom-6 left-8">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/20">
                            {selectedEvent.type}
                        </span>
                    </div>
                </div>

                <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                    <h2 className="text-3xl font-black text-slate-900 leading-tight mb-2">{selectedEvent.title}</h2>
                    <p className="text-sm font-medium text-slate-500 mb-8 flex items-center gap-2">
                       Organisé par la Commission Culturelle
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                            <div className="p-3 bg-white text-indigo-600 rounded-xl shadow-sm"><Calendar size={20}/></div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                                <p className="text-sm font-bold text-slate-800">{selectedEvent.date}</p>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                            <div className="p-3 bg-white text-indigo-600 rounded-xl shadow-sm"><Clock size={20}/></div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Heure</p>
                                <p className="text-sm font-bold text-slate-800">{selectedEvent.time}</p>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                            <div className="p-3 bg-white text-indigo-600 rounded-xl shadow-sm"><MapPin size={20}/></div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lieu</p>
                                <p className="text-sm font-bold text-slate-800">{selectedEvent.location}</p>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                            <div className="p-3 bg-white text-indigo-600 rounded-xl shadow-sm"><Users size={20}/></div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Public</p>
                                <p className="text-sm font-bold text-slate-800">{selectedEvent.targetAudience?.join(', ') || 'Tous'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <Info size={14} className="text-indigo-500"/> À propos de l'événement
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {selectedEvent.description}
                        </p>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 shrink-0">
                    <button 
                        onClick={handleSetReminder}
                        disabled={reminderSet}
                        className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                            reminderSet ? 'bg-emerald-100 text-emerald-700' : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600'
                        }`}
                    >
                        {reminderSet ? <CheckCircle size={16}/> : <Bell size={16}/>}
                        {reminderSet ? 'Rappel Activé' : 'Me Rappeler'}
                    </button>
                    <button className="flex-1 py-4 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 active:scale-95">
                        S'inscrire Maintenant <ArrowRight size={16}/>
                    </button>
                </div>
            </div>
        </div>
      )}

      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Agenda Culturel</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Calendar size={14} className="text-indigo-500" /> Événements et Rencontres Spirituelles
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map(activity => (
          <div 
            key={activity.id} 
            onClick={() => setSelectedEvent(activity)}
            className="glass-card p-6 flex flex-col justify-between group hover:border-indigo-300 hover:shadow-xl transition-all cursor-pointer relative overflow-hidden bg-white"
          >
             <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-[4rem] -mr-4 -mt-4 transition-all group-hover:bg-indigo-100"></div>
             
             <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                   <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                      {getTypeIcon(activity.type)}
                   </div>
                   <span className="px-3 py-1 bg-white border border-indigo-100 rounded-full text-[9px] font-black uppercase text-indigo-600">{activity.type}</span>
                </div>

                <h4 className="text-lg font-black text-slate-800 mb-2 leading-tight group-hover:text-indigo-700 transition-colors">{activity.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 mb-6 h-10">{activity.description}</p>

                <div className="space-y-3 pt-6 border-t border-indigo-50">
                   <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                      <Clock size={14} className="text-indigo-400" />
                      <span>{activity.date} à {activity.time}</span>
                   </div>
                   <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                      <MapPin size={14} className="text-indigo-400" />
                      <span className="truncate">{activity.location}</span>
                   </div>
                </div>
             </div>
             
             <button className="w-full mt-6 py-3 bg-indigo-50 text-indigo-700 rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white transition-all flex items-center justify-center gap-2">
                Détails & Inscription <ArrowRight size={14} />
             </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CulturalCalendar;
