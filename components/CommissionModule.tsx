
import React, { useState, useMemo } from 'react';
import { INITIAL_COMMISSIONS } from '../constants';
import { 
  Landmark, ArrowRight, Shield, ShieldCheck, 
  Zap, Layers, Search, Users, ArrowLeft
} from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'my'>('all');

  // Mock: Memberships de l'utilisateur courant (à remplacer par le vrai profil user)
  const currentUserMembership = [CommissionType.ADMINISTRATION, CommissionType.COMMUNICATION];
  
  const isUserMember = (type: CommissionType) => currentUserMembership.includes(type);

  // Filtrage des commissions
  const filteredCommissions = useMemo(() => {
    return INITIAL_COMMISSIONS.filter(comm => {
      const matchesSearch = comm.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            comm.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterMode === 'all' || isUserMember(comm.name);
      
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filterMode]);

  // Mapping des styles par couleur pour Tailwind (PurgeCSS safe)
  const colorMap: Record<string, { bg: string, text: string }> = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-600' },
    cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600' },
    teal: { bg: 'bg-teal-50', text: 'text-teal-600' },
    slate: { bg: 'bg-slate-50', text: 'text-slate-600' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
  };

  // VUE DÉTAILLÉE (DASHBOARD COMMISSION)
  if (viewDetail) {
    const userIsMember = isUserMember(viewDetail);
    const config = COMMISSION_REGISTRY[viewDetail] || { color: 'slate', icon: Landmark };
    const Icon = config.icon;

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        {selectedCommissionForPerms && (
           <CommissionPermissions commissionType={selectedCommissionForPerms} onClose={() => setSelectedCommissionForPerms(null)} />
        )}
        
        {/* Navigation Header avec Bouton Retour Animé */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              onClick={() => setViewDetail(null)} 
              className="group flex items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-md active:scale-95 transition-all duration-300"
              title="Retour à la liste"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
            </button>
            
            <div className="flex items-center gap-4 flex-1">
               <div className={`p-3 rounded-2xl bg-${config.color}-50 text-${config.color}-600 hidden sm:block`}>
                  <Icon size={24} />
               </div>
               <div>
                  <h2 className="text-lg md:text-2xl font-black text-slate-900 tracking-tight leading-none">{viewDetail}</h2>
                  <div className="flex items-center gap-3 mt-1">
                     <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${userIsMember ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {userIsMember ? <ShieldCheck size={10} /> : <Shield size={10} />}
                        {userIsMember ? 'Accès Membre' : 'Mode Consultation'}
                     </span>
                  </div>
               </div>
            </div>
          </div>

          {userIsMember && (
             <button 
               onClick={() => setSelectedCommissionForPerms(viewDetail)} 
               className="w-full md:w-auto px-5 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95"
             >
               <Shield size={14} /> Gérer les Droits
             </button>
           )}
        </div>

        {/* Dynamic Commission Loader */}
        <div className="min-h-[600px]">
          <CommissionLoader type={viewDetail} />
        </div>
      </div>
    );
  }

  // VUE PRINCIPALE (GRILLE STYLE MAQUETTE)
  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
          <nav className="flex items-center gap-2 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <Landmark size={12} /> Structure Institutionnelle
          </nav>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
            Pôles & <span className="text-emerald-600">Commissions</span>
          </h2>
          <div className="flex items-center gap-2 mt-3 text-amber-500 font-bold text-xs uppercase tracking-[0.2em]">
             <Zap size={14} className="fill-current" /> Architecture Unifiée du Dahira
          </div>
        </div>

        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 px-5 py-3 rounded-2xl shadow-sm">
           <Layers size={18} className="text-emerald-600" />
           <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">
             {currentUserMembership.length} Affectations Actives
           </span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 w-full bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher une commission..." 
              className="w-full pl-14 pr-6 py-4 bg-transparent border-none text-sm font-bold outline-none text-slate-700 placeholder-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem]">
            <button 
              onClick={() => setFilterMode('all')}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filterMode === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Toutes
            </button>
            <button 
              onClick={() => setFilterMode('my')}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filterMode === 'my' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Mes Pôles
            </button>
          </div>
      </div>

      {/* Grid des Commissions Style Clean */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredCommissions.map((commission, i) => {
          const config = COMMISSION_REGISTRY[commission.name] || { color: 'slate', icon: Landmark };
          const Icon = config.icon;
          const isMember = isUserMember(commission.name);
          const styles = colorMap[config.color] || colorMap['slate'];

          return (
            <div 
              key={i} 
              onClick={() => setViewDetail(commission.name)} 
              className="group relative bg-white rounded-[2.5rem] p-8 border border-slate-100 hover:border-slate-200 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 cursor-pointer flex flex-col h-full min-h-[340px] overflow-hidden"
            >
              {/* Background Glow on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br from-white to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <div className="relative z-10 flex flex-col h-full">
                  {/* Top Row: Icon & Status */}
                  <div className="flex justify-between items-start mb-8">
                     <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm ${styles.bg} ${styles.text}`}>
                        <Icon size={36} strokeWidth={1.5} />
                     </div>
                     
                     <div className="flex flex-col items-end gap-2">
                        <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm flex items-center gap-1.5">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                           Actif
                        </span>
                     </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-emerald-900 transition-colors leading-tight">
                      {commission.name}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-3 group-hover:text-slate-600">
                      "{commission.description}"
                    </p>
                  </div>

                  {/* Footer Info */}
                  <div className="pt-8 mt-auto flex items-center justify-between border-t border-slate-50 group-hover:border-slate-100 transition-colors">
                     {isMember ? (
                        <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50/50 px-3 py-1.5 rounded-xl border border-emerald-100/50">
                           <ShieldCheck size={14} />
                           <span className="text-[9px] font-black uppercase tracking-widest">Accès Bureau</span>
                        </div>
                     ) : (
                        <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-600 transition-colors">
                           <Users size={16} />
                           <span className="text-[10px] font-black uppercase tracking-widest">{commission.memberCount || 0} Membres</span>
                        </div>
                     )}
                     
                     <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 bg-slate-50 text-slate-300 group-hover:bg-slate-900 group-hover:text-white group-hover:shadow-lg group-hover:scale-110">
                        <ArrowRight size={20} className="-ml-0.5" />
                     </div>
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
