
import React, { useState, useMemo } from 'react';
import { Calendar, MapPin, Clock, Search, Filter, Plus, ChevronRight, ArrowLeft } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../utils/date';

const EventsModule: React.FC = () => {
  const { events, isLoading } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Tous');

  const filteredEvents = useMemo(() => {
    return (events || []).filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           e.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'Tous' || e.type === filterType;
      return matchesSearch && matchesType;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events, searchTerm, filterType]);

  const eventTypes = ['Tous', 'Magal', 'Ziar', 'Gott', 'Thiant', 'Réunion', 'Atelier', 'Sortie', 'Dîner', 'Sport'];

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center opacity-40">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] font-black uppercase tracking-widest">Chargement de l'agenda...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Agenda <span className="text-emerald-600">& Événements</span></h2>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Calendar size={14} className="text-emerald-500" /> Planification des activités du Dahira
          </p>
        </div>
        <button className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-3 hover:bg-emerald-600 transition-all active:scale-95">
          <Plus size={16} /> Proposer Événement
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 bg-white p-3 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un événement..." 
            className="w-full pl-16 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
          {eventTypes.map(type => (
            <button 
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                filterType === type ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/10' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? filteredEvents.map((event) => (
          <div key={event.id} className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] font-arabic text-8xl pointer-events-none group-hover:scale-110 transition-transform">م</div>
            
            <div className="flex justify-between items-start mb-8">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-lg">
                <span className="text-2xl font-black leading-none">{new Date(event.date).getDate()}</span>
                <span className="text-[8px] font-black uppercase tracking-widest mt-1">{new Date(event.date).toLocaleString('fr-FR', {month: 'short'})}</span>
              </div>
              <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-100">
                {event.type}
              </span>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-emerald-700 transition-colors line-clamp-2">{event.title}</h3>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-slate-400">
                <Clock size={14} className="text-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-tight">{event.time || 'Heure à confirmer'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <MapPin size={14} className="text-emerald-500" />
                <span className="text-xs font-bold line-clamp-1">{event.location}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-slate-300 group-hover:text-emerald-600 transition-colors">Détails de l'événement</span>
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                <ChevronRight size={18} />
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
            <Calendar size={48} className="mx-auto text-slate-200 mb-6" />
            <h4 className="text-xl font-black text-slate-400 uppercase tracking-widest">Aucun événement trouvé</h4>
            <p className="text-sm text-slate-300 mt-2">Essayez de modifier vos filtres ou votre recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsModule;
