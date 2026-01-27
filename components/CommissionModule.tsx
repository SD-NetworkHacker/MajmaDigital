
import React, { useState } from 'react';
import { INITIAL_COMMISSIONS } from '../constants';
import { Landmark, ArrowRight, Shield, ShieldCheck, ChevronLeft, ChevronRight, Zap, Layers } from 'lucide-react';
import { CommissionType, Member, Event } from '../types';
import CommissionPermissions from './CommissionPermissions';
import CommissionLoader from '../commissions/CommissionLoader';
import { COMMISSION_REGISTRY } from '../commissions/CommissionRegistry';

interface CommissionModuleProps {
  members: Member[];
  events: Event[];
}

const CommissionModule: React.FC<CommissionModuleProps> = ({ members, events }) => {
  const [viewDetail, setViewDetail] = useState<CommissionType | null>(null);
  const [selectedCommissionForPerms, setSelectedCommissionForPerms] = useState<CommissionType | null>(null);

  const currentUserMembership = [CommissionType.ADMINISTRATION, CommissionType.COMMUNICATION];
  const isUserMember = (type: CommissionType) => currentUserMembership.includes(type);

  if (viewDetail) {
    const userIsMember = isUserMember(viewDetail);
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-500">
        {selectedCommissionForPerms && (
           <CommissionPermissions commissionType={selectedCommissionForPerms} onClose={() => setSelectedCommissionForPerms(null)} />
        )}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setViewDetail(null)} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 shadow-sm active:scale-95 transition-all">
              <ChevronLeft size={20} />
            </button>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{viewDetail}</h2>
              <div className="flex items-center gap-3 mt-1">
                 <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${userIsMember ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {userIsMember ? 'Accès Membre' : 'Mode Consultation'}
                 </span>
                 {userIsMember && (
                   <button onClick={() => setSelectedCommissionForPerms(viewDetail)} className="text-[8px] font-black text-emerald-600 hover:underline uppercase flex items-center gap-1">
                     <Shield size={10} /> Droits
                   </button>
                 )}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white/30 rounded-[2rem] min-h-[400px]">
          <CommissionLoader type={viewDetail} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <nav className="flex items-center gap-2 mb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
            <Landmark size={10} /> Structure Institutionnelle
          </nav>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
            Pôles & <span className="text-emerald-600">Commissions</span>
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4 flex items-center gap-2">
            <Zap size={14} className="text-amber-500 animate-pulse" /> Architecture unifiée du Dahira
          </p>
        </div>
        <div className="px-5 py-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-[9px] font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2 shadow-sm">
          <Layers size={14} /> {currentUserMembership.length} Affectations Actives
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {INITIAL_COMMISSIONS.map((commission, i) => {
          const config = COMMISSION_REGISTRY[commission.name] || { color: 'slate', icon: Landmark, gradient: 'from-slate-600 to-slate-900' };
          const Icon = config.icon;
          const isMember = isUserMember(commission.name);

          return (
            <div key={i} onClick={() => setViewDetail(commission.name)} className="glass-card p-6 cursor-pointer group flex flex-col h-full min-h-[320px] relative overflow-hidden">
              <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-5 rounded-full transition-all duration-700`}></div>
              
              <div className="flex justify-between items-start mb-6 shrink-0">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                  isMember ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-400'
                } group-hover:scale-110 group-hover:rotate-3 shadow-inner`}>
                  {isMember ? <ShieldCheck size={28} /> : <Icon size={28} />}
                </div>
                {isMember && <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg text-[7px] font-black uppercase border border-emerald-100">Actif</span>}
              </div>
              
              <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">{commission.name}</h3>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed flex-1 opacity-80 mb-6 italic">"{commission.description}"</p>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between shrink-0">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{commission.dieuwrine}</span>
                <div className="p-2 bg-slate-900 text-white rounded-lg transition-transform group-hover:translate-x-1">
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommissionModule;