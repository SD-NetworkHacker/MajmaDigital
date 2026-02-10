import React, { useState, useEffect } from 'react';
import { Landmark, ShieldAlert, ArrowLeft, Search, Layers, ShieldCheck, Lock } from 'lucide-react';
import { CommissionType } from '../types';
import CommissionLoader from '../commissions/CommissionLoader';
import { INITIAL_COMMISSIONS } from '../constants';
import { useCommissionContext, CommissionProvider } from '../commissions/CommissionContext';

interface CommissionModuleProps {
  defaultView?: CommissionType | null;
}

const CommissionContent: React.FC<{ initialView: CommissionType | null }> = ({ initialView }) => {
  const { activeCommission, setActiveCommission, canEdit, isSupervising } = useCommissionContext();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (initialView) setActiveCommission(initialView);
  }, [initialView, setActiveCommission]);

  if (activeCommission) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 pb-20">
        
        {/* BANDEAU SUPERVISION SG */}
        {isSupervising && (
          <div className="bg-amber-50 border-2 border-amber-200 p-5 rounded-[1.5rem] flex items-center justify-between shadow-sm animate-in slide-in-from-top-4">
             <div className="flex items-center gap-4">
                <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
                    <ShieldAlert size={24}/>
                </div>
                <div>
                   <p className="text-xs font-black text-amber-800 uppercase tracking-widest">Mode Supervision - Secrétariat Général</p>
                   <p className="text-[10px] text-amber-600 font-bold uppercase mt-0.5">Consultation en lecture seule activée pour ce pôle.</p>
                </div>
             </div>
             <button onClick={() => setActiveCommission(null)} className="px-4 py-2 bg-white text-amber-700 rounded-xl text-[9px] font-black uppercase border border-amber-200 hover:bg-amber-100 transition-colors">Fermer</button>
          </div>
        )}

        <div className="flex items-center gap-4 bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm sticky top-0 z-30">
          <button onClick={() => setActiveCommission(null)} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 hover:text-slate-900 transition-all">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
             <h2 className="text-2xl font-black text-slate-900 tracking-tight">{activeCommission}</h2>
             <div className="flex items-center gap-2 mt-0.5">
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${canEdit ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                   {canEdit ? 'Accès Édition Total' : 'Consultation Seule'}
                </span>
                {!canEdit && <Lock size={10} className="text-slate-400" />}
             </div>
          </div>
        </div>

        {/* Le loader injecte dynamiquement le module du dossier /commissions/ */}
        <div className={!canEdit ? 'pointer-events-none-readonly' : ''}>
            <CommissionLoader type={activeCommission} />
        </div>

        <style>{`
            .pointer-events-none-readonly button:not(.btn-view), 
            .pointer-events-none-readonly input,
            .pointer-events-none-readonly select {
                display: none !important;
            }
            .pointer-events-none-readonly .can-view-only {
                display: block !important;
                pointer-events: auto !important;
            }
        `}</style>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Pôles & <span className="text-emerald-600">Commissions</span></h2>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-3 flex items-center gap-2">
            <Layers size={14} className="text-emerald-500" /> Structure Institutionnelle du Dahira
          </p>
        </div>
      </div>

      <div className="relative group max-w-xl">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Filtrer les commissions..." 
          className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] text-sm font-bold shadow-sm focus:ring-4 focus:ring-emerald-500/5 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-20">
        {INITIAL_COMMISSIONS.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((comm, i) => (
          <div 
            key={i} 
            onClick={() => setActiveCommission(comm.name)}
            className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-emerald-200 hover:shadow-2xl transition-all duration-500 cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 font-arabic text-8xl pointer-events-none group-hover:scale-110 transition-transform">م</div>
            <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl w-fit mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
              <Landmark size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3">{comm.name}</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2 mb-8">{comm.description}</p>
            <div className="pt-6 border-t border-slate-50 flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
               <span>{comm.memberCount} Participants</span>
               <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                  <ChevronRight size={18} />
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CommissionModule: React.FC<CommissionModuleProps> = ({ defaultView = null }) => (
  <CommissionProvider>
    <CommissionContent initialView={defaultView} />
  </CommissionProvider>
);

export default CommissionModule;
const ChevronRight = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;