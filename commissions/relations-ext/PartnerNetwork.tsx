
import React, { useState } from 'react';
import { Search, Filter, Plus, MapPin, Globe, Landmark, ChevronRight, Phone, Mail, Award, Calendar } from 'lucide-react';

const PartnerNetwork: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const partners = [
    { id: 1, name: 'Dahira Moukhadimatul Khidma', location: 'Touba', type: 'Institutionnel', lastContact: 'Il y a 3j', status: 'Actif' },
    { id: 2, name: 'Dahira Touba London', location: 'Londres, UK', type: 'Diaspora', lastContact: 'Semaine dernière', status: 'Partenaire' },
    { id: 3, name: 'Collectif Dahiras Campus UCAD', location: 'Dakar', type: 'Académique', lastContact: 'Hier', status: 'Accord-cadre' },
    { id: 4, name: 'Dahira Hizbut Tarqiyyah', location: 'Touba', type: 'Institutionnel', lastContact: 'Janvier 2024', status: 'Historique' },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex-1 w-full relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher un Dahira, une ville, un responsable..." 
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] text-sm font-bold shadow-sm focus:ring-4 focus:ring-slate-500/5 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-800 transition-all shadow-sm"><Filter size={20}/></button>
          <button className="px-8 py-4 bg-slate-800 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-3">
            <Plus size={18} /> Nouveau Partenaire
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {partners.map(partner => (
            <div key={partner.id} className="glass-card p-8 group hover:border-slate-300 transition-all flex flex-col justify-between relative overflow-hidden">
               <div className="relative z-10">
                  <div className="flex justify-between items-start mb-10">
                     <div className="p-4 rounded-2xl bg-slate-50 text-slate-600 shadow-inner group-hover:bg-slate-800 group-hover:text-white transition-all duration-500">
                        <Landmark size={24} />
                     </div>
                     <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                       partner.status === 'Actif' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                     }`}>{partner.status}</span>
                  </div>
                  <h4 className="text-lg font-black text-slate-800 leading-tight mb-2 group-hover:text-slate-900 transition-colors">{partner.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-10 flex items-center gap-2">
                    <MapPin size={12} className="text-slate-300" /> {partner.location} • {partner.type}
                  </p>
               </div>
               
               <div className="relative z-10 pt-6 border-t border-slate-50 flex justify-between items-center">
                  <div className="flex gap-2">
                     <button className="p-2 text-slate-300 hover:text-slate-800 transition-colors"><Phone size={16} /></button>
                     <button className="p-2 text-slate-300 hover:text-slate-800 transition-colors"><Mail size={16} /></button>
                  </div>
                  <button className="text-[9px] font-black text-slate-800 uppercase flex items-center gap-2 hover:gap-4 transition-all">Consulter Fiche <ChevronRight size={14}/></button>
               </div>
               <div className="absolute -right-6 -bottom-6 opacity-[0.02] rotate-12 transition-transform duration-1000 group-hover:scale-150 text-slate-900"><Globe size={100} /></div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-8 bg-white border-slate-100 flex flex-col h-full">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                <Calendar size={18} className="text-slate-600" /> Anniversaires & Événements
              </h4>
              <div className="space-y-6 flex-1">
                 {[
                   { l: '10 ans Dahira London', d: '15 Juin', s: 'Message Prêt' },
                   { l: 'Ziar Moukhadimatul', d: 'Hier', s: 'Délégation envoyée' },
                   { l: 'Gamou Médina', d: '22 Juin', s: 'Invitation reçue' },
                 ].map((e, i) => (
                   <div key={i} className="flex items-start gap-4 group cursor-pointer">
                      <div className="w-12 h-12 bg-slate-50 rounded-xl flex flex-col items-center justify-center shrink-0 group-hover:bg-slate-100 transition-colors">
                         <span className="text-xs font-black text-slate-800">{e.d.split(' ')[0]}</span>
                         <span className="text-[8px] font-black text-slate-400 uppercase">{e.d.split(' ')[1]}</span>
                      </div>
                      <div>
                         <p className="text-xs font-black text-slate-800 leading-tight mb-1">{e.l}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{e.s}</p>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Calendrier Relationnel</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerNetwork;
