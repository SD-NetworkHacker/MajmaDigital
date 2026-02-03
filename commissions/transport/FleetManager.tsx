
import React, { useState, useEffect } from 'react';
import { 
  Bus, Truck, Car, Wrench, CheckCircle, AlertTriangle, Battery, Plus, 
  Fuel, X, Save, Trash2, FileText, ChevronRight, Briefcase, Phone, 
  Building2, Coins, Search, Filter, MoreHorizontal, PlayCircle, StopCircle 
} from 'lucide-react';
import { Vehicle, VehicleType, VehicleStatus } from '../../types';
import { getCollection, addItem, deleteItem, updateItem, STORAGE_KEYS } from '../../services/storage';

const FleetManager: React.FC = () => {
  const [fleet, setFleet] = useState<Vehicle[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState<Vehicle | null>(null);
  const [activeTab, setActiveTab] = useState<'internal' | 'external'>('internal');
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
    type: 'bus_grand',
    status: 'disponible',
    features: ['Climatisation'],
    ownership: 'internal'
  });

  // Chargement des données au montage
  useEffect(() => {
    setFleet(getCollection<Vehicle>(STORAGE_KEYS.FLEET));
  }, []);

  const refreshFleet = () => {
      setFleet(getCollection<Vehicle>(STORAGE_KEYS.FLEET));
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle.registrationNumber || !newVehicle.capacity) return;

    const vehicle: Vehicle = {
      id: Date.now().toString(),
      type: newVehicle.type as VehicleType,
      capacity: Number(newVehicle.capacity),
      registrationNumber: newVehicle.registrationNumber,
      status: 'disponible',
      features: newVehicle.features || [],
      ownership: activeTab, // Déterminé par l'onglet actif
      maintenance: {
        lastDate: new Date().toISOString().split('T')[0],
        nextDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +3 mois
        status: 'ok'
      },
      // Ajout des détails externes si nécessaire
      externalDetails: activeTab === 'external' ? {
        companyName: newVehicle.externalDetails?.companyName || 'Prestataire Inconnu',
        contactPhone: newVehicle.externalDetails?.contactPhone || '',
        dailyCost: Number(newVehicle.externalDetails?.dailyCost) || 0
      } : undefined
    };

    // Sauvegarde via le service
    addItem(STORAGE_KEYS.FLEET, vehicle);
    refreshFleet();
    
    setShowModal(false);
    setNewVehicle({ 
      type: 'bus_grand', 
      status: 'disponible', 
      features: ['Climatisation'],
      ownership: 'internal',
      externalDetails: { companyName: '', contactPhone: '', dailyCost: 0 }
    });
  };

  const handleDeleteVehicle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Voulez-vous vraiment retirer ce véhicule du parc ?")) {
      deleteItem<Vehicle>(STORAGE_KEYS.FLEET, id);
      refreshFleet();
    }
  };

  const handleUpdateStatus = (e: React.MouseEvent, id: string, status: VehicleStatus) => {
    e.stopPropagation();
    updateItem<Vehicle>(STORAGE_KEYS.FLEET, id, { status });
    refreshFleet();
  };

  const getVehicleIcon = (type: string) => {
    switch(type) {
      case 'bus_grand': return <Bus size={32} />;
      case 'minibus': return <Truck size={32} />;
      default: return <Car size={32} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'disponible': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'en_mission': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'maintenance': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'hors_service': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 border-slate-200';
    }
  };

  const filteredFleet = fleet.filter(v => {
    const matchesTab = (v.ownership || 'internal') === activeTab;
    const matchesSearch = v.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (v.externalDetails?.companyName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    
    return matchesTab && matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 relative pb-20">
      
      {/* MAINTENANCE LOG MODAL (Seulement pertinent pour flotte interne) */}
      {showMaintenanceModal && (
         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
               <div className="p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <div>
                     <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                        <Wrench size={24} className="text-orange-500"/> Carnet d'Entretien
                     </h3>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Véhicule {showMaintenanceModal.registrationNumber}</p>
                  </div>
                  <button onClick={() => setShowMaintenanceModal(null)} className="p-2 hover:bg-white rounded-full"><X size={20}/></button>
               </div>
               
               <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
                  {/* Status Actuel */}
                  <div className="flex gap-4">
                     <div className="flex-1 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Prochaine Visite</p>
                        <p className="text-lg font-black text-slate-800">{new Date(showMaintenanceModal.maintenance.nextDate).toLocaleDateString()}</p>
                     </div>
                     <div className="flex-1 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1">État Général</p>
                        <p className={`text-lg font-black uppercase ${showMaintenanceModal.maintenance.status === 'ok' ? 'text-emerald-600' : 'text-rose-600'}`}>
                           {showMaintenanceModal.maintenance.status === 'ok' ? 'Opérationnel' : 'Attention'}
                        </p>
                     </div>
                  </div>

                  {/* Logs Historique (Mock) */}
                  <div>
                     <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Historique Interventions</h4>
                     <div className="space-y-4 relative pl-4 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                        {[
                           { date: '12 Jan 2024', type: 'Vidange Complète', cout: '45 000 F', garage: 'Garage Central' },
                           { date: '05 Nov 2023', type: 'Changement Pneus (x2)', cout: '120 000 F', garage: 'Auto-Pneu' },
                        ].map((log, i) => (
                           <div key={i} className="relative flex gap-4">
                              <div className="w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white relative z-10 mt-1.5 shadow-sm"></div>
                              <div className="flex-1 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                 <div className="flex justify-between">
                                    <p className="text-sm font-bold text-slate-800">{log.type}</p>
                                    <span className="text-xs font-black text-slate-600">{log.cout}</span>
                                 </div>
                                 <p className="text-[10px] text-slate-400 mt-1">{log.date} • {log.garage}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Fuel Stats */}
                  <div className="p-6 bg-slate-900 rounded-2xl text-white">
                     <div className="flex items-center gap-3 mb-4">
                        <Fuel size={20} className="text-orange-500" />
                        <h4 className="text-xs font-black uppercase tracking-widest">Consommation Carburant</h4>
                     </div>
                     <div className="flex items-end gap-2">
                        <span className="text-4xl font-black">18.5</span>
                        <span className="text-xs text-slate-400 font-bold mb-2">L / 100km</span>
                     </div>
                     <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
                        <div className="bg-orange-500 h-full w-[60%]"></div>
                     </div>
                  </div>
               </div>

               <div className="p-6 border-t border-slate-100 bg-white flex gap-3">
                  <button className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200">Ajouter Entretien</button>
                  <button className="flex-1 py-3 bg-orange-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-700 shadow-lg">Signaler Panne</button>
               </div>
            </div>
         </div>
      )}

      {/* ADD VEHICLE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[2rem] p-8 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <Bus size={24} className={activeTab === 'internal' ? 'text-orange-500' : 'text-purple-500'}/> 
                {activeTab === 'internal' ? 'Nouveau Véhicule (Dahira)' : 'Ajout Véhicule Externe'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">Immatriculation</label>
                <input 
                  required 
                  type="text" 
                  placeholder="ex: AA-123-BB" 
                  className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-orange-500/20 outline-none"
                  value={newVehicle.registrationNumber || ''}
                  onChange={e => setNewVehicle({...newVehicle, registrationNumber: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Type</label>
                  <select 
                    className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none"
                    value={newVehicle.type}
                    onChange={e => setNewVehicle({...newVehicle, type: e.target.value as VehicleType})}
                  >
                    <option value="bus_grand">Grand Bus</option>
                    <option value="minibus">Minibus</option>
                    <option value="voiture">Voiture Légère</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Capacité</label>
                  <input 
                    required 
                    type="number" 
                    placeholder="Nb Places" 
                    className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none"
                    value={newVehicle.capacity || ''}
                    onChange={e => setNewVehicle({...newVehicle, capacity: Number(e.target.value)})}
                  />
                </div>
              </div>

              {/* CHAMPS SPÉCIFIQUES EXTERNES */}
              {activeTab === 'external' && (
                <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 space-y-3 mt-2">
                   <h4 className="text-[10px] font-black uppercase text-purple-700 flex items-center gap-2">
                      <Briefcase size={12}/> Infos Prestataire
                   </h4>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-purple-400">Nom Compagnie</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Gie Transport Touba"
                        className="w-full p-2 bg-white rounded-lg text-xs font-bold outline-none border border-purple-200"
                        value={newVehicle.externalDetails?.companyName || ''}
                        onChange={e => setNewVehicle({...newVehicle, externalDetails: {...newVehicle.externalDetails!, companyName: e.target.value}})}
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-purple-400">Contact</label>
                        <input 
                            type="text" 
                            placeholder="77 000 00 00"
                            className="w-full p-2 bg-white rounded-lg text-xs font-bold outline-none border border-purple-200"
                            value={newVehicle.externalDetails?.contactPhone || ''}
                            onChange={e => setNewVehicle({...newVehicle, externalDetails: {...newVehicle.externalDetails!, contactPhone: e.target.value}})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-purple-400">Coût / Jour</label>
                        <input 
                            type="number" 
                            placeholder="FCFA"
                            className="w-full p-2 bg-white rounded-lg text-xs font-bold outline-none border border-purple-200"
                            value={newVehicle.externalDetails?.dailyCost || ''}
                            onChange={e => setNewVehicle({...newVehicle, externalDetails: {...newVehicle.externalDetails!, dailyCost: Number(e.target.value)}})}
                        />
                      </div>
                   </div>
                </div>
              )}

              <div className="pt-4">
                <button type="submit" className={`w-full py-4 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all ${
                    activeTab === 'internal' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-purple-600 hover:bg-purple-700'
                }`}>
                  <Save size={16} /> {activeTab === 'internal' ? 'Enregistrer Flotte' : 'Ajouter Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HEADER WITH TABS */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Parc Automobile</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Bus size={14} className="text-orange-500" /> Gestion de la flotte et des locations
          </p>
        </div>
        
        <div className="flex gap-4">
            <div className="bg-white p-1 rounded-xl border border-slate-200 flex">
                <button 
                    onClick={() => { setActiveTab('internal'); setSearchTerm(''); }}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        activeTab === 'internal' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-500 hover:text-orange-600'
                    }`}
                >
                    Flotte Interne
                </button>
                <button 
                    onClick={() => { setActiveTab('external'); setSearchTerm(''); }}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        activeTab === 'external' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-500 hover:text-purple-600'
                    }`}
                >
                    Locations Externe
                </button>
            </div>
            
            <button 
              onClick={() => setShowModal(true)}
              className={`px-8 py-4 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-3 transition-all active:scale-95 ${
                  activeTab === 'internal' ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-900/10' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-900/10'
              }`}
            >
              <Plus size={18} /> {activeTab === 'internal' ? 'Ajouter Véhicule' : 'Louer Véhicule'}
            </button>
        </div>
      </div>

      {/* SEARCH & FILTERS TOOLBAR */}
      <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-center bg-white border-slate-100">
         <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={16}/>
            <input 
               type="text" 
               placeholder={activeTab === 'internal' ? "Rechercher par immatriculation..." : "Rechercher compagnie..."} 
               className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-xs font-bold shadow-sm focus:ring-2 focus:ring-orange-500/10 focus:bg-white transition-all outline-none"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="flex bg-slate-100 p-1 rounded-xl">
             {['all', 'disponible', 'en_mission', 'maintenance'].map(status => (
                <button
                   key={status}
                   onClick={() => setStatusFilter(status)}
                   className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                      statusFilter === status ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                   }`}
                >
                   {status.replace('_', ' ')}
                </button>
             ))}
         </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFleet.length > 0 ? filteredFleet.map(vehicle => (
          <div key={vehicle.id} className={`glass-card p-6 group transition-all flex flex-col justify-between relative overflow-hidden bg-white ${
             vehicle.ownership === 'external' ? 'hover:border-purple-200' : 'hover:border-orange-200'
          }`}>
            <div className={`absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] -mr-4 -mt-4 transition-all ${
                vehicle.ownership === 'external' ? 'group-hover:bg-purple-50' : 'group-hover:bg-orange-50'
            }`}></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 bg-slate-100 rounded-2xl text-slate-600 transition-all ${
                    vehicle.ownership === 'external' ? 'group-hover:bg-purple-100 group-hover:text-purple-600' : 'group-hover:bg-orange-100 group-hover:text-orange-600'
                }`}>
                  {getVehicleIcon(vehicle.type)}
                </div>
                
                {/* QUICK ACTION DROPDOWN SIMULATION */}
                <div className="flex items-center gap-2">
                    <button 
                        onClick={(e) => handleDeleteVehicle(e, vehicle.id)}
                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Supprimer"
                    >
                        <Trash2 size={14} />
                    </button>
                    <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${getStatusColor(vehicle.status)}`}>
                        {vehicle.status.replace('_', ' ')}
                    </span>
                </div>
              </div>

              <h4 className="text-xl font-black text-slate-900 mb-1">{vehicle.registrationNumber}</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">{vehicle.type.replace('_', ' ')} • {vehicle.capacity} places</p>

              {vehicle.ownership === 'external' ? (
                 <div className="space-y-3 bg-purple-50 p-3 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-3 text-xs font-bold text-purple-800">
                       <Building2 size={14} />
                       <span className="truncate">{vehicle.externalDetails?.companyName}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                       <div className="flex items-center gap-2"><Phone size={14} className="text-purple-400" /> {vehicle.externalDetails?.contactPhone}</div>
                       <div className="flex items-center gap-2"><Coins size={14} className="text-purple-400" /> {vehicle.externalDetails?.dailyCost.toLocaleString()} F/j</div>
                    </div>
                 </div>
              ) : (
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                    <Wrench size={14} className={vehicle.maintenance.status === 'ok' ? 'text-emerald-500' : 'text-rose-500'} />
                    <span>Maint. : {new Date(vehicle.maintenance.nextDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                    <Fuel size={14} className="text-slate-400" />
                    <span>Conso. Moyenne: 18L/100</span>
                    </div>
                </div>
              )}
            </div>

            {/* ACTION FOOTER */}
            <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
                <div className="flex gap-2">
                    {/* Status Toggles */}
                    <button 
                        onClick={(e) => handleUpdateStatus(e, vehicle.id, 'disponible')}
                        className={`p-2 rounded-lg transition-all ${vehicle.status === 'disponible' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'}`}
                        title="Disponible"
                    >
                        <PlayCircle size={14}/>
                    </button>
                    <button 
                        onClick={(e) => handleUpdateStatus(e, vehicle.id, 'maintenance')}
                        className={`p-2 rounded-lg transition-all ${vehicle.status === 'maintenance' ? 'bg-amber-100 text-amber-600' : 'bg-slate-50 text-slate-400 hover:bg-amber-50 hover:text-amber-600'}`}
                        title="Maintenance"
                    >
                        <Wrench size={14}/>
                    </button>
                     <button 
                        onClick={(e) => handleUpdateStatus(e, vehicle.id, 'hors_service')}
                        className={`p-2 rounded-lg transition-all ${vehicle.status === 'hors_service' ? 'bg-rose-100 text-rose-600' : 'bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600'}`}
                        title="Hors Service"
                    >
                        <StopCircle size={14}/>
                    </button>
                </div>

                {vehicle.ownership !== 'external' && (
                    <button 
                        onClick={() => setShowMaintenanceModal(vehicle)}
                        className="text-[9px] font-black uppercase text-orange-600 flex items-center gap-1 hover:gap-2 transition-all"
                    >
                        Carnet <ChevronRight size={12} />
                    </button>
                )}
            </div>
          </div>
        )) : (
          <div className="col-span-full flex flex-col items-center justify-center p-20 border-2 border-dashed border-slate-200 rounded-[3rem] text-slate-400">
             <Bus size={48} className="mb-4 opacity-20"/>
             <p className="text-xs font-bold uppercase">Aucun véhicule {activeTab === 'internal' ? 'interne' : 'externe'} trouvé</p>
             <button onClick={() => setShowModal(true)} className={`mt-4 text-[10px] font-black uppercase hover:underline ${activeTab === 'internal' ? 'text-orange-600' : 'text-purple-600'}`}>Ajouter le premier</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FleetManager;
