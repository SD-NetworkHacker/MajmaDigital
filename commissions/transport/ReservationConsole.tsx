
import React, { useState } from 'react';
import { Ticket, User, QrCode, CreditCard, Armchair } from 'lucide-react';

const ReservationConsole: React.FC = () => {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  // Tous les sièges sont libres par défaut
  const seats = Array.from({ length: 45 }, (_, i) => ({ id: i + 1, status: 'free' }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in zoom-in duration-500">
      
      {/* Visual Seat Picker */}
      <div className="lg:col-span-8 glass-card p-10 bg-white">
         <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
               <Armchair size={24} className="text-orange-500" /> Plan du Bus (45 Places)
            </h3>
            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
               <span className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-100 rounded border border-slate-200"></div> Libre</span>
               <span className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded"></div> Sélection</span>
            </div>
         </div>

         <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 relative">
            <div className="grid grid-cols-5 gap-y-4 gap-x-12 max-w-2xl mx-auto pl-20">
               {seats.map((seat) => (
                 <button
                   key={seat.id}
                   onClick={() => setSelectedSeat(seat.id)}
                   className={`w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                     selectedSeat === seat.id 
                       ? 'bg-orange-500 text-white scale-110 shadow-orange-200' 
                       : 'bg-white border-2 border-slate-200 text-slate-400 hover:border-orange-400 hover:text-orange-500'
                   } ${seat.id % 2 === 0 && seat.id % 4 !== 0 ? 'mr-8' : ''}`}
                 >
                    {seat.id}
                 </button>
               ))}
            </div>
         </div>
      </div>

      {/* Booking Summary */}
      <div className="lg:col-span-4 space-y-6">
         <div className="glass-card p-8 bg-slate-900 text-white relative overflow-hidden">
            <div className="relative z-10">
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 opacity-60">Ma Réservation</h4>
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-sm font-bold text-slate-300">Siège</span>
                     <span className="text-xl font-black text-orange-400">{selectedSeat || '-'}</span>
                  </div>
               </div>
               {selectedSeat ? (
                 <button className="w-full mt-8 py-4 bg-orange-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 shadow-lg">
                    <Ticket size={16} /> Confirmer
                 </button>
               ) : (
                 <p className="mt-8 text-center text-[10px] text-slate-400 uppercase tracking-widest">Sélectionnez une place</p>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default ReservationConsole;
