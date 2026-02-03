
import React, { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, ChevronRight, Plus, Image as ImageIcon, Camera, CheckCircle, X, Save, Clock, Tag, Trash2 } from 'lucide-react';
import { getCollection, addItem, deleteItem, STORAGE_KEYS } from '../../services/storage';

interface SocialEvent {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  color: string;
}

const SocialCalendar: React.FC = () => {
  const [socialEvents, setSocialEvents] = useState<SocialEvent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<SocialEvent>>({
    type: 'Sortie',
    date: new Date().toISOString().split('T')[0],
    color: 'bg-rose-500'
  });

  useEffect(() => {
    setSocialEvents(getCollection<SocialEvent>(STORAGE_KEYS.SOCIAL_EVENTS));
  }, []);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title) return;

    const event: SocialEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      type: newEvent.type || 'Sortie',
      date: new Date(newEvent.date!).toLocaleString('fr-FR', { day: '2-digit', month: 'long' }),
      time: newEvent.time || '10:00',
      location: newEvent.location || 'Dakar',
      participants: 0,
      color: newEvent.color || 'bg-rose-500'
    };

    const updated = addItem(STORAGE_KEYS.SOCIAL_EVENTS, event);
    setSocialEvents(updated);
    
    setShowModal(false);
    setNewEvent({ type: 'Sortie', date: new Date().toISOString().split('T')[0], color: 'bg-rose-500' });
  };

  const handleDeleteEvent = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if(confirm("Supprimer cet événement social ?")) {
      const updated = deleteItem<SocialEvent>(STORAGE_KEYS.SOCIAL_EVENTS, id);
      setSocialEvents(updated);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 relative">
      
      {/* ADD EVENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[2rem] p-8 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <Calendar size={24} className="text-rose-500"/> Planifier Activité
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">Titre de l'activité</label>
                <input 
                  required 
                  type="text" 
                  className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-rose-500/20"
                  value={newEvent.title || ''}
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Type</label>
                  <select 
                    className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none"
                    value={newEvent.type}
                    onChange={e => setNewEvent({...newEvent, type: e.target.value})}
                  >
                    <option>Sortie</option>
                    <option>Dîner</option>
                    <option>Sport</option>
                    <option>Ziar</option>
                    <option>Atelier</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Date</label>
                  <input 
                    required 
                    type="date" 
                    className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none"
                    value={newEvent.date}
                    onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Heure</label>
                    <input 
                      type="time" 
                      className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none"
                      value={newEvent.time}
                      onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Lieu</label>
                    <input 
                      type="text" 
                      className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none"
                      value={newEvent.location}
                      onChange={e => setNewEvent({...newEvent, location: e.target.value})}
                    />
                 </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                  <Save size={16} /> Publier dans l'agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Agenda Social & Récréatif</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Calendar size={14} className="text-rose-500" /> Créer des moments de partage inoubliables
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-3 active:scale-95 transition-all hover:bg-slate-800"
        >
          <Plus size={18} /> Programmer Activité
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main List */}
        <div className="lg:col-span-8 space-y-6">
           {socialEvents.length > 0 ? socialEvents.map(event => (
             <div key={event.id} className="glass-card p-1 relative overflow-hidden group cursor-pointer hover:border-rose-200 transition-all">
                <div className="p-8 flex flex-col md:flex-row items-center gap-8">
                   <div className="flex flex-col items-center text-center shrink-0 w-24">
                      <p className="text-3xl font-black text-slate-900 leading-none">{event.date.split(' ')[0]}</p>
                      <p className="text-[10px] font-black text-rose-600 uppercase mt-1 tracking-widest">{event.date.split(' ').slice(1).join(' ')}</p>
                   </div>
                   <div className="w-px h-12 bg-slate-100 hidden md:block"></div>
                   <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                         <span className={`px-2 py-0.5 rounded text-[8px] font-black text-white uppercase tracking-tighter ${event.color}`}>{event.type}</span>
                         <span className="text-[10px] font-black text-slate-300 flex items-center gap-1 uppercase"><MapPin size={10}/> {event.location}</span>
                         <span className="text-[10px] font-black text-slate-300 flex items-center gap-1 uppercase"><Clock size={10}/> {event.time}</span>
                      </div>
                      <h4 className="text-xl font-black text-slate-900 leading-tight group-hover:text-rose-700 transition-colors">{event.title}</h4>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                         <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Inscrits</p>
                         <div className="flex items-center gap-2">
                            <Users size={14} className="text-slate-300" />
                            <span className="text-sm font-black text-slate-800">{event.participants}</span>
                         </div>
                      </div>
                      <button 
                        onClick={(e) => handleDeleteEvent(e, event.id)}
                        className="p-3 bg-slate-50 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18}/>
                      </button>
                   </div>
                </div>
             </div>
           )) : (
             <div className="flex flex-col items-center justify-center h-64 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400">
                <Calendar size={48} className="opacity-20 mb-4"/>
                <p className="text-xs font-bold uppercase">Aucune activité programmée</p>
                <button onClick={() => setShowModal(true)} className="mt-4 text-rose-600 text-[10px] font-black uppercase hover:underline">Créer le premier événement</button>
             </div>
           )}
        </div>

        {/* Gallery Preview Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-8 flex flex-col h-full bg-white">
              <div className="flex justify-between items-center mb-8">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Camera size={14}/> Souvenirs</h4>
                 <button className="text-[9px] font-black text-rose-600 hover:underline uppercase">Voir tout</button>
              </div>
              <div className="flex-1 flex items-center justify-center text-slate-300">
                 <div className="text-center">
                    <ImageIcon size={32} className="mx-auto mb-2 opacity-30"/>
                    <p className="text-[10px] font-bold uppercase">Galerie vide</p>
                 </div>
              </div>
              <button className="w-full mt-8 py-4 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-rose-300 hover:text-rose-600 transition-all">Partager une photo</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SocialCalendar;
