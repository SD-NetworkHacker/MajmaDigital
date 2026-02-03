
import React, { useState } from 'react';
import { ShieldCheck, Activity, Users, Database, ChevronRight, HardDrive, Cpu, Wifi, Zap, AlertTriangle, RefreshCcw, Power, Loader2, Check, Terminal, FileJson, Lock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '../contexts/DataContext';

const AdminModule: React.FC = () => {
  const { userProfile, members, reports, budgetRequests, contributions, events } = useData();
  
  // Simulation de données temps réel pour le monitoring
  const [performanceData] = useState([
    { time: '10:00', load: 12, ai: 45 },
    { time: '10:05', load: 15, ai: 30 },
    { time: '10:10', load: 14, ai: 60 },
    { time: '10:15', load: 18, ai: 40 },
    { time: '10:20', load: 13, ai: 85 },
    { time: '10:25', load: 16, ai: 50 },
  ]);

  const [isSyncing, setIsSyncing] = useState(false);
  
  // Admin Actions States
  const [actionStates, setActionStates] = useState<Record<string, 'idle' | 'loading' | 'success'>>({
    backup: 'idle',
    maintenance: 'idle',
    roles: 'idle',
    reboot: 'idle'
  });
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
        window.location.reload(); 
        setIsSyncing(false);
    }, 1500);
  };

  const triggerAction = async (action: string) => {
    setActionStates(prev => ({ ...prev, [action]: 'loading' }));

    // Logic based on action
    if (action === 'backup') {
        await new Promise(r => setTimeout(r, 2000)); // Simulate compression
        const backupData = {
            metadata: { date: new Date().toISOString(), version: '3.1.0', generator: 'MajmaAdmin' },
            members,
            contributions,
            events,
            reports,
            budgetRequests
        };
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `MAJMA_BACKUP_${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } 
    else if (action === 'maintenance') {
        await new Promise(r => setTimeout(r, 1000));
        setMaintenanceMode(!maintenanceMode);
    }
    else if (action === 'roles') {
        await new Promise(r => setTimeout(r, 1500));
        // Simulation of permission audit
        console.log("Audit des rôles terminé");
    }
    else if (action === 'reboot') {
        await new Promise(r => setTimeout(r, 3000));
        // Simulation reboot
    }

    setActionStates(prev => ({ ...prev, [action]: 'success' }));
    
    // Reset to idle after delay
    setTimeout(() => {
        setActionStates(prev => ({ ...prev, [action]: 'idle' }));
    }, 2500);
  };

  // Génération de logs d'activité basés sur les données réelles du contexte
  const recentActivity = [
      ...members.slice(0, 2).map(m => ({ id: m.id, user: 'Système', action: 'Inscription Membre', target: `${m.firstName} ${m.lastName}`, date: new Date(m.joinDate).toLocaleDateString(), type: 'update' })),
      ...reports.slice(0, 2).map(r => ({ id: r.id, user: r.createdBy, action: 'Création Rapport', target: r.title, date: new Date(r.createdAt).toLocaleDateString(), type: 'system' })),
      ...budgetRequests.slice(0, 2).map(r => ({ id: r.id, user: r.submittedBy, action: 'Demande Budget', target: r.title, date: new Date(r.submittedAt).toLocaleDateString(), type: 'system' }))
  ].sort(() => Math.random() - 0.5).slice(0, 5);

  return (
    <div className="space-y-10 h-full flex flex-col overflow-hidden animate-in fade-in duration-1000">
      
      {/* Maintenance Banner */}
      {maintenanceMode && (
         <div className="bg-amber-500 text-white px-6 py-3 rounded-2xl flex items-center justify-between shadow-lg animate-in slide-in-from-top-4 shrink-0">
            <div className="flex items-center gap-3">
               <div className="p-1.5 bg-white/20 rounded-lg animate-pulse"><AlertTriangle size={18} /></div>
               <span className="font-black text-xs uppercase tracking-widest">Mode Maintenance Système Actif</span>
            </div>
            <button onClick={() => setMaintenanceMode(false)} className="text-[10px] font-bold bg-black/20 hover:bg-black/30 px-3 py-1 rounded-lg transition-colors">Désactiver</button>
         </div>
      )}

      {/* Header Statutaire */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Poste de Contrôle</h2>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" /> Surveillance infrastructure & Audit global
          </p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={handleManualSync}
            className={`flex items-center gap-3 px-6 py-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-md transition-all ${isSyncing ? 'text-emerald-600' : 'text-slate-600'}`}
          >
            <RefreshCcw size={16} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Rafraîchissement...' : 'Recharger Données'}
          </button>
          <div className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-3 shadow-sm transition-colors ${maintenanceMode ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
            <div className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px_currentColor] ${maintenanceMode ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
            {maintenanceMode ? 'Système : Maintenance' : 'Système : Stable'}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-10 pb-12 no-scrollbar">
        {/* Grille Principale Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* IA & Cloud Monitoring */}
          <div className="lg:col-span-8 glass-card p-10 overflow-hidden relative group">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-600 text-white rounded-[1.25rem] shadow-lg shadow-emerald-200">
                  <Zap size={24} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg leading-none">Réactivité de l'IA Majma</h3>
                  <p className="text-[9px] font-bold text-emerald-600 mt-1 uppercase tracking-widest">Temps de réponse moyen : 450ms</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest pr-2">Gemini 3 Pro Active</span>
              </div>
            </div>

            <div className="h-64 w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorIA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#cbd5e1', fontWeight: 'bold' }} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)', fontSize: '11px', fontWeight: 'black' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="ai" 
                    stroke="#10b981" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorIA)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="absolute top-1/2 right-0 -translate-y-1/2 p-10 opacity-[0.03] font-arabic text-[15rem] select-none text-emerald-900 pointer-events-none">ص</div>
          </div>

          {/* Sante Physique des serveurs */}
          <div className="lg:col-span-4 glass-card p-10 space-y-8">
             <h3 className="font-black text-slate-400 uppercase text-[10px] tracking-widest border-b border-slate-50 pb-4">Ressources Allouées</h3>
             <div className="space-y-10">
                {[
                  { label: 'Calcul vCPU', val: 12, icon: Cpu, color: 'text-blue-500', bg: 'bg-blue-50' },
                  { label: 'Stockage Cloud', val: 24.8, icon: HardDrive, color: 'text-purple-500', bg: 'bg-purple-50', max: 100 },
                  { label: 'Latence Réseau', val: 8, icon: Wifi, color: 'text-emerald-500', bg: 'bg-emerald-50' }
                ].map((stat, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <stat.icon size={16} className={stat.color} />
                         <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{stat.label}</span>
                      </div>
                      <span className="text-[11px] font-black text-slate-400">{stat.val}{stat.max ? ' GB' : '%'}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-50 rounded-full border border-slate-100 overflow-hidden shadow-inner">
                      <div 
                        className={`h-full ${stat.bg} transition-all duration-2000 ease-out`} 
                        style={{ width: `${stat.max ? (stat.val / stat.max) * 100 : stat.val}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Journal d'Audit & Maintenance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Logs d'activité interactifs */}
          <div className="lg:col-span-7 glass-card overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
               <h3 className="font-black text-slate-900 flex items-center gap-3">
                 <Activity size={22} className="text-emerald-600" /> Activité Récente (Live)
               </h3>
               <div className="flex items-center gap-2">
                 <span className="px-3 py-1 bg-white border border-slate-100 rounded-full text-[9px] font-black text-slate-400 uppercase">Temps réel</span>
               </div>
            </div>
            <div className="divide-y divide-slate-50">
              {recentActivity.length > 0 ? recentActivity.map((log) => (
                <div key={log.id} className="p-8 hover:bg-emerald-50/30 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-[1.25rem] border group-hover:bg-white transition-all shadow-sm ${
                      log.type === 'system' ? 'bg-blue-50 text-blue-600 border-blue-50' :
                      log.type === 'update' ? 'bg-amber-50 text-amber-600 border-amber-50' :
                      'bg-emerald-50 text-emerald-600 border-emerald-50'
                    }`}>
                      <Database size={20} />
                    </div>
                    <div>
                      <p className="text-[14px] font-black text-slate-800 leading-none mb-2">
                        {log.user} <span className="mx-2 opacity-20">/</span> {log.action}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{log.target}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">{log.date}</span>
                    <button className="p-3 text-slate-200 group-hover:text-emerald-600 transition-colors"><ChevronRight size={20} /></button>
                  </div>
                </div>
              )) : (
                <div className="p-12 text-center text-slate-400">
                    <p className="text-xs font-bold uppercase">Aucune activité récente enregistrée.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Command Center */}
          <div className="lg:col-span-5 space-y-8">
             <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden group shadow-2xl">
                <h3 className="font-black uppercase text-[10px] tracking-widest opacity-80 mb-10 flex items-center gap-2 text-emerald-400">
                   <Terminal size={14} /> Actions Administratives Prioritaires
                </h3>
                <div className="grid grid-cols-2 gap-4 relative z-10">
                  
                  {/* BUTTON 1: BACKUP */}
                  <button 
                    onClick={() => triggerAction('backup')}
                    disabled={actionStates.backup !== 'idle'}
                    className={`p-6 border rounded-[2rem] transition-all flex flex-col items-center gap-4 text-center group/btn shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed ${
                       actionStates.backup === 'success' 
                         ? 'bg-emerald-600 border-emerald-500 text-white' 
                         : 'bg-white/5 border-white/10 hover:bg-white hover:text-slate-900'
                    }`}
                  >
                     {actionStates.backup === 'loading' ? (
                        <Loader2 size={24} className="animate-spin text-emerald-400" />
                     ) : actionStates.backup === 'success' ? (
                        <Check size={24} className="text-white" />
                     ) : (
                        <Database size={24} className="text-emerald-400 group-hover/btn:scale-110 transition-transform" />
                     )}
                     <span className="text-[9px] font-black uppercase tracking-widest">
                       {actionStates.backup === 'loading' ? 'Compression...' : actionStates.backup === 'success' ? 'Téléchargé' : 'Backup Cloud'}
                     </span>
                  </button>

                  {/* BUTTON 2: MAINTENANCE */}
                  <button 
                    onClick={() => triggerAction('maintenance')}
                    disabled={actionStates.maintenance !== 'idle'}
                    className={`p-6 border rounded-[2rem] transition-all flex flex-col items-center gap-4 text-center group/btn shadow-lg active:scale-95 ${
                        maintenanceMode ? 'bg-amber-500 border-amber-400 text-white' : 'bg-white/5 border-white/10 hover:bg-amber-400 hover:text-slate-900'
                    }`}
                  >
                     {actionStates.maintenance === 'loading' ? (
                        <Loader2 size={24} className="animate-spin text-amber-400" />
                     ) : (
                        <AlertTriangle size={24} className={`group-hover/btn:scale-110 transition-transform ${maintenanceMode ? 'text-white' : 'text-amber-400'}`} />
                     )}
                     <span className="text-[9px] font-black uppercase tracking-widest">
                        {maintenanceMode ? 'Mode Maint. ON' : 'Maintenance'}
                     </span>
                  </button>

                  {/* BUTTON 3: ROLES */}
                  <button 
                    onClick={() => triggerAction('roles')}
                    disabled={actionStates.roles !== 'idle'}
                    className={`p-6 border rounded-[2rem] transition-all flex flex-col items-center gap-4 text-center group/btn shadow-lg active:scale-95 disabled:opacity-70 ${
                       actionStates.roles === 'success' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 hover:bg-white hover:text-slate-900'
                    }`}
                  >
                     {actionStates.roles === 'loading' ? (
                        <Loader2 size={24} className="animate-spin text-blue-400" />
                     ) : actionStates.roles === 'success' ? (
                        <Lock size={24} className="text-white" />
                     ) : (
                        <Users size={24} className="text-blue-400 group-hover/btn:scale-110 transition-transform" />
                     )}
                     <span className="text-[9px] font-black uppercase tracking-widest">
                        {actionStates.roles === 'success' ? 'Audit OK' : 'Audit Rôles'}
                     </span>
                  </button>

                  {/* BUTTON 4: REBOOT */}
                  <button 
                    onClick={() => triggerAction('reboot')}
                    disabled={actionStates.reboot !== 'idle'}
                    className={`p-6 border rounded-[2rem] transition-all flex flex-col items-center gap-4 text-center group/btn shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed ${
                        actionStates.reboot === 'success' ? 'bg-rose-600 border-rose-500 text-white' : 'bg-white/5 border-white/10 hover:bg-rose-500 hover:text-white'
                    }`}
                  >
                     {actionStates.reboot === 'loading' ? (
                        <Loader2 size={24} className="animate-spin text-rose-400" />
                     ) : actionStates.reboot === 'success' ? (
                        <Power size={24} className="text-white" />
                     ) : (
                        <Power size={24} className="text-rose-400 group-hover/btn:scale-110 transition-transform" />
                     )}
                     <span className="text-[9px] font-black uppercase tracking-widest">
                        {actionStates.reboot === 'loading' ? 'Rebooting...' : actionStates.reboot === 'success' ? 'Redémarré' : 'Reboot IA'}
                     </span>
                  </button>
                </div>
                <div className="absolute -right-10 -bottom-10 text-white/5 font-arabic text-8xl">ت</div>
             </div>

             <div className="glass-card p-10 border-rose-100/50 bg-rose-50/20">
                <div className="flex items-center gap-4 mb-6 text-rose-600">
                   <AlertTriangle size={24} />
                   <h4 className="font-black text-xs uppercase tracking-widest">Alertes Sécurité</h4>
                </div>
                <p className="text-[13px] font-medium text-slate-600 mb-8 leading-relaxed">
                  Aucune intrusion détectée. Le cryptage de bout en bout des transactions est opérationnel.
                </p>
                <div className="flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-widest">
                   <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></div>
                   Surveillance Active
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModule;
