
import React from 'react';
import { CommissionType } from '../../types';
import { Calendar, FileText, CheckSquare, ChevronRight } from 'lucide-react';
import { getReportsByCommission } from '../../services/reportService';

interface Props {
  commission: CommissionType;
  onClick: () => void;
}

const MeetingOverviewWidget: React.FC<Props> = ({ commission, onClick }) => {
  const reports = getReportsByCommission(commission);
  const pendingReports = reports.filter(r => r.status === 'brouillon' || r.status === 'soumis_admin');
  
  // Calcul dynamique des actions ouvertes
  const openActions = reports.flatMap(r => r.actionItems || []).filter(a => a.status !== 'termine').length;

  // Recherche de la prochaine réunion (basée sur les rapports de type planification ou dates futures si dispo)
  const nextMeeting = reports
    .filter(r => new Date(r.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const nextMeetingDate = nextMeeting 
    ? new Date(nextMeeting.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
    : '--';

  return (
    <div 
      onClick={onClick}
      className="glass-card p-6 bg-white border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer group h-full flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
           <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Calendar size={20} />
           </div>
           <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Prochaine</p>
              <p className="text-sm font-black text-slate-800">{nextMeetingDate}</p>
           </div>
        </div>
        
        <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Vie de la Commission</h4>

        <div className="space-y-3">
           <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                 <FileText size={14} className="text-slate-400"/>
                 <span className="text-[10px] font-bold text-slate-600">PV en attente</span>
              </div>
              <span className={`text-[10px] font-black ${pendingReports.length > 0 ? 'text-amber-600' : 'text-slate-400'}`}>{pendingReports.length}</span>
           </div>
           <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                 <CheckSquare size={14} className="text-slate-400"/>
                 <span className="text-[10px] font-bold text-slate-600">Actions ouvertes</span>
              </div>
              <span className="text-[10px] font-black text-slate-400">{openActions}</span>
           </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600">
         <span>Accéder au Secrétariat</span>
         <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

export default MeetingOverviewWidget;
