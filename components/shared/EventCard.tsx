
import React from 'react';
import { Calendar, MapPin, ArrowRight, Users, Clock } from 'lucide-react';
import { Event } from '../../types';
import { getDay, getMonth } from '../../utils/date';

interface EventCardProps {
  event: Event;
  onRegister?: () => void;
  onClick?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onRegister, onClick }) => {
  const eventDate = new Date(event.date);
  const day = getDay(event.date);
  const month = getMonth(event.date);
  const isPast = eventDate < new Date();

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'Magal': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Ziar': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Gott': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`group bg-white rounded-[2rem] p-1 border border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden ${isPast ? 'opacity-70 grayscale-[0.5]' : ''}`}
    >
      <div className="flex">
        {/* Date Column */}
        <div className="w-24 bg-slate-50 rounded-[1.8rem] flex flex-col items-center justify-center p-4 border border-slate-100 group-hover:bg-slate-100 transition-colors">
          <span className="text-3xl font-black text-slate-900">{day}</span>
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">{month}</span>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${getTypeStyle(event.type)}`}>
                {event.type}
              </span>
              {isPast && <span className="text-[9px] font-bold text-slate-400 uppercase">Terminé</span>}
            </div>
            
            <h4 className="text-lg font-black text-slate-800 leading-tight mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
              {event.title}
            </h4>
            
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <MapPin size={14} className="text-slate-400" />
                <span className="truncate">{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Clock size={14} className="text-slate-400" />
                <span>{event.time || '09:00'} - 18:00</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
            <div className="flex -space-x-2">
               {/* Mock avatars */}
               <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"></div>
               <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white"></div>
               <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-500">+40</div>
            </div>
            
            {!isPast && (
              <button 
                onClick={(e) => { e.stopPropagation(); onRegister?.(); }}
                className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
              >
                S'inscrire <ArrowRight size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
