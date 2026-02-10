import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, MapPin, ChevronRight, Filter, Users, 
  LayoutGrid, List, Trash2, CheckCircle, 
  FileSpreadsheet, Briefcase, GraduationCap, School, Eye, Activity,
  Square, CheckSquare, X, Smartphone, Mail
} from 'lucide-react';
import { MemberCategory, GlobalRole, Member } from '../types';
import MemberForm from './MemberForm';
import { useData } from '../contexts/DataContext';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface MemberModuleProps {
  onViewProfile?: (memberId: string) => void;
}

const MemberModule: React.FC<MemberModuleProps> = ({ onViewProfile }) => {
  const { members, addMember, isLoading } = useData();
  const { isMobile } = useMediaQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(isMobile ? 'grid' : 'list');
  const [categoryFilter, setCategoryFilter] = useState('Tous les secteurs');
  const [roleFilter, setRoleFilter] = useState('Tous les rôles');

  const filteredMembers = useMemo(() => {
    const lowerSearchTerm = (searchTerm || '').toLowerCase().trim();
    return (members || []).filter(member => {
      const matchesCategory = categoryFilter === 'Tous les secteurs' || member.category === categoryFilter;
      const matchesRole = roleFilter === 'Tous les rôles' || member.role === roleFilter;
      if (!matchesCategory || !matchesRole) return false;
      if (!lowerSearchTerm) return true;
      
      const firstName = (member.firstName || '').toLowerCase();
      const lastName = (member.lastName || '').toLowerCase();
      const matricule = (member.matricule || '').toLowerCase();
      
      return firstName.includes(lowerSearchTerm) || 
             lastName.includes(lowerSearchTerm) || 
             matricule.includes(lowerSearchTerm);
    });
  }, [searchTerm, categoryFilter, roleFilter, members]);

  const handleViewProfile = (id: string) => {
    if (onViewProfile) onViewProfile(id);
  };

  const getCategoryIcon = (cat: string) => {
      switch(cat) {
          case MemberCategory.ETUDIANT: return <GraduationCap size={14}/>;
          case MemberCategory.ELEVE: return <School size={14}/>;
          default: return <Briefcase size={14}/>;
      }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {showForm && (
        <MemberForm onClose={() => setShowForm(false)} onSubmit={(data) => { addMember(data); setShowForm(false); }} />
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Registre</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
            <Users size={12} className="text-emerald-500" /> {(members || []).length} Talibés inscrits
          </p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto px-6 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95"
        >
          <Plus size={16} /> Inscrire Membre
        </button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500/10 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
           <select 
             value={roleFilter} 
             onChange={(e) => setRoleFilter(e.target.value)}
             className="px-4 py-2.5 bg-slate-50 rounded-xl text-[10px] font-black uppercase text-slate-600 outline-none min-w-[140px]"
           >
              <option>Tous les rôles</option>
              {Object.values(GlobalRole).map(r => <option key={r} value={r}>{r}</option>)}
           </select>
           {!isMobile && (
              <div className="flex bg-slate-100 p-1 rounded-xl">
                 <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400'}`}><LayoutGrid size={16}/></button>
                 <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400'}`}><List size={16}/></button>
              </div>
           )}
        </div>
      </div>

      <div className={viewMode === 'grid' || isMobile ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "bg-white rounded-2xl border border-slate-100 overflow-hidden"}>
        {filteredMembers.map(member => (
          <div 
            key={member.id}
            onClick={() => handleViewProfile(member.id)}
            className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
             <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-lg shadow-inner uppercase">
                      {(member.firstName || 'U')[0]}{(member.lastName || '')[0]}
                   </div>
                   <div>
                      <h4 className="font-black text-slate-900 leading-tight">{member.firstName} {member.lastName}</h4>
                      <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase">{member.matricule}</p>
                   </div>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg text-slate-300">
                   <Smartphone size={16} />
                </div>
             </div>
             
             <div className="flex flex-wrap gap-2 mb-6">
                <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-2 text-[9px] font-black uppercase text-slate-500">
                   {getCategoryIcon(member.category)} {member.category}
                </div>
                <div className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-2 text-[9px] font-black uppercase text-emerald-600">
                   <CheckCircle size={10} /> {member.role}
                </div>
             </div>

             <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <div className="flex gap-2">
                   <button className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-emerald-600 transition-colors"><Smartphone size={14}/></button>
                   <button className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-colors"><Mail size={14}/></button>
                </div>
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Voir Profil</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberModule;