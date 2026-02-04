
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, MapPin, Clock, Users, Bus, Navigation, FileText, 
  UserPlus, Check, Search, Filter, ArrowLeft, QrCode, 
  MessageSquare, Send, Shield, AlertCircle, Phone, Printer, 
  MoreVertical, Play, CheckCircle, Wallet, Fuel, 
  TrendingUp, AlertTriangle, X, DollarSign, Gauge, Plus
} from 'lucide-react';
import { TransportSchedule } from '../../types';
import { getCollection, STORAGE_KEYS } from '../../services/storage';
import { useData } from '../../contexts/DataContext';

const TripScheduler: React.FC = () => {
  const [schedules, setSchedules] = useState<TransportSchedule[]>([]);
  const { members } = useData();
  
  // View State
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [selectedTrip, setSelectedTrip] = useState<TransportSchedule | null>(null);
  const [activeTab, setActiveTab] = useState<'manifest' | 'logistics' | 'finance'>('manifest');

  // Detail State - PRODUCTION : Liste vide par défaut, chargement API requis
  const [passengers, setPassengers] = useState<any[]>([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  
  // Finance State (Dépenses réelles)
  const [expenses, setExpenses] = useState<any[]>([]);
  const [newExpense, setNewExpense] = useState({ label: '', amount: '' });

  useEffect(() => {
    setSchedules(getCollection<TransportSchedule>(STORAGE_KEYS.TRIPS));
    
    const handleStorageChange = () => {
        setSchedules(getCollection<TransportSchedule>(STORAGE_KEYS.TRIPS));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // --- ACTIONS ---

  const handleOpenDetail = (trip: TransportSchedule) => {
    setSelectedTrip(trip);
    setViewMode('detail');
    // TODO: Charger les passagers réels depuis l'API pour ce voyage
    setPassengers([]); 
  };

  const toggleCheckIn = (id: string) => {
    setPassengers(prev => prev.map(p => 
      p.id === id ? { ...p, status: p.status === 'checked-in' ? 'pending' : 'checked-in' } : p
    ));
  };

  const handleStatusChange = (status: any) => {
      if(!selectedTrip) return;
      alert(`Statut du convoi passé à : ${status}`);
  };

  const addExpense = () => {
      if (!newExpense.label || !newExpense.amount) return;
      setExpenses([...expenses, { id: Date.now(), label: newExpense.label, amount: parseInt(newExpense.amount), type: 'other' }]);
      setNewExpense({ label: '', amount: '' });
  };

  // --- STATS ---
  const checkedInCount = passengers.filter(p => p.status === 'checked-in').length;
  const boardingProgress = passengers.length > 0 ? Math.round((checkedInCount / passengers.length) * 100) : 0;
  
  const financialStats = useMemo(() => {
      const revenue = passengers.reduce((acc, p) => acc + (p.amount || 0), 0);
      const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
      return { revenue, totalExpenses, net: revenue - totalExpenses };
  }, [passengers, expenses]);

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
               {selectedTrip.status !== 'termine' && (
                   <button 
                    onClick={() => handleStatusChange('Parti')}
                    className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-black shadow-lg animate-pulse"
                   >
                      <Navigation size={14}/> Départ Convoi
                   </button>
               )}
            </div>
         </div>

         {/* Dashboard Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT: INFO & STATS */}
            <div className="space-y-6">
               {/* Boarding Circle */}
               <div className="glass-card p-6 bg-white border-slate-100 flex flex-col items-center">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 w-full text-left">Embarquement</h4>
                  <div className="relative w-40 h-40 flex items-center justify-center">
                     <svg className="w-full h-full transform -rotate-90">
                        <circle cx="80" cy="80" r="70" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                        <circle cx="80" cy="80" r="70" stroke={boardingProgress === 100 ? '#10b981' : '#f97316'} strokeWidth="12" fill="transparent" strokeDasharray="440" strokeDashoffset={440 - (440 * boardingProgress) / 100} className="transition-all duration-1000 ease-out" />
                     </svg>
                     <div className="absolute text-center">
                        <span className="text-3xl font-black text-slate-800">{checkedInCount}</span>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">/ {passengers.length} à bord</span>
                     </div>
                  </div>
                  <div className="mt-6 w-full grid grid-cols-2 gap-2 text-center">
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <p className="text-[9px] text-slate-400 uppercase font-bold">Capacité</p>
                          <p className="text-sm font-black text-slate-800">{selectedTrip.totalCapacity}</p>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <p className="text-[9px] text-slate-400 uppercase font-bold">Libres</p>
                          <p className="text-sm font-black text-slate-800">{selectedTrip.totalCapacity - passengers.length}</p>
                      </div>
                  </div>
               </div>

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
                  <button 
                     onClick={() => setActiveTab('finance')} 
                     className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'finance' ? 'text-orange-600 border-b-2 border-orange-600 bg-white' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
                  >
                     Finances
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
                           {passengers.length > 0 ? passengers.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                              <div key={p.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all group ${p.status === 'checked-in' ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                                 <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${p.status === 'checked-in' ? 'bg-emerald-200 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                                       {p.name.charAt(0)}
                                    </div>
                                    <div>
                                       <p className="text-xs font-bold text-slate-800">{p.name}</p>
                                       <p className="text-[10px] text-slate-500 font-mono flex items-center gap-2">
                                          {p.phone} <span className="w-1 h-1 rounded-full bg-slate-300"></span> Siège {p.seat}
                                       </p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-3">
                                     <button 
                                        onClick={() => toggleCheckIn(p.id)}
                                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all flex items-center gap-2 ${
                                        p.status === 'checked-in' 
                                            ? 'bg-emerald-500 text-white shadow-sm' 
                                            : 'bg-white border border-slate-200 text-slate-400 hover:border-orange-200 hover:text-orange-500'
                                        }`}
                                    >
                                        {p.status === 'checked-in' ? <Check size={10}/> : <div className="w-2 h-2 rounded-full border-2 border-current"></div>}
                                        {p.status === 'checked-in' ? 'Présent' : 'Attente'}
                                    </button>
                                 </div>
                              </div>
                           )) : (
                              <div className="text-center py-10 text-slate-400 italic text-xs">Aucun passager enregistré.</div>
                           )}
                        </div>
                     </div>
                  )}

                  {/* --- FINANCE TAB --- */}
                  {activeTab === 'finance' && (
                     <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Recettes Est.</p>
                                <p className="text-2xl font-black text-emerald-800">{financialStats.revenue.toLocaleString()} F</p>
                            </div>
                            <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100 text-center">
                                <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest mb-1">Dépenses Est.</p>
                                <p className="text-2xl font-black text-rose-800">{financialStats.totalExpenses.toLocaleString()} F</p>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h5 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><Wallet size={14}/> Dépenses Convoi</h5>
                            </div>
                            <div className="space-y-2 mb-4">
                                {expenses.map(exp => (
                                    <div key={exp.id} className="flex justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                        <span className="text-xs text-slate-600 font-bold">{exp.label}</span>
                                        <span className="text-xs text-slate-900 font-black">{exp.amount.toLocaleString()} F</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Libellé dépense" 
                                    className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-orange-500"
                                    value={newExpense.label}
                                    onChange={e => setNewExpense({...newExpense, label: e.target.value})}
                                />
                                <input 
                                    type="number" 
                                    placeholder="Montant" 
                                    className="w-24 p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-orange-500"
                                    value={newExpense.amount}
                                    onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                                />
                                <button onClick={addExpense} className="p-2 bg-slate-900 text-white rounded-lg hover:bg-black"><Plus size={16}/></button>
                            </div>
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
        <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase">À Venir</button>
            <button className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-lg text-[10px] font-black uppercase">Historique</button>
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
                      
                      <div className="mt-8 space-y-2">
                         <div className="flex justify-between text-[10px] font-black uppercase opacity-60">
                            <span>Remplissage</span>
                            <span>{Math.round((trip.seatsFilled / trip.totalCapacity) * 100)}%</span>
                         </div>
                         <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500" style={{ width: `${(trip.seatsFilled / trip.totalCapacity) * 100}%` }}></div>
                         </div>
                         <p className="text-[9px] opacity-40 text-right mt-1">{trip.seatsFilled} / {trip.totalCapacity} places</p>
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

                        {/* Stops */}
                        {trip.stops.map((stop, i) => (
                           <div key={i} className="relative flex items-center gap-6">
                              <div className="w-2.5 h-2.5 bg-white border-2 border-slate-300 rounded-full relative z-10"></div>
                              <div className="flex-1 flex items-center justify-between group/stop">
                                 <div>
                                    <p className="text-xs font-bold text-slate-700">{stop.location}</p>
                                 </div>
                                 <span className="text-xs font-mono text-slate-400 group-hover/stop:text-orange-500 transition-colors">{stop.time}</span>
                              </div>
                           </div>
                        ))}

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
             <p className="text-[10px] mt-1 opacity-70">Utilisez le bouton "Nouveau Convoi" pour commencer.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripScheduler;
