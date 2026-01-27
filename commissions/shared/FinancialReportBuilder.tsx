
import React, { useState } from 'react';
import { CommissionType, ExpenseItem } from '../../types';
import { Plus, Trash2, Save, FileText, Upload, DollarSign, Calendar } from 'lucide-react';
import { createReport } from '../../services/financialService';

interface Props {
  commission: CommissionType;
  onClose: () => void;
}

const FinancialReportBuilder: React.FC<Props> = ({ commission, onClose }) => {
  const [reportData, setReportData] = useState({
    period: '',
    startDate: '',
    endDate: '',
    totalBudgetAllocated: 0,
  });

  const [expenses, setExpenses] = useState<Partial<ExpenseItem>[]>([
    { id: '1', category: '', description: '', amount: 0, date: '' }
  ]);

  const addExpense = () => {
    setExpenses([...expenses, { id: Date.now().toString(), category: '', description: '', amount: 0, date: '' }]);
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const updateExpense = (id: string, field: string, value: any) => {
    const newExpenses = expenses.map(e => e.id === id ? { ...e, [field]: value } : e);
    setExpenses(newExpenses);
  };

  const totalExpenses = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const balance = reportData.totalBudgetAllocated - totalExpenses;

  const handleSubmit = () => {
    createReport({
      commission,
      ...reportData,
      expenses: expenses as ExpenseItem[],
      submittedBy: 'Utilisateur Courant' // Mock
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <FileText size={24} className="text-blue-600" /> Bilan Financier
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Commission {commission}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Solde Final</p>
            <p className={`text-2xl font-black ${balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {balance.toLocaleString()} F
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
          
          {/* General Info */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intitulé / Période</label>
              <input 
                type="text" 
                placeholder="Ex: Bilan Magal 2024" 
                className="w-full p-4 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                value={reportData.period}
                onChange={(e) => setReportData({...reportData, period: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Budget Alloué (FCFA)</label>
              <input 
                type="number" 
                className="w-full p-4 bg-slate-50 border-none rounded-xl text-sm font-black text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                value={reportData.totalBudgetAllocated}
                onChange={(e) => setReportData({...reportData, totalBudgetAllocated: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Début</label>
              <input 
                type="date" 
                className="w-full p-4 bg-slate-50 border-none rounded-xl text-sm font-bold"
                value={reportData.startDate}
                onChange={(e) => setReportData({...reportData, startDate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Fin</label>
              <input 
                type="date" 
                className="w-full p-4 bg-slate-50 border-none rounded-xl text-sm font-bold"
                value={reportData.endDate}
                onChange={(e) => setReportData({...reportData, endDate: e.target.value})}
              />
            </div>
          </section>

          {/* Expenses Table */}
          <section className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h4 className="text-sm font-black text-slate-700 uppercase tracking-widest">Détail des Dépenses</h4>
              <button 
                onClick={addExpense}
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all flex items-center gap-2"
              >
                <Plus size={14} /> Ajouter Ligne
              </button>
            </div>
            
            <div className="space-y-3">
              {expenses.map((exp, index) => (
                <div key={exp.id} className="flex flex-col md:flex-row gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100 group">
                  <div className="w-8 flex items-center justify-center text-slate-300 font-black text-xs">{index + 1}</div>
                  <input 
                    type="text" 
                    placeholder="Catégorie" 
                    className="md:w-32 p-2 bg-white rounded-lg text-xs border border-slate-200 outline-none focus:border-blue-400"
                    value={exp.category}
                    onChange={(e) => updateExpense(exp.id!, 'category', e.target.value)}
                  />
                  <input 
                    type="text" 
                    placeholder="Description" 
                    className="flex-1 p-2 bg-white rounded-lg text-xs border border-slate-200 outline-none focus:border-blue-400"
                    value={exp.description}
                    onChange={(e) => updateExpense(exp.id!, 'description', e.target.value)}
                  />
                  <input 
                    type="date" 
                    className="md:w-32 p-2 bg-white rounded-lg text-xs border border-slate-200 outline-none focus:border-blue-400"
                    value={exp.date}
                    onChange={(e) => updateExpense(exp.id!, 'date', e.target.value)}
                  />
                  <input 
                    type="number" 
                    placeholder="Montant" 
                    className="md:w-32 p-2 bg-white rounded-lg text-xs font-bold text-right border border-slate-200 outline-none focus:border-blue-400"
                    value={exp.amount}
                    onChange={(e) => updateExpense(exp.id!, 'amount', Number(e.target.value))}
                  />
                  <button className="p-2 text-slate-300 hover:text-blue-500"><Upload size={16} /></button>
                  <button onClick={() => removeExpense(exp.id!)} className="p-2 text-slate-300 hover:text-rose-500"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end pt-4">
               <div className="bg-slate-100 px-6 py-3 rounded-xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Total Dépenses</p>
                  <p className="text-xl font-black text-slate-800">{totalExpenses.toLocaleString()} F</p>
               </div>
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-3 rounded-xl text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Annuler</button>
          <button onClick={handleSubmit} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2">
            <Save size={16} /> Soumettre au Bureau
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialReportBuilder;
