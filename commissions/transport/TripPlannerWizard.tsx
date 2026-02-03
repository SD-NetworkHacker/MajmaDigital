
import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Clock, Bus, User, Navigation, 
  CheckCircle, ChevronRight, ChevronLeft, Save, X, 
  Ticket, Plus, Trash2 
} from 'lucide-react';
import { TransportSchedule, Vehicle, Driver } from '../../types';
import { getCollection, addItem, STORAGE_KEYS } from '../../services/storage';

interface Props {
  onClose: () => void;
}

const STEPS = [
  { id: 1, label: 'Itinéraire & Horaire' },
  { id: 2, label: 'Ressources & Flotte' },
  { id: 3, label: 'Tarification' },
  { id: 4, label: 'Validation' }
];

const TripPlannerWizard: React.FC<Props> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Data State
  const [fleet, setFleet] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '07:00',
    origin: 'Dakar',
    destination: 'Touba',
    stops: [{ location: 'Thiès', time: '08:30' }],
    vehicleId: '',
    driverId: '',
    capacity: 60,
    price: 3500,
    luggagePolicy: 'Inclus (1 bagage)'
  });

  useEffect(() => {
    setFleet(getCollection<Vehicle>(STORAGE_KEYS.FLEET).filter(v => v.status === 'disponible'));
    setDrivers(getCollection<Driver>(STORAGE_KEYS.DRIVERS).filter(d => d.status === 'disponible'));
  }, []);

  const handleAddStop = () => {
    setFormData({ ...formData, stops: [...formData.stops, { location: '', time: '' }] });
  };

  const handleRemoveStop = (index: number) => {
    const newStops = formData.stops.filter((_, i) => i !== index);
    setFormData({ ...formData, stops: newStops });
  };

  const updateStop = (index: number, field: string, value: string) => {
    const newStops = [...formData.stops];
    newStops[index] = { ...newStops[index], [field]: value };
    setFormData({ ...formData, stops: newStops });
  };

  const handleVehicleSelect = (vId: string) => {
      const selectedVehicle = fleet.find(v => v.id === vId);
      setFormData({
          ...formData, 
          vehicleId: vId,
          capacity: selectedVehicle ? selectedVehicle.capacity : 60
      });
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.date) return;

    const newSchedule: TransportSchedule = {
        id: Date.now().toString(),
        eventId: `EVT-${Date.now()}`, // Could link to real event
        eventTitle: formData.title,
        departureDate: new Date(formData.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        departureTime: formData.time,
        origin: formData.origin,
        destination: formData.destination,
        stops: formData.stops.map((s, i) => ({ id: `S${i}`, location: s.location, time: s.time, expectedPassengers: 0 })),
        assignedVehicleId: formData.vehicleId, // Should use registration number ideally for display or ID
        status: 'planifie',
        seatsFilled: 0,
        totalCapacity: formData.capacity
    };

    addItem(STORAGE_KEYS.TRIPS, newSchedule);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl flex flex-col h-[85vh] overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
               <Navigation size={24} className="text-orange-600"/> Planification de Convoi
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Nouveau départ</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white hover:bg-rose-50 hover:text-rose-500 rounded-full transition-all border border-slate-100 shadow-sm"><X size={20}/></button>
        </div>

        {/* Steps */}
        <div className="px-12 py-6 border-b border-slate-100 flex justify-between items-center bg-white relative">
           <div className="absolute left-12 right-12 top-1/2 h-1 bg-slate-100 -z-0"></div>
           {STEPS.map((step, idx) => (
             <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 ${
                  currentStep >= step.id ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30' : 'bg-slate-200 text-slate-400'
                }`}>
                   {currentStep > step.id ? <CheckCircle size={18}/> : step.id}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${currentStep >= step.id ? 'text-orange-700' : 'text-slate-300'}`}>{step.label}</span>
             </div>
           ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-slate-50/30">
           
           {/* STEP 1: ROUTE */}
           {currentStep === 1 && (
             <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom de l'événement</label>
                      <input type="text" className="w-full p-4 bg-white border border-slate-100 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-orange-500/20" 
                        value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ex: Magal 2024 - Vague 1" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date de départ</label>
                      <input type="date" className="w-full p-4 bg-white border border-slate-100 rounded-xl font-bold text-slate-800 outline-none" 
                        value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                   </div>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="flex-1 space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Départ (Origine)</label>
                         <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <input type="text" className="bg-transparent font-bold text-slate-700 w-full outline-none" value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} />
                         </div>
                      </div>
                      <div className="w-32 space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Heure</label>
                         <input type="time" className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-700 outline-none" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                      </div>
                   </div>

                   {/* Stops */}
                   <div className="space-y-3 relative pl-8 border-l-2 border-slate-100 ml-4">
                      {formData.stops.map((stop, idx) => (
                         <div key={idx} className="flex gap-3 items-center relative">
                            <div className="absolute -left-[39px] w-4 h-4 bg-white border-2 border-slate-300 rounded-full flex items-center justify-center">
                               <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                            </div>
                            <input type="text" placeholder="Ville d'escale" className="flex-1 p-3 bg-slate-50 rounded-xl text-xs font-bold outline-none" value={stop.location} onChange={e => updateStop(idx, 'location', e.target.value)} />
                            <input type="time" className="w-24 p-3 bg-slate-50 rounded-xl text-xs font-bold outline-none" value={stop.time} onChange={e => updateStop(idx, 'time', e.target.value)} />
                            <button onClick={() => handleRemoveStop(idx)} className="p-2 text-slate-300 hover:text-rose-500"><Trash2 size={16}/></button>
                         </div>
                      ))}
                      <button onClick={handleAddStop} className="flex items-center gap-2 text-[10px] font-black uppercase text-orange-600 hover:underline mt-2">
                         <Plus size={12}/> Ajouter une escale
                      </button>
                   </div>

                   <div className="flex items-center gap-4">
                      <div className="flex-1 space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Arrivée (Destination)</label>
                         <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-orange-200 bg-orange-50/20">
                            <MapPin size={16} className="text-orange-600" />
                            <input type="text" className="bg-transparent font-bold text-slate-700 w-full outline-none" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} />
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {/* STEP 2: RESOURCES */}
           {currentStep === 2 && (
             <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-4">
                      <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><Bus size={16}/> Véhicule</h4>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sélectionner dans le Parc</label>
                         <select 
                            className="w-full p-4 bg-white border border-slate-100 rounded-xl font-bold text-slate-800 outline-none"
                            value={formData.vehicleId}
                            onChange={e => handleVehicleSelect(e.target.value)}
                         >
                             <option value="">-- Choisir véhicule --</option>
                             {fleet.map(v => (
                                 <option key={v.id} value={v.id}>{v.registrationNumber} ({v.type})</option>
                             ))}
                         </select>
                         {fleet.length === 0 && <p className="text-[9px] text-rose-500 italic">Aucun véhicule disponible</p>}
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacité (Sièges)</label>
                         <input type="number" className="w-full p-4 bg-white border border-slate-100 rounded-xl font-bold text-slate-800 outline-none" 
                           value={formData.capacity} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} />
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><User size={16}/> Chauffeur</h4>
                      <select 
                        className="w-full p-4 bg-white border border-slate-100 rounded-xl font-bold text-slate-800 outline-none"
                        value={formData.driverId} onChange={e => setFormData({...formData, driverId: e.target.value})}
                      >
                         <option value="">Sélectionner un chauffeur</option>
                         {drivers.map(d => (
                            <option key={d.id} value={d.id}>{d.name} ({d.status})</option>
                         ))}
                      </select>
                      {drivers.length === 0 && <p className="text-[9px] text-rose-500 italic">Aucun chauffeur disponible</p>}
                      
                      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                         <p className="text-[10px] font-bold text-blue-800 uppercase mb-2">Info Chauffeur</p>
                         <div className="space-y-1 text-xs text-blue-700">
                            {formData.driverId ? (
                                <>
                                    <p>Permis : {drivers.find(d => d.id === formData.driverId)?.licenseType}</p>
                                    <p>Tel : {drivers.find(d => d.id === formData.driverId)?.phone}</p>
                                </>
                            ) : <p>Non assigné</p>}
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {/* STEP 3: PRICING */}
           {currentStep === 3 && (
             <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="bg-slate-900 p-8 rounded-[2rem] text-white text-center">
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Prix du Billet Unitaire</p>
                   <div className="flex items-center justify-center gap-2">
                      <input 
                        type="number" 
                        className="bg-transparent text-5xl font-black text-center w-48 outline-none border-b-2 border-slate-700 focus:border-orange-500 transition-all"
                        value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value)})}
                      />
                      <span className="text-xl font-bold text-slate-500">FCFA</span>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Politique Bagages</label>
                   <select 
                      className="w-full p-4 bg-white border border-slate-100 rounded-xl font-bold text-slate-800 outline-none"
                      value={formData.luggagePolicy} onChange={e => setFormData({...formData, luggagePolicy: e.target.value})}
                   >
                      <option>Inclus (1 bagage soute)</option>
                      <option>Payant (500F / kg)</option>
                      <option>Restreint (Sac à dos uniquement)</option>
                   </select>
                </div>
                
                <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl flex justify-between items-center">
                   <div>
                      <p className="text-[10px] font-black text-emerald-800 uppercase">Recette Potentielle</p>
                      <p className="text-xs text-emerald-600">Basé sur 100% de remplissage</p>
                   </div>
                   <p className="text-2xl font-black text-emerald-700">{(formData.price * formData.capacity).toLocaleString()} F</p>
                </div>
             </div>
           )}

           {/* STEP 4: REVIEW */}
           {currentStep === 4 && (
             <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in duration-300">
                <div className="text-center space-y-2">
                   <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl">
                      <Navigation size={40}/>
                   </div>
                   <h3 className="text-2xl font-black text-slate-900">Confirmer le Convoi ?</h3>
                   <p className="text-slate-500">Vérifiez les informations avant la publication.</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                   <div className="p-4 border-b border-slate-100 flex justify-between">
                      <span className="text-xs font-bold text-slate-500">Trajet</span>
                      <span className="text-xs font-black text-slate-900">{formData.origin} ➝ {formData.destination}</span>
                   </div>
                   <div className="p-4 border-b border-slate-100 flex justify-between">
                      <span className="text-xs font-bold text-slate-500">Départ</span>
                      <span className="text-xs font-black text-slate-900">{formData.date} à {formData.time}</span>
                   </div>
                   <div className="p-4 border-b border-slate-100 flex justify-between">
                      <span className="text-xs font-bold text-slate-500">Véhicule</span>
                      <span className="text-xs font-black text-slate-900 capitalize">
                         {fleet.find(v => v.id === formData.vehicleId)?.registrationNumber || 'Non spécifié'} ({formData.capacity} pl.)
                      </span>
                   </div>
                   <div className="p-4 flex justify-between bg-slate-50">
                      <span className="text-xs font-bold text-slate-500">Tarif</span>
                      <span className="text-sm font-black text-orange-600">{formData.price.toLocaleString()} FCFA</span>
                   </div>
                </div>
             </div>
           )}

        </div>

        {/* Footer Navigation */}
        <div className="p-8 border-t border-slate-100 bg-white flex justify-between items-center">
           <button 
             onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
             disabled={currentStep === 1}
             className="px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-slate-600 disabled:opacity-30 transition-all flex items-center gap-2"
           >
             <ChevronLeft size={16}/> Précédent
           </button>

           {currentStep < 4 ? (
             <button 
               onClick={() => setCurrentStep(currentStep + 1)}
               className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-black transition-all flex items-center gap-3"
             >
               Suivant <ChevronRight size={16}/>
             </button>
           ) : (
             <button 
               onClick={handleSubmit}
               className="px-10 py-4 bg-orange-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-orange-500 transition-all flex items-center gap-3 animate-pulse"
             >
               <Save size={18}/> Publier Convoi
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default TripPlannerWizard;
