
import React, { useEffect, useRef, useState } from 'react';
import { 
  MapPin, Search, Navigation, Sparkles, Loader2, Info, Crosshair, 
  Map as MapIcon, X, ChevronRight, Filter, Layers, Briefcase, 
  GraduationCap, School, User, List, ShieldCheck, Phone, Mail, 
  Clock, MapPinned, ExternalLink 
} from 'lucide-react';
import { getMapsLocationInfo } from '../services/geminiService';
import { MemberCategory, Member } from '../types';

declare const L: any;

interface MemberMapModuleProps {
  members: Member[];
}

const MemberMapModule: React.FC<MemberMapModuleProps> = ({ members }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any>({});
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [locationInsight, setLocationInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  // Initialisation de la carte
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        scrollWheelZoom: false, // Désactivé par défaut pour ne pas bloquer le scroll page
        fadeAnimation: true,
        attributionControl: false
      }).setView([14.7167, -17.4677], 12);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapRef.current);
      
      // Ajout contrôles de zoom manuels
      L.control.zoom({
        position: 'bottomright'
      }).addTo(mapRef.current);
    }

    const createIcon = (isSelected: boolean) => L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="relative flex items-center justify-center group cursor-pointer">
          <div class="absolute ${isSelected ? 'w-16 h-16 bg-emerald-500/20' : 'w-0 h-0 group-hover:w-10 group-hover:h-10 bg-emerald-500/10'} rounded-full transition-all duration-300"></div>
          <div class="absolute ${isSelected ? 'w-10 h-10 bg-emerald-500/30' : 'w-0 h-0 group-hover:w-6 group-hover:h-6 bg-emerald-500/20'} rounded-full animate-pulse"></div>
          <div class="relative ${isSelected ? 'w-8 h-8 bg-emerald-600 border-[3px] scale-110 z-20' : 'w-4 h-4 bg-[#2E8B57] border-2 group-hover:scale-125 z-10'} border-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center">
            ${isSelected ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    // Nettoyage des marqueurs existants
    Object.values(markersRef.current).forEach((m: any) => mapRef.current.removeLayer(m));
    markersRef.current = {};

    // Filtrage
    const filtered = members.filter(m => {
      const matchesSearch = `${m.firstName} ${m.lastName} ${m.address}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === 'Tous' || m.category === activeFilter;
      return matchesSearch && matchesFilter;
    });

    // Ajout des marqueurs
    const bounds = L.latLngBounds([]);
    filtered.forEach(member => {
      const isSelected = selectedMember?.id === member.id;
      const marker = L.marker([member.coordinates.lat, member.coordinates.lng], { 
        icon: createIcon(isSelected) 
      }).addTo(mapRef.current);
      
      markersRef.current[member.id] = marker;
      bounds.extend([member.coordinates.lat, member.coordinates.lng]);

      marker.on('click', () => {
        handleGetInsight(member);
      });
    });

    // Ajustement de la vue (seulement si pas de sélection active pour éviter le saut)
    if (filtered.length > 0 && mapRef.current && !selectedMember) {
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }

  }, [searchTerm, activeFilter, selectedMember?.id, members]);

  const handleGetInsight = async (member: Member) => {
    setSelectedMember(member);
    
    // Switcher sur la vue carte sur mobile si on clique dans la liste
    if (window.innerWidth < 1024) {
      setViewMode('map');
    }

    if (mapRef.current) {
      mapRef.current.flyTo([member.coordinates.lat, member.coordinates.lng], 16, {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }

    // Appel IA simulé/réel
    setIsLoadingInsight(true);
    setLocationInsight(null);
    const query = `Identifie les mosquées et centres d'intérêt pour un membre vivant à "${member.address}" et donne 3 conseils de fraternité locale pour ce talibé au sein du Dahira.`;
    const result = await getMapsLocationInfo(query, member.coordinates.lat, member.coordinates.lng);
    setLocationInsight(result.text);
    setIsLoadingInsight(false);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case MemberCategory.ELEVE: return <School size={14} />;
      case MemberCategory.ETUDIANT: return <GraduationCap size={14} />;
      case MemberCategory.TRAVAILLEUR: return <Briefcase size={14} />;
      default: return <User size={14} />;
    }
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch = `${m.firstName} ${m.lastName} ${m.address}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'Tous' || m.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    // Utilisation de h-[calc(100dvh-120px)] pour occuper l'espace restant sans dépasser
    <div className="flex flex-col h-[calc(100dvh-120px)] min-h-[500px] animate-in fade-in duration-500">
      
      {/* Header Filtres & Recherche - Fixe en haut */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6 shrink-0">
        <div className="flex-1 w-full relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher par zone, nom ou matricule..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200/60 rounded-[1.5rem] text-sm font-bold shadow-sm focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
          />
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200/60 w-full lg:w-auto overflow-x-auto no-scrollbar">
           {['Tous', MemberCategory.TRAVAILLEUR, MemberCategory.ETUDIANT, MemberCategory.ELEVE].map(f => (
              <button 
                key={f} 
                onClick={() => setActiveFilter(f)} 
                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeFilter === f ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-emerald-600 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
        </div>

        {/* Toggle Mobile Vue */}
        <div className="lg:hidden flex bg-white p-1.5 rounded-2xl border border-slate-200/60 w-full">
            <button 
              onClick={() => setViewMode('list')}
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${viewMode === 'list' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400'}`}
            >
              <List size={16} /> Liste
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${viewMode === 'map' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400'}`}
            >
              <MapIcon size={16} /> Carte
            </button>
        </div>
      </div>

      {/* Conteneur Principal - Grille Map/List */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        
        {/* Colonne Carte (Prenant plus de place sur desktop) */}
        <div className={`lg:col-span-8 xl:col-span-9 relative rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-xl bg-slate-100 h-full transition-all duration-500 ${viewMode === 'list' ? 'hidden lg:block' : 'block'}`}>
          <div ref={mapContainerRef} className="w-full h-full z-0 grayscale-[0.1]"></div>
          
          {/* Overlay Contrôle Zoom Warning (si scroll) */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-[10px] font-bold text-slate-500 shadow-sm border border-slate-100 pointer-events-none z-[400] hidden lg:block">
            Utilisez Ctrl + Scroll pour zoomer
          </div>

          {/* Detailed Profile Overlay (Desktop Floating Panel) */}
          {selectedMember && (
            <div className="absolute top-6 right-6 bottom-6 w-96 z-[1000] animate-in slide-in-from-right-8 duration-500 hidden lg:flex">
              <MemberDetailPanel 
                member={selectedMember} 
                insight={locationInsight} 
                isLoading={isLoadingInsight} 
                onClose={() => setSelectedMember(null)} 
              />
            </div>
          )}
        </div>

        {/* Colonne Liste (Sidebar) */}
        <div className={`lg:col-span-4 xl:col-span-3 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden ${viewMode === 'map' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 backdrop-blur-sm sticky top-0 z-10 shrink-0">
             <div className="flex justify-between items-center">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <MapPinned size={14} /> Résultats
               </h3>
               <span className="text-[10px] font-black text-white bg-emerald-600 px-3 py-1 rounded-full shadow-sm shadow-emerald-200">{filteredMembers.length}</span>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
            {filteredMembers.map(m => (
                <button 
                  key={m.id} 
                  onClick={() => handleGetInsight(m)} 
                  className={`w-full p-4 rounded-2xl text-left transition-all flex items-start gap-4 border ${
                    selectedMember?.id === m.id 
                      ? 'bg-emerald-50 border-emerald-200 shadow-sm' 
                      : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-all shadow-sm ${
                    selectedMember?.id === m.id ? 'bg-emerald-600 text-white scale-110 rotate-3' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {m.firstName[0]}{m.lastName[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-black truncate leading-tight mb-1 ${selectedMember?.id === m.id ? 'text-emerald-900' : 'text-slate-800'}`}>
                      {m.firstName} {m.lastName}
                    </p>
                    <div className="flex items-center gap-2 opacity-80 mb-1">
                      {getCategoryIcon(m.category)}
                      <span className="text-[9px] font-bold uppercase tracking-wide">{m.category}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                      <MapPin size={10} /> {m.address}
                    </p>
                  </div>
                  <ChevronRight size={14} className={`shrink-0 self-center transition-all ${selectedMember?.id === m.id ? 'text-emerald-600 translate-x-1' : 'text-slate-200'}`} />
                </button>
            ))}
            {filteredMembers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                <MapIcon size={40} className="text-slate-300 mb-4" />
                <p className="text-xs font-bold text-slate-400">Aucun membre trouvé</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet Profile (Slide Up) */}
      {selectedMember && (
        <div className="lg:hidden fixed inset-0 z-[1500] flex flex-col justify-end">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setSelectedMember(null)}></div>
           <div className="relative bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] h-[85dvh] overflow-hidden animate-in slide-in-from-bottom-full duration-500">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full z-20"></div>
              <MemberDetailPanel 
                  member={selectedMember} 
                  insight={locationInsight} 
                  isLoading={isLoadingInsight} 
                  onClose={() => setSelectedMember(null)} 
                />
           </div>
        </div>
      )}
    </div>
  );
};

// Internal Component for Detail View
const MemberDetailPanel: React.FC<{ 
  member: Member; 
  insight: string | null; 
  isLoading: boolean; 
  onClose: () => void;
}> = ({ member, insight, isLoading, onClose }) => {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header Profile with Pattern */}
      <div className="p-8 bg-slate-900 text-white relative shrink-0">
        <div className="absolute top-0 right-0 p-10 opacity-5 font-arabic text-9xl select-none rotate-12 pointer-events-none">م</div>
        
        <div className="relative z-10 flex justify-between items-start mb-6">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-[1.5rem] border border-white/10 flex items-center justify-center text-white font-black text-2xl shadow-inner">
            {member.firstName[0]}{member.lastName[0]}
          </div>
          <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/60 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="relative z-10">
          <h3 className="text-2xl font-black mb-1 leading-tight">{member.firstName} {member.lastName}</h3>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck size={12} /> {member.role}
             </div>
             <span className="text-[10px] text-slate-400 font-mono">{member.matricule}</span>
          </div>
        </div>
      </div>

      {/* Profile Details Scroll Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-slate-50/30">
        {/* Vital Info */}
        <section className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">Coordonnées</h4>
          <div className="grid grid-cols-1 gap-3">
             <a href={`tel:${member.phone}`} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-emerald-200 group">
                <div className="p-2.5 bg-slate-50 rounded-xl text-emerald-600 group-hover:bg-emerald-50 transition-colors"><Phone size={16} /></div>
                <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Téléphone</p>
                   <p className="text-sm font-bold text-slate-800">{member.phone}</p>
                </div>
             </a>
             <a href={`mailto:${member.email}`} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-blue-200 group">
                <div className="p-2.5 bg-slate-50 rounded-xl text-blue-600 group-hover:bg-blue-50 transition-colors"><Mail size={16} /></div>
                <div className="min-w-0 flex-1">
                   <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Email</p>
                   <p className="text-sm font-bold text-slate-800 truncate">{member.email}</p>
                </div>
             </a>
          </div>
        </section>

        {/* Location Verification */}
        <section className="space-y-4">
           <div className="flex justify-between items-center">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zone Géographique</h4>
             <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg flex items-center gap-1"><Crosshair size={10}/> GPS Exact</span>
           </div>
           <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-slate-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>
              <div className="flex items-start gap-4 relative z-10">
                 <div className="p-2 bg-slate-100 rounded-xl text-slate-600 mt-1"><MapPin size={18} /></div>
                 <div>
                    <p className="text-sm font-bold text-slate-800 leading-tight">{member.address}</p>
                    <div className="flex items-center gap-2 mt-2">
                       <Navigation size={12} className="text-slate-400" />
                       <span className="text-[10px] font-mono text-slate-500">{member.coordinates.lat.toFixed(5)}, {member.coordinates.lng.toFixed(5)}</span>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Gemini AI Context */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-700">
            <Sparkles size={16} />
            <h4 className="text-[10px] font-black uppercase tracking-widest">Dahira Intelligence (IA)</h4>
          </div>
          
          <div className="relative group">
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-4 bg-emerald-50/30 rounded-3xl border border-dashed border-emerald-200">
                <Loader2 size={24} className="text-emerald-500 animate-spin" />
                <p className="text-[10px] font-black text-emerald-700/60 uppercase animate-pulse">Analyse du quartier...</p>
              </div>
            ) : (
              <div className="p-6 bg-gradient-to-br from-emerald-50 to-white rounded-3xl border border-emerald-100 text-[12px] text-slate-600 leading-relaxed font-medium shadow-sm">
                {insight ? insight : "Aucune donnée contextuelle disponible."}
              </div>
            )}
          </div>
        </section>

        {/* Member Category Card */}
        <section className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-white rounded-2xl text-slate-400 shadow-sm">
                {member.category === MemberCategory.TRAVAILLEUR ? <Briefcase size={20} /> : <GraduationCap size={20} />}
             </div>
             <div>
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Profil Sectoriel</p>
                <p className="text-sm font-black text-slate-800">{member.category}</p>
             </div>
          </div>
          <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg"><Clock size={16} /></div>
        </section>
        
        {/* Bottom Padding for scroll */}
        <div className="h-4"></div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-slate-100 bg-white shrink-0">
        <button className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95">
          <ExternalLink size={16} /> Ouvrir Dossier Complet
        </button>
      </div>
    </div>
  );
};

export default MemberMapModule;
