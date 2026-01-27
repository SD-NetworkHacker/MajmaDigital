
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Plus, ChevronRight, Bell, X, Users, Sparkles } from 'lucide-react';
import EventForm from './EventForm';
import { Event } from '../types';
import { useData } from '../contexts/DataContext';

const EventModule: React.FC = () => {
  const { events, addEvent } = useData();
  const [showForm, setShowForm] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState<string | null>(null);
  const [activeReminders, setActiveReminders] = useState<Record<string, number>>({});

  useEffect(() => {
    const saved = localStorage.getItem('majma_event_reminders');
    if (saved) setActiveReminders(JSON.parse(saved));
  }, []);

  const saveReminder = (eventId: string, minutes: number) => {
    const newReminders = { ...activeReminders, [eventId]: minutes };
    setActiveReminders(newReminders);
    localStorage.setItem('majma_event_reminders', JSON.stringify(newReminders));
    setShowReminderModal(null);
  };

  const handleAddEvent = (data: any) => {
    const newEvent: Event = {
      ...data,
      id: Date.now().toString(),
    };
    addEvent(newEvent);
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {showForm && (
        <EventForm 
          onClose={() => setShowForm(false)} 
          onSubmit={handleAddEvent} 
        />
      )}

      {showReminderModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-emerald-50">
              <h3 className="font-black text-gray-800 text-sm flex items-center gap-2"><Bell size={18} className="text-emerald-600" /> Rappel</h3>
              <button onClick={() => setShowReminderModal(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-3">
              {[60, 1440, 10080].map((min) => (
                <button 
                  key={min}
                  onClick={() => saveReminder(showReminderModal, min)}
                  className="w-full p-4 text-left rounded-2xl border border-gray-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all flex items-center justify-between"
                >
                  <span className="text-xs font-bold text-gray-700">{min === 60 ? '1 Heure' : min === 1440 ? '1 Jour' : '1 Semaine'}</span>
                  <ChevronRight size={16} className="text-gray-300" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight leading-none">Événements & Agenda</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Calendrier Officiel Dahira</p>
          </div>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-black transition-all active:scale-95"
        >
          <Plus size={18} />
          <span>Planifier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-[10px] uppercase tracking-widest text-gray-400">Aperçu Agenda</h3>
                <Calendar size={14} className="text-emerald-600" />
             </div>
             <div className="grid grid-cols-7 gap-1 text-center opacity-40">
                {['L','M','M','J','V','S','D'].map(d => <span key={d} className="text-[8px] font-black">{d}</span>)}
                {Array.from({length: 31}).map((_,i) => <span key={i} className="text-[10px] py-1">{i+1}</span>)}
             </div>
          </div>

          <div className="bg-emerald-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
            <Sparkles className="absolute -right-8 -bottom-8 text-white/5 group-hover:rotate-12 transition-transform duration-1000" size={120} />
            <div className="relative z-10">
              <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 opacity-60">Status Préparatifs</h4>
              <p className="text-2xl font-black mb-2">94%</p>
              <p className="text-[9px] font-bold opacity-60 uppercase tracking-widest">Taux de mobilisation moyen</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event) => {
              const hasReminder = !!activeReminders[event.id];
              return (
                <div key={event.id} className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden group hover:shadow-2xl transition-all duration-500">
                  <div className="h-44 bg-gray-100 relative overflow-hidden">
                    <img src={`https://picsum.photos/seed/${event.id}/800/600`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={event.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-6 left-6 flex gap-2">
                       <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase tracking-widest">{event.type}</div>
                       {hasReminder && <div className="px-3 py-1 bg-emerald-500 rounded-lg text-[8px] font-black text-white uppercase tracking-widest flex items-center gap-1 animate-in zoom-in"><Bell size={10} /> Rappel</div>}
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h3 className="text-xl font-black leading-tight">{event.title}</h3>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-emerald-600" />
                        <span className="text-xs font-bold text-gray-700">{new Date(event.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-emerald-600" />
                        <span className="text-xs font-bold text-gray-700 truncate max-w-[100px]">{event.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-black text-[8px]">T</div>
                         <span className="text-[10px] font-black text-gray-400 uppercase">Commission {event.organizingCommission}</span>
                      </div>
                      <button 
                        onClick={() => setShowReminderModal(event.id)}
                        className={`p-2.5 rounded-xl transition-all ${hasReminder ? 'bg-emerald-50 text-emerald-600' : 'text-gray-300 hover:text-emerald-600'}`}
                      >
                        <Bell size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModule;
