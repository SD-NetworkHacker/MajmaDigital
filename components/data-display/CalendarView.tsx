
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, Plus, Clock } from 'lucide-react';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type?: string; // e.g., 'meeting', 'task', 'deadline'
  color?: string; // tailwind bg class
}

interface CalendarViewProps {
  events: CalendarEvent[];
  onAddEvent?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  height?: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({ 
  events, 
  onAddEvent, 
  onEventClick,
  height = 'h-[600px]'
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');

  // --- HELPERS ---
  
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    // 0 = Sunday, but we want Monday start (so shift: 0->6, 1->0)
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const days = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const numDays = getDaysInMonth(year, month);
    const startOffset = getFirstDayOfMonth(year, month);
    
    const calendarDays = [];
    
    // Empty slots for offset
    for (let i = 0; i < startOffset; i++) calendarDays.push(null);
    
    // Real days
    for (let i = 1; i <= numDays; i++) {
      calendarDays.push(new Date(year, month, i));
    }
    
    return calendarDays;
  }, [currentDate]);

  const monthLabel = currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });

  // --- HANDLERS ---

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') newDate.setMonth(newDate.getMonth() - 1);
    else newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') newDate.setMonth(newDate.getMonth() + 1);
    else newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const getEventsForDay = (date: Date) => {
    return events.filter(e => 
      e.start.getDate() === date.getDate() && 
      e.start.getMonth() === date.getMonth() && 
      e.start.getFullYear() === date.getFullYear()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  return (
    <div className={`bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden ${height}`}>
      
      {/* Toolbar */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
         <div className="flex items-center gap-4">
            <div className="flex bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
               <button onClick={handlePrev} className="p-2 hover:bg-slate-50 rounded-lg text-slate-500"><ChevronLeft size={16}/></button>
               <button onClick={() => setCurrentDate(new Date())} className="px-4 text-xs font-black text-slate-700 uppercase tracking-widest border-x border-slate-100">Aujourd'hui</button>
               <button onClick={handleNext} className="p-2 hover:bg-slate-50 rounded-lg text-slate-500"><ChevronRight size={16}/></button>
            </div>
            <h3 className="text-lg font-black text-slate-800 capitalize">{monthLabel}</h3>
         </div>

         <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 p-1 rounded-xl">
               <button onClick={() => setView('month')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${view === 'month' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-400'}`}>Mois</button>
               <button onClick={() => setView('week')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${view === 'week' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-400'}`}>Semaine</button>
            </div>
            {onAddEvent && (
              <button 
                onClick={() => onAddEvent(new Date())}
                className="p-3 bg-slate-900 text-white rounded-xl hover:bg-black transition-all shadow-lg active:scale-95"
              >
                <Plus size={18} />
              </button>
            )}
         </div>
      </div>

      {/* Calendar Grid (Month View) */}
      {view === 'month' && (
        <div className="flex-1 flex flex-col">
           {/* Weekday Headers */}
           <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                 <div key={day} className="py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {day}
                 </div>
              ))}
           </div>
           
           {/* Days Grid */}
           <div className="grid grid-cols-7 flex-1 auto-rows-fr">
              {days.map((date, i) => (
                 <div 
                   key={i} 
                   className={`border-b border-r border-slate-50 p-2 min-h-[100px] group relative hover:bg-slate-50/50 transition-colors ${!date ? 'bg-slate-50/20' : ''}`}
                   onClick={() => date && onAddEvent && onAddEvent(date)}
                 >
                    {date && (
                      <>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                           isToday(date) ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500'
                        }`}>
                           {date.getDate()}
                        </div>
                        
                        <div className="space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                           {getEventsForDay(date).map(event => (
                              <div 
                                key={event.id}
                                onClick={(e) => { e.stopPropagation(); onEventClick?.(event); }}
                                className={`px-2 py-1 rounded-md text-[9px] font-bold truncate cursor-pointer shadow-sm border border-transparent hover:brightness-95 ${event.color || 'bg-blue-100 text-blue-700'}`}
                              >
                                 {event.title}
                              </div>
                           ))}
                        </div>
                      </>
                    )}
                 </div>
              ))}
           </div>
        </div>
      )}

      {/* Simplified Week/List View for Demo */}
      {view === 'week' && (
         <div className="flex-1 p-6 overflow-y-auto">
            <p className="text-center text-slate-400 italic text-sm">Vue Semaine simplifiée (Liste)</p>
            <div className="mt-6 space-y-4">
               {days.filter(d => d).slice(0, 7).map((date, i) => (
                  <div key={i} className="flex gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50/30">
                     <div className="w-16 text-center shrink-0">
                        <p className="text-xs font-black text-slate-500 uppercase">{date?.toLocaleDateString('fr-FR', {weekday: 'short'})}</p>
                        <p className="text-xl font-black text-slate-900">{date?.getDate()}</p>
                     </div>
                     <div className="flex-1 space-y-2 border-l border-slate-200 pl-4">
                        {date && getEventsForDay(date).length > 0 ? getEventsForDay(date).map(e => (
                           <div key={e.id} className="flex items-center gap-3 p-2 bg-white border border-slate-100 rounded-lg shadow-sm">
                              <span className={`w-2 h-2 rounded-full ${e.color ? e.color.replace('bg-', 'bg-') : 'bg-blue-500'}`}></span>
                              <span className="text-xs font-bold text-slate-700">{e.title}</span>
                              <span className="text-[10px] text-slate-400 ml-auto flex items-center gap-1"><Clock size={10}/> {e.start.getHours()}h</span>
                           </div>
                        )) : <p className="text-xs text-slate-300 italic py-2">Aucun événement</p>}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      )}

    </div>
  );
};

export default CalendarView;
