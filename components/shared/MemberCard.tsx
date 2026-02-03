
import React from 'react';
import { Phone, Mail, ChevronRight, MoreHorizontal, ShieldCheck } from 'lucide-react';
import { Member } from '../../types';
import SectorBadge from './SectorBadge';

interface MemberCardProps {
  member: Member;
  onViewProfile?: () => void;
  onContact?: (method: 'phone' | 'email' | 'whatsapp') => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onViewProfile, onContact }) => {
  return (
    <div 
      className="group relative bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-emerald-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={onViewProfile}
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] -mr-6 -mt-6 transition-all group-hover:bg-emerald-50"></div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="relative">
            {member.status === 'active' && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full z-10"></span>
            )}
            <div className="w-16 h-16 rounded-2xl bg-slate-100 border-2 border-white shadow-md flex items-center justify-center text-slate-400 font-black text-xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
              {/* Fallback Initials if no image (image support to be added to type later) */}
              {member.firstName[0]}{member.lastName[0]}
            </div>
          </div>
          <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Info */}
        <div className="mb-4">
          <h4 className="text-lg font-black text-slate-900 leading-tight mb-1 group-hover:text-emerald-800 transition-colors">
            {member.firstName} {member.lastName}
          </h4>
          <p className="text-[10px] text-slate-400 font-mono mb-3">{member.matricule}</p>
          <SectorBadge category={member.category} level={member.level} size="sm" />
        </div>

        {/* Commissions */}
        <div className="flex-1">
          <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">Engagements</p>
          <div className="flex flex-wrap gap-1.5">
            {member.commissions.length > 0 ? (
              member.commissions.slice(0, 2).map((comm, i) => (
                <span key={i} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-md text-[9px] font-bold text-slate-600 flex items-center gap-1">
                  <ShieldCheck size={10} className="text-emerald-500"/>
                  {comm.type}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-slate-400 italic">Aucune commission</span>
            )}
            {member.commissions.length > 2 && (
              <span className="px-2 py-1 bg-slate-50 rounded-md text-[9px] font-bold text-slate-400">+{member.commissions.length - 2}</span>
            )}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between gap-2">
          <div className="flex gap-1">
            <button 
              onClick={(e) => { e.stopPropagation(); onContact?.('phone'); }}
              className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
            >
              <Phone size={14} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onContact?.('email'); }}
              className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <Mail size={14} />
            </button>
          </div>
          <button className="pl-3 pr-2 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-600 transition-all active:scale-95">
            Profil <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
