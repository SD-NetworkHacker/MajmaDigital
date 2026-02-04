
import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, Car, Phone, Award, Star, MapPin, Plus, Search, Filter, 
  MoreVertical, FileText, CheckCircle, XCircle, Clock, Shield, 
  MessageSquare, Edit, Trash2, X, Save, Bus, Calendar, ChevronRight
} from 'lucide-react';
import { Driver } from '../../types';
import { getCollection, addItem, deleteItem, updateItem, STORAGE_KEYS } from '../../services/storage';

const DriverRoster: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'disponible' | 'en_mission' | 'repos'>('all');
  
  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [newDriver, setNewDriver] = useState<Partial<Driver>>({ status: 'disponible', licenseType: 'Permis D' });

  // Load Data
  useEffect(() => {
    setDrivers(getCollection<Driver>(STORAGE_KEYS.DRIVERS));
    
    // Listen for updates from other tabs/components
    const handleStorageChange = () => {
        setDrivers(getCollection<Driver>(STORAGE_KEYS.DRIVERS));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // --- STATS ---
  const stats = useMemo(() => {
    return {
      total: drivers.length,
      available: drivers.filter(d => d.status === 'disponible').length,
      onMission: drivers.filter(d => d.status === 'en_mission').length,
      resting: drivers.filter(d => d.status === 'repos').length
    };
  }, [drivers]);

  // --- FILTERS ---
  const filteredDrivers = drivers.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // --- ACTIONS ---
  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriver.name || !newDriver.phone) return;
    
    const driver: Driver = {
      id: Date.now().toString(),
      memberId: 'TEMP-' + Date.now(), // Devrait être lié à un membre réel
      name: newDriver.name!,
      licenseType: newDriver.licenseType || 'Permis D',
      status: newDriver.status as any || 'disponible',
      phone: newDriver.phone!,
      tripsCompleted: 0
    };
    
    const updated = addItem(STORAGE_KEYS.DRIVERS, driver);
    setDrivers(updated);
    setShowAddModal(false);
    setNewDriver({ status: 'disponible', licenseType: 'Permis D' });
  };

  const handleDeleteDriver = (id: string) => {
    if (confirm("Retirer ce chauffeur de la liste ?")) {
      const updated = deleteItem<Driver>(STORAGE_KEYS.DRIVERS, id);
      setDrivers(updated);
      if (selectedDriver?.id === id) setSelectedDriver(null);
    }
  };

  const handleUpdateStatus = (id: string, status: 'disponible' | 'en_mission' | 'repos') => {
    const updated = updateItem<Driver>(STORAGE_KEYS.DRIVERS, id, { status });
    setDrivers(updated);
    if (selectedDriver?.id === id) setSelectedDriver({ ...selectedDriver, status });
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 relative pb-20">
      
      {/* --- ADD DRIVER MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl animate-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <User size={24} className="text-orange-500"/> Nouveau Chauffeur
                 </h3>
                 <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
              </div>
              
              <form onSubmit={handleAddDriver} className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom Complet</label>
                    <input 
                      required 
                      type="text" 
                      className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                      value={newDriver.name || ''}
                      onChange={e => setNewDriver({...newDriver, name: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Téléphone</label>
                    <input 
                      required 
                      type="tel" 
                      className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                      value={newDriver.phone || ''}
                      onChange={e => setNewDriver({...newDriver, phone: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type de Permis</label>
                    <select 
                      className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none"
                      value={newDriver.licenseType}
                      onChange={e => setNewDriver({...newDriver, licenseType: e.target.value})}
                    >
                       <option>Permis B (Léger)</option>
                       <option>Permis C (Poids Lourd)</option>
                       <option>Permis D (Transport en Commun)</option>
                    </select>
                 </div>
                 
                 <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg mt-4 flex items-center justify-center gap-2">
                    <Save size={16}/> Enregistrer
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* --- DRIVER DETAIL PANEL (SLIDE-OVER) --- */}
      {selectedDriver && (
         <div className="fixed inset-0 z-[100] flex justify-end items-stretch pointer-events-none">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm pointer-events-auto transition-opacity" 
                onClick={() => setSelectedDriver(null)}
            ></div>
            
            {/* The Panel */}
            <div className="relative w-full max-w-md bg-white shadow-2xl pointer-events-auto flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-100">
               
               {/* Header Profile - Dark Theme */}
               <div className="p-8 bg-slate-900 text-white shrink-0 relative">
                  <button 
                    onClick={() => setSelectedDriver(null)} 
                    className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                  >
                    <X size={20}/>
                  </button>
                  
                  <div className="flex items-center gap-6 mt-4">
                     <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center text-3xl font-black border-2 border-white/10 text-white shadow-inner">
                        {selectedDriver.name.charAt(0)}
                     </div>
                     <div>
                        <h3 className="text-2xl font-black leading-none mb-1">{selectedDriver.name}</h3>
                        <p className="text-sm text-slate-400 font-mono mb-3">{selectedDriver.phone}</p>
                        <div className="flex gap-2">
                           <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-bold uppercase tracking-wider">{selectedDriver.licenseType}</span>
                           <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                              selectedDriver.status === 'disponible' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
                              selectedDriver.status === 'en_mission' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 
                              'bg-amber-500/20 text-amber-400 border-amber-500/30'
                           }`}>
                              {selectedDriver.status.replace('_', ' ')}
                           </span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Body Content */}
               <div className="flex-1 overflow-y-auto p-8 bg-slate-50 space-y-8">
                  
                  {/* Status Switcher */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                     <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Mettre à jour le statut</h4>
                     <div className="flex gap-3">
                        <button 
                            onClick={() => handleUpdateStatus(selectedDriver.id, 'disponible')} 
                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                                selectedDriver.status === 'disponible' 
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-sm' 
                                : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-200'
                            }`}
                        >
                            Dispo
                        </button>
                        <button 
                            onClick={() => handleUpdateStatus(selectedDriver.id, 'en_mission')} 
                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                                selectedDriver.status === 'en_mission' 
                                ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-sm' 
                                : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200'
                            }`}
                        >
                            Mission
                        </button>
                        <button 
                            onClick={() => handleUpdateStatus(selectedDriver.id, 'repos')} 
                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                                selectedDriver.status === 'repos' 
                                ? 'bg-amber-50 border-amber-500 text-amber-600 shadow-sm' 
                                : 'bg-white border-slate-100 text-slate-400 hover:border-amber-200'
                            }`}
                        >
                            Repos
                        </button>
                     </div>
                  </div>

                  {/* History Section */}
                  <div>
                     <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Clock size={14}/> Historique Trajets
                     </h4>
                     <div className="space-y-3">
                        <p className="text-xs text-slate-400 italic text-center py-4">Aucun trajet enregistré.</p>
                     </div>
                  </div>
                  
                  {/* Delete Button */}
                  <div className="pt-4">
                      <button 
                        onClick={() => handleDeleteDriver(selectedDriver.id)}
                        className="w-full py-4 text-rose-500 bg-rose-50 border border-rose-100 rounded-2xl text-xs font-black uppercase hover:bg-rose-100 hover:border-rose-200 transition-all flex items-center justify-center gap-2"
                      >
                         <Trash2 size={16}/> Retirer de l'effectif
                      </button>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* --- MAIN HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
        <div>
           <h3 className="text-3xl font-black text-slate-900 tracking-tight">Effectif Chauffeurs</h3>
           <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
             <User size={14} className="text-orange-500" /> Gestion du personnel roulant
           </p>
        </div>
        
        {/* Search & Add */}
        <div className="flex gap-3 w-full md:w-auto">
           <div className="relative group flex-1 md:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={16}/>
              <input 
                 type="text" 
                 placeholder="Rechercher..." 
                 className="w-full md:w-64 pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button 
             onClick={() => setShowAddModal(true)}
             className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all flex items-center gap-2 active:scale-95"
           >
             <Plus size={16} /> <span className="hidden sm:inline">Ajouter</span>
           </button>
        </div>
      </div>
      
      {/* --- STATS BAR --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div 
             onClick={() => setStatusFilter('all')} 
             className={`p-5 bg-white border rounded-[1.5rem] shadow-sm cursor-pointer transition-all hover:shadow-md ${statusFilter === 'all' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-100 hover:border-slate-300'}`}
          >
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
             <p className="text-3xl font-black text-slate-900">{stats.total}</p>
          </div>
          <div 
             onClick={() => setStatusFilter('disponible')} 
             className={`p-5 bg-emerald-50/50 border rounded-[1.5rem] shadow-sm cursor-pointer transition-all hover:shadow-md ${statusFilter === 'disponible' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-emerald-100 hover:border-emerald-300'}`}
          >
             <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Disponibles</p>
             <p className="text-3xl font-black text-emerald-800">{stats.available}</p>
          </div>
          <div 
             onClick={() => setStatusFilter('en_mission')} 
             className={`p-5 bg-blue-50/50 border rounded-[1.5rem] shadow-sm cursor-pointer transition-all hover:shadow-md ${statusFilter === 'en_mission' ? 'border-blue-500 ring-1 ring-blue-500' : 'border-blue-100 hover:border-blue-300'}`}
          >
             <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">En Mission</p>
             <p className="text-3xl font-black text-blue-800">{stats.onMission}</p>
          </div>
          <div 
             onClick={() => setStatusFilter('repos')} 
             className={`p-5 bg-amber-50/50 border rounded-[1.5rem] shadow-sm cursor-pointer transition-all hover:shadow-md ${statusFilter === 'repos' ? 'border-amber-500 ring-1 ring-amber-500' : 'border-amber-100 hover:border-amber-300'}`}
          >
             <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">En Repos</p>
             <p className="text-3xl font-black text-amber-800">{stats.resting}</p>
          </div>
      </div>

      {/* --- DRIVER CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map(driver => (
          <div 
            key={driver.id} 
            onClick={() => setSelectedDriver(driver)}
            className={`relative p-6 bg-white border rounded-[2rem] hover:shadow-xl transition-all cursor-pointer group overflow-hidden ${
               selectedDriver?.id === driver.id ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-100 hover:border-emerald-200'
            }`}
          >
             {/* Status Indicator Stripe */}
             <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                driver.status === 'disponible' ? 'bg-emerald-500' : 
                driver.status === 'en_mission' ? 'bg-blue-500' : 'bg-amber-500'
             }`}></div>

             <div className="flex items-center gap-5 mb-6 pl-2">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black text-xl border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-300">
                   {driver.name.charAt(0)}
                </div>
                <div>
                   <h4 className="text-lg font-black text-slate-900 leading-tight mb-1 group-hover:text-emerald-700 transition-colors">{driver.name}</h4>
                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wide border ${
                     driver.status === 'disponible' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                     driver.status === 'en_mission' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                     'bg-amber-50 text-amber-700 border-amber-100'
                   }`}>
                     {driver.status.replace('_', ' ')}
                   </span>
                </div>
             </div>

             <div className="space-y-3 pt-4 border-t border-slate-50 pl-2">
                <div className="flex items-center justify-between">
                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2"><Car size={12}/> Permis</span>
                   <span className="text-xs font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded">{driver.licenseType}</span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2"><Phone size={12}/> Contact</span>
                   <span className="text-xs font-mono text-slate-600">{driver.phone}</span>
                </div>
             </div>
             
             {/* Hover Action */}
             <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                <div className="p-2 bg-slate-900 text-white rounded-xl shadow-lg">
                   <ChevronRight size={16}/>
                </div>
             </div>
          </div>
        ))}
        {filteredDrivers.length === 0 && (
           <div className="col-span-full py-24 text-center text-slate-300 border-2 border-dashed border-slate-200 rounded-[3rem] bg-slate-50/50">
              <User size={48} className="mx-auto mb-4 opacity-30"/>
              <p className="text-sm font-bold uppercase tracking-widest">Aucun chauffeur trouvé</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default DriverRoster;
