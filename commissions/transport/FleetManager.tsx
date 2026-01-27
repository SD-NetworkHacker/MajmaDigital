
import React, { useState, useEffect } from 'react';
import { Bus, Truck, Car, Wrench, CheckCircle, AlertTriangle, Battery, Plus, Fuel } from 'lucide-react';
import { Vehicle } from '../../types';
import { getFleet } from '../../services/transportService';

const FleetManager: React.FC = () => {
  const [fleet, setFleet] = useState<Vehicle[]>([]);

  useEffect(() => {
    getFleet().then(setFleet);
  }, []);

  const getVehicleIcon = (type: string) => {
    switch(type) {
      case 'bus_grand': return <Bus size={32} />;
      case 'minibus': return <Truck size={32} />;
      default: return <Car size={32} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'disponible': return 'bg-emerald-100 text-emerald-700';
      case 'en_mission': return 'bg-blue-100 text-blue-700';
      case 'maintenance': return 'bg-amber-100 text-amber-700';
      case 'hors_service': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100';
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Parc Automobile</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Bus size={14} className="text-orange-500" /> Gestion de la flotte et maintenance
          </p>
        </div>
        <button className="px-8 py-4 bg-orange-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-orange-900/10 flex items-center gap-3 hover:bg-orange-700 transition-all">
          <Plus size={18} /> Ajouter Véhicule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fleet.map(vehicle => (
          <div key={vehicle.id} className="glass-card p-8 group hover:border-orange-200 transition-all flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] -mr-4 -mt-4 transition-all group-hover:bg-orange-50"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-slate-100 rounded-2xl text-slate-600 group-hover:bg-orange-100 group-hover:text-orange-600 transition-all">
                  {getVehicleIcon(vehicle.type)}
                </div>
                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${getStatusColor(vehicle.status)}`}>
                  {vehicle.status.replace('_', ' ')}
                </span>
              </div>

              <h4 className="text-xl font-black text-slate-900 mb-1">{vehicle.registrationNumber}</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">{vehicle.type.replace('_', ' ')} • {vehicle.capacity} places</p>

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
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50 flex gap-2">
               {vehicle.features.map((f, i) => (
                 <span key={i} className="px-2 py-1 bg-slate-50 text-slate-400 text-[8px] font-black uppercase rounded-lg border border-slate-100">{f}</span>
               ))}
            </div>
          </div>
        ))}
        
        {/* Add Card */}
        <div className="border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center p-10 cursor-pointer hover:border-orange-300 hover:bg-orange-50/10 transition-all group">
           <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4 group-hover:bg-orange-100 group-hover:text-orange-500 transition-all">
              <Plus size={32} />
           </div>
           <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Enregistrer Véhicule</p>
        </div>
      </div>
    </div>
  );
};

export default FleetManager;
