
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, ArrowRight, Music, Mic, PenTool } from 'lucide-react';
import { CulturalActivity } from '../../types';
import { getCulturalActivities } from '../../services/cultureService';

const CulturalCalendar: React.FC = () => {
  const [activities, setActivities] = useState<CulturalActivity[]>([]);

  useEffect(() => {
    getCulturalActivities().then(setActivities);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'khassaide': return <Music size={20} />;
      case 'conference': return <Mic size={20} />;
      case 'atelier': return <PenTool size={20} />;
      default: return <Calendar size={20} />;
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
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
          <div key={activity.id} className="glass-card p-6 flex flex-col justify-between group hover:border-indigo-300 transition-all cursor-pointer relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-[4rem] -mr-4 -mt-4 transition-all group-hover:bg-indigo-100"></div>
             
             <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                   <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {getTypeIcon(activity.type)}
                   </div>
                   <span className="px-3 py-1 bg-white border border-indigo-100 rounded-full text-[9px] font-black uppercase text-indigo-600">{activity.type}</span>
                </div>

                <h4 className="text-lg font-black text-slate-800 mb-2 leading-tight">{activity.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 mb-6">{activity.description}</p>

                <div className="space-y-3 pt-6 border-t border-indigo-50">
                   <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                      <Clock size={14} className="text-indigo-400" />
                      <span>{activity.date} à {activity.time}</span>
                   </div>
                   <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                      <MapPin size={14} className="text-indigo-400" />
                      <span>{activity.location}</span>
                   </div>
                </div>
             </div>
             
             <button className="w-full mt-6 py-3 bg-indigo-50 text-indigo-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2">
                S'inscrire <ArrowRight size={14} />
             </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CulturalCalendar;
