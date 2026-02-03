
import React, { useState } from 'react';
import { Search, Filter, Plus, MapPin, Globe, Landmark, ChevronRight, Phone, Mail, Award, Calendar, X, Save, Handshake } from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  type: string;
  location: string;
  contact: string;
  status: string;
}

const PartnerNetwork: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [partners, setPartners] = useState<Partner[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newPartner, setNewPartner] = useState<Partial<Partner>>({ type: 'Dahira Soeur', status: 'Actif' });

  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartner.name) return;
    
    const partner: Partner = {
      id: Date.now().toString(),
      name: newPartner.name,
      type: newPartner.type || 'Institution',
      location: newPartner.location || 'Dakar',
      contact: newPartner.contact || '',
      status: 'Actif'
    };
    
    setPartners([partner, ...partners]);
    setShowModal(false);
    setNewPartner({ type: 'Dahira Soeur', status: 'Actif' });
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 relative">
      
      {/* ADD PARTNER MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[2rem] p-8 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <Handshake size={24} className="text-slate-600"/> Nouveau Partenaire
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleAddPartner} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">Nom de l'organisation</label>
                <input 
                  required 
                  type="text" 
                  className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-slate-500/20"
                  value={newPartner.name || ''}
                  onChange={e => setNewPartner({...newPartner, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Type</label>
                    <select 
                      className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none"
                      value={newPartner.type}
                      onChange={e => setNewPartner({...newPartner, type: e.target.value})}
                    >
                       <option>Dahira Soeur</option>
                       <option>Institution</option>
                       <option>ONG</option>
                       <option>Entreprise</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Ville / Pays</label>
                    <input 
                      type="text" 
                      className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none"
                      value={newPartner.location || ''}
                      onChange={e => setNewPartner({...newPartner, location: e.target.value})}
                    />
                 </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">Contact (Nom / Tel)</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none"
                  value={newPartner.contact || ''}
                  onChange={e => setNewPartner({...newPartner, contact: e.target.value})}
                />
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                  <Save size={16} /> Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex-1 w-full relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher un Dahira, une ville, un responsable..." 
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] text-sm font-bold shadow-sm focus:ring-4 focus:ring-slate-500/5 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-800 transition-all shadow-sm"><Filter size={20}/></button>
          <button 
            onClick={() => setShowModal(true)}
            className="px-8 py-4 bg-slate-800 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-3 hover:bg-slate-900 transition-all"
          >
            <Plus size={18} /> Nouveau Partenaire
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {partners.length > 0 ? partners.map(partner => (
            <div key={partner.id} className="glass-card p-8 group hover:border-slate-300 transition-all flex flex-col justify-between relative overflow-hidden bg-white">
               <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-slate-100 rounded-2xl text-slate-600 group-hover:bg-slate-800 group-hover:text-white transition-all">
                     <Landmark size={24} />
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase border border-emerald-100">{partner.status}</span>
               </div>
               <div>
                  <h4 className="text-lg font-black text-slate-900 mb-1">{partner.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
                     <MapPin size={10} /> {partner.location}
                  </p>
                  <div className="pt-4 border-t border-slate-50 flex items-center gap-2 text-slate-500 text-xs font-bold">
                     <Phone size={12} /> {partner.contact}
                  </div>
               </div>
            </div>
          )) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
               <Globe size={48} className="mb-4 opacity-20"/>
               <p className="text-xs font-bold uppercase">Aucun partenaire enregistré</p>
               <button onClick={() => setShowModal(true)} className="mt-4 text-slate-600 text-[10px] font-black uppercase hover:underline">Ajouter le premier</button>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-8 bg-white border-slate-100 flex flex-col h-full">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                <Calendar size={18} className="text-slate-600" /> Anniversaires & Événements
              </h4>
              <div className="space-y-6 flex-1 text-center flex items-center justify-center">
                 <p className="text-xs text-slate-400 italic">Aucun événement partenaire.</p>
              </div>
              <button className="w-full mt-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Calendrier Relationnel</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerNetwork;
