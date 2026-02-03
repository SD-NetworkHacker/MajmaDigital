
import React from 'react';
import { Users, ChevronRight, Shield, ShieldCheck, Activity } from 'lucide-react';
import { CommissionType } from '../../types';

interface CommissionCardProps {
  name: CommissionType;
  memberCount: number;
  description: string;
  isMember?: boolean;
  status?: 'active' | 'inactive';
  color?: string; // Tailwind color name like 'emerald', 'blue', etc.
  onClick?: () => void;
}

const CommissionCard: React.FC<CommissionCardProps> = ({ 
  name, 
  memberCount, 
  description, 
  isMember = false, 
  status = 'active',
  color = 'slate',
  onClick 
}) => {
  
  // Mapping dynamique des couleurs
  const colorClasses: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
    blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
    amber: 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white',
    purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
    rose: 'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white',
    slate: 'bg-slate-100 text-slate-600 group-hover:bg-slate-800 group-hover:text-white',
    indigo: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white',
    orange: 'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white',
    teal: 'bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white',
    cyan: 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white',
  };

  const selectedColorClass = colorClasses[color] || colorClasses.slate;

  return (
    <div 
      onClick={onClick}
      className="group relative bg-white rounded-[2rem] p-8 border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 cursor-pointer flex flex-col h-full overflow-hidden"
    >
      {/* Status Dot */}
      <div className="absolute top-6 right-6 flex items-center gap-2">
        <span className={`flex h-3 w-3 ${status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'} rounded-full`}>
          {status === 'active' && <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75"></span>}
        </span>
      </div>

      <div className="mb-6">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 mb-6 shadow-sm ${selectedColorClass}`}>
          <Activity size={32} strokeWidth={1.5} />
        </div>
        
        <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight group-hover:text-slate-700">
          {name}
        </h3>
        
        <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-600 transition-colors">
          <Users size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">{memberCount} Membres</span>
        </div>

        {isMember ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-widest border border-emerald-100">
            <ShieldCheck size={12} /> Membre
          </span>
        ) : (
          <button className={`p-2 rounded-full bg-slate-50 text-slate-400 transition-all group-hover:scale-110 group-hover:bg-${color}-50 group-hover:text-${color}-600`}>
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CommissionCard;
