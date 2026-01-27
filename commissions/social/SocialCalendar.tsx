
import React from 'react';
import { Calendar, Users, MapPin, ChevronRight, Plus, Image as ImageIcon, Camera, CheckCircle } from 'lucide-react';

const SocialCalendar: React.FC = () => {
  const socialEvents = [
    { id: 1, title: 'Randonnée Fraternité', date: '15 Juin', type: 'Sortie', participants: '45/50', color: 'bg-emerald-500' },
    { id: 2, title: 'Tournoi de Foot Inter-Secteurs', date: '22 Juin', type: 'Sport', participants: '24/32', color: 'bg-rose-500' },
    { id: 3, title: 'Dîner Débat : Valeurs Mourides', date: '30 Juin', type: 'Culture', participants: '80/100', color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Agenda Social & Récréatif</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Calendar size={14} className="text-rose-500" /> Créer des moments de partage inoubliables
          </p>
        </div>
        <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-3 active:scale-95 transition-all">
          <Plus size={18} /> Programmer Activité
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main List */}
        <div className="lg:col-span-8 space-y-6">
           {socialEvents.map(event => (
             <div key={event.id} className="glass-card p-1 relative overflow-hidden group cursor-pointer">
                <div className="p-8 flex flex-col md:flex-row items-center gap-8">
                   <div className="flex flex-col items-center text-center shrink-0">
                      <p className="text-3xl font-black text-slate-900 leading-none">{event.date.split(' ')[0]}</p>
                      <p className="text-[10px] font-black text-rose-600 uppercase mt-1 tracking-widest">{event.date.split(' ')[1]}</p>
                   </div>
                   <div className="w-px h-12 bg-slate-100 hidden md:block"></div>
                   <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                         <span className={`px-2 py-0.5 rounded text-[8px] font-black text-white uppercase tracking-tighter ${event.color}`}>{event.type}</span>
                         <span className="text-[10px] font-black text-slate-300 flex items-center gap-1 uppercase"><MapPin size={10}/> Dakar & Alentours</span>
                      </div>
                      <h4 className="text-xl font-black text-slate-900 leading-tight group-hover:text-rose-700 transition-colors">{event.title}</h4>
                   </div>
                   <div className="flex items-center gap-6">
                      <div className="text-right">
                         <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Inscrits</p>
                         <div className="flex items-center gap-2">
                            <Users size={14} className="text-slate-300" />
                            <span className="text-sm font-black text-slate-800">{event.participants}</span>
                         </div>
                      </div>
                      <button className="p-4 bg-rose-50 text-rose-600 rounded-2xl group-hover:bg-rose-600 group-hover:text-white transition-all shadow-sm"><ChevronRight size={20}/></button>
                   </div>
                </div>
             </div>
           ))}
        </div>

        {/* Gallery Preview Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-8 flex flex-col h-full bg-white">
              <div className="flex justify-between items-center mb-8">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Camera size={14}/> Souvenirs</h4>
                 <button className="text-[9px] font-black text-rose-600 hover:underline uppercase">Voir tout</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="aspect-square bg-slate-100 rounded-2xl overflow-hidden relative group">
                      <img src={`https://picsum.photos/seed/social-${i}/400/400`} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Activity" />
                      <div className="absolute inset-0 bg-rose-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <ImageIcon size={20} className="text-white" />
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-8 py-4 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-rose-300 hover:text-rose-600 transition-all">Partager une photo</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SocialCalendar;
