
import React, { useState } from 'react';
import { Siren, AlertTriangle, Play, ShieldAlert, History, FileText, ChevronRight } from 'lucide-react';
import { CrisisLevel, CrisisScenario, ActiveCrisis } from '../../types';
import { CRISIS_SCENARIOS, startCrisis } from '../../services/crisisService';
import ActiveCrisisMode from './ActiveCrisisMode';

interface Props {
  level: CrisisLevel;
  setLevel: (l: CrisisLevel) => void;
}

const CrisisManager: React.FC<Props> = ({ level, setLevel }) => {
  const [selectedScenario, setSelectedScenario] = useState<CrisisScenario | null>(null);
  const [activeCrisis, setActiveCrisis] = useState<ActiveCrisis | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleTrigger = () => {
    if (selectedScenario) {
      const newCrisis = startCrisis(selectedScenario.id);
      setActiveCrisis(newCrisis);
      setLevel(CrisisLevel.CRITICAL);
      setShowConfirm(false);
    }
  };

  const handleCloseCrisis = () => {
    setActiveCrisis(null);
    setLevel(CrisisLevel.NORMAL);
    setSelectedScenario(null);
  };

  if (activeCrisis && selectedScenario) {
    return <ActiveCrisisMode scenario={selectedScenario} activeCrisis={activeCrisis} onCloseCrisis={handleCloseCrisis} />;
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
      {showConfirm && selectedScenario && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
           <div className="bg-slate-900 border-2 border-red-600 w-full max-w-lg rounded-3xl p-8 shadow-[0_0_50px_rgba(220,38,38,0.5)] text-center animate-in zoom-in duration-200">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                 <Siren size={40} className="text-white" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Confirmation Requise</h3>
              <p className="text-slate-300 text-sm font-medium mb-8">
                Vous êtes sur le point d'activer le protocole : <br/>
                <span className="text-red-500 font-bold text-lg">{selectedScenario.title}</span>.
                <br/>Cela alertera immédiatement le bureau exécutif.
              </p>
              <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => setShowConfirm(false)} className="py-4 bg-slate-800 text-slate-400 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-700">Annuler</button>
                 <button onClick={handleTrigger} className="py-4 bg-red-600 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-red-500 shadow-lg">Confirmer Activation</button>
              </div>
           </div>
        </div>
      )}

      <div className="flex items-center justify-between">
         <h3 className="text-2xl font-black text-slate-100 uppercase tracking-widest flex items-center gap-3">
            <ShieldAlert size={28} className="text-slate-500" /> Centre de Crise
         </h3>
         <div className="flex gap-2">
            <span className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase border ${level === CrisisLevel.NORMAL ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>Normal</span>
            <span className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase border ${level === CrisisLevel.CRITICAL ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>Crise</span>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Scenarios List */}
         <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {CRISIS_SCENARIOS.map((scenario) => (
              <div 
                key={scenario.id} 
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer group relative overflow-hidden ${
                  selectedScenario?.id === scenario.id 
                    ? 'bg-red-900/20 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.2)]' 
                    : 'bg-slate-900 border-slate-800 hover:border-slate-600'
                }`}
                onClick={() => setSelectedScenario(scenario)}
              >
                 <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-slate-800 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">{scenario.type}</span>
                    {selectedScenario?.id === scenario.id && <div className="w-3 h-3 bg-red-600 rounded-full animate-ping"></div>}
                 </div>
                 <h4 className="text-lg font-black text-slate-200 mb-2 leading-tight group-hover:text-white">{scenario.title}</h4>
                 <p className="text-xs text-slate-500 font-medium mb-6 line-clamp-2">{scenario.description}</p>
                 
                 <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{scenario.steps.length} Étapes Clés</span>
                    <ChevronRight size={16} className={`transition-transform ${selectedScenario?.id === scenario.id ? 'text-red-500 translate-x-2' : 'text-slate-600'}`} />
                 </div>
              </div>
            ))}
         </div>

         {/* Action Panel */}
         <div className="lg:col-span-1 space-y-6">
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-[2rem] flex flex-col items-center text-center h-full justify-center relative overflow-hidden">
               {selectedScenario ? (
                 <div className="relative z-10 w-full animate-in zoom-in duration-300">
                    <AlertTriangle size={48} className="text-red-500 mb-6 mx-auto" />
                    <h4 className="text-xl font-black text-white mb-2">{selectedScenario.title}</h4>
                    <p className="text-xs text-slate-400 mb-8">Prêt à initialiser le protocole d'urgence ?</p>
                    <button 
                      onClick={() => setShowConfirm(true)}
                      className="w-full py-5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-red-900/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                       <Play size={16} className="fill-current"/> Activer Mode Crise
                    </button>
                 </div>
               ) : (
                 <div className="opacity-30">
                    <ShieldAlert size={48} className="text-slate-500 mb-4 mx-auto" />
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">Sélectionnez un scénario</p>
                 </div>
               )}
            </div>

            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
               <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><History size={14}/> Derniers Incidents</h5>
               <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 opacity-60">
                     <FileText size={14} className="text-slate-500"/>
                     <div>
                        <p className="text-[10px] font-bold text-slate-300">Panne Bus 3</p>
                        <p className="text-[8px] text-slate-600 uppercase">Résolu • 12 Fév</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CrisisManager;
