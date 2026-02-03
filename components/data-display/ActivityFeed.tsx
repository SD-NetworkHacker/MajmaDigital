import React, { useState, useMemo } from 'react';
import { Clock, Filter, Circle } from 'lucide-react';

export interface ActivityItem {
  id: string;
  title: string;
  description?: string;
  date: Date;
  type: 'info' | 'success' | 'warning' | 'error';
  user?: string; // Nom de l'utilisateur ou avatar
  icon?: React.ReactNode;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  title?: string;
  height?: string; // Class CSS ex: h-[400px]
  enableFilters?: boolean;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  activities, 
  title = "Flux d'Activité",
  height = "max-h-[500px]",
  enableFilters = true
}) => {
  
  const [filter, setFilter] = useState<'all' | 'info' | 'success' | 'warning'>('all');

  const filteredActivities = useMemo(() => {
    return activities
      .filter(a => filter === 'all' || a.type === filter)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [activities, filter]);

  // Group by Date Label
  const groupedActivities = useMemo(() => {
    const groups: Record<string, ActivityItem[]> = {};
    filteredActivities.forEach(act => {
       const today = new Date();
       const date = new Date(act.date);
       let key = date.toLocaleDateString();
       
       if (date.toDateString() === today.toDateString()) key = "Aujourd'hui";
       else {
         const yesterday = new Date();
         yesterday.setDate(today.getDate() - 1);
         if (date.toDateString() === yesterday.toDateString()) key = "Hier";
       }
       
       if (!groups[key]) groups[key] = [];
       groups[key].push(act);
    });
    return groups;
  }, [filteredActivities]);

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'warning': return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'error': return 'bg-rose-100 text-rose-600 border-rose-200';
      default: return 'bg-blue-100 text-blue-600 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
       
       <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest flex items-center gap-2">
             <Clock size={16} className="text-slate-400" /> {title}
          </h3>
          
          {enableFilters && (
            <div className="flex bg-white p-1 rounded-lg border border-slate-200">
               {['all', 'info', 'success', 'warning'].map(f => (
                 <button
                   key={f}
                   onClick={() => setFilter(f as any)}
                   className={`px-3 py-1 text-[9px] font-black uppercase rounded-md transition-all ${
                     filter === f ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'
                   }`}
                 >
                   {f === 'all' ? 'Tout' : f}
                 </button>
               ))}
            </div>
          )}
       </div>

       <div className={`p-6 overflow-y-auto custom-scrollbar ${height}`}>
          {Object.entries(groupedActivities).length > 0 ? Object.entries(groupedActivities).map(([dateLabel, items]) => (
            <div key={dateLabel} className="mb-8 last:mb-0">
               <div className="sticky top-0 bg-white/95 backdrop-blur-sm py-2 z-10 border-b border-slate-50 mb-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{dateLabel}</span>
               </div>
               
               <div className="relative pl-4 space-y-6 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                  {(items as ActivityItem[]).map((act) => (
                    <div key={act.id} className="relative flex gap-4 group">
                       {/* Timeline Dot */}
                       <div className={`relative z-10 w-2.5 h-2.5 rounded-full border-2 border-white mt-1.5 shadow-sm ${
                         act.type === 'success' ? 'bg-emerald-500' : 
                         act.type === 'warning' ? 'bg-amber-500' : 
                         act.type === 'error' ? 'bg-rose-500' : 'bg-blue-500'
                       }`}></div>
                       
                       <div className="flex-1 pb-2">
                          <div className="flex justify-between items-start">
                             <h5 className="text-xs font-bold text-slate-800 leading-tight">{act.title}</h5>
                             <span className="text-[9px] font-mono text-slate-400 ml-2">{act.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                          
                          {act.description && (
                            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{act.description}</p>
                          )}
                          
                          {act.user && (
                             <div className="mt-2 flex items-center gap-2">
                                <div className="px-2 py-0.5 bg-slate-50 rounded-md text-[9px] font-bold text-slate-600 uppercase tracking-wide border border-slate-100">
                                   {act.user}
                                </div>
                             </div>
                          )}
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center h-full py-10 text-slate-400">
               <Filter size={32} className="opacity-20 mb-2"/>
               <p className="text-xs font-bold uppercase">Aucune activité</p>
            </div>
          )}
       </div>

    </div>
  );
};

export default ActivityFeed;