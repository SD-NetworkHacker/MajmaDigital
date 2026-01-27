
import React, { useState } from 'react';
import { X, Save, Phone, User, Mail, Plus, MapPin, Crosshair, Loader2, Trash2 } from 'lucide-react';
import { MemberCategory, GlobalRole, CommissionType } from '../types';

interface MemberFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const COMMISSION_ROLES = [
  'Dieuwrine', 'Dieuwrine Adjoint', 'Secrétaire', 'Trésorier', 
  'Chargé d\'Organisation', 'Chargé de Com.', 'Chauffeur', 
  'Animateur', 'Bibliothécaire', 'Membre Actif', 'Observateur'
];

const MemberForm: React.FC<MemberFormProps> = ({ onClose, onSubmit, initialData }) => {
  const [isLocating, setIsLocating] = useState(false);
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    category: initialData?.category || MemberCategory.ETUDIANT,
    level: initialData?.level || '',
    role: initialData?.role || GlobalRole.MEMBRE,
    address: initialData?.address || '',
    coordinates: {
      lat: initialData?.coordinates?.lat || 14.7167,
      lng: initialData?.coordinates?.lng || -17.4677
    },
    commissionAssignments: initialData?.commissions || [] as { type: CommissionType, role_commission: string }[]
  });

  const [tempComm, setTempComm] = useState<CommissionType>(CommissionType.COMMUNICATION);
  const [tempRole, setTempRole] = useState('');

  const addCommission = () => {
    // Check if role is selected and commission not already assigned
    if (tempRole && !formData.commissionAssignments.some((c: any) => c.type === tempComm)) {
      setFormData({
        ...formData,
        commissionAssignments: [...formData.commissionAssignments, { type: tempComm, role_commission: tempRole }]
      });
      setTempRole('');
    }
  };

  const removeCommission = (type: CommissionType) => {
    setFormData({
      ...formData,
      commissionAssignments: formData.commissionAssignments.filter((c: any) => c.type !== type)
    });
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          coordinates: {
            lat: parseFloat(position.coords.latitude.toFixed(6)),
            lng: parseFloat(position.coords.longitude.toFixed(6))
          }
        }));
        setIsLocating(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsLocating(false);
        alert("Impossible de récupérer votre position. Veuillez saisir les coordonnées manuellement.");
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Map assignments to expected format if needed, though structure matches what we set
    const finalData = {
        ...formData,
        commissionAssignments: formData.commissionAssignments.map((ca: any) => ({
            type: ca.type,
            role: ca.role_commission // Adapter key to match what MemberModule expects or ensure types align
        }))
    };
    onSubmit(finalData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200 my-8">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-emerald-50">
          <div>
            <h3 className="text-xl font-bold text-[#2E8B57]">Inscription au Dahira</h3>
            <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest">Nouveau Membre</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white rounded-full transition-colors text-emerald-700"
            aria-label="Fermer le formulaire"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-hide">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Prénom</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                  required 
                  type="text" 
                  value={formData.firstName} 
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} 
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#2E8B57]"
                  aria-label="Prénom" 
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Nom</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                  required 
                  type="text" 
                  value={formData.lastName} 
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} 
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#2E8B57]"
                  aria-label="Nom" 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Email</label>
              <input 
                required 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-[#2E8B57]"
                aria-label="Adresse Email" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Téléphone</label>
              <input 
                required 
                type="tel" 
                value={formData.phone} 
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-[#2E8B57]"
                aria-label="Numéro de téléphone" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Rôle Global</label>
              <select 
                value={formData.role} 
                onChange={(e) => setFormData({ ...formData, role: e.target.value as GlobalRole })} 
                className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#2E8B57]"
                aria-label="Sélectionner le rôle global"
              >
                {Object.values(GlobalRole).map(role => <option key={role} value={role}>{role}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Secteur</label>
              <select 
                value={formData.category} 
                onChange={(e) => setFormData({ ...formData, category: e.target.value as MemberCategory })} 
                className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#2E8B57]"
                aria-label="Sélectionner le secteur d'activité"
              >
                {Object.values(MemberCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <label className="text-[10px] font-black text-[#2E8B57] uppercase ml-1 tracking-widest">Localisation & Adresse</label>
              <button 
                type="button" 
                onClick={handleLocateMe}
                disabled={isLocating}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-[#2E8B57] rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-200 transition-all disabled:opacity-50"
                aria-label="Géolocaliser ma position actuelle"
              >
                {isLocating ? <Loader2 size={12} className="animate-spin" /> : <Crosshair size={12} />}
                {isLocating ? 'Position...' : 'Ma position'}
              </button>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                  type="text" 
                  placeholder="Adresse complète (ex: Plateau, Dakar)..." 
                  value={formData.address} 
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-[#2E8B57]"
                  aria-label="Adresse complète" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase ml-1 tracking-tight">Latitude</label>
                  <input 
                    type="number" 
                    step="any"
                    placeholder="14.7167"
                    value={formData.coordinates.lat} 
                    onChange={(e) => setFormData({ ...formData, coordinates: { ...formData.coordinates, lat: parseFloat(e.target.value) } })} 
                    className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-[#2E8B57]"
                    aria-label="Latitude" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase ml-1 tracking-tight">Longitude</label>
                  <input 
                    type="number" 
                    step="any"
                    placeholder="-17.4677"
                    value={formData.coordinates.lng} 
                    onChange={(e) => setFormData({ ...formData, coordinates: { ...formData.coordinates, lng: parseFloat(e.target.value) } })} 
                    className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-[#2E8B57]"
                    aria-label="Longitude" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label className="text-[10px] font-black text-[#2E8B57] uppercase ml-1 tracking-widest mb-2 block">Affectation aux Commissions</label>
            
            <div className="space-y-2 mb-4">
              {formData.commissionAssignments.map((ca: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-2 bg-emerald-50 rounded-xl border border-emerald-100 animate-in fade-in">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-emerald-800 uppercase">{ca.type}</span>
                    <span className="text-xs font-bold text-emerald-600">{ca.role_commission}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeCommission(ca.type)} 
                    className="p-1 hover:text-red-500 transition-colors"
                    aria-label={`Retirer la commission ${ca.type}`}
                  >
                    <Trash2 size={14}/>
                  </button>
                </div>
              ))}
              {formData.commissionAssignments.length === 0 && (
                <p className="text-[10px] text-gray-400 italic text-center py-2">Aucune commission assignée</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Commission</label>
                <select 
                  value={tempComm} 
                  onChange={(e) => setTempComm(e.target.value as CommissionType)} 
                  className="w-full px-3 py-2.5 bg-gray-100 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                  aria-label="Sélectionner une commission"
                >
                  {Object.values(CommissionType).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Rôle</label>
                <div className="flex gap-2">
                  <select 
                    value={tempRole} 
                    onChange={(e) => setTempRole(e.target.value)} 
                    className="flex-1 px-3 py-2.5 bg-gray-100 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                    aria-label="Sélectionner un rôle dans la commission"
                  >
                    <option value="">Sélectionner...</option>
                    {COMMISSION_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <button 
                    type="button" 
                    onClick={addCommission} 
                    className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" 
                    disabled={!tempRole}
                    aria-label="Ajouter l'affectation à la commission"
                  >
                    <Plus size={16}/>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex gap-3 sticky bottom-0 bg-white pb-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-200 transition-colors"
              aria-label="Annuler l'inscription"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="flex-1 px-4 py-3 bg-[#2E8B57] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              aria-label="Enregistrer le membre"
            >
              <Save size={18} /> Inscrire le membre
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberForm;
