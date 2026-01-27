
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, Clock, MapPin, Users, Plus, ChevronRight, 
  FileText, CheckCircle, AlertCircle, Wand2, ArrowRight,
  ClipboardList, Share2, MoreVertical, Star, Loader2, 
  Filter, RefreshCcw, Zap, Trash2, Edit, Printer, Archive, PenTool, XCircle, MessageSquare
} from 'lucide-react';
import { getAllReports, deleteReport, validateReportByAdmin, rejectReport } from '../../services/reportService';
import { InternalMeetingReport, CommissionType } from '../../types';
import MeetingReportEditor from '../shared/MeetingReportEditor';

const MeetingManager: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [reports, setReports] = useState<InternalMeetingReport[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [filterMode, setFilterMode] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [reportToEdit, setReportToEdit] = useState<InternalMeetingReport | undefined>(undefined);
  const [showOptions, setShowOptions] = useState(false);
  
  // Admin Validation State
  const [adminFeedback, setAdminFeedback] = useState('');
  
  // AI Simulation States
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    handleRefresh();
  }, []);

  // --- COMPUTED DATA ---
  const selectedReport = useMemo(() => 
    reports.find(r => r.id === selectedReportId), 
  [reports, selectedReportId]);

  const filteredReports = useMemo(() => {
    const now = new Date();
    return reports.filter(r => {
      const reportDate = new Date(r.date);
      if (filterMode === 'upcoming') return reportDate >= now;
      if (filterMode === 'past') return reportDate < now;
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [reports, filterMode]);

  const pendingMinutesCount = reports.filter(r => new Date(r.date) < new Date() && (r.status === 'brouillon' || !r.status)).length;

  // --- HANDLERS ---
  const handleGenerateAgenda = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      setAiSuggestion("1. Revue des cotisations du mois dernier (Action: Trésorier)\n2. Logistique du prochain Ziar (Action: Org)\n3. Validation des nouveaux adhérents.");
      setIsAiGenerating(false);
    }, 2000);
  };

  const handleRefresh = () => {
    const data = getAllReports().filter(r => r.commission === CommissionType.ADMINISTRATION);
    setReports(data);
    if (data.length > 0 && !selectedReportId) {
      // Keep selected ID if still exists, else select first
      if (!data.find(d => d.id === selectedReportId)) {
         setSelectedReportId(data[0].id);
      }
    }
  };

  const handleShare = async () => {
    if (!selectedReport) return;
    const text = `📅 *${selectedReport.title}*\n\n📍 ${selectedReport.location}\n🕒 ${selectedReport.date} de ${selectedReport.startTime} à ${selectedReport.endTime}\n\n📝 *Ordre du jour:*\n${selectedReport.agenda.map((a, i) => `${i+1}. ${a.title}`).join('\n')}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedReport.title,
          text: text,
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Informations copiées dans le presse-papier !');
    }
  };

  const handleDelete = () => {
    if (!selectedReport) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer définitivement cette réunion ?')) {
      deleteReport(selectedReport.id);
      setSelectedReportId(null);
      handleRefresh();
      setShowOptions(false);
    }
  };

  const handleEdit = () => {
    if (!selectedReport) return;
    setReportToEdit(selectedReport);
    setShowEditor(true);
    setShowOptions(false);
  };

  const handlePrint = () => {
    window.print();
    setShowOptions(false);
  };

  const handleValidateReport = () => {
    if (!selectedReport) return;
    if(confirm("Valider ce procès-verbal ? Il sera verrouillé.")) {
        validateReportByAdmin(selectedReport.id, adminFeedback);
        setAdminFeedback('');
        handleRefresh();
    }
  };

  const handleRejectReport = () => {
    if (!selectedReport) return;
    if (!adminFeedback.trim()) {
        alert("Veuillez fournir un motif de rejet ou des corrections attendues.");
        return;
    }
    rejectReport(selectedReport.id, adminFeedback);
    setAdminFeedback('');
    handleRefresh();
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'brouillon': return 'bg-slate-100 text-slate-500 border-slate-200';
      case 'valide_admin': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'soumis_admin': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'soumis_bureau': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-left-4 duration-500 pb-12">
      {/* MODAL EDITOR */}
      {showEditor && (
        <MeetingReportEditor 
          commission={CommissionType.ADMINISTRATION} 
          onClose={() => { setShowEditor(false); handleRefresh(); }}
          existingReport={reportToEdit}
        />
      )}

      {/* HEADER ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Planificateur d'Instances</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Calendar size={14} className="text-emerald-500" /> Organisation des réunions et suivi des décisions stratégiques
          </p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={handleRefresh}
             className="p-4 bg-white text-slate-400 border border-slate-200 rounded-2xl hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm"
             title="Actualiser"
           >
             <RefreshCcw size={18} />
           </button>
           <button 
             onClick={() => { setReportToEdit(undefined); setShowEditor(true); }}
             className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-3 active:scale-95 transition-all hover:bg-emerald-600"
           >
             <Plus size={18} /> Programmer Réunion
           </button>
        </div>
      </div>

      {/* ALERT BAR FOR PENDING MINUTES */}
      {pendingMinutesCount > 0 && (
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center justify-between animate-in fade-in">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><AlertCircle size={16}/></div>
              <div>
                 <p className="text-xs font-black text-amber-800">Action Requise : Rédaction PV</p>
                 <p className="text-[10px] text-amber-600/80">{pendingMinutesCount} réunion(s) passée(s) attend(ent) un compte rendu.</p>
              </div>
           </div>
           <button onClick={() => setFilterMode('past')} className="px-4 py-2 bg-white text-amber-700 rounded-xl text-[9px] font-black uppercase shadow-sm hover:bg-amber-100 transition-all">
              Voir la liste
           </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: LISTE DES RÉUNIONS */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Filters */}
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
             {[
               { id: 'upcoming', label: 'À venir' },
               { id: 'past', label: 'Historique / PV' },
               { id: 'all', label: 'Tout' }
             ].map(f => (
               <button
                 key={f.id}
                 onClick={() => setFilterMode(f.id as any)}
                 className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                   filterMode === f.id ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                 }`}
               >
                 {f.label}
               </button>
             ))}
          </div>

          {/* Meetings List */}
          <div className="glass-card p-0 bg-white overflow-hidden border-slate-200">
             <div className="max-h-[600px] overflow-y-auto custom-scrollbar p-6 space-y-4">
                {filteredReports.length > 0 ? filteredReports.map((meeting) => (
                  <div 
                    key={meeting.id} 
                    onClick={() => setSelectedReportId(meeting.id)}
                    className={`relative flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer group ${
                      selectedReportId === meeting.id 
                        ? 'bg-emerald-50 border-emerald-200 shadow-md' 
                        : 'bg-white border-slate-100 hover:border-emerald-100 hover:bg-slate-50'
                    }`}
                  >
                     <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-black border shadow-sm ${
                       selectedReportId === meeting.id ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-100'
                     }`}>
                        <span className="text-[10px] uppercase opacity-70">{new Date(meeting.date).toLocaleString('default', { month: 'short' })}</span>
                        <span className="text-lg leading-none">{new Date(meeting.date).getDate()}</span>
                     </div>
                     
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                           <h5 className={`text-xs font-black truncate pr-2 ${selectedReportId === meeting.id ? 'text-emerald-900' : 'text-slate-800'}`}>{meeting.title}</h5>
                           <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded border ${getStatusStyle(meeting.status)}`}>
                             {meeting.status.replace('_', ' ')}
                           </span>
                        </div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                           <Clock size={10}/> {meeting.startTime} • <MapPin size={10}/> {meeting.location}
                        </p>
                        
                        {/* Quick Action Button for Drafts */}
                        {meeting.status === 'brouillon' && new Date(meeting.date) <= new Date() && (
                           <button 
                             onClick={(e) => { e.stopPropagation(); setReportToEdit(meeting); setShowEditor(true); }}
                             className="mt-2 text-[9px] font-black text-blue-600 uppercase flex items-center gap-1 hover:underline"
                           >
                              <PenTool size={10} /> Rédiger PV maintenant
                           </button>
                        )}
                     </div>
                     {selectedReportId === meeting.id && (
                       <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-12 bg-emerald-500 rounded-full hidden md:block"></div>
                     )}
                  </div>
                )) : (
                  <div className="text-center py-10 text-slate-400">
                     <Calendar size={32} className="mx-auto mb-2 opacity-20"/>
                     <p className="text-xs font-bold uppercase">Aucune réunion trouvée</p>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DÉTAILS DE LA RÉUNION */}
        <div className="lg:col-span-7">
          {selectedReport ? (
            <div className="glass-card p-8 flex flex-col h-full bg-white relative animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Detail Header */}
              <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-100">
                 <div className="flex items-center gap-5">
                    <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl shadow-inner border border-emerald-100">
                       <ClipboardList size={28} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-900 leading-tight">{selectedReport.title}</h4>
                      <div className="flex items-center gap-3 mt-2">
                         <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-50 px-2 py-1 rounded border border-slate-100">
                            {selectedReport.type}
                         </span>
                         <span className="text-[10px] text-slate-400 font-bold">Créé par {selectedReport.createdBy}</span>
                      </div>
                    </div>
                 </div>
                 <div className="flex gap-2 relative">
                   <button 
                     onClick={handleShare}
                     className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-emerald-600 rounded-xl transition-all shadow-sm" 
                     title="Partager"
                   >
                     <Share2 size={18} />
                   </button>
                   <button 
                     onClick={() => setShowOptions(!showOptions)}
                     className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-emerald-600 rounded-xl transition-all shadow-sm" 
                     title="Options"
                   >
                     <MoreVertical size={18} />
                   </button>

                   {/* Options Dropdown */}
                   {showOptions && (
                     <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-20 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                        <div className="p-1">
                          <button onClick={handleEdit} className="w-full flex items-center gap-2 px-4 py-3 text-[10px] font-bold text-slate-600 hover:bg-slate-50 rounded-lg text-left transition-colors">
                             <Edit size={14} /> Modifier
                          </button>
                          <button onClick={handlePrint} className="w-full flex items-center gap-2 px-4 py-3 text-[10px] font-bold text-slate-600 hover:bg-slate-50 rounded-lg text-left transition-colors">
                             <Printer size={14} /> Imprimer
                          </button>
                          <button className="w-full flex items-center gap-2 px-4 py-3 text-[10px] font-bold text-slate-600 hover:bg-slate-50 rounded-lg text-left transition-colors">
                             <Archive size={14} /> Archiver
                          </button>
                          <div className="h-px bg-slate-100 my-1"></div>
                          <button onClick={handleDelete} className="w-full flex items-center gap-2 px-4 py-3 text-[10px] font-bold text-rose-600 hover:bg-rose-50 rounded-lg text-left transition-colors">
                             <Trash2 size={14} /> Supprimer
                          </button>
                        </div>
                     </div>
                   )}
                 </div>
              </div>

              <div className="flex-1 space-y-8 overflow-y-auto custom-scrollbar pr-2" onClick={() => setShowOptions(false)}>
                 
                 {/* Empty State / Call to Action for Drafts */}
                 {(selectedReport.status === 'brouillon' || selectedReport.discussions.length === 0) && (
                    <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex flex-col items-center text-center space-y-3">
                       <div className="p-3 bg-white rounded-full text-blue-500 shadow-sm"><PenTool size={20}/></div>
                       <div>
                          <h5 className="font-black text-blue-900 text-sm">Rédaction du PV en attente</h5>
                          <p className="text-[11px] text-blue-700/70 mt-1 max-w-sm mx-auto">
                             La réunion est passée ou planifiée, mais le compte rendu n'a pas encore été finalisé.
                          </p>
                       </div>
                       <button 
                         onClick={handleEdit}
                         className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/10"
                       >
                          Ouvrir l'éditeur de PV
                       </button>
                    </div>
                 )}

                 {/* ADMIN VALIDATION ZONE */}
                 {selectedReport.status === 'soumis_admin' && (
                    <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl mb-6 shadow-sm">
                       <h5 className="text-orange-800 font-black text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                          <AlertCircle size={14}/> Validation Requise
                       </h5>
                       <textarea 
                          className="w-full p-3 bg-white border border-orange-200 rounded-xl text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-orange-500/20 mb-3"
                          rows={2}
                          placeholder="Note de validation ou motif de rejet (obligatoire pour rejeter)..."
                          value={adminFeedback}
                          onChange={(e) => setAdminFeedback(e.target.value)}
                       />
                       <div className="flex gap-3 justify-end">
                          <button 
                             onClick={handleRejectReport}
                             className="px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 flex items-center gap-2"
                          >
                             <XCircle size={14}/> Rejeter
                          </button>
                          <button 
                             onClick={handleValidateReport}
                             className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 flex items-center gap-2 shadow-md"
                          >
                             <CheckCircle size={14}/> Valider
                          </button>
                       </div>
                    </div>
                 )}

                 {/* Admin Feedback Display (if any) */}
                 {selectedReport.adminFeedback && (
                    <div className="p-4 bg-slate-50 border-l-4 border-blue-400 rounded-r-xl">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Note de l'administrateur</p>
                       <p className="text-xs font-medium text-slate-700 italic">"{selectedReport.adminFeedback}"</p>
                    </div>
                 )}

                 {/* Presence Section */}
                 <section>
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                       <Users size={14}/> Présence & Quorum
                    </h5>
                    <div className="flex flex-wrap gap-3">
                      {selectedReport.attendees.length > 0 ? selectedReport.attendees.map((att, i) => (
                        <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
                           att.status === 'present' ? 'bg-emerald-50 border-emerald-100' : 
                           att.status === 'absent_excuse' ? 'bg-amber-50 border-amber-100' : 'bg-rose-50 border-rose-100'
                        }`}>
                           <div className={`w-2 h-2 rounded-full ${
                              att.status === 'present' ? 'bg-emerald-500' : att.status === 'absent_excuse' ? 'bg-amber-500' : 'bg-rose-500'
                           }`}></div>
                           <div>
                              <p className="text-[10px] font-black text-slate-700 leading-none">{att.name}</p>
                              <p className="text-[8px] font-bold text-slate-400 uppercase">{att.role}</p>
                           </div>
                        </div>
                      )) : <p className="text-xs text-slate-400 italic">Aucun participant enregistré.</p>}
                    </div>
                 </section>

                 {/* Agenda Section */}
                 <section>
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                       <FileText size={14}/> Ordre du Jour
                    </h5>
                    <div className="space-y-3">
                       {selectedReport.agenda.length > 0 ? selectedReport.agenda.map((item, i) => (
                         <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3">
                               <span className="text-xs font-black text-slate-300 w-4">{i+1}.</span>
                               <span className="text-xs font-bold text-slate-700">{item.title}</span>
                            </div>
                            <span className="text-[9px] font-black bg-white px-2 py-1 rounded text-slate-400 border border-slate-100">{item.duration} min</span>
                         </div>
                       )) : <p className="text-xs text-slate-400 italic">Aucun point à l'ordre du jour.</p>}
                    </div>
                 </section>

                 {/* Content Preview */}
                 {selectedReport.discussions && (
                   <section>
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Discussions</h5>
                      <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-600 leading-relaxed border border-slate-100">
                         {selectedReport.discussions}
                      </div>
                   </section>
                 )}

                 {/* Actions Section */}
                 <section>
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                       <CheckCircle size={14}/> Actions à suivre
                    </h5>
                    <div className="space-y-3">
                       {selectedReport.actionItems.length > 0 ? selectedReport.actionItems.map((action, i) => (
                         <div key={i} className="flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                            <div className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center ${
                               action.status === 'termine' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'
                            }`}>
                               {action.status === 'termine' && <CheckCircle size={10} className="text-white"/>}
                            </div>
                            <div className="flex-1">
                               <p className="text-xs font-bold text-slate-800 line-through-if-done">{action.description}</p>
                               <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[9px] font-black text-slate-400 uppercase bg-slate-50 px-1.5 py-0.5 rounded">Resp: {action.assignedTo}</span>
                                  <span className="text-[9px] font-bold text-rose-400">Échéance: {action.dueDate}</span>
                               </div>
                            </div>
                         </div>
                       )) : <p className="text-xs text-slate-400 italic">Aucune action assignée.</p>}
                    </div>
                 </section>
              </div>

              {/* Detail Footer */}
              <div className="pt-8 mt-4 border-t border-slate-100 flex justify-end gap-4" onClick={() => setShowOptions(false)}>
                 <button className="px-6 py-4 bg-slate-50 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-slate-100 hover:bg-slate-100">
                    Exporter PDF
                 </button>
                 <button className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-900/10 flex items-center gap-3 hover:bg-emerald-700 transition-all">
                    Envoyer par Email <ArrowRight size={16}/>
                 </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center glass-card bg-slate-50/50 border-dashed border-2 border-slate-200 text-slate-400">
               <FileText size={64} className="mb-6 opacity-20"/>
               <h4 className="text-lg font-black text-slate-500">Aucune réunion sélectionnée</h4>
               <p className="text-xs font-medium mt-2 max-w-xs text-center">Cliquez sur une réunion dans la liste pour voir les détails, rédiger le PV ou commencez-en une nouvelle.</p>
               <button 
                 onClick={() => { setReportToEdit(undefined); setShowEditor(true); }}
                 className="mt-6 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:border-emerald-200 hover:text-emerald-600 transition-all"
               >
                 + Nouvelle Réunion
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingManager;
