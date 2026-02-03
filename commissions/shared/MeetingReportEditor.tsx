
import React, { useState, useEffect, useMemo } from 'react';
import { CommissionType, InternalMeetingReport, MeetingType, MeetingAttendee, AgendaItem, MeetingActionItem, AttendanceStatus, MeetingDecision } from '../../types';
import { Save, X, Users, List, FileText, CheckSquare, Send, Clock, MapPin, Plus, Trash2, Calendar, UserCheck, UserX, UserMinus, Loader2, QrCode, ScanLine, Filter, Bell, Smartphone, Mail, CheckCircle, XCircle, MinusCircle, Gavel } from 'lucide-react';
import { createReport, submitReportToAdmin, updateReport } from '../../services/reportService';
import { useData } from '../../contexts/DataContext';
import QRCode from 'react-qr-code';

interface Props {
  commission: CommissionType;
  existingReport?: InternalMeetingReport;
  onClose: () => void;
}

const MeetingReportEditor: React.FC<Props> = ({ commission, existingReport, onClose }) => {
  const { members } = useData();
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
  const [decisions, setDecisions] = useState<MeetingDecision[]>(existingReport?.decisions || []);
  const [meetingQrCode, setMeetingQrCode] = useState(existingReport?.meetingQrCode || '');
  
  // Notifications State
  const [notifications, setNotifications] = useState({
    emailInvite: true,
    pushReminder: true,
    smsUrgent: false
  });

  // Sub-lists States
  const [attendees, setAttendees] = useState<MeetingAttendee[]>(existingReport?.attendees || []);
  const [agenda, setAgenda] = useState<AgendaItem[]>(existingReport?.agenda || []);
  const [actions, setActions] = useState<MeetingActionItem[]>(existingReport?.actionItems || []);

  // UI States for Attendance
  const [attendeeFilter, setAttendeeFilter] = useState<'all' | AttendanceStatus>('all');
  const [showQRModal, setShowQRModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Temporary inputs
  const [newDecisionDesc, setNewDecisionDesc] = useState('');
  const [newAgendaTitle, setNewAgendaTitle] = useState('');
  const [newAgendaPresenter, setNewAgendaPresenter] = useState('');
  const [newAgendaDuration, setNewAgendaDuration] = useState(15);
  const [newActionDesc, setNewActionDesc] = useState('');
  const [newActionAssignee, setNewActionAssignee] = useState('');
  const [newActionDue, setNewActionDue] = useState('');

  // Initialization: Load members if empty attendees
  useEffect(() => {
    if (attendees.length === 0) {
      // Use real members from context
      const commMembers = members.filter(m => m.commissions.some(c => c.type === commission));
      setAttendees(commMembers.map(m => ({
        memberId: m.id,
        name: `${m.firstName} ${m.lastName}`,
        role: 'participant',
        status: 'absent' // Default to absent until marked
      })));
    }
  }, [members, commission]); 

  // --- STATS ATTENDEES ---
  const attendanceStats = useMemo(() => {
    const total = attendees.length;
    const present = attendees.filter(a => a.status === 'present').length;
    const excused = attendees.filter(a => a.status === 'absent_excuse').length;
    const absent = attendees.filter(a => a.status === 'absent').length;
    return { total, present, excused, absent };
  }, [attendees]);

  const filteredAttendees = useMemo(() => {
     if (attendeeFilter === 'all') return attendees;
     return attendees.filter(a => a.status === attendeeFilter);
  }, [attendees, attendeeFilter]);

  // --- HANDLERS ---

  const handleSave = async (submit: boolean = false) => {
    setIsSaving(true);
    const reportData: Partial<InternalMeetingReport> = {
      commission,
      title, date, startTime, endTime, location, type,
      discussions, decisions,
      attendees, agenda, actionItems: actions,
      confidentiality: 'interne', 
      createdBy: 'Utilisateur Courant',
      meetingQrCode: meetingQrCode || `MEETING-${Date.now()}`, // Generate if missing
      status: submit ? 'soumis_admin' : (existingReport?.status || 'brouillon')
    };

    // Simulation de l'envoi des notifications
    if (notifications.pushReminder || notifications.emailInvite) {
        console.log(`Sending notifications: Push=${notifications.pushReminder}, Email=${notifications.emailInvite}`);
        // Dans une vraie app, appel API ici
    }

    await new Promise(resolve => setTimeout(resolve, 800));

    if (existingReport) {
      updateReport(existingReport.id, reportData);
    } else {
      createReport(reportData);
    }
    
    // Feedback visuel si notifications activées
    if (notifications.pushReminder) {
        alert("Réunion enregistrée. Les notifications Push ont été envoyées aux membres.");
    }

    setIsSaving(false);
    onClose();
  };

  const updateAttendance = (memberId: string, status: AttendanceStatus) => {
    setAttendees(prev => prev.map(a => a.memberId === memberId ? { ...a, status } : a));
  };

  const generateMeetingQR = () => {
     const code = `MAJMA-MEET-${commission.substring(0,3).toUpperCase()}-${Date.now()}`;
     setMeetingQrCode(code);
     setShowQRModal(true);
  };

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
       // Simulate scanning a random absent member
       const absentMembers = attendees.filter(a => a.status === 'absent');
       if (absentMembers.length > 0) {
          const randomMember = absentMembers[Math.floor(Math.random() * absentMembers.length)];
          updateAttendance(randomMember.memberId, 'present');
          alert(`✅ Présence validée : ${randomMember.name}`);
       } else {
          alert("Tous les membres sont déjà marqués présents ou excusés.");
       }
       setIsScanning(false);
    }, 1500);
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

  const addDecision = () => {
     if (newDecisionDesc.trim()) {
        setDecisions([...decisions, {
           id: Date.now().toString(),
           description: newDecisionDesc,
           votes: { for: 0, against: 0, abstain: 0 },
           status: 'pending'
        }]);
        setNewDecisionDesc('');
     }
  };

  const updateVote = (id: string, type: 'for' | 'against' | 'abstain', delta: number) => {
     setDecisions(prev => prev.map(d => {
        if (d.id === id) {
           const newVotes = { ...d.votes, [type]: Math.max(0, d.votes[type] + delta) };
           // Auto-status logic
           let status: 'adopted' | 'rejected' | 'pending' = 'pending';
           const total = newVotes.for + newVotes.against + newVotes.abstain;
           if (total > 0) {
              if (newVotes.for > newVotes.against) status = 'adopted';
              else if (newVotes.against >= newVotes.for) status = 'rejected';
           }
           return { ...d, votes: newVotes, status };
        }
        return d;
     }));
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
      {/* QR Code Modal */}
      {showQRModal && (
         <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center text-center max-w-sm w-full animate-in zoom-in duration-300 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
               <button onClick={() => setShowQRModal(false)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
               
               <h3 className="text-xl font-black text-slate-900 mb-2">Émargement Digital</h3>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-8">Scannez pour valider votre présence</p>
               
               <div className="bg-white p-4 rounded-3xl shadow-inner border border-slate-100 mb-6">
                  <QRCode value={meetingQrCode || 'init'} size={200} level="M" />
               </div>
               
               <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-mono text-slate-500">
                  <QrCode size={12}/> {meetingQrCode}
               </div>
               <p className="mt-6 text-xs text-slate-400 italic">Code unique de session sécurisé</p>
            </div>
         </div>
      )}

      {/* Scanner Simulator Modal */}
      {showScanner && (
         <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
            <div className="bg-slate-900 w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl border border-slate-800 relative flex flex-col">
               <div className="absolute top-6 right-6 z-20">
                  <button onClick={() => setShowScanner(false)} className="p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md"><X size={20}/></button>
               </div>
               
               <div className="flex-1 relative bg-black flex flex-col items-center justify-center">
                  {/* Camera UI Simulation */}
                  <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
                  
                  <div className="w-64 h-64 border-2 border-emerald-500/50 rounded-[2rem] relative flex items-center justify-center z-10">
                     <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-2xl"></div>
                     <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-2xl"></div>
                     <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-2xl"></div>
                     <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-2xl"></div>
                     <div className="w-full h-1 bg-emerald-500/50 absolute top-1/2 -translate-y-1/2 animate-pulse shadow-[0_0_15px_#10b981]"></div>
                  </div>
                  <p className="mt-8 text-white font-black uppercase text-xs tracking-widest z-10">Placez le QR Code dans le cadre</p>
               </div>

               <div className="p-6 bg-slate-900 border-t border-slate-800">
                  <button 
                     onClick={handleSimulateScan}
                     disabled={isScanning}
                     className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-emerald-900/20 hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                     {isScanning ? <Loader2 size={16} className="animate-spin"/> : <ScanLine size={16}/>}
                     {isScanning ? 'Analyse...' : 'Simuler Scan Membre'}
                  </button>
               </div>
            </div>
         </div>
      )}

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
             <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in">
                <div className="space-y-6">
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

                {/* NOTIFICATIONS SETTINGS */}
                <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                    <h4 className="text-sm font-black text-indigo-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Bell size={16} /> Notifications & Rappels
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div 
                           onClick={() => setNotifications(prev => ({...prev, pushReminder: !prev.pushReminder}))}
                           className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${notifications.pushReminder ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-500'}`}
                        >
                            <Bell size={18} />
                            <div>
                                <p className="text-[10px] font-black uppercase">Push Mobile</p>
                                <p className="text-[9px] opacity-80">Rappel 1h avant</p>
                            </div>
                        </div>
                        <div 
                           onClick={() => setNotifications(prev => ({...prev, emailInvite: !prev.emailInvite}))}
                           className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${notifications.emailInvite ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-500'}`}
                        >
                            <Mail size={18} />
                            <div>
                                <p className="text-[10px] font-black uppercase">Invitation Email</p>
                                <p className="text-[9px] opacity-80">Envoyer convocation</p>
                            </div>
                        </div>
                        <div 
                           onClick={() => setNotifications(prev => ({...prev, smsUrgent: !prev.smsUrgent}))}
                           className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${notifications.smsUrgent ? 'bg-rose-600 border-rose-600 text-white' : 'bg-white border-slate-200 text-slate-500'}`}
                        >
                            <Smartphone size={18} />
                            <div>
                                <p className="text-[10px] font-black uppercase">SMS Urgent</p>
                                <p className="text-[9px] opacity-80">Si non lu</p>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
           )}

           {/* TAB 2: ATTENDEES (ENHANCED) */}
           {activeTab === 'attendees' && (
             <div className="space-y-8 animate-in fade-in">
                
                {/* Stats Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                   <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center justify-between">
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                         <p className="text-2xl font-black text-slate-900">{attendanceStats.total}</p>
                      </div>
                      <div className="p-3 bg-slate-50 text-slate-400 rounded-xl"><Users size={20}/></div>
                   </div>
                   <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl shadow-sm flex items-center justify-between">
                      <div>
                         <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Présents</p>
                         <p className="text-2xl font-black text-emerald-900">{attendanceStats.present}</p>
                      </div>
                      <div className="p-3 bg-white text-emerald-500 rounded-xl"><UserCheck size={20}/></div>
                   </div>
                   <div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl shadow-sm flex items-center justify-between">
                      <div>
                         <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Excusés</p>
                         <p className="text-2xl font-black text-amber-900">{attendanceStats.excused}</p>
                      </div>
                      <div className="p-3 bg-white text-amber-500 rounded-xl"><UserMinus size={20}/></div>
                   </div>
                   <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl shadow-sm flex items-center justify-between">
                      <div>
                         <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest mb-1">Absents</p>
                         <p className="text-2xl font-black text-rose-900">{attendanceStats.absent}</p>
                      </div>
                      <div className="p-3 bg-white text-rose-500 rounded-xl"><UserX size={20}/></div>
                   </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                   <div className="flex p-1 bg-slate-50 rounded-xl overflow-x-auto no-scrollbar max-w-full">
                      {[
                        { id: 'all', label: 'Tous' },
                        { id: 'present', label: 'Présents' },
                        { id: 'absent_excuse', label: 'Excusés' },
                        { id: 'absent', label: 'Absents' }
                      ].map(f => (
                         <button 
                           key={f.id}
                           onClick={() => setAttendeeFilter(f.id as any)}
                           className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                             attendeeFilter === f.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                           }`}
                         >
                            {f.label}
                         </button>
                      ))}
                   </div>

                   <div className="flex gap-2 w-full md:w-auto">
                      <button 
                        onClick={() => setShowScanner(true)}
                        className="flex-1 md:flex-none px-4 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all shadow-md"
                      >
                         <ScanLine size={14}/> Scanner
                      </button>
                      <button 
                        onClick={generateMeetingQR}
                        className="flex-1 md:flex-none px-4 py-2.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-100 transition-all"
                      >
                         <QrCode size={14}/> QR Réunion
                      </button>
                   </div>
                </div>

                {/* List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {filteredAttendees.map(attendee => (
                     <div key={attendee.memberId} className={`flex items-center justify-between p-4 bg-white border rounded-2xl shadow-sm transition-all ${
                       attendee.status === 'present' ? 'border-emerald-200 bg-emerald-50/10' :
                       attendee.status === 'absent_excuse' ? 'border-amber-200 bg-amber-50/10' :
                       'border-slate-100'
                     }`}>
                        <div className="flex items-center gap-3">
                           <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs ${
                             attendee.status === 'present' ? 'bg-emerald-100 text-emerald-600' : 
                             attendee.status === 'absent_excuse' ? 'bg-amber-100 text-amber-600' :
                             'bg-slate-100 text-slate-500'
                           }`}>
                              {attendee.name.split(' ').map(n => n[0]).join('')}
                           </div>
                           <div>
                              <p className="text-sm font-black text-slate-800">{attendee.name}</p>
                              <p className="text-[10px] text-slate-400 uppercase font-bold">{attendee.role}</p>
                           </div>
                        </div>
                        <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100">
                           <button onClick={() => updateAttendance(attendee.memberId, 'present')} className={`p-2 rounded-md transition-all ${attendee.status === 'present' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-300 hover:text-emerald-500 hover:bg-white'}`} title="Présent"><UserCheck size={16}/></button>
                           <button onClick={() => updateAttendance(attendee.memberId, 'absent_excuse')} className={`p-2 rounded-md transition-all ${attendee.status === 'absent_excuse' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-300 hover:text-amber-500 hover:bg-white'}`} title="Excusé"><UserMinus size={16}/></button>
                           <button onClick={() => updateAttendance(attendee.memberId, 'absent')} className={`p-2 rounded-md transition-all ${attendee.status === 'absent' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-300 hover:text-rose-500 hover:bg-white'}`} title="Absent"><UserX size={16}/></button>
                        </div>
                     </div>
                   ))}
                   {filteredAttendees.length === 0 && <p className="text-xs text-slate-400 italic text-center col-span-2 py-8">Aucun membre ne correspond aux filtres.</p>}
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

           {/* TAB 4: CONTENT & VOTING */}
           {activeTab === 'content' && (
             <div className="space-y-8 animate-in fade-in">
                <div className="space-y-3">
                   <h4 className="font-black text-slate-700 text-sm uppercase tracking-widest">Résumé des Échanges</h4>
                   <textarea 
                     className="w-full h-40 p-4 bg-white border border-slate-100 rounded-2xl text-sm leading-relaxed outline-none focus:border-blue-300 resize-none font-medium text-slate-600"
                     placeholder="Saisir le déroulé de la réunion, les points clés abordés..."
                     value={discussions} onChange={e => setDiscussions(e.target.value)}
                   />
                </div>

                <div className="space-y-3">
                   <h4 className="font-black text-slate-700 text-sm uppercase tracking-widest flex items-center gap-2">
                      <Gavel size={16} className="text-emerald-500"/> Décisions & Votes
                   </h4>
                   
                   <div className="flex gap-2">
                      <input 
                        type="text" 
                        className="flex-1 p-3 bg-white border border-slate-100 rounded-xl text-sm outline-none focus:border-emerald-300"
                        placeholder="Nouvelle décision à soumettre..."
                        value={newDecisionDesc} onChange={e => setNewDecisionDesc(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addDecision()}
                      />
                      <button 
                        onClick={addDecision}
                        className="px-4 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase hover:bg-emerald-700 transition-all"
                      >Ajouter</button>
                   </div>

                   <div className="space-y-4 mt-4">
                      {decisions.map((d) => (
                        <div key={d.id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                           <div className="flex justify-between items-start mb-4">
                              <p className="text-sm font-bold text-slate-800 flex-1 pr-4">{d.description}</p>
                              <div className="flex gap-2">
                                 <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                    d.status === 'adopted' ? 'bg-emerald-100 text-emerald-700' :
                                    d.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'
                                 }`}>
                                    {d.status === 'adopted' ? 'Adoptée' : d.status === 'rejected' ? 'Rejetée' : 'En cours'}
                                 </span>
                                 <button onClick={() => setDecisions(decisions.filter(x => x.id !== d.id))} className="text-slate-300 hover:text-rose-500"><X size={14}/></button>
                              </div>
                           </div>
                           
                           {/* Voting Controls */}
                           <div className="flex items-center gap-4 bg-slate-50/50 p-2 rounded-xl">
                              <div className="flex-1 flex items-center justify-between px-2">
                                 <span className="text-[10px] font-bold text-emerald-600 uppercase flex items-center gap-1"><CheckCircle size={12}/> Pour</span>
                                 <div className="flex items-center gap-2">
                                    <button onClick={() => updateVote(d.id, 'for', -1)} className="p-1 hover:bg-white rounded text-slate-400"><MinusCircle size={12}/></button>
                                    <span className="font-mono font-black text-sm w-4 text-center">{d.votes.for}</span>
                                    <button onClick={() => updateVote(d.id, 'for', 1)} className="p-1 hover:bg-white rounded text-emerald-500"><Plus size={12}/></button>
                                 </div>
                              </div>
                              <div className="w-px h-6 bg-slate-200"></div>
                              <div className="flex-1 flex items-center justify-between px-2">
                                 <span className="text-[10px] font-bold text-rose-600 uppercase flex items-center gap-1"><XCircle size={12}/> Contre</span>
                                 <div className="flex items-center gap-2">
                                    <button onClick={() => updateVote(d.id, 'against', -1)} className="p-1 hover:bg-white rounded text-slate-400"><MinusCircle size={12}/></button>
                                    <span className="font-mono font-black text-sm w-4 text-center">{d.votes.against}</span>
                                    <button onClick={() => updateVote(d.id, 'against', 1)} className="p-1 hover:bg-white rounded text-rose-500"><Plus size={12}/></button>
                                 </div>
                              </div>
                              <div className="w-px h-6 bg-slate-200"></div>
                              <div className="flex-1 flex items-center justify-between px-2">
                                 <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">Abst.</span>
                                 <div className="flex items-center gap-2">
                                    <button onClick={() => updateVote(d.id, 'abstain', -1)} className="p-1 hover:bg-white rounded text-slate-400"><MinusCircle size={12}/></button>
                                    <span className="font-mono font-black text-sm w-4 text-center">{d.votes.abstain}</span>
                                    <button onClick={() => updateVote(d.id, 'abstain', 1)} className="p-1 hover:bg-white rounded text-slate-600"><Plus size={12}/></button>
                                 </div>
                              </div>
                           </div>
                        </div>
                      ))}
                      {decisions.length === 0 && <p className="text-center text-slate-400 text-xs italic py-4">Aucune décision enregistrée.</p>}
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
