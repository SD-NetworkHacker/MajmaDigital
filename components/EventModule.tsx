import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Plus, ChevronRight, Bell, X, Users, Sparkles, Check, Trash2, Smartphone, Mail, MessageSquare, Ticket, QrCode, Clock } from 'lucide-react';
import EventForm from './EventForm';
import { Event } from '../types';
import { useData } from '../contexts/DataContext';
// Fixed: AuthContext path updated to contexts/
import { useAuth } from '../contexts/AuthContext';

const REMINDER_OPTIONS = [
  { label: '15 minutes avant', value: 15 },
  { label: '30 minutes avant', value: 30 },
  { label: '1 heure avant', value: 60 },
  { label: '2 heures avant', value: 120 },
  { label: '1 jour avant', value: 1440 },
  { label: '2 jours avant', value: 2880 },
  { label: '1 semaine avant', value: 10080 },
];

interface ReminderConfig {
  time: number;
  channels: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
}

const EventModule: React.FC = () => {
  const { events, addEvent } = useData();
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'admin' || user?.role === 'manager' || user?.role === 'Super Admin';

  const [showForm, setShowForm] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState<string | null>(null);
  const [activeReminders, setActiveReminders] = useState<Record<string, ReminderConfig>>({});
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');

  // État temporaire pour la config en cours dans la modale
  const [tempConfig, setTempConfig] = useState<ReminderConfig>({
    time: 60,
    channels: { push: true, email: false, sms: false }
  });

  useEffect(() => {
    const saved = localStorage.getItem('majma_event_reminders_v2');
    if (saved) {
      setActiveReminders(JSON.parse(saved));
    }
  }, []);

  const openReminderModal = (eventId: string) => {
    const existing = activeReminders[eventId];
    if (existing) {
      setTempConfig(existing);
    } else {
      setTempConfig({ time: 60, channels: { push: true, email: false, sms: false } });
    }
    setShowReminderModal(eventId);
  };

  const saveReminder = () => {
    if (!showReminderModal) return;
    const newReminders = { ...activeReminders, [showReminderModal]: tempConfig };
    setActiveReminders(newReminders);
    localStorage.setItem('majma_event_reminders_v2', JSON.stringify(newReminders));
    setShowReminderModal(null);
  };

  const deleteReminder = () => {
    if (!showReminderModal) return;
    const { [showReminderModal]: deleted, ...rest } = activeReminders;
    setActiveReminders(rest);
    localStorage.setItem('majma_event_reminders_v2', JSON.stringify(rest));
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

  const handleRegister = (eventId: string) => {
     if(confirm("Confirmer votre inscription à cet événement ?")) {
        // Simulation d'inscription locale
        const newReminders = { 
           ...activeReminders, 
           [eventId]: { time: 1440, channels: { push: true, email: true, sms: false } } 
        };
        setActiveReminders(newReminders);
        localStorage.setItem('majma_event_reminders_v2', JSON.stringify(newReminders));
        alert("Inscription validée ! Votre billet est disponible dans l'onglet 'Mes Billets'.");
        setActiveTab('my'); // Redirection auto
     }
  };

  // Filtrer les événements pour l'onglet "Mes Billets"
  const displayedEvents = activeTab === 'my' 
    ? events.filter(e => !!activeReminders[e.id]) 
    : events;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {showForm && (
        <EventForm 
          onClose={() => setShowForm(false)} 
          onSubmit={handleAddEvent} 
        />
      )}

      {showReminderModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-emerald-50">
              <h3 className="font-black text-gray-800 text-sm flex items-center gap-2"><Ticket size={18} className="text-emerald-600" /> Mon Billet & Options</h3>
              <button onClick={() => setShowReminderModal(null)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            
            <div className="p-8 flex flex-col items-center border-b border-gray-50 bg-white">
                <div className="p-4 bg-white rounded-2xl shadow-inner border border-gray-100 mb-4">
                   <QrCode size={120} className="text-slate-800" />
                </div>
                <p className="text-[10px] font-mono text-slate-400">SCAN: {showReminderModal}</p>
                <p className="text-xs font-black text-emerald-600 uppercase mt-2">Billet Valide</p>
            </div>
            
            <div className="p-6 space-y-6 bg-slate-50/50">
              {/* Timing Selection */}
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Me prévenir...</p>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                  {REMINDER_OPTIONS.map((opt) => (
                    <button 
                      key={opt.value}
                      onClick={() => setTempConfig({ ...tempConfig, time: opt.value })}
                      className={`w-full p-3 text-left rounded-xl border transition-all flex items-center justify-between group ${
                        tempConfig.time === opt.value 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold' 
                          : 'bg-white border-slate-100 text-slate-600 hover:border-emerald-100 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs">{opt.label}</span>
                      {tempConfig.time === opt.value && <Check size={14} className="text-emerald-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Channel Selection */}
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Via les canaux</p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setTempConfig(prev => ({...prev, channels: {...prev.channels, push: !prev.channels.push}}))}
                    className={`flex-1 py-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                      tempConfig.channels.push ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-slate-400'
                    }`}
                  >
                    <Bell size={16} /> <span className="text-[9px] font-bold uppercase">Push</span>
                  </button>
                  <button 
                    onClick={() => setTempConfig(prev => ({...prev, channels: {...prev.channels, sms: !prev.channels.sms}}))}
                    className={`flex-1 py-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                      tempConfig.channels.sms ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-slate-400'
                    }`}
                  >
                    <Smartphone size={16} /> <span className="text-[9px] font-bold uppercase">SMS</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                {activeReminders[showReminderModal] && (
                  <button 
                    onClick={deleteReminder}
                    className="p-4 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all border border-rose-100"
                    title="Annuler inscription"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                <button 
                  onClick={saveReminder}
                  className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-black transition-all"
                >
                  Enregistrer Options
                </button>
              </div>
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
        
        <div className="flex gap-3 w-full md:w-auto">
           {/* Tab Switcher for Members */}
           <div className="flex p-1 bg-slate-100/80 rounded-2xl border border-slate-200/50">
              <button 
                onClick={() => setActiveTab('all')}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'all' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Tous
              </button>
              <button 
                onClick={() => setActiveTab('my')}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'my' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Mes Billets
              </button>
           </div>
           
           {isAdmin && (
             <button 
               onClick={() => setShowForm(true)}
               className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-black transition-all active:scale-95"
             >
               <Plus size={16} />
               <span>Planifier</span>
             </button>
           )}
        </div>
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
            {displayedEvents.length > 0 ? displayedEvents.map((event) => {
              const hasReminder = !!activeReminders[event.id];
              const isPast = new Date(event.date) < new Date();
              
              return (
                <div key={event.id} className={`bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden group hover:shadow-2xl transition-all duration-500 ${isPast ? 'opacity-70 grayscale' : ''}`}>
                  <div className="h-44 bg-gray-100 relative overflow-hidden">
                    <img 
                      src={`https://picsum.photos/seed/${event.id}/800/600`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                      alt={event.title} 
                      loading="lazy" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-6 left-6 flex gap-2">
                       <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase tracking-widest">{event.type}</div>
                       {hasReminder && (
                         <div className="px-3 py-1 bg-emerald-500 rounded-lg text-[8px] font-black text-white uppercase tracking-widest flex items-center gap-1 animate-in zoom-in">
                           <Ticket size={10} /> Inscrit
                         </div>
                       )}
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
                         <Clock size={14} className="text-emerald-600" />
                         <span className="text-xs font-bold text-gray-700">09:00</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-6">
                        <MapPin size={14} className="text-emerald-600" />
                        <span className="text-xs font-bold text-gray-700 truncate max-w-[200px]">{event.location}</span>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-black text-[8px]">T</div>
                         <span className="text-[10px] font-black text-gray-400 uppercase">Comm. {event.organizingCommission.substring(0,6)}</span>
                      </div>
                      
                      <div className="flex gap-2">
                         {hasReminder ? (
                             <button 
                              onClick={() => openReminderModal(event.id)}
                              className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shadow-sm transition-all hover:bg-emerald-100 flex items-center gap-2 px-4"
                              title="Voir mon billet / Modifier rappel"
                            >
                              <QrCode size={18} /> <span className="text-[10px] font-black uppercase">Mon Billet</span>
                            </button>
                         ) : !isPast && (
                             <button 
                               onClick={() => handleRegister(event.id)}
                               className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-emerald-600 transition-all active:scale-95"
                             >
                               S'inscrire
                             </button>
                         )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }) : (
               <div className="col-span-2 flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-[3rem]">
                  <Ticket size={48} className="mb-4 opacity-20"/>
                  <p className="text-xs font-bold uppercase">{activeTab === 'my' ? "Vous n'êtes inscrit à aucun événement" : "Aucun événement disponible"}</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModule;