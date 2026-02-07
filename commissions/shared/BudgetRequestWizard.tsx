
import React, { useState } from 'react';
import { CommissionType, BudgetCategory, BudgetPriority, BudgetBreakdownItem } from '../../types';
import { ChevronRight, ChevronLeft, CheckCircle, Target, Calculator, Calendar, Save, X, Plus, Trash2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface Props {
  commission: CommissionType;
  onClose: () => void;
}

const STEPS = [
  { id: 1, label: 'Informations' },
  { id: 2, label: 'Détail Coûts' },
  { id: 3, label: 'Impact & Justif.' },
  { id: 4, label: 'Validation' }
];

const BudgetRequestWizard: React.FC<Props> = ({ commission, onClose }) => {
  const { addBudgetRequest } = useData();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'projet' as BudgetCategory,
    priority: 'moyen' as BudgetPriority,
    timeline: { startDate: '', endDate: '' },
    expectedOutcomes: ''
  });

  const [breakdown, setBreakdown] = useState<Partial<BudgetBreakdownItem>[]>([
    { id: '1', item: '', quantity: 1, unitCost: 0, total: 0, justification: '' }
  ]);

  const updateBreakdown = (id: string, field: string, value: any) => {
    setBreakdown(prev => prev.map(item => {
      if (item.id === id) {
        const updates = { [field]: value };
        if (field === 'quantity' || field === 'unitCost') {
          const qty = field === 'quantity' ? value : item.quantity;
          const cost = field === 'unitCost' ? value : item.unitCost;
          updates['total'] = Number(qty) * Number(cost);
        }
        return { ...item, ...updates };
      }
      return item;
    }));
  };

  const totalAmount = breakdown.reduce((acc, curr) => acc + (curr.total || 0), 0);

  const handleSubmit = () => {
    addBudgetRequest({
      commission,
      ...formData,
      breakdown: breakdown as BudgetBreakdownItem[],
      amountRequested: totalAmount, // explicitly set total
      submittedBy: 'Utilisateur Courant' // Mock - backend handles real user
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl flex flex-col h-[85vh] overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
        
        {/* Wizard Header */}
        <div className="p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Nouvelle Demande Budgétaire</h3>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">Commission {commission}</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white hover:bg-rose-50 hover:text-rose-500 rounded-full transition-all border border-slate-100 shadow-sm"><X size={20}/></button>
        </div>

        {/* Steps Progress */}
        <div className="px-12 py-6 border-b border-slate-100 flex justify-between items-center bg-white relative">
           <div className="absolute left-12 right-12 top-1/2 h-1 bg-slate-100 -z-0"></div>
           {STEPS.map((step, idx) => (
             <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 ${
                  currentStep >= step.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-200 text-slate-400'
                }`}>
                   {currentStep > step.id ? <CheckCircle size={18}/> : step.id}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${currentStep >= step.id ? 'text-emerald-700' : 'text-slate-300'}`}>{step.label}</span>
             </div>
           ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-slate-50/30">
           
           {/* STEP 1: BASIC INFO */}
           {currentStep === 1 && (
             <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Titre du Projet / Événement</label>
                   <input type="text" className="w-full p-5 bg-white border border-slate-100 rounded-2xl text-lg font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/20" 
                     placeholder="Ex: Achat matériel sonorisation"
                     value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                   />
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Catégorie</label>
                      <select className="w-full p-4 bg-white border border-slate-100 rounded-xl text-sm font-bold outline-none"
                        value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as BudgetCategory})}
                      >
                         <option value="evenement">Événement</option>
                         <option value="projet">Projet</option>
                         <option value="equipement">Équipement</option>
                         <option value="urgence">Urgence</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priorité</label>
                      <select className="w-full p-4 bg-white border border-slate-100 rounded-xl text-sm font-bold outline-none"
                        value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as BudgetPriority})}
                      >
                         <option value="bas">Basse</option>
                         <option value="moyen">Moyenne</option>
                         <option value="eleve">Élevée</option>
                         <option value="urgence">Critique</option>
                      </select>
                   </div>
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description Détaillée</label>
                   <textarea rows={5} className="w-full p-5 bg-white border border-slate-100 rounded-2xl text-sm font-medium text-slate-600 outline-none resize-none focus:ring-2 focus:ring-emerald-500/20" 
                     placeholder="Expliquez le contexte..."
                     value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                   />
                </div>
             </div>
           )}

           {/* STEP 2: BREAKDOWN */}
           {currentStep === 2 && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="flex justify-between items-center mb-4">
                   <h4 className="text-lg font-black text-slate-700">Ventilation des Coûts</h4>
                   <button onClick={() => setBreakdown([...breakdown, { id: Date.now().toString(), item: '', quantity: 1, unitCost: 0, total: 0 }])} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all flex items-center gap-2">
                      <Plus size={14}/> Ajouter Ligne
                   </button>
                </div>
                
                <div className="space-y-3">
                   {breakdown.map((item, idx) => (
                     <div key={item.id} className="flex gap-4 items-start p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <span className="mt-3 text-xs font-black text-slate-300 w-6">{idx + 1}</span>
                        <div className="flex-1 space-y-2">
                           <input type="text" placeholder="Désignation" className="w-full p-2 bg-slate-50 rounded-lg text-xs font-bold outline-none" 
                             value={item.item} onChange={e => updateBreakdown(item.id!, 'item', e.target.value)}
                           />
                           <input type="text" placeholder="Justification courte" className="w-full p-2 bg-white border border-slate-100 rounded-lg text-[10px] text-slate-500 outline-none" 
                             value={item.justification} onChange={e => updateBreakdown(item.id!, 'justification', e.target.value)}
                           />
                        </div>
                        <div className="w-24 space-y-2">
                           <input type="number" placeholder="Qté" className="w-full p-2 bg-slate-50 rounded-lg text-xs font-bold text-center outline-none" 
                             value={item.quantity} onChange={e => updateBreakdown(item.id!, 'quantity', e.target.value)}
                           />
                        </div>
                        <div className="w-32 space-y-2">
                           <input type="number" placeholder="Prix Unitaire" className="w-full p-2 bg-slate-50 rounded-lg text-xs font-bold text-right outline-none" 
                             value={item.unitCost} onChange={e => updateBreakdown(item.id!, 'unitCost', e.target.value)}
                           />
                        </div>
                        <div className="w-32 pt-2 text-right">
                           <p className="text-sm font-black text-emerald-600">{item.total?.toLocaleString()} F</p>
                        </div>
                        <button onClick={() => setBreakdown(breakdown.filter(i => i.id !== item.id))} className="p-2 text-slate-300 hover:text-rose-500"><Trash2 size={16}/></button>
                     </div>
                   ))}
                </div>

                <div className="flex justify-end mt-8">
                   <div className="bg-slate-900 text-white p-6 rounded-2xl text-right min-w-[300px] shadow-xl">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Total Estimé</p>
                      <p className="text-4xl font-black tracking-tighter">{totalAmount.toLocaleString()} <span className="text-lg opacity-40">FCFA</span></p>
                   </div>
                </div>
             </div>
           )}

           {/* STEP 3: IMPACT & TIMELINE */}
           {currentStep === 3 && (
             <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex gap-4">
                   <Target size={24} className="text-emerald-600 shrink-0" />
                   <div>
                      <h5 className="font-black text-emerald-900 text-sm mb-2">Justification Stratégique</h5>
                      <textarea className="w-full bg-white p-4 rounded-xl text-xs text-emerald-800 min-h-[100px] outline-none" 
                        placeholder="Quels sont les bénéfices attendus pour le Dahira ?"
                        value={formData.expectedOutcomes} onChange={e => setFormData({...formData, expectedOutcomes: e.target.value})}
                      />
                   </div>
                </div>

                <div className="space-y-4">
                   <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Calendar size={14}/> Calendrier d'Exécution</h5>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-slate-500 uppercase">Date Début</label>
                         <input type="date" className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm font-bold" 
                           value={formData.timeline.startDate} onChange={e => setFormData({...formData, timeline: {...formData.timeline, startDate: e.target.value}})}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-slate-500 uppercase">Date Fin</label>
                         <input type="date" className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm font-bold" 
                           value={formData.timeline.endDate} onChange={e => setFormData({...formData, timeline: {...formData.timeline, endDate: e.target.value}})}
                         />
                      </div>
                   </div>
                </div>
             </div>
           )}

           {/* STEP 4: RECAP */}
           {currentStep === 4 && (
             <div className="max-w-3xl mx-auto space-y-8 animate-in zoom-in duration-300 text-center">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                   <Calculator size={48} />
                </div>
                <h3 className="text-3xl font-black text-slate-900">Prêt à soumettre ?</h3>
                <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
                   Votre demande de budget pour <strong>"{formData.title}"</strong> s'élève à <strong className="text-emerald-600">{totalAmount.toLocaleString()} FCFA</strong>.
                   <br/>Elle sera transmise à la Commission Finance pour analyse.
                </p>
             </div>
           )}

        </div>

        {/* Footer Navigation */}
        <div className="p-8 border-t border-slate-100 bg-white flex justify-between items-center">
           <button 
             onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
             disabled={currentStep === 1}
             className="px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-slate-600 disabled:opacity-30 transition-all flex items-center gap-2"
           >
             <ChevronLeft size={16}/> Précédent
           </button>

           {currentStep < 4 ? (
             <button 
               onClick={() => setCurrentStep(currentStep + 1)}
               className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-black transition-all flex items-center gap-3"
             >
               Suivant <ChevronRight size={16}/>
             </button>
           ) : (
             <button 
               onClick={handleSubmit}
               className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-emerald-500 transition-all flex items-center gap-3 animate-pulse"
             >
               <Save size={18}/> Soumettre Demande
             </button>
           )}
        </div>

      </div>
    </div>
  );
};

export default BudgetRequestWizard;
