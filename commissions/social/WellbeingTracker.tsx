
import React from 'react';
// Added MessageSquare to imports
import { Activity, AlertCircle, Heart, UserMinus, UserCheck, ChevronRight, TrendingUp, Sparkles, MessageCircle, MessageSquare } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WellbeingTracker: React.FC = () => {
  // Données initiales neutres
  const cohesionTrend = [
    { name: 'S-4', val: 0 }, { name: 'S-3', val: 0 },
    { name: 'S-2', val: 0 }, { name: 'S-1', val: 0 },
    { name: 'Actuel', val: 0 },
  ];

  const alerts: any[] = [];

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Wellbeing Analytics */}
        <div className="lg:col-span-7 glass-card p-10 bg-white">
           <div className="flex justify-between items-center mb-12">
              <div>
                 <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    <Activity size={24} className="text-rose-600" /> Vitalité de l'Engagement
                 </h4>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Taux moyen de participation aux activités sociales</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl font-black text-xs">--%</div>
           </div>
           
           <div className="h-[300px] w-full mb-10 flex items-center justify-center bg-slate-50/30 rounded-3xl">
              {cohesionTrend.every(d => d.val === 0) ? (
                 <p className="text-xs text-slate-400 font-bold uppercase">Données insuffisantes</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={cohesionTrend}>
                      <defs>
                        <linearGradient id="colorWell" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#e11d48" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} />
                      <YAxis hide />
                      <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)', fontSize: '11px', fontWeight: 'bold' }} />
                      <Area type="monotone" dataKey="val" stroke="#e11d48" strokeWidth={4} fillOpacity={1} fill="url(#colorWell)" />
                   </AreaChart>
                </ResponsiveContainer>
              )}
           </div>

           <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-50">
              {[
                { l: 'Moyenne Sorties', v: '--' },
                { l: 'Taux Parrainage', v: '--%' },
                { l: 'Satisfaction', v: '--%' }
              ].map((s, i) => (
                <div key={i} className="text-center">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.l}</p>
                   <p className="text-xl font-black text-slate-900">{s.v}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Integration Alerts Sidebar */}
        <div className="lg:col-span-5 space-y-8">
           <div className="glass-card p-10 bg-rose-50/50 border-rose-100">
              <h4 className="text-[11px] font-black text-rose-800 uppercase tracking-widest mb-8 flex items-center gap-3">
                 <AlertCircle size={22} className="text-rose-600" /> Alertes d'Isolement
              </h4>
              <div className="space-y-4">
                 {alerts.length > 0 ? alerts.map((alert, i) => (
                   <div key={i} className="p-5 bg-white border border-rose-100 rounded-[2rem] shadow-sm flex items-center justify-between group hover:border-rose-300 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center font-black text-xs">AW</div>
                         <div>
                            <p className="text-xs font-black text-slate-800 leading-none mb-1">{alert.name}</p>
                            <p className="text-[9px] text-rose-500 font-bold uppercase tracking-tight">{alert.issue}</p>
                         </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${alert.color} bg-white border border-current opacity-60`}>{alert.status}</span>
                   </div>
                 )) : (
                   <p className="text-xs text-rose-400 font-medium italic text-center">Aucune alerte d'isolement détectée.</p>
                 )}
              </div>
              <button className="w-full mt-10 py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"><MessageSquare size={16}/> Organiser Visite de courtoisie</button>
           </div>

           <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden group">
              <div className="relative z-10">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 opacity-50">IA Suggestion d'Intégration</h4>
                 <div className="flex items-center gap-4 text-emerald-400 mb-6">
                    <Sparkles size={24} />
                    <p className="text-sm font-medium italic opacity-80 leading-relaxed">"L'IA analysera l'activité des membres pour proposer des actions d'intégration ciblées."</p>
                 </div>
              </div>
              <div className="absolute -right-6 -bottom-6 opacity-5 font-arabic text-8xl">ش</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WellbeingTracker;
