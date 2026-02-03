
import React from 'react';
import { Wallet, CheckCircle, Clock, ArrowRight, Target } from 'lucide-react';

interface CotisationCardProps {
  type: string; // Adiya, Sass, etc.
  title: string; // "Mensualité Mars", "Magal 2024"
  amount: number;
  paidAmount?: number; // Si partiel
  targetAmount?: number; // Si objectif
  dueDate?: string;
  status: 'pending' | 'paid' | 'partial' | 'overdue';
  onPay?: () => void;
}

const CotisationCard: React.FC<CotisationCardProps> = ({ 
  type, title, amount, paidAmount = 0, targetAmount, dueDate, status, onPay 
}) => {
  
  const isPaid = status === 'paid';
  const progress = targetAmount ? Math.min(100, Math.round((paidAmount / targetAmount) * 100)) : 0;

  const getStatusColor = () => {
    switch (status) {
      case 'paid': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'overdue': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'partial': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className={`bg-white rounded-[2rem] p-6 border transition-all duration-300 ${isPaid ? 'border-emerald-100 opacity-80 hover:opacity-100' : 'border-slate-200 shadow-sm hover:shadow-lg'}`}>
      
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${isPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
          <Wallet size={24} />
        </div>
        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusColor()}`}>
          {status === 'paid' ? 'Réglé' : status === 'overdue' ? 'En retard' : 'En attente'}
        </span>
      </div>

      <div className="mb-6">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{type}</p>
        <h4 className="text-lg font-black text-slate-900 leading-tight mb-2">{title}</h4>
        
        {targetAmount ? (
          <div className="space-y-2 mt-3">
            <div className="flex justify-between text-[10px] font-bold text-slate-500">
              <span>{paidAmount.toLocaleString()} F</span>
              <span>{targetAmount.toLocaleString()} F</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-1000 ${isPaid ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        ) : (
          <p className="text-2xl font-black text-slate-800">{amount.toLocaleString()} <span className="text-sm text-slate-400">FCFA</span></p>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Clock size={14} />
          <span>{dueDate ? `Avant le ${new Date(dueDate).toLocaleDateString()}` : 'Date libre'}</span>
        </div>
        
        {!isPaid && (
          <button 
            onClick={onPay}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-lg"
          >
            Payer <ArrowRight size={12} />
          </button>
        )}
        {isPaid && (
          <span className="flex items-center gap-1 text-emerald-600 text-[10px] font-black uppercase">
            <CheckCircle size={14} /> Reçu dispo
          </span>
        )}
      </div>
    </div>
  );
};

export default CotisationCard;
