
import React, { useState } from 'react';
import { getAllReports, acknowledgeReportByBureau } from '../../services/reportService';
import { InternalMeetingReport } from '../../types';
import { FileText, CheckCircle, Clock, Filter, AlertCircle, Eye, Download } from 'lucide-react';

const BureauReportDashboard: React.FC = () => {
  // Dans un vrai cas, on filtrerait pour avoir seulement ceux validés par l'admin ('valide_admin' ou 'soumis_bureau')
  const [reports, setReports] = useState<InternalMeetingReport[]>(getAllReports());
  const [filter, setFilter] = useState('Tous');

  const handleAcknowledge = (id: string) => {
    acknowledgeReportByBureau(id, 'Vu par le bureau');
    // Force refresh local state for demo
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'approuve_bureau' } : r));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
         <h3 className="text-2xl font-black text-slate-100 uppercase tracking-widest">Synthèse des Commissions</h3>
         <div className="flex gap-2">
            {['Tous', 'En attente', 'Archivés'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                  filter === f ? 'bg-white text-slate-900 border-white' : 'bg-slate-900 text-slate-500 border-slate-700 hover:border-slate-500'
                }`}
              >
                {f}
              </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {reports.map(report => (
           <div key={report.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 group hover:border-slate-600 transition-all">
              <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-slate-800 rounded-xl text-slate-400 group-hover:text-white transition-colors">
                       <FileText size={20} />
                    </div>
                    <div>
                       <h4 className="text-sm font-black text-slate-200 leading-tight">{report.title}</h4>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Comm. {report.commission} • {report.date}</p>
                    </div>
                 </div>
                 <span className={`px-2 py-1 rounded text-[8px] font-black uppercase ${
                   report.status === 'approuve_bureau' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'
                 }`}>
                    {report.status === 'approuve_bureau' ? 'Validé' : 'À traiter'}
                 </span>
              </div>
              
              <p className="text-xs text-slate-400 line-clamp-2 mb-6 pl-14 leading-relaxed">
                 {report.discussions.substring(0, 150)}...
              </p>

              <div className="pl-14 flex items-center gap-4">
                 {report.status !== 'approuve_bureau' ? (
                   <button 
                     onClick={() => handleAcknowledge(report.id)}
                     className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-2"
                   >
                      <CheckCircle size={12} /> Prendre note
                   </button>
                 ) : (
                   <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-2"><CheckCircle size={12}/> Archivé</span>
                 )}
                 <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all flex items-center gap-2">
                    <Eye size={12} /> Lire
                 </button>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default BureauReportDashboard;
