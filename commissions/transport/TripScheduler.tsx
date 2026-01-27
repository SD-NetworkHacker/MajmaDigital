
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, ArrowRight, Bus, Navigation } from 'lucide-react';
import { TransportSchedule } from '../../types';
import { getSchedules } from '../../services/transportService';

const TripScheduler: React.FC = () => {
  const [schedules, setSchedules] = useState<TransportSchedule[]>([]);

  useEffect(() => {
    getSchedules().then(setSchedules);
  }, []);

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
        {schedules.map(trip => (
          <div key={trip.id} className="glass-card p-0 overflow-hidden group border-slate-200 hover:border-orange-200 transition-all">
             <div className="flex flex-col lg:flex-row">
                
                {/* Left: Event Info */}
                <div className="lg:w-1/3 p-8 bg-slate-900 text-white relative overflow-hidden">
                   <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-6">
                         <span className="px-3 py-1 bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/10">{trip.status}</span>
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
                      </div>
                   </div>
                   <div className="absolute -bottom-10 -right-10 text-white/5 opacity-20"><MapPin size={150} /></div>
                </div>

                {/* Right: Route Timeline */}
                <div className="lg:w-2/3 p-8 bg-white relative">
                   <h5 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center gap-2">
                      <Clock size={14} className="text-orange-500" /> Itinéraire & Arrêts
                   </h5>
                   
                   <div className="relative pl-4 space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                      {/* Origin */}
                      <div className="relative flex items-center gap-6">
                         <div className="w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow-md relative z-10"></div>
                         <div className="flex-1 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex justify-between items-center">
                               <span className="text-sm font-black text-slate-800">{trip.origin}</span>
                               <span className="text-xs font-bold text-orange-600">{trip.departureTime}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Départ Convoi</p>
                         </div>
                      </div>

                      {/* Stops */}
                      {trip.stops.map((stop, i) => (
                        <div key={i} className="relative flex items-center gap-6">
                           <div className="w-2.5 h-2.5 bg-white border-2 border-slate-300 rounded-full relative z-10"></div>
                           <div className="flex-1 flex items-center justify-between group/stop">
                              <div>
                                 <p className="text-xs font-bold text-slate-700">{stop.location}</p>
                                 <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1"><Users size={10}/> +{stop.expectedPassengers}</p>
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
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripScheduler;
