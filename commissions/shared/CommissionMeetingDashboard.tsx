
import React, { useState } from 'react';
import { CommissionType } from '../../types';
import { 
  Calendar, FileText, CheckSquare, Plus, Clock, 
  ChevronRight, Users, AlertCircle, Search 
} from 'lucide-react';
import MeetingReportEditor from './MeetingReportEditor';
import ActionItemManager from './ActionItemManager';
import { useData } from '../../contexts/DataContext';

interface Props {
  commission: CommissionType;
}

const CommissionMeetingDashboard: React.FC<Props> = ({ commission }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [activeTab, setActiveTab] = useState<'reports' | 'actions'>('reports');
  
  const { reports: allReports } = useData();
  
  const reports = allReports.filter(r => r.commission === commission);
  const pendingReports = reports.filter(r => r.status === 'brouillon' || r.status === 'soumis_admin');
  
  // Extraction de toutes les actions de tous les rapports
  const allActions = reports.flatMap(r => r.actionItems || []).filter(a => a.status !== 'termine');
  
  // Calcul dynamique des actions ouvertes
  const openActions = allActions.length;

  // Trouver la prochaine réunion (basée sur les données réelles ou vide)
  const nextMeeting = reports
    .filter(r => new Date(r.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const nextMeetingDate = nextMeeting 
    ? new Date(nextMeeting.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
    : '--';

  // Calcul des stats réelles (0 par défaut)
  const attendanceRate = 0; 
  const closedActions = reports.flatMap(r => r.actionItems || []).filter(a => a.status === 'termine').length;
  const totalActions = reports.flatMap(r => r.actionItems || []).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {showEditor && (
        <MeetingReportEditor 
          commission={commission} 
          onClose={() => setShowEditor(false)} 
        />
      )}

      {/* Header Statutaire */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Secrétariat & Instances</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <FileText size={14} className="text-blue-500" /> Gestion des PV et suivi des décisions
          </p>
        </div>
        <button 
          onClick={() => setShowEditor(true)}
          className="px-8 py-4 bg-blue-600 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-blue-700 transition-all flex items-center gap-3 active:scale-95"
        >
          <Plus size={18} /> Nouveau Compte Rendu
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6">
           {/* Navigation interne */}
           <div className="flex gap-4 border-b border-slate-100 pb-1">
              <button 
                onClick={() => setActiveTab('reports')}
                className={`pb-3 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'reports' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Comptes Rendus ({reports.length})
              </button>
              <button 
                onClick={() => setActiveTab('actions')}
                className={`pb-3 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'actions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Suivi des Actions ({allActions.length})
              </button>
           </div>

           {activeTab === 'reports' ? (
             <div className="space-y-4">
                {reports.length > 0 ? reports.map(report => (
                  <div key={report.id} className="group glass-card p-6 hover:border-blue-200 transition-all cursor-pointer">
                     <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                              <FileText size={20} />
                           </div>
                           <div>
                              <h4 className="text-sm font-black text-slate-800">{report.title}</h4>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{report.date} • {report.type}</p>
                           </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${
                          report.status === 'approuve_bureau' ? 'bg-emerald-100 text-emerald-700' : 
                          report.status === 'soumis_admin' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                           {report.status.replace('_', ' ')}
                        </span>
                     </div>
                     <p className="text-xs text-slate-500 line-clamp-2 mb-4 pl-14">{report.discussions}</p>
                     <div className="flex items-center justify-between pl-14 pt-4 border-t border-slate-50">
                        <div className="flex -space-x-2">
                           {report.attendees.slice(0, 4).map((a, i) => (
                             <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-black text-slate-500" title={a.name}>
                                {a.name[0]}
                             </div>
                           ))}
                           {report.attendees.length > 4 && (
                             <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-black text-slate-400">+{report.attendees.length - 4}</div>
                           )}
                        </div>
                        <button className="text-[9px] font-black text-blue-600 uppercase flex items-center gap-1 hover:gap-2 transition-all">
                           Consulter <ChevronRight size={12}/>
                        </button>
                     </div>
                  </div>
                )) : (
                  <div className="text-center py-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                     <FileText size={40} className="text-slate-300 mx-auto mb-4"/>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aucun compte rendu archivé</p>
                  </div>
                )}
             </div>
           ) : (
             <div className="glass-card p-8 bg-white">
                <ActionItemManager actions={allActions} />
             </div>
           )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           {/* Next Meeting Card */}
           <div className="glass-card p-8 bg-slate-900 text-white relative overflow-hidden">
              <div className="relative z-10">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 opacity-60">Prochaine Instance</h4>
                 {nextMeeting ? (
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-white/10 rounded-xl backdrop-blur-md flex flex-col items-center justify-center border border-white/10">
                         <span className="text-sm font-black">{new Date(nextMeeting.date).getDate()}</span>
                         <span className="text-[8px] uppercase">{new Date(nextMeeting.date).toLocaleString('default', { month: 'short' })}</span>
                      </div>
                      <div>
                         <p className="text-sm font-bold truncate">{nextMeeting.title}</p>
                         <p className="text-[10px] opacity-60 flex items-center gap-1"><Clock size={10}/> {nextMeeting.startTime} • {nextMeeting.location}</p>
                      </div>
                   </div>
                 ) : (
                   <div className="mb-6 text-center text-white/40 text-xs italic">
                      Aucune réunion programmée
                   </div>
                 )}
                 <button onClick={() => setShowEditor(true)} className="w-full py-3 bg-white text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all">Préparer l'ordre du jour</button>
              </div>
              <div className="absolute -right-6 -bottom-6 opacity-10"><Calendar size={120}/></div>
           </div>

           {/* Stats Rapides */}
           <div className="glass-card p-8 bg-white">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Performance Administrative</h4>
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-600">Assiduité Moyenne</span>
                    <span className="text-xs font-black text-emerald-600">{attendanceRate}%</span>
                 </div>
                 <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${attendanceRate}%` }}></div>
                 </div>
                 
                 <div className="flex justify-between items-center mt-4">
                    <span className="text-xs font-bold text-slate-600">Actions Clôturées</span>
                    <span className="text-xs font-black text-blue-600">{closedActions}/{totalActions}</span>
                 </div>
                 <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: totalActions > 0 ? `${(closedActions/totalActions)*100}%` : '0%' }}></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionMeetingDashboard;
