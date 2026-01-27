
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Calendar, Brain, Download, RefreshCcw, AlertTriangle 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useData } from '../../contexts/DataContext';
import { generateFinancialForecast } from '../../services/analyticsEngine';

const PredictiveAnalytics: React.FC = () => {
  const { contributions } = useData();
  const [financialData, setFinancialData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (contributions.length > 2) {
      setIsProcessing(true);
      setTimeout(() => {
        const forecast = generateFinancialForecast(contributions);
        setFinancialData(forecast);
        setIsProcessing(false);
      }, 1000);
    } else {
        setFinancialData([]);
    }
  }, [contributions]);

  if (contributions.length < 3) {
      return (
        <div className="flex flex-col items-center justify-center h-[600px] bg-slate-900 rounded-[3rem] border border-slate-800 text-slate-500">
            <Brain size={64} className="mb-6 opacity-20 text-indigo-500" />
            <h3 className="text-2xl font-black text-slate-300 uppercase tracking-widest mb-2">Moteur Prédictif en Veille</h3>
            <p className="text-sm font-medium max-w-md text-center leading-relaxed">
                L'intelligence artificielle nécessite un historique minimal de 3 transactions financières pour générer des modèles de projection fiables.
            </p>
        </div>
      );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header Intelligence */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-indigo-500/20 border border-indigo-500 rounded-lg">
                <Brain size={20} className="text-indigo-400" />
             </div>
             <h3 className="text-2xl font-black text-slate-100 tracking-tight uppercase">Moteur Prédictif v1.0</h3>
          </div>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
            {isProcessing ? (
              <span className="flex items-center gap-2 text-amber-500"><RefreshCcw size={12} className="animate-spin"/> Calcul des modèles en cours...</span>
            ) : (
              <span className="flex items-center gap-2 text-emerald-500"><TrendingUp size={12}/> Modèles synchronisés</span>
            )}
          </p>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-3 bg-slate-900 border border-slate-700 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all flex items-center gap-2">
              <Calendar size={14}/> Plage : Semestre
           </button>
           <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-900/20 flex items-center gap-2 transition-all">
              <Download size={14}/> Export Rapport Exec.
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Forecast Chart */}
        <div className="lg:col-span-12 space-y-8">
           <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 relative overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                 <div>
                    <h4 className="text-lg font-black text-white">Projection Trésorerie (3 Mois)</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Régression Linéaire basée sur l'historique réel</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase">
                       <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Réel
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase">
                       <span className="w-2 h-2 rounded-full bg-indigo-500 border border-indigo-500 border-dashed"></span> Prédiction
                    </div>
                 </div>
              </div>
              
              <div className="h-[350px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={financialData}>
                       <defs>
                          <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                       <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} />
                       <YAxis hide />
                       <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)', fontSize: '11px', fontWeight: 'bold', color: '#fff' }}
                          itemStyle={{ color: '#fff' }}
                       />
                       <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#10b981" 
                          strokeWidth={3} 
                          fillOpacity={1} 
                          fill="url(#colorReal)" 
                          connectNulls
                       />
                       {/* Overlay prediction line */}
                       <Area 
                          type="monotone" 
                          dataKey={d => d.type === 'predicted' ? d.value : null} 
                          stroke="#6366f1" 
                          strokeWidth={3} 
                          strokeDasharray="5 5"
                          fillOpacity={1} 
                          fill="url(#colorPred)" 
                          connectNulls
                       />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalytics;
