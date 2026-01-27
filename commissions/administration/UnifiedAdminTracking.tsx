
import React, { useState } from 'react';
import { 
  CheckCircle, AlertCircle, Clock, FileText, 
  TrendingUp, Filter, Download, ChevronRight, 
  PieChart, ShieldAlert, Search, Eye, ArrowLeft,
  Activity, Calendar, Wallet, MoreHorizontal
} from 'lucide-react';
import { getCommissionHealthMatrix, getGlobalKPI, CommissionHealth } from '../../services/monitoringService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

type DetailViewType = 'none' | 'compliance' | 'reports' | 'budget' | 'alerts';

const UnifiedAdminTracking: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [detailView, setDetailView] = useState<DetailViewType>('none');
  const [selectedCommission, setSelectedCommission] = useState<CommissionHealth | null>(null);
  
  const matrix = getCommissionHealthMatrix();
  const kpi = getGlobalKPI();

  const filteredMatrix = matrix.filter(c => filterStatus === 'all' || c.status === filterStatus);

  // --- DERIVED DATA FOR DETAIL VIEWS ---
  const alertsList = matrix.filter(c => c.alerts.length > 0);
  const pendingReportsList = matrix.filter(c => c.pendingReports > 0);
  const budgetCriticalList = matrix.sort((a, b) => b.budgetUtilization - a.budgetUtilization);

  const handleCommissionClick = (comm: CommissionHealth) => {
    setSelectedCommission(comm);
    setDetailView('none'); // Ensure we aren't in a KPI view
  };

  const handleKPIClick = (view: DetailViewType) => {
    setDetailView(view === detailView ? 'none' : view);
    setSelectedCommission(null); // Ensure we aren't in commission view
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Top KPI Section - Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { id: 'compliance', l: 'Conformité Globale', v: `${kpi.complianceRate}%`, i: ShieldAlert, c: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
          { id: 'reports', l: 'Rapports en Attente', v: kpi.pendingApprovals.toString(), i: FileText, c: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
          { id: 'budget', l: 'Budget Consolidé', v: '56%', i: PieChart, c: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
          { id: 'alerts', l: 'Alertes Actives', v: kpi.activeAlerts.toString(), i: AlertCircle, c: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
        ].map((stat, i) => (
          <button 
            key={i} 
            onClick={() => handleKPIClick(stat.id as DetailViewType)}
            className={`glass-card p-6 flex items-center justify-between group hover:shadow-md transition-all text-left border ${
              detailView === stat.id ? stat.border + ' ring-2 ring-offset-2 ring-slate-100' : 'border-transparent'
            }`}
          >
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.l}</p>
                <h4 className={`text-3xl font-black ${stat.c}`}>{stat.v}</h4>
             </div>
             <div className={`p-4 rounded-2xl ${stat.bg} ${stat.c} group-hover:scale-110 transition-transform`}>
                <stat.i size={24} />
             </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content Area (Dynamic) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
           
           {/* SCENARIO 1: Commission Detail View */}
           {selectedCommission ? (
             <div className="glass-card bg-white overflow-hidden animate-in slide-in-from-right-4 duration-300">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                   <div className="flex items-center gap-4">
                      <button onClick={() => setSelectedCommission(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                         <ArrowLeft size={20} className="text-slate-400" />
                      </button>
                      <div>
                         <h3 className="text-2xl font-black text-slate-900">Commission {selectedCommission.commission}</h3>
                         <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                               selectedCommission.status === 'healthy' ? 'bg-emerald-100 text-emerald-700' : 
                               selectedCommission.status === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                            }`}>
                               {selectedCommission.status === 'healthy' ? 'Performance Optimale' : selectedCommission.status === 'warning' ? 'Attention Requise' : 'Critique'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">Dernière MAJ: {selectedCommission.lastReportDate}</span>
                         </div>
                      </div>
                   </div>
                   <div className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
                      <Activity size={24} className={selectedCommission.complianceScore > 80 ? 'text-emerald-500' : 'text-amber-500'} />
                   </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Score Conformité</p>
                      <div className="flex items-end gap-2">
                         <span className="text-4xl font-black text-slate-900">{selectedCommission.complianceScore}</span>
                         <span className="text-sm text-slate-400 font-bold mb-1">/100</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full mt-4 overflow-hidden">
                         <div className="h-full bg-slate-800" style={{ width: `${selectedCommission.complianceScore}%` }}></div>
                      </div>
                   </div>
                   <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Utilisation Budget</p>
                      <div className="flex items-end gap-2">
                         <span className={`text-4xl font-black ${selectedCommission.budgetUtilization > 90 ? 'text-rose-600' : 'text-slate-900'}`}>{selectedCommission.budgetUtilization}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full mt-4 overflow-hidden">
                         <div className={`h-full ${selectedCommission.budgetUtilization > 90 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${selectedCommission.budgetUtilization}%` }}></div>
                      </div>
                   </div>
                   <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Requêtes en cours</p>
                      <div className="flex items-end gap-2">
                         <span className="text-4xl font-black text-slate-900">{selectedCommission.pendingRequests}</span>
                         <span className="text-xs text-slate-400 font-bold mb-1">Dossiers</span>
                      </div>
                      <div className="mt-4 flex gap-2">
                         {Array.from({length: Math.min(5, selectedCommission.pendingRequests)}).map((_, i) => (
                            <div key={i} className="w-2 h-2 rounded-full bg-amber-400"></div>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="px-8 pb-8">
                   <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Alertes & Actions Requises</h4>
                   {selectedCommission.alerts.length > 0 ? (
                      <div className="space-y-3">
                         {selectedCommission.alerts.map((alert, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-800">
                               <AlertCircle size={18} />
                               <span className="text-xs font-bold">{alert}</span>
                            </div>
                         ))}
                      </div>
                   ) : (
                      <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-4 text-emerald-800">
                         <CheckCircle size={18} />
                         <span className="text-xs font-bold">Aucune alerte active. Tout est sous contrôle.</span>
                      </div>
                   )}
                </div>
                
                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                   <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Voir Historique</button>
                   <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-all">Contacter Dieuwrine</button>
                </div>
             </div>
           ) : detailView !== 'none' ? (
             /* SCENARIO 2: KPI Drill-down View */
             <div className="glass-card bg-white flex flex-col overflow-hidden animate-in slide-in-from-top-4 duration-300">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                   <div className="flex items-center gap-4">
                      <button onClick={() => setDetailView('none')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                         <ArrowLeft size={20} className="text-slate-400" />
                      </button>
                      <h3 className="font-black text-slate-900 text-lg flex items-center gap-3">
                         {detailView === 'alerts' && <><AlertCircle className="text-rose-600" /> Centre d'Alertes</>}
                         {detailView === 'compliance' && <><ShieldAlert className="text-blue-600" /> Audit Conformité</>}
                         {detailView === 'reports' && <><FileText className="text-amber-600" /> Rapports en Attente</>}
                         {detailView === 'budget' && <><PieChart className="text-emerald-600" /> Analyse Budgétaire</>}
                      </h3>
                   </div>
                   <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase">Vue Détaillée</span>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8">
                   {detailView === 'alerts' && (
                      <div className="space-y-4">
                         {alertsList.map((comm, i) => (
                            <div key={i} className="p-5 border border-rose-100 bg-rose-50/50 rounded-2xl space-y-3 cursor-pointer hover:bg-rose-50 transition-all" onClick={() => handleCommissionClick(comm)}>
                               <div className="flex justify-between items-center">
                                  <h4 className="font-black text-rose-800 text-sm">{comm.commission}</h4>
                                  <span className="text-[9px] font-bold bg-white px-2 py-1 rounded text-rose-600 border border-rose-100">{comm.alerts.length} Alertes</span>
                               </div>
                               {comm.alerts.map((a, j) => (
                                  <div key={j} className="flex items-center gap-2 text-xs text-rose-700">
                                     <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> {a}
                                  </div>
                               ))}
                            </div>
                         ))}
                         {alertsList.length === 0 && <p className="text-center text-slate-400 italic">Aucune alerte active.</p>}
                      </div>
                   )}

                   {detailView === 'reports' && (
                      <div className="space-y-4">
                         {pendingReportsList.map((comm, i) => (
                            <div key={i} className="flex items-center justify-between p-5 border border-amber-100 bg-amber-50/30 rounded-2xl hover:bg-amber-50 transition-all cursor-pointer" onClick={() => handleCommissionClick(comm)}>
                               <div>
                                  <h4 className="font-black text-slate-800 text-sm">{comm.commission}</h4>
                                  <p className="text-xs text-slate-500 mt-1">Dernier rapport : {comm.lastReportDate}</p>
                               </div>
                               <div className="text-right">
                                  <p className="text-xl font-black text-amber-600">{comm.pendingReports}</p>
                                  <p className="text-[9px] font-bold text-amber-700 uppercase">En attente</p>
                               </div>
                            </div>
                         ))}
                      </div>
                   )}

                   {detailView === 'budget' && (
                      <div className="space-y-4">
                         {budgetCriticalList.map((comm, i) => (
                            <div key={i} className="p-5 border border-slate-100 bg-white rounded-2xl hover:shadow-md transition-all cursor-pointer group" onClick={() => handleCommissionClick(comm)}>
                               <div className="flex justify-between items-center mb-3">
                                  <h4 className="font-black text-slate-800 text-sm">{comm.commission}</h4>
                                  <span className={`text-[10px] font-bold ${comm.budgetUtilization > 90 ? 'text-rose-600' : 'text-emerald-600'}`}>{comm.budgetUtilization}% Utilisé</span>
                               </div>
                               <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div className={`h-full ${comm.budgetUtilization > 90 ? 'bg-rose-500' : comm.budgetUtilization > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${comm.budgetUtilization}%` }}></div>
                               </div>
                            </div>
                         ))}
                      </div>
                   )}

                   {detailView === 'compliance' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {matrix.sort((a,b) => b.complianceScore - a.complianceScore).map((comm, i) => (
                            <div key={i} className="p-5 border border-slate-100 bg-white rounded-2xl flex items-center justify-between cursor-pointer hover:border-blue-200 transition-all" onClick={() => handleCommissionClick(comm)}>
                               <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                                     comm.complianceScore > 80 ? 'bg-emerald-50 text-emerald-600' : comm.complianceScore > 50 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                                  }`}>
                                     {comm.complianceScore}
                                  </div>
                                  <span className="font-bold text-slate-700 text-sm">{comm.commission}</span>
                               </div>
                               <ChevronRight size={16} className="text-slate-300" />
                            </div>
                         ))}
                      </div>
                   )}
                </div>
             </div>
           ) : (
             /* SCENARIO 3: Default Table View */
             <div className="glass-card bg-white flex flex-col overflow-hidden">
               <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                  <h3 className="font-black text-slate-900 text-lg flex items-center gap-3">
                     <Clock size={22} className="text-slate-700"/> Suivi des Livrables
                  </h3>
                  <div className="flex gap-2">
                     {['all', 'healthy', 'warning', 'critical'].map(status => (
                       <button 
                         key={status}
                         onClick={() => setFilterStatus(status)}
                         className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                           filterStatus === status 
                             ? 'bg-slate-800 text-white border-slate-800' 
                             : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                         }`}
                       >
                         {status === 'all' ? 'Tous' : status}
                       </button>
                     ))}
                     <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-emerald-600 border border-slate-100 ml-2"><Download size={18}/></button>
                  </div>
               </div>
               
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <tr>
                           <th className="px-8 py-4">Commission</th>
                           <th className="px-8 py-4">Santé Admin</th>
                           <th className="px-8 py-4">Dernier Bilan</th>
                           <th className="px-8 py-4">Budget Utilisé</th>
                           <th className="px-8 py-4 text-right">Détails</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {filteredMatrix.map((comm, i) => (
                          <tr 
                            key={i} 
                            onClick={() => handleCommissionClick(comm)}
                            className="hover:bg-slate-50/80 transition-all group cursor-pointer"
                          >
                             <td className="px-8 py-5">
                                <span className="font-bold text-xs text-slate-800 group-hover:text-emerald-700 transition-colors">{comm.commission}</span>
                                {comm.alerts.length > 0 && (
                                  <p className="text-[9px] text-rose-500 font-bold mt-1 flex items-center gap-1">
                                    <AlertCircle size={10}/> {comm.alerts[0]}
                                  </p>
                                )}
                             </td>
                             <td className="px-8 py-5">
                                <div className="flex items-center gap-2">
                                   <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full ${comm.complianceScore > 80 ? 'bg-emerald-500' : comm.complianceScore > 50 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                                        style={{ width: `${comm.complianceScore}%` }}
                                      ></div>
                                   </div>
                                   <span className="text-[10px] font-black text-slate-500">{comm.complianceScore}%</span>
                                </div>
                             </td>
                             <td className="px-8 py-5">
                                <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${
                                  comm.pendingReports > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                                }`}>
                                   {comm.pendingReports > 0 ? `${comm.pendingReports} en retard` : 'À jour'}
                                </span>
                                <p className="text-[9px] text-slate-400 mt-1">{comm.lastReportDate}</p>
                             </td>
                             <td className="px-8 py-5 font-black text-xs text-slate-700">
                                {comm.budgetUtilization}%
                             </td>
                             <td className="px-8 py-5 text-right">
                                <button className="p-2 bg-white border border-slate-100 rounded-lg text-slate-300 group-hover:text-blue-600 group-hover:border-blue-200 transition-all shadow-sm">
                                   <Eye size={16} />
                                </button>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
             </div>
           )}
        </div>

        {/* Analytics Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-8 bg-white border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Taux de Soumission (30j)</h4>
              <div className="h-[200px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={matrix.slice(0, 5)}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis dataKey="commission" axisLine={false} tickLine={false} tick={{ fontSize: 0 }} />
                       <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '10px' }} />
                       <Bar dataKey="complianceScore" radius={[4, 4, 0, 0]}>
                          {matrix.slice(0, 5).map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.complianceScore > 80 ? '#10b981' : '#f59e0b'} />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                 {matrix.slice(0, 3).map((c, i) => (
                   <div key={i} className="flex justify-between items-center text-[10px] cursor-pointer hover:bg-slate-50 p-1 rounded" onClick={() => handleCommissionClick(c)}>
                      <span className="font-bold text-slate-600">{c.commission}</span>
                      <span className="font-black text-slate-900">{c.complianceScore}%</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="glass-card p-8 bg-slate-900 text-white relative overflow-hidden group">
              <div className="relative z-10">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-60">Actions Requises</h4>
                 <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => handleKPIClick('reports')}>
                       <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                       <div>
                          <p className="text-xs font-bold">Relancer Comm. Social</p>
                          <p className="text-[9px] opacity-60 mt-1">Bilan mensuel non reçu depuis 45 jours.</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => handleKPIClick('reports')}>
                       <CheckCircle size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                       <div>
                          <p className="text-xs font-bold">Valider PV Organisation</p>
                          <p className="text-[9px] opacity-60 mt-1">Rapport post-Magal en attente.</p>
                       </div>
                    </div>
                 </div>
                 <button className="w-full mt-6 py-3 bg-white text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                    Envoyer Rappels Groupés
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedAdminTracking;
