
import React from 'react';
import { GraduationCap, Briefcase, School, User } from 'lucide-react';
import { MemberCategory } from '../../types';

interface SectorBadgeProps {
  category: MemberCategory | string;
  level?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SectorBadge: React.FC<SectorBadgeProps> = ({ category, level, size = 'md', className = '' }) => {
  
  const getConfig = (cat: string) => {
    switch (cat) {
      case MemberCategory.ETUDIANT:
        return {
          icon: GraduationCap,
          styles: 'bg-emerald-50 text-emerald-700 border-emerald-100 group-hover:bg-emerald-100',
          iconColor: 'text-emerald-600'
        };
      case MemberCategory.TRAVAILLEUR:
        return {
          icon: Briefcase,
          styles: 'bg-blue-50 text-blue-700 border-blue-100 group-hover:bg-blue-100',
          iconColor: 'text-blue-600'
        };
      case MemberCategory.ELEVE:
        return {
          icon: School,
          styles: 'bg-amber-50 text-amber-700 border-amber-100 group-hover:bg-amber-100',
          iconColor: 'text-amber-600'
        };
      default:
        return {
          icon: User,
          styles: 'bg-slate-50 text-slate-600 border-slate-100 group-hover:bg-slate-100',
          iconColor: 'text-slate-500'
        };
    }
  };

  const config = getConfig(category);
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[9px] gap-1',
    md: 'px-3 py-1 text-[10px] gap-1.5',
    lg: 'px-4 py-2 text-xs gap-2'
  };

  const iconSizes = {
    sm: 10,
    md: 14,
    lg: 16
  };

  return (
    <div className={`inline-flex items-center rounded-lg border font-black uppercase tracking-widest transition-colors duration-300 ${config.styles} ${sizeClasses[size]} ${className}`}>
      <Icon size={iconSizes[size]} className={config.iconColor} />
      <span>{category}</span>
      {level && (
        <>
          <span className="opacity-30 mx-0.5">|</span>
          <span className="opacity-80 font-bold">{level}</span>
        </>
      )}
    </div>
  );
};

export default SectorBadge;
