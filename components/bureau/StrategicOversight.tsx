
import React, { useMemo } from 'react';
import { 
  Wallet, CheckCircle, XCircle, Activity, PieChart, AlertCircle
} from 'lucide-react';
import { PieChart as RePie, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useData } from '../../contexts/DataContext';

const StrategicOversight: React.FC = () => {
  const { budgetRequests } = useData();

  // Filtrer uniquement les demandes soumises au bureau
  const pendingArbitration = useMemo(() => 
    budgetRequests.filter(r => r.status === 'soumis_bureau'), 
  [budgetRequests]);

  const chartData = [
    { name: 'Disponible', value: 100, color: '#e2e8f0' },
    { name: 'Engagé', value: 0, color: '#4f46e5' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Health Matrix & Global Status */}
        <div className="lg:col-span-8 space-y-8">
           {/* Global Health Indicator */}
           <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden group">
              <div className="relative z-10 flex justify-between items-start">
                 <div>
                    <div className="flex items-center gap-3 mb-4">
                       <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 text-emerald-400">
                          <Activity size={24} />
                       </div>
                       <h3 className="text-2xl font-black tracking-tight">Santé Institutionnelle</h3>
                    </div>
                    <p className="text-sm text-slate-300 font-medium max-w-lg leading-relaxed">
                       Le système est opérationnel. En attente de données d'activité pour générer le score de performance.
                    </p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Score Global</p>
                    <p className="text-5xl font-black tracking-tighter text-slate-500">--<span className="text-xl opacity-50">/100</span></p>
                 </div>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-5 font-arabic text-[12rem] rotate-12 pointer-events-none">ص</div>
           </div>

           {/* Empty State for Matrix Details */}
           <div className="glass-card p-12 bg-white flex flex-col items-center justify-center text-center border-slate-100">
              <Activity size={48} className="text-slate-200 mb-4" />
              <h4 className="text-lg font-black text-slate-400 uppercase tracking-widest">Analyse en attente</h4>
              <p className="text-xs text-slate-400 max-w-md mt-2">Les indicateurs de performance s'afficheront ici une fois que les commissions auront soumis leurs premiers rapports.</p>
           </div>
        </div>

        {/* Right Column: Budget Arbitration & Alerts */}
        <div className="lg:col-span-4 space-y-8">
           
           {/* Budget Overview Donut */}
           <div className="glass-card p-10 bg-white flex flex-col items-center text-center">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Consommation Budgétaire</h4>
              <div className="h-48 w-48 relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <RePie>
                       <Pie data={chartData} innerRadius={60} outerRadius={80} dataKey="value" startAngle={90} endAngle={-270}>
                          {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                       </Pie>
                    </RePie>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-slate-300">0%</span>
                    <span className="text-[8px] font-black uppercase text-slate-400">Engagé</span>
                 </div>
              </div>
              <div className="mt-6 w-full pt-6 border-t border-slate-50 flex justify-between">
                 <div className="text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Total</p>
                    <p className="text-sm font-black text-slate-900">0 F</p>
                 </div>
                 <div className="text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Reste</p>
                    <p className="text-sm font-black text-emerald-600">0 F</p>
                 </div>
              </div>
           </div>

           {/* Budget Approval Queue */}
           <div className="glass-card p-8 bg-slate-50 border-slate-100">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                 <Wallet size={14}/> Demandes en Attente (Arbitrage)
              </h4>
              <div className="space-y-4">
                 {pendingArbitration.length > 0 ? pendingArbitration.map((req, i) => (
                   <div key={i} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-[8px] font-black uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-500">{req.commission}</span>
                         <span className="text-[9px] font-bold text-slate-400">{new Date(req.submittedAt).toLocaleDateString()}</span>
                      </div>
                      <h5 className="text-xs font-black text-slate-900 leading-tight mb-3">{req.title}</h5>
                      <p className="text-sm font-black text-indigo-600 mb-4">{req.amountRequested.toLocaleString()} F</p>
                      
                      <div className="flex gap-2">
                         <button className="flex-1 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-[9px] font-black uppercase hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1">
                            <CheckCircle size={12}/> Valider
                         </button>
                         <button className="flex-1 py-2 bg-rose-50 text-rose-700 rounded-lg text-[9px] font-black uppercase hover:bg-rose-100 transition-colors flex items-center justify-center gap-1">
                            <XCircle size={12}/> Rejeter
                         </button>
                      </div>
                   </div>
                 )) : (
                    <div className="text-center py-8 text-slate-400">
                       <CheckCircle size={32} className="mx-auto mb-2 opacity-50"/>
                       <p className="text-xs font-bold uppercase">Aucune demande</p>
                       <p className="text-[9px] mt-1">Le flux d'approbation est vide.</p>
                    </div>
                 )}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default StrategicOversight;
