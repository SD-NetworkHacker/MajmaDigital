
import React, { useState, useEffect } from 'react';
import { acknowledgeReportByBureau } from '../../services/reportService';
import { InternalMeetingReport } from '../../types';
import { FileText, CheckCircle, Clock, Filter, Eye, Search, Inbox, ChevronRight, Hash, XCircle, MinusCircle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { formatDate } from '../../utils/date';

const BureauReportDashboard: React.FC = () => {
  const { reports: allReports } = useData();
  const [reports, setReports] = useState<InternalMeetingReport[]>([]);
  const [filter, setFilter] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<InternalMeetingReport | null>(null);

  useEffect(() => {
    // Filter pertinent reports from context data
    const pertinent = allReports.filter(r => ['valide_admin', 'soumis_bureau', 'approuve_bureau'].includes(r.status));
    setReports(pertinent);
  }, [allReports]);

  const handleAcknowledge = (id: string) => {
    acknowledgeReportByBureau(id, 'Vu et archivé par le Bureau Exécutif');
    // Context update should trigger useEffect and refresh list
  };

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.commission.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'Tous' 
      ? true 
      : filter === 'En attente' 
        ? r.status !== 'approuve_bureau' 
        : r.status === 'approuve_bureau';
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-in fade-in duration-500">
      {/* Header Toolbar */}
      <div className="flex justify-between items-center mb-6 shrink-0">
         <div className="flex items-center gap-4">
            <h3 className="text-2xl font-black text-slate-100 uppercase tracking-widest flex items-center gap-3">
               <Inbox size={28} className="text-purple-500" /> Flux de Rapports
            </h3>
            <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] font-black text-slate-400 border border-slate-700">
               {filteredReports.length} Documents
            </span>
         </div>
         
         <div className="flex gap-4">
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-500 transition-colors" size={16}/>
               <input 
                 type="text" 
                 placeholder="Filtrer..." 
                 className="w-64 bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500 transition-all"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
               {['Tous', 'En attente', 'Archivés'].map(f => (
                 <button 
                   key={f}
                   onClick={() => setFilter(f)}
                   className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                     filter === f ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                   }`}
                 >
                   {f}
                 </button>
               ))}
            </div>
         </div>
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden">
         {/* LIST COLUMN */}
         <div className="w-1/3 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2">
            {filteredReports.length > 0 ? filteredReports.map(report => (
               <div 
                  key={report.id} 
                  onClick={() => setSelectedReport(report)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer group ${
                     selectedReport?.id === report.id 
                        ? 'bg-purple-900/20 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]' 
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-600 hover:bg-slate-800'
                  }`}
               >
                  <div className="flex justify-between items-start mb-2">
                     <span className="text-[9px] font-black uppercase text-purple-400 tracking-widest">{report.commission}</span>
                     <span className={`w-2 h-2 rounded-full ${report.status === 'approuve_bureau' ? 'bg-slate-600' : 'bg-emerald-500 animate-pulse'}`}></span>
                  </div>
                  <h4 className={`text-sm font-bold leading-tight mb-2 ${selectedReport?.id === report.id ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                     {report.title}
                  </h4>
                  <div className="flex justify-between items-end">
                     <p className="text-[10px] text-slate-500 font-mono">{formatDate(report.date)}</p>
                     <ChevronRight size={14} className={`transition-transform ${selectedReport?.id === report.id ? 'text-purple-500 translate-x-1' : 'text-slate-600'}`}/>
                  </div>
               </div>
            )) : (
               <div className="text-center py-20 text-slate-600 border border-dashed border-slate-800 rounded-2xl">
                  <p className="text-xs">Aucun rapport</p>
               </div>
            )}
         </div>

         {/* PREVIEW COLUMN */}
         <div className="flex-1 bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden relative flex flex-col">
            {selectedReport ? (
               <>
                  <div className="p-8 border-b border-slate-800 bg-slate-950/50 flex justify-between items-start">
                     <div>
                        <div className="flex items-center gap-3 mb-2">
                           <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-[9px] font-black uppercase border border-purple-500/20">
                              {selectedReport.type}
                           </span>
                           <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                              <Hash size={10}/> {selectedReport.id.slice(-6)}
                           </span>
                        </div>
                        <h2 className="text-2xl font-black text-white leading-tight">{selectedReport.title}</h2>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rapporteur</p>
                        <p className="text-sm font-black text-slate-300">{selectedReport.createdBy}</p>
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                     <div className="space-y-3">
                        <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2"><FileText size={12}/> Synthèse</h5>
                        <div className="text-sm text-slate-300 leading-relaxed font-medium bg-slate-800/50 p-6 rounded-2xl border border-slate-800">
                           {selectedReport.discussions || "Aucun détail disponible."}
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-8">
                        <div>
                           <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Décisions ({selectedReport.decisions.length})</h5>
                           <ul className="space-y-3">
                              {selectedReport.decisions.map((d, i) => {
                                 const totalVotes = d.votes.for + d.votes.against + d.votes.abstain;
                                 const forPercent = totalVotes ? (d.votes.for / totalVotes) * 100 : 0;
                                 
                                 return (
                                    <li key={i} className="p-3 bg-slate-800/30 rounded-xl border border-slate-800">
                                       <div className="flex items-start gap-3 mb-2">
                                          {d.status === 'adopted' ? <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0"/> : 
                                           d.status === 'rejected' ? <XCircle size={14} className="text-rose-500 mt-0.5 shrink-0"/> :
                                           <MinusCircle size={14} className="text-slate-400 mt-0.5 shrink-0"/>}
                                          <span className="text-xs text-slate-300 font-medium">{d.description}</span>
                                       </div>
                                       <div className="flex items-center gap-2">
                                          <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                                             <div className="h-full bg-emerald-500" style={{ width: `${forPercent}%` }}></div>
                                          </div>
                                          <span className="text-[9px] font-mono text-slate-500">{d.votes.for}/{totalVotes}</span>
                                       </div>
                                    </li>
                                 );
                              })}
                           </ul>
                        </div>
                        <div>
                           <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Présence ({selectedReport.attendees.length})</h5>
                           <div className="flex flex-wrap gap-2">
                              {selectedReport.attendees.map((a, i) => (
                                 <span key={i} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border ${
                                    a.status === 'present' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'
                                 }`}>
                                    {a.name}
                                 </span>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>

                  {selectedReport.status !== 'approuve_bureau' && (
                     <div className="p-6 border-t border-slate-800 bg-slate-950 flex justify-end gap-4">
                        <button className="px-6 py-3 bg-slate-800 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all">Demander Révision</button>
                        <button 
                           onClick={() => handleAcknowledge(selectedReport.id)}
                           className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all flex items-center gap-2"
                        >
                           <CheckCircle size={14}/> Valider & Archiver
                        </button>
                     </div>
                  )}
               </>
            ) : (
               <div className="flex flex-col items-center justify-center h-full text-slate-600">
                  <Inbox size={64} className="mb-4 opacity-20"/>
                  <p className="text-xs font-black uppercase tracking-widest">Sélectionnez un rapport pour lecture</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default BureauReportDashboard;
