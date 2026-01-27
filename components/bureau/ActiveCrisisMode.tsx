
import React, { useState, useEffect } from 'react';
import { 
  Siren, Phone, CheckCircle, Circle, MessageSquare, 
  ShieldAlert, Clock, Send, Lock, FileText, XCircle 
} from 'lucide-react';
import { CrisisScenario, ActiveCrisis } from '../../types';

interface Props {
  scenario: CrisisScenario;
  activeCrisis: ActiveCrisis;
  onCloseCrisis: () => void;
}

const ActiveCrisisMode: React.FC<Props> = ({ scenario, activeCrisis, onCloseCrisis }) => {
  const [steps, setSteps] = useState(scenario.steps);
  const [logs, setLogs] = useState(activeCrisis.log);
  const [elapsed, setElapsed] = useState('00:00:00');
  const [commMessage, setCommMessage] = useState(scenario.communicationTemplate);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const start = new Date(activeCrisis.startTime).getTime();
      const now = new Date().getTime();
      const diff = now - start;
      const h = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      const s = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
      setElapsed(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeCrisis.startTime]);

  const toggleStep = (stepId: string) => {
    const newSteps = steps.map(s => s.id === stepId ? { ...s, status: s.status === 'done' ? 'pending' : 'done' } : s);
    setSteps(newSteps as any);
    
    // Add log
    const step = steps.find(s => s.id === stepId);
    const action = step?.status === 'done' ? `Annulation étape: ${step?.label}` : `Validation étape: ${step?.label}`;
    addLog(action);
  };

  const addLog = (action: string) => {
    const newLog = { time: new Date().toISOString(), action, user: 'Admin' };
    setLogs([newLog, ...logs]);
  };

  const handleBroadcast = () => {
    setIsSending(true);
    setTimeout(() => {
      addLog(`Diffusion message d'urgence: "${commMessage.substring(0, 30)}..."`);
      setIsSending(false);
      alert("Message envoyé à tous les membres via SMS et Push.");
    }, 2000);
  };

  const progress = Math.round((steps.filter(s => s.status === 'done').length / steps.length) * 100);

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 text-white flex flex-col animate-in fade-in duration-300 font-sans">
      {/* Red Alert Header */}
      <div className="h-20 bg-red-600 flex items-center justify-between px-8 shadow-2xl shadow-red-900/50 z-50">
        <div className="flex items-center gap-6">
           <Siren size={32} className="animate-pulse text-white" />
           <div>
              <h1 className="text-2xl font-black uppercase tracking-widest">Mode Crise Actif</h1>
              <p className="text-xs font-bold text-red-100 opacity-80">{scenario.title} • ID: {activeCrisis.id.slice(-6)}</p>
           </div>
        </div>
        <div className="flex items-center gap-8">
           <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-red-200">Temps Écoulé</p>
              <p className="text-3xl font-mono font-black">{elapsed}</p>
           </div>
           <button 
             onClick={onCloseCrisis}
             className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black uppercase text-xs tracking-widest border border-slate-700 transition-all"
           >
             Clôturer Incident
           </button>
        </div>
      </div>

      {/* Main War Room Grid */}
      <div className="flex-1 overflow-hidden flex">
         
         {/* LEFT: Protocols & Checklists */}
         <div className="w-1/3 border-r border-slate-800 flex flex-col bg-slate-900/50">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
               <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
                  <ShieldAlert size={18} className="text-red-500"/> Protocole d'Action
               </h3>
               <span className="text-xs font-mono text-emerald-400">{progress}%</span>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
               {steps.map(step => (
                 <div 
                   key={step.id} 
                   onClick={() => toggleStep(step.id)}
                   className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                     step.status === 'done' 
                       ? 'bg-emerald-900/20 border-emerald-500/30 opacity-60' 
                       : step.isCritical 
                       ? 'bg-red-500/10 border-red-500 hover:bg-red-500/20' 
                       : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                   }`}
                 >
                    <div className={`mt-1 ${step.status === 'done' ? 'text-emerald-500' : 'text-slate-500'}`}>
                       {step.status === 'done' ? <CheckCircle size={20} /> : <Circle size={20} />}
                    </div>
                    <div>
                       <p className={`text-sm font-bold ${step.status === 'done' ? 'line-through text-slate-500' : 'text-slate-200'}`}>{step.label}</p>
                       <p className="text-[10px] uppercase font-black text-slate-500 mt-1">Assigné à : {step.role}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* MIDDLE: Timeline & Logs */}
         <div className="w-1/3 border-r border-slate-800 flex flex-col bg-slate-950">
            <div className="p-6 border-b border-slate-800">
               <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
                  <Clock size={18} className="text-blue-500"/> Chronologie des Événements
               </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
               <div className="space-y-6 relative">
                  <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-800"></div>
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-6 relative animate-in slide-in-from-left-2 duration-300">
                       <div className="w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-600 mt-1 z-10"></div>
                       <div>
                          <p className="text-[10px] font-mono text-slate-500 mb-1">{new Date(log.time).toLocaleTimeString()}</p>
                          <p className="text-sm font-medium text-slate-300">{log.action}</p>
                          <p className="text-[10px] font-black text-slate-600 uppercase mt-1">{log.user}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
            <div className="p-4 border-t border-slate-800 bg-slate-900">
               <input 
                 type="text" 
                 placeholder="Ajouter une note au journal..." 
                 className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-xs text-white focus:border-blue-500 outline-none"
                 onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                       addLog(e.currentTarget.value);
                       e.currentTarget.value = '';
                    }
                 }}
               />
            </div>
         </div>

         {/* RIGHT: Comms & Contacts */}
         <div className="w-1/3 flex flex-col bg-slate-900/50">
            <div className="p-6 border-b border-slate-800">
               <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
                  <MessageSquare size={18} className="text-amber-500"/> Communication & Contacts
               </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
               {/* Broadcast Tool */}
               <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6">
                  <h4 className="text-xs font-black uppercase text-amber-500 mb-4 flex items-center gap-2"><Siren size={14}/> Diffusion Prioritaire</h4>
                  <textarea 
                    value={commMessage}
                    onChange={(e) => setCommMessage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-300 h-24 mb-4 focus:ring-1 focus:ring-amber-500 outline-none"
                  />
                  <button 
                    onClick={handleBroadcast}
                    disabled={isSending}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"
                  >
                     {isSending ? 'Envoi...' : <><Send size={14}/> Envoyer (SMS + Push)</>}
                  </button>
               </div>

               {/* Key Contacts */}
               <div>
                  <h4 className="text-xs font-black uppercase text-slate-500 mb-4">Contacts Critiques</h4>
                  <div className="space-y-3">
                     {scenario.contacts.map((contact, i) => (
                       <div key={i} className="flex items-center justify-between p-3 bg-slate-800 rounded-xl border border-slate-700">
                          <div>
                             <p className="text-xs font-bold text-slate-200">{contact.name}</p>
                             <p className="text-[10px] text-slate-500 uppercase">{contact.role}</p>
                          </div>
                          <a href={`tel:${contact.phone}`} className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors">
                             <Phone size={14} />
                          </a>
                       </div>
                     ))}
                  </div>
               </div>

               {/* Secure Vote */}
               <div className="p-6 border border-slate-700 rounded-2xl bg-slate-800/50">
                  <div className="flex items-center gap-3 mb-4 text-slate-400">
                     <Lock size={16} />
                     <h4 className="text-xs font-black uppercase">Validation Bureau</h4>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-4">Un vote est requis pour débloquer les fonds d'urgence.</p>
                  <div className="flex gap-2">
                     <button className="flex-1 py-2 bg-emerald-900/30 border border-emerald-500/30 text-emerald-500 rounded-lg text-[10px] font-black uppercase hover:bg-emerald-500 hover:text-white transition-all">Approuver</button>
                     <button className="flex-1 py-2 bg-red-900/30 border border-red-500/30 text-red-500 rounded-lg text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all">Refuser</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ActiveCrisisMode;
