
import React, { useState, useMemo } from 'react';
import { 
  Calendar, MapPin, Clock, Bus, Navigation, Printer, 
  CheckCircle, ArrowLeft, Search, Check, Users 
} from 'lucide-react';
import { TransportSchedule } from '../../types';
import { useData } from '../../contexts/DataContext';

const TripScheduler: React.FC = () => {
  const { schedules } = useData(); // Utilisation des données réelles du contexte
  
  // View State
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [selectedTrip, setSelectedTrip] = useState<TransportSchedule | null>(null);
  const [activeTab, setActiveTab] = useState<'manifest' | 'finance'>('manifest');

  // Detail State (Vide par défaut, à connecter à une API de passagers réelle plus tard)
  const [passengers] = useState<any[]>([]); 
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenDetail = (trip: TransportSchedule) => {
    setSelectedTrip(trip);
    setViewMode('detail');
  };

  // --- VUE DÉTAIL ---
  if (viewMode === 'detail' && selectedTrip) {
    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
         {/* Header Navigation */}
         <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
            <button onClick={() => setViewMode('list')} className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white text-slate-500 transition-all">
               <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
               <div className="flex items-center gap-3">
                  <h3 className="text-xl font-black text-slate-900">{selectedTrip.eventTitle}</h3>
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      selectedTrip.status === 'en_cours' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                      {selectedTrip.status.replace('_', ' ')}
                  </span>
               </div>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2 mt-1">
                  <MapPin size={12}/> {selectedTrip.origin} <span className="text-slate-300">➝</span> {selectedTrip.destination}
               </p>
            </div>
            
            <div className="flex gap-2">
               <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-slate-50 hover:text-orange-600 transition-all">
                  <Printer size={14}/> Manifeste
               </button>
            </div>
         </div>

         {/* Dashboard Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT: INFO & STATS */}
            <div className="space-y-6">
               {/* Quick Info */}
               <div className="glass-card p-6 bg-slate-50 border-slate-100">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Infos Clés</h4>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium flex items-center gap-2"><Bus size={14}/> Véhicule</span>
                        <span className="font-bold text-slate-800 bg-white px-2 py-1 rounded border border-slate-200">{selectedTrip.assignedVehicleId || 'Non assigné'}</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium flex items-center gap-2"><Clock size={14}/> Heure Départ</span>
                        <span className="font-bold text-slate-800">{selectedTrip.departureTime}</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* RIGHT: TABS MANAGEMENT */}
            <div className="lg:col-span-2 glass-card p-0 bg-white border-slate-100 overflow-hidden flex flex-col h-[600px]">
               {/* Tabs Header */}
               <div className="flex border-b border-slate-100 bg-slate-50/50">
                  <button 
                     onClick={() => setActiveTab('manifest')} 
                     className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'manifest' ? 'text-orange-600 border-b-2 border-orange-600 bg-white' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
                  >
                     Passagers
                  </button>
               </div>

               {/* TAB CONTENT */}
               <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-white">
                  
                  {/* --- MANIFEST TAB --- */}
                  {activeTab === 'manifest' && (
                     <div className="space-y-4">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                                <input 
                                    type="text" 
                                    placeholder="Rechercher un passager..." 
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-xs font-bold border-none outline-none focus:ring-2 focus:ring-orange-500/20"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                           {passengers.length > 0 ? passengers.map(p => (
                              <div key={p.id}></div> 
                           )) : (
                              <div className="text-center py-20 text-slate-400 italic text-xs">
                                <Users size={32} className="mx-auto mb-2 opacity-20"/>
                                Aucun passager enregistré sur ce convoi.
                              </div>
                           )}
                        </div>
                     </div>
                  )}

               </div>
            </div>
         </div>
      </div>
    );
  }

  // --- VUE LISTE (PLANNING) ---
  return (
    <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Planning des Convois</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Navigation size={14} className="text-orange-500" /> Organisation des départs et itinéraires
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {schedules.length > 0 ? schedules.map(trip => (
          <div key={trip.id} className="glass-card p-0 overflow-hidden group border-slate-200 hover:border-orange-200 transition-all">
             <div className="flex flex-col lg:flex-row">
                
                {/* Left: Event Info */}
                <div className="lg:w-1/3 p-8 bg-slate-900 text-white relative overflow-hidden flex flex-col justify-between">
                   <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-6">
                         <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                           trip.status === 'en_cours' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-white/10 border-white/10'
                         }`}>
                           {trip.status.replace('_', ' ')}
                         </span>
                         <span className="text-[10px] opacity-60 font-bold uppercase flex items-center gap-1"><Calendar size={12}/> {trip.departureDate}</span>
                      </div>
                      <h4 className="text-2xl font-black mb-2">{trip.eventTitle}</h4>
                      <div className="flex items-center gap-3 text-orange-400 mt-4">
                         <Bus size={18} />
                         <span className="text-xs font-bold uppercase tracking-widest">{trip.assignedVehicleId ? `Véhicule ${trip.assignedVehicleId}` : 'Non assigné'}</span>
                      </div>
                   </div>
                   <div className="absolute -bottom-10 -right-10 text-white/5 opacity-20"><MapPin size={150} /></div>

                   <div className="relative z-10 mt-8 flex gap-3">
                      <button 
                        onClick={() => handleOpenDetail(trip)}
                        className="flex-1 py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-50 transition-all shadow-lg"
                      >
                         <CheckCircle size={14}/> Gérer Convoi
                      </button>
                   </div>
                </div>

                {/* Right: Route Timeline */}
                <div className="lg:w-2/3 p-8 bg-white relative flex flex-col justify-between">
                   <div>
                     <h5 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center gap-2">
                        <Clock size={14} className="text-orange-500" /> Itinéraire & Arrêts
                     </h5>
                     
                     <div className="relative pl-4 space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                        {/* Origin */}
                        <div className="relative flex items-center gap-6">
                           <div className="w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow-md relative z-10"></div>
                           <div className="flex-1 p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                              <div>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Départ Convoi</p>
                                 <span className="text-sm font-black text-slate-800">{trip.origin}</span>
                              </div>
                              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">{trip.departureTime}</span>
                           </div>
                        </div>

                        {/* Destination */}
                        <div className="relative flex items-center gap-6">
                           <div className="w-3 h-3 bg-slate-900 rounded-full border-2 border-white shadow-md relative z-10"></div>
                           <div className="flex-1">
                              <span className="text-sm font-black text-slate-900">{trip.destination}</span>
                              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">Arrivée Prévue</p>
                           </div>
                        </div>
                     </div>
                   </div>

                   <div className="mt-8 pt-6 border-t border-slate-50 flex justify-end">
                      <button className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 hover:text-orange-600 transition-colors">
                         Voir sur la carte <ArrowLeft size={12} className="rotate-180"/>
                      </button>
                   </div>
                </div>
             </div>
          </div>
        )) : (
          <div className="flex flex-col items-center justify-center py-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] text-slate-400">
             <Bus size={48} className="mb-4 opacity-20"/>
             <p className="text-xs font-bold uppercase">Aucun convoi planifié</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripScheduler;