
import React, { useState, useEffect } from 'react';
import { validateReportByAdmin } from '../../services/reportService';
import { InternalMeetingReport } from '../../types';
import { FileText, Eye, CheckCircle, MessageSquare, Search, Filter, XCircle, MinusCircle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const AdministrationReviewInterface: React.FC = () => {
  const { reports } = useData();
  const [pendingReports, setPendingReports] = useState<InternalMeetingReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<InternalMeetingReport | null>(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setPendingReports(reports.filter(r => r.status === 'soumis_admin'));
  }, [reports]);

  const handleValidate = () => {
    if (selectedReport) {
      validateReportByAdmin(selectedReport.id, feedback);
      // Optimistically update local state while waiting for context refresh
      setPendingReports(prev => prev.filter(r => r.id !== selectedReport.id));
      setSelectedReport(null);
      setFeedback('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
       {/* List Sidebar */}
       <div className="lg:col-span-1 flex flex-col gap-4 bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">À Réviser ({pendingReports.length})</h3>
             <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-emerald-600"><Search size={16}/></button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
             {pendingReports.length === 0 ? (
               <p className="text-center text-xs text-slate-400 mt-10">Aucun rapport en attente.</p>
             ) : pendingReports.map(report => (
               <div 
                 key={report.id}
                 onClick={() => setSelectedReport(report)}
                 className={`p-4 rounded-xl border cursor-pointer transition-all ${
                   selectedReport?.id === report.id 
                     ? 'bg-blue-50 border-blue-200 shadow-md' 
                     : 'bg-slate-50 border-transparent hover:bg-white hover:border-slate-200'
                 }`}
               >
                  <div className="flex justify-between mb-2">
                     <span className="text-[9px] font-black uppercase text-blue-600 bg-blue-100 px-2 py-0.5 rounded">{report.commission}</span>
                     <span className="text-[9px] text-slate-400">{report.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 leading-tight mb-1">{report.title}</h4>
                  <p className="text-[10px] text-slate-500 truncate">Par {report.createdBy}</p>
               </div>
             ))}
          </div>
       </div>

       {/* Detail View */}
       <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-xl flex flex-col overflow-hidden relative">
          {selectedReport ? (
            <>
              <div className="p-8 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                 <div>
                    <h2 className="text-xl font-black text-slate-900">{selectedReport.title}</h2>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                       Commission {selectedReport.commission} • {selectedReport.date} • {selectedReport.location}
                    </p>
                 </div>
                 <div className="p-3 bg-white rounded-xl shadow-sm text-slate-400">
                    <FileText size={24} />
                 </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                 <div className="space-y-2">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Résumé des Discussions</h5>
                    <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">{selectedReport.discussions}</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Décisions ({selectedReport.decisions.length})</h5>
                       <ul className="space-y-3">
                          {selectedReport.decisions.map((d, i) => {
                             const totalVotes = d.votes.for + d.votes.against + d.votes.abstain;
                             const forPercent = totalVotes ? (d.votes.for / totalVotes) * 100 : 0;
                             const againstPercent = totalVotes ? (d.votes.against / totalVotes) * 100 : 0;
                             
                             return (
                               <li key={i} className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                  <div className="flex items-start gap-2 mb-2">
                                     {d.status === 'adopted' ? <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0"/> : 
                                      d.status === 'rejected' ? <XCircle size={14} className="text-rose-500 mt-0.5 shrink-0"/> :
                                      <MinusCircle size={14} className="text-slate-400 mt-0.5 shrink-0"/>}
                                     <span className="font-bold">{d.description}</span>
                                  </div>
                                  
                                  {/* Vote Bar */}
                                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex">
                                     <div className="h-full bg-emerald-500" style={{ width: `${forPercent}%` }}></div>
                                     <div className="h-full bg-rose-500" style={{ width: `${againstPercent}%` }}></div>
                                  </div>
                                  <div className="flex justify-between mt-1 text-[8px] font-bold text-slate-400 uppercase">
                                     <span className="text-emerald-600">{d.votes.for} Pour</span>
                                     <span className="text-rose-600">{d.votes.against} Contre</span>
                                     <span>{d.votes.abstain} Abs.</span>
                                  </div>
                               </li>
                             );
                          })}
                       </ul>
                    </div>
                    <div className="space-y-2">
                       <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Présence</h5>
                       <div className="flex flex-wrap gap-2">
                          {selectedReport.attendees.map((a, i) => (
                            <span key={i} className={`px-2 py-1 rounded text-[9px] font-black uppercase ${
                              a.status === 'present' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                            }`}>
                               {a.name}
                            </span>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100">
                 <div className="flex gap-4 items-end">
                    <div className="flex-1 space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2"><MessageSquare size={12}/> Note de validation (Facultatif)</label>
                       <input 
                         type="text" 
                         className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400"
                         placeholder="Remarques pour le bureau..."
                         value={feedback}
                         onChange={(e) => setFeedback(e.target.value)}
                       />
                    </div>
                    <button 
                      onClick={handleValidate}
                      className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-emerald-700 transition-all active:scale-95"
                    >
                       Valider & Transmettre
                    </button>
                 </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-300">
               <FileText size={48} className="mb-4 opacity-50"/>
               <p className="text-xs font-black uppercase tracking-widest">Sélectionnez un rapport pour lecture</p>
            </div>
          )}
       </div>
    </div>
  );
};

export default AdministrationReviewInterface;
