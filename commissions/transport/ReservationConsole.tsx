
import React, { useState } from 'react';
import { Ticket, User, QrCode, CreditCard, Armchair, ArrowLeft, Bus, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { TransportSchedule } from '../../types';

interface ReservationConsoleProps {
  trip?: TransportSchedule;
  onBack: () => void;
  onConfirm: (seatId: number) => void;
}

const ReservationConsole: React.FC<ReservationConsoleProps> = ({ trip, onBack, onConfirm }) => {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Simulation: Sièges aléatoirement occupés pour le réalisme
  // 45 places (4 par rangée + 5 au fond)
  const seats = Array.from({ length: 45 }, (_, i) => ({ 
      id: i + 1, 
      status: Math.random() > 0.8 ? 'occupied' : 'free' 
  }));

  const handleConfirm = () => {
      if (!selectedSeat) return;
      setIsProcessing(true);
      setTimeout(() => {
          onConfirm(selectedSeat);
          setIsProcessing(false);
      }, 1500);
  };

  return (
    <div className="space-y-6 animate-in zoom-in duration-500">
      
      {/* Navigation Header */}
      <div className="flex items-center gap-4 mb-4">
        <button 
            onClick={onBack}
            className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-500 group"
        >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/>
        </button>
        <div>
            <h3 className="text-xl font-black text-slate-900 leading-none">Réservation de Siège</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                {trip ? `${trip.origin} ➝ ${trip.destination}` : 'Sélection du siège'}
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Visual Seat Picker */}
        <div className="lg:col-span-8 glass-card p-10 bg-white">
           <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                 <Armchair size={24} className="text-orange-500" /> 
                 <span className="font-black text-sm">Plan du Bus</span>
              </div>
              <div className="flex gap-4 text-[9px] font-bold uppercase tracking-widest">
                 <span className="flex items-center gap-2"><div className="w-3 h-3 bg-white border-2 border-slate-200 rounded"></div> Libre</span>
                 <span className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-200 rounded"></div> Occupé</span>
                 <span className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded"></div> Votre choix</span>
              </div>
           </div>

           <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 relative overflow-hidden flex flex-col items-center">
              {/* Front of Bus / Driver */}
              <div className="w-full flex justify-between items-center px-12 mb-10 text-slate-300 uppercase text-[9px] font-black tracking-widest">
                 <span>Porte</span>
                 <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-2 border-slate-300 rounded-full flex items-center justify-center mb-1">
                       <User size={20} />
                    </div>
                    <span>Chauffeur</span>
                 </div>
              </div>

              {/* Grid of Seats */}
              <div className="relative">
                 {/* Aisle Marker */}
                 <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-slate-100/50 rounded-full z-0"></div>
                 
                 <div className="grid grid-cols-4 gap-x-16 gap-y-4 relative z-10">
                    {seats.map((seat) => (
                      <button
                        key={seat.id}
                        disabled={seat.status === 'occupied'}
                        onClick={() => setSelectedSeat(seat.id)}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                          seat.status === 'occupied' 
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-transparent'
                            : selectedSeat === seat.id 
                              ? 'bg-orange-500 text-white scale-110 shadow-orange-200 ring-4 ring-orange-100 border border-orange-600' 
                              : 'bg-white border-2 border-slate-200 text-slate-500 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50'
                        }`}
                      >
                         {seat.id}
                      </button>
                    ))}
                 </div>
              </div>
              
              {/* Back of Bus */}
              <div className="mt-10 w-full text-center text-slate-300 text-[9px] font-black uppercase tracking-widest">
                 Fond du Bus
              </div>
           </div>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-4 space-y-6">
           <div className="glass-card p-8 bg-slate-900 text-white relative overflow-hidden h-full flex flex-col">
              <div className="relative z-10 flex-1">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 opacity-60">Récapitulatif</h4>
                 
                 {trip && (
                     <div className="mb-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-lg"><Calendar size={16} className="text-orange-400"/></div>
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase">Date & Heure</p>
                               <span className="text-sm font-bold">{trip.departureDate} • {trip.departureTime}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-lg"><Bus size={16} className="text-orange-400"/></div>
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase">Trajet</p>
                               <span className="text-sm font-bold">{trip.eventTitle}</span>
                            </div>
                        </div>
                     </div>
                 )}

                 <div className="p-6 bg-white/5 rounded-3xl border border-white/10 mb-8 flex flex-col items-center justify-center text-center">
                    <p className="text-xs font-bold text-slate-300 mb-2">Siège Sélectionné</p>
                    <div className="text-5xl font-black text-orange-400 bg-white/10 w-20 h-20 flex items-center justify-center rounded-2xl mb-2">
                       {selectedSeat || '--'}
                    </div>
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest">{selectedSeat ? 'Disponible' : 'En attente'}</p>
                 </div>

                 {selectedSeat ? (
                   <button 
                     onClick={handleConfirm}
                     disabled={isProcessing}
                     className="w-full py-4 bg-orange-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 shadow-lg hover:bg-orange-500 transition-all active:scale-95 disabled:opacity-50"
                   >
                      {isProcessing ? 'Validation...' : <><Ticket size={16} /> Confirmer Réservation</>}
                   </button>
                 ) : (
                   <div className="text-center text-[10px] text-slate-500 uppercase tracking-widest bg-white/5 p-4 rounded-xl border border-dashed border-slate-700">
                      Veuillez choisir une place sur le plan
                   </div>
                 )}
              </div>
              <div className="absolute -bottom-10 -right-10 opacity-10"><Ticket size={150}/></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationConsole;
