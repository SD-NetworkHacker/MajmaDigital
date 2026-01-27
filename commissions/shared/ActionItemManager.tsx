
import React from 'react';
import { MeetingActionItem } from '../../types';
import { CheckCircle, Clock, AlertCircle, MoreHorizontal } from 'lucide-react';

interface Props {
  actions: MeetingActionItem[];
  onUpdateStatus?: (id: string, status: any) => void;
}

const ActionItemManager: React.FC<Props> = ({ actions, onUpdateStatus }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'termine': return 'bg-emerald-100 text-emerald-700';
      case 'en_cours': return 'bg-blue-100 text-blue-700';
      case 'retard': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'termine': return <CheckCircle size={14}/>;
      case 'en_cours': return <Clock size={14}/>;
      case 'retard': return <AlertCircle size={14}/>;
      default: return <Clock size={14}/>;
    }
  };

  return (
    <div className="space-y-4">
      {actions.map(action => (
        <div key={action.id} className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
           <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${getStatusColor(action.status)}`}>
                 {getStatusIcon(action.status)}
              </div>
              <div>
                 <p className="text-sm font-bold text-slate-800">{action.description}</p>
                 <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">
                    Resp: {action.assignedTo} • Échéance: {action.dueDate}
                 </p>
              </div>
           </div>
           <button className="p-2 text-slate-300 hover:text-slate-600">
              <MoreHorizontal size={16} />
           </button>
        </div>
      ))}
      {actions.length === 0 && (
        <p className="text-center text-xs text-slate-400 italic py-4">Aucune action en cours.</p>
      )}
    </div>
  );
};

export default ActionItemManager;
