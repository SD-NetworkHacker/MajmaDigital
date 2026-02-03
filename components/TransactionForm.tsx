
import React, { useState, useEffect } from 'react';
import { X, Save, DollarSign, Calendar, User, Tag, Trash2 } from 'lucide-react';
import { Member, Contribution } from '../types';

interface TransactionFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  members: Member[];
  initialData?: Contribution | null;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, onSubmit, members, initialData }) => {
  const [formData, setFormData] = useState({
    memberId: '',
    type: 'Adiyas',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    eventLabel: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        memberId: initialData.memberId,
        type: initialData.type,
        amount: initialData.amount.toString(),
        date: initialData.date,
        eventLabel: initialData.eventLabel || ''
      });
    } else if (members.length > 0) {
      setFormData(prev => ({ ...prev, memberId: members[0].id }));
    }
  }, [initialData, members]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-emerald-50/50">
          <div>
            <h3 className="text-xl font-black text-[#2E8B57]">{initialData ? 'Modifier Transaction' : 'Nouvelle Contribution'}</h3>
            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-1">Saisie Trésorerie</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-emerald-700">
            <X size={20} />
          </button>
        </div>

        <form className="p-8 space-y-5" onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Membre Donateur</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <select 
                required 
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-[#2E8B57] appearance-none"
                value={formData.memberId}
                onChange={(e) => setFormData({...formData, memberId: e.target.value})}
              >
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.firstName} {m.lastName} ({m.matricule})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Type</label>
              <select 
                className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-[#2E8B57]"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option>Adiyas</option>
                <option>Sass</option>
                <option>Diayanté</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Date</label>
              <input 
                required 
                type="date" 
                className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-[#2E8B57]"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Montant (FCFA)</label>
            <div className="relative">
              <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input 
                required 
                type="number" 
                placeholder="Ex: 50000" 
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-black text-gray-800 focus:ring-2 focus:ring-[#2E8B57]"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Campagne / Événement</label>
            <div className="relative">
              <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input 
                type="text" 
                placeholder="Ex: Magal Touba, Social..." 
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-[#2E8B57]"
                value={formData.eventLabel}
                onChange={(e) => setFormData({...formData, eventLabel: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-6">
            <button type="submit" className="w-full py-4 bg-[#2E8B57] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 active:scale-95">
              <Save size={18} />
              {initialData ? 'Mettre à jour' : 'Enregistrer le paiement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
