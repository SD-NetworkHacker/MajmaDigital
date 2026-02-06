
import React, { useState } from 'react';
import { ClipboardCheck, CheckCircle, XCircle, AlertTriangle, Truck, Save, X, Camera } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface Props {
  vehicleId?: string;
  onClose: () => void;
}

const CHECKLIST_ITEMS = [
  { id: 'tires', label: 'Pression des Pneus', category: 'Sécurité' },
  { id: 'brakes', label: 'Système de Freinage', category: 'Sécurité' },
  { id: 'lights', label: 'Feux & Clignotants', category: 'Sécurité' },
  { id: 'oil', label: 'Niveau Huile Moteur', category: 'Mécanique' },
  { id: 'coolant', label: 'Liquide Refroidissement', category: 'Mécanique' },
  { id: 'papers', label: 'Papiers Véhicule (Assurance/Vignette)', category: 'Administratif' },
  { id: 'fuel', label: 'Niveau Carburant (Plein)', category: 'Mécanique' },
  { id: 'clean', label: 'Propreté Intérieure', category: 'Confort' },
];

const VehicleInspectionModal: React.FC<Props> = ({ vehicleId, onClose }) => {
  const { updateVehicleStatus } = useData();
  const [checks, setChecks] = useState<Record<string, 'ok' | 'nok' | null>>({});
  const [notes, setNote] = useState('');
  
  const handleCheck = (id: string, status: 'ok' | 'nok') => {
    setChecks(prev => ({ ...prev, [id]: status }));
  };

  const progress = Math.round((Object.keys(checks).length / CHECKLIST_ITEMS.length) * 100);
  const allOk = Object.values(checks).every(v => v === 'ok');

  const handleSubmit = () => {
      const hasIssues = Object.values(checks).includes('nok');
      // In a real app, we would save the inspection record to DB here.
      // For now, we update the vehicle status directly.

      if (vehicleId) {
          if (hasIssues) {
             updateVehicleStatus(vehicleId, 'maintenance');
             alert("Inspection enregistrée. Le véhicule a été marqué en MAINTENANCE.");
          } else {
             updateVehicleStatus(vehicleId, 'disponible');
             alert("Inspection validée ! Véhicule prêt au départ.");
          }
      } else {
          alert("Inspection simulée enregistrée.");
      }
      
      onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl flex flex-col h-[80vh] overflow-hidden animate-in zoom-in duration-300">
        
        <div className="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
           <div>
              <h3 className="font-black text-lg flex items-center gap-2"><ClipboardCheck size={20} className="text-orange-500"/> Contrôle Départ</h3>
              <p className="text-[10px] opacity-60 uppercase tracking-widest font-bold">Véhicule {vehicleId || 'Non Assigné'}</p>
           </div>
           <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full"><X size={18}/></button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
           {/* Progress Bar */}
           <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                 <span>Progression</span>
                 <span>{progress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                 <div className={`h-full transition-all duration-300 ${allOk ? 'bg-emerald-500' : 'bg-orange-500'}`} style={{ width: `${progress}%` }}></div>
              </div>
           </div>

           {/* Categories */}
           {['Sécurité', 'Mécanique', 'Administratif', 'Confort'].map(cat => (
             <div key={cat} className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">{cat}</h4>
                {CHECKLIST_ITEMS.filter(i => i.category === cat).map(item => (
                   <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-xs font-bold text-slate-700">{item.label}</span>
                      <div className="flex gap-2">
                         <button 
                           onClick={() => handleCheck(item.id, 'ok')}
                           className={`p-2 rounded-lg transition-all ${checks[item.id] === 'ok' ? 'bg-emerald-500 text-white shadow-md' : 'bg-white text-slate-300 hover:bg-emerald-50 hover:text-emerald-500'}`}
                         >
                            <CheckCircle size={16}/>
                         </button>
                         <button 
                           onClick={() => handleCheck(item.id, 'nok')}
                           className={`p-2 rounded-lg transition-all ${checks[item.id] === 'nok' ? 'bg-rose-500 text-white shadow-md' : 'bg-white text-slate-300 hover:bg-rose-50 hover:text-rose-500'}`}
                         >
                            <XCircle size={16}/>
                         </button>
                      </div>
                   </div>
                ))}
             </div>
           ))}

           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Observations / Pannes</label>
              <textarea 
                className="w-full p-4 bg-slate-50 border-none rounded-xl text-sm outline-none resize-none h-24 focus:ring-2 focus:ring-orange-500/20"
                placeholder="R.A.S ou détaillez le problème..."
                value={notes}
                onChange={(e) => setNote(e.target.value)}
              />
              <button className="w-full py-3 border-2 border-dashed border-slate-200 text-slate-400 rounded-xl text-[10px] font-black uppercase hover:border-orange-300 hover:text-orange-500 transition-all flex items-center justify-center gap-2">
                 <Camera size={14}/> Ajouter Photo Preuve
              </button>
           </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-white">
           <button 
             disabled={progress < 100}
             onClick={handleSubmit}
             className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black transition-all"
           >
              <Save size={16}/> {Object.values(checks).includes('nok') ? 'Signaler Anomalie' : 'Valider Départ'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleInspectionModal;
