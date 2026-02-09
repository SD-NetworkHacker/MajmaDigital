
import React, { useState } from 'react';
import { X, Save, Calendar, MapPin, Tag, AlignLeft, Users } from 'lucide-react';
import { CommissionType } from '../types';

interface EventFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const EventForm: React.FC<EventFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Magal',
    date: new Date().toISOString().split('T')[0],
    location: '',
    organizingCommission: CommissionType.ORGANISATION,
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200" role="dialog" aria-modal="true">
        <h2 className="sr-only">Formulaire d'événement</h2>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-emerald-50 text-[#2E8B57]">
          <div>
            <h3 className="text-xl font-bold">Planifier un Événement</h3>
            <p className="text-xs font-medium uppercase tracking-wider">Agenda du Dahira</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Titre de l'événement</label>
            <div className="relative">
              <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                required
                type="text"
                placeholder="Ex: Conférence annuelle..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#2E8B57]"
              />
            </div>
          </div>
          {/* Reste du formulaire inchangé */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[#2E8B57] text-white rounded-xl font-bold text-sm shadow-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
