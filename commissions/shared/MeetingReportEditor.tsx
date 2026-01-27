
import React, { useState, useEffect } from 'react';
import { CommissionType, InternalMeetingReport, MeetingType, MeetingAttendee, AgendaItem, MeetingActionItem, AttendanceStatus } from '../../types';
import { Save, X, Users, List, FileText, CheckSquare, Send, Clock, MapPin, Plus, Trash2, Calendar, UserCheck, UserX, UserMinus, Loader2 } from 'lucide-react';
import { createReport, submitReportToAdmin, updateReport } from '../../services/reportService';
import { MOCK_MEMBERS } from '../../constants';

interface Props {
  commission: CommissionType;
  existingReport?: InternalMeetingReport;
  onClose: () => void;
}

const MeetingReportEditor: React.FC<Props> = ({ commission, existingReport, onClose }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'attendees' | 'agenda' | 'content' | 'actions'>('info');
  const [isSaving, setIsSaving] = useState(false);
  
  // Form States
  const [title, setTitle] = useState(existingReport?.title || '');
  const [date, setDate] = useState(existingReport?.date || new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(existingReport?.startTime || '10:00');
  const [endTime, setEndTime] = useState(existingReport?.endTime || '12:00');
  const [location, setLocation] = useState(existingReport?.location || '');
  const [type, setType] = useState<MeetingType>(existingReport?.type || 'ordinaire');
  const [discussions, setDiscussions] = useState(existingReport?.discussions || '');
  const [decisions, setDecisions] = useState<string[]>(existingReport?.decisions || []);
  
  // Sub-lists States
  const [attendees, setAttendees] = useState<MeetingAttendee[]>(existingReport?.attendees || []);
  const [agenda, setAgenda] = useState<AgendaItem[]>(existingReport?.agenda || []);
  const [actions, setActions] = useState<MeetingActionItem[]>(existingReport?.actionItems || []);

  // Temporary inputs
  const [newDecision, setNewDecision] = useState('');
  const [newAgendaTitle, setNewAgendaTitle] = useState('');
  const [newAgendaPresenter, setNewAgendaPresenter] = useState('');
  const [newAgendaDuration, setNewAgendaDuration] = useState(15);
  const [newActionDesc, setNewActionDesc] = useState('');
  const [newActionAssignee, setNewActionAssignee] = useState('');
  const [newActionDue, setNewActionDue] = useState('');

  // Initialization: Load members if empty attendees
  useEffect(() => {
    if (attendees.length === 0) {
      // Mock loading members for this commission
      const commMembers = MOCK_MEMBERS.filter(m => m.commissions.some(c => c.type === commission));
      setAttendees(commMembers.map(m => ({
        memberId: m.id,
        name: `${m.firstName} ${m.lastName}`,
        role: 'participant',
        status: 'present'
      })));
    }
  }, []);

  const handleSave = async (submit: boolean = false) => {
    setIsSaving(true);
    const reportData: Partial<InternalMeetingReport> = {
      commission,
      title, date, startTime, endTime, location, type,
      discussions, decisions,
      attendees, agenda, actionItems: actions,
      confidentiality: 'interne', // Default
      createdBy: 'Utilisateur Courant',
      status: submit ? 'soumis_admin' : (existingReport?.status || 'brouillon')
    };

    // Simulation de délai réseau
    await new Promise(resolve => setTimeout(resolve, 800));

    if (existingReport) {
      updateReport(existingReport.id, reportData);
    } else {
      createReport(reportData);
    }
    
    setIsSaving(false);
    onClose();
  };

  const updateAttendance = (memberId: string, status: AttendanceStatus) => {
    setAttendees(prev => prev.map(a => a.memberId === memberId ? { ...a, status } : a));
  };

  const addAgendaItem = () => {
    if (newAgendaTitle) {
      setAgenda([...agenda, {
        id: Date.now().toString(),
        title: newAgendaTitle,
        duration: newAgendaDuration,
        presenter: newAgendaPresenter,
        notes: ''
      }]);
      setNewAgendaTitle('');
    }
  };

  const addActionItem = () => {
    if (newActionDesc) {
      setActions([...actions, {
        id: Date.now().toString(),
        description: newActionDesc,
        assignedTo: newActionAssignee,
        dueDate: newActionDue,
        status: 'a_faire'
      }]);
      setNewActionDesc('');
    }
  };

  return (
    <div className="fixed inset-0 z-[150] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl flex flex-col h-[90vh] overflow-hidden animate-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <FileText size={24} className="text-blue-600" /> {existingReport ? 'Éditer le Compte Rendu' : 'Nouveau Compte Rendu'}
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Commission {commission}</p>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={() => handleSave(false)} 
                disabled={isSaving}
                className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 disabled:opacity-50"
             >
                {isSaving ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>}
                Sauvegarder
             </button>
             <button 
                onClick={() => handleSave(true)} 
                disabled={isSaving}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
             >
                <Send size={16}/> Soumettre
             </button>
             <button onClick={onClose} className="p-3 bg-slate-100 text-slate-400 rounded-xl hover:text-rose-500 hover:bg-rose-50 transition-all"><X size={20}/></button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-8 pt-4 border-b border-slate-100 flex gap-1 bg-white overflow-x-auto no-scrollbar">
           {[
             { id: 'info', label: 'Infos Générales', icon: Clock },
             { id: 'attendees', label: 'Feuille de Présence', icon: Users },
             { id: 'agenda', label: 'Ordre du Jour', icon: List },
             { id: 'content', label: 'Discussions & Décisions', icon: FileText },
             { id: 'actions', label: 'Plan d\'Action', icon: CheckSquare },
           ].map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-2 px-6 py-4 border-b-2 text-xs font-bold uppercase tracking-widest transition-all ${
                 activeTab === tab.id ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-400 hover:text-slate-600'
               }`}
             >
                <tab.icon size={16} /> {tab.label}
             </button>
           ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/30">
           
           {/* TAB 1: INFO */}
           {activeTab === 'info' && (
             <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Titre de la réunion</label>
                   <input type="text" className="w-full p-4 bg-white border border-slate-100 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20" 
                     value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Réunion Mensuelle Mai" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</label>
                      <select className="w-full p-4 bg-white border border-slate-100 rounded-xl font-bold text-slate-800 outline-none"
                        value={type} onChange={e => setType(e.target.value as MeetingType)}>
                         <option value="ordinaire">Ordinaire</option>
                         <option value="extraordinaire">Extraordinaire</option>
                         <option value="urgence">Urgence</option>
                         <option value="planification">Planification</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</label>
                      <input type="date" className="w-full p-4 bg-white border border-slate-100 rounded-xl font-bold text-slate-800 outline-none" 
                        value={date} onChange={e => setDate(e.target.value)} />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Début</label>
                      <input type="time" className="w-full p-4 bg-white border border-slate-100 rounded-xl font-bold text-slate-800 outline-none" 
                        value={startTime} onChange={e => setStartTime(e.target.value)} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fin</label>
                      <input type="time" className="w-full p-4 bg-white border border-slate-100 rounded-xl font-bold text-slate-800 outline-none" 
                        value={endTime} onChange={e => setEndTime(e.target.value)} />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lieu / Lien</label>
                   <div className="relative">
                      <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"/>
                      <input type="text" className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-xl font-bold text-slate-800 outline-none" 
                        value={location} onChange={e => setLocation(e.target.value)} placeholder="Siège Dahira ou Lien Google Meet" />
                   </div>
                </div>
             </div>
           )}

           {/* TAB 2: ATTENDEES */}
           {activeTab === 'attendees' && (
             <div className="space-y-6 animate-in fade-in">
                <div className="flex justify-between items-center mb-4">
                   <h4 className="font-black text-slate-700">Liste des Convoqués</h4>
                   <div className="text-xs font-bold text-slate-500">
                      Présents: <span className="text-emerald-600">{attendees.filter(a => a.status === 'present').length}</span> / {attendees.length}
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {attendees.map(attendee => (
                     <div key={attendee.memberId} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-500 text-xs">
                              {attendee.name.split(' ').map(n => n[0]).join('')}
                           </div>
                           <div>
                              <p className="text-sm font-black text-slate-800">{attendee.name}</p>
                              <p className="text-[10px] text-slate-400 uppercase font-bold">{attendee.role}</p>
                           </div>
                        </div>
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                           <button onClick={() => updateAttendance(attendee.memberId, 'present')} className={`p-2 rounded-md transition-all ${attendee.status === 'present' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-emerald-500'}`} title="Présent"><UserCheck size={16}/></button>
                           <button onClick={() => updateAttendance(attendee.memberId, 'absent_excuse')} className={`p-2 rounded-md transition-all ${attendee.status === 'absent_excuse' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-400 hover:text-amber-500'}`} title="Excusé"><UserMinus size={16}/></button>
                           <button onClick={() => updateAttendance(attendee.memberId, 'absent')} className={`p-2 rounded-md transition-all ${attendee.status === 'absent' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-400 hover:text-rose-500'}`} title="Absent"><UserX size={16}/></button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {/* TAB 3: AGENDA */}
           {activeTab === 'agenda' && (
             <div className="space-y-6 animate-in fade-in">
                <div className="flex gap-4 items-end bg-slate-100/50 p-4 rounded-2xl border border-slate-200">
                   <div className="flex-1 space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase">Sujet</label>
                      <input type="text" className="w-full p-2 bg-white rounded-lg text-sm outline-none" value={newAgendaTitle} onChange={e => setNewAgendaTitle(e.target.value)} />
                   </div>
                   <div className="w-32 space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase">Durée (min)</label>
                      <input type="number" className="w-full p-2 bg-white rounded-lg text-sm outline-none" value={newAgendaDuration} onChange={e => setNewAgendaDuration(Number(e.target.value))} />
                   </div>
                   <div className="w-48 space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase">Intervenant</label>
                      <input type="text" className="w-full p-2 bg-white rounded-lg text-sm outline-none" value={newAgendaPresenter} onChange={e => setNewAgendaPresenter(e.target.value)} />
                   </div>
                   <button onClick={addAgendaItem} className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"><Plus size={18}/></button>
                </div>

                <div className="space-y-2">
                   {agenda.map((item, i) => (
                     <div key={item.id} className="flex items-center gap-4 p-4 bg-white border-l-4 border-blue-500 rounded-r-xl shadow-sm">
                        <span className="text-xl font-black text-blue-200 w-8">{i+1}</span>
                        <div className="flex-1">
                           <p className="text-sm font-bold text-slate-800">{item.title}</p>
                           <p className="text-[10px] text-slate-400 uppercase">Par {item.presenter || 'Non défini'}</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-xs font-black text-slate-600">
                           <Clock size={12}/> {item.duration} min
                        </div>
                        <button onClick={() => setAgenda(agenda.filter(a => a.id !== item.id))} className="text-slate-300 hover:text-rose-500"><Trash2 size={16}/></button>
                     </div>
                   ))}
                   {agenda.length === 0 && <p className="text-center text-slate-400 text-xs italic py-10">Aucun point à l'ordre du jour.</p>}
                </div>
             </div>
           )}

           {/* TAB 4: CONTENT */}
           {activeTab === 'content' && (
             <div className="space-y-8 animate-in fade-in">
                <div className="space-y-3">
                   <h4 className="font-black text-slate-700 text-sm uppercase tracking-widest">Résumé des Échanges</h4>
                   <textarea 
                     className="w-full h-64 p-4 bg-white border border-slate-100 rounded-2xl text-sm leading-relaxed outline-none focus:border-blue-300 resize-none font-medium text-slate-600"
                     placeholder="Saisir le déroulé de la réunion, les points clés abordés..."
                     value={discussions} onChange={e => setDiscussions(e.target.value)}
                   />
                </div>

                <div className="space-y-3">
                   <h4 className="font-black text-slate-700 text-sm uppercase tracking-widest">Décisions Actées</h4>
                   <div className="flex gap-2">
                      <input 
                        type="text" 
                        className="flex-1 p-3 bg-white border border-slate-100 rounded-xl text-sm outline-none focus:border-emerald-300"
                        placeholder="Nouvelle décision..."
                        value={newDecision} onChange={e => setNewDecision(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (setDecisions([...decisions, newDecision]), setNewDecision(''))}
                      />
                      <button 
                        onClick={() => { if(newDecision) { setDecisions([...decisions, newDecision]); setNewDecision(''); }}}
                        className="px-4 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase hover:bg-emerald-700 transition-all"
                      >Ajouter</button>
                   </div>
                   <div className="space-y-2 mt-4">
                      {decisions.map((d, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                           <CheckSquare size={16} className="text-emerald-600 mt-0.5 shrink-0"/>
                           <p className="text-sm font-medium text-emerald-900 flex-1">{d}</p>
                           <button onClick={() => setDecisions(decisions.filter((_, idx) => idx !== i))} className="text-emerald-300 hover:text-rose-500"><X size={14}/></button>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
           )}

           {/* TAB 5: ACTIONS */}
           {activeTab === 'actions' && (
             <div className="space-y-6 animate-in fade-in">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                   <div className="md:col-span-2 space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase">Tâche à faire</label>
                      <input type="text" className="w-full p-2 bg-white rounded-lg text-sm outline-none" value={newActionDesc} onChange={e => setNewActionDesc(e.target.value)} />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase">Responsable</label>
                      <input type="text" className="w-full p-2 bg-white rounded-lg text-sm outline-none" value={newActionAssignee} onChange={e => setNewActionAssignee(e.target.value)} />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase">Échéance</label>
                      <div className="flex gap-2">
                         <input type="date" className="w-full p-2 bg-white rounded-lg text-sm outline-none" value={newActionDue} onChange={e => setNewActionDue(e.target.value)} />
                         <button onClick={addActionItem} className="p-2 bg-slate-800 text-white rounded-lg hover:bg-black"><Plus size={18}/></button>
                      </div>
                   </div>
                </div>

                <div className="space-y-3">
                   {actions.map((action) => (
                     <div key={action.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                        <div className="flex items-center gap-4">
                           <div className="w-2 h-12 bg-amber-400 rounded-full"></div>
                           <div>
                              <p className="text-sm font-bold text-slate-800">{action.description}</p>
                              <p className="text-[10px] text-slate-400 uppercase font-bold mt-1">
                                 Pour: {action.assignedTo || 'Non assigné'} • Avant le: {action.dueDate || 'N/A'}
                              </p>
                           </div>
                        </div>
                        <button onClick={() => setActions(actions.filter(a => a.id !== action.id))} className="text-slate-300 hover:text-rose-500"><Trash2 size={16}/></button>
                     </div>
                   ))}
                   {actions.length === 0 && <p className="text-center text-slate-400 text-xs italic py-10">Aucune action planifiée.</p>}
                </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default MeetingReportEditor;
