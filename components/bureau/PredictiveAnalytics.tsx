
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Calendar, Brain, Download, RefreshCcw, AlertTriangle, Layers 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
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
      }, 1200);
    } else {
        setFinancialData([]);
    }
  }, [contributions]);

  // Mock data pour la demo si pas assez de data réelle
  const demoData = [
      { date: 'Jan', value: 4000, type: 'real' },
      { date: 'Fév', value: 3000, type: 'real' },
      { date: 'Mar', value: 5500, type: 'real' },
      { date: 'Avr', value: 4800, type: 'real' },
      { date: 'Mai', value: 6000, type: 'predicted' },
      { date: 'Juin', value: 7500, type: 'predicted' },
  ];
  
  const displayData = financialData.length > 0 ? financialData : demoData;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header Intelligence */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-indigo-500/10 border border-indigo-500/50 rounded-lg text-indigo-400">
                <Brain size={24} />
             </div>
             <h3 className="text-3xl font-black text-slate-100 tracking-tight uppercase">Moteur Prédictif v1.0</h3>
          </div>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
            {isProcessing ? (
              <span className="flex items-center gap-2 text-amber-500"><RefreshCcw size={12} className="animate-spin"/> Calcul des modèles en cours...</span>
            ) : (
              <span className="flex items-center gap-2 text-emerald-500"><TrendingUp size={12}/> Modèles synchronisés</span>
            )}
          </p>
        </div>
        <div className="flex gap-3">
           <button className="px-6 py-3 bg-slate-900 border border-slate-700 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all flex items-center gap-2">
              <Calendar size={14}/> Semestre
           </button>
           <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(99,102,241,0.3)] flex items-center gap-2 transition-all">
              <Download size={14}/> Export Rapport
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Forecast Chart */}
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                 <Layers size={120} className="text-indigo-500"/>
              </div>

              <div className="flex justify-between items-center mb-8 relative z-10">
                 <div>
                    <h4 className="text-lg font-black text-white">Projection Trésorerie</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Régression Linéaire & Tendance</p>
                 </div>
                 <div className="flex items-center gap-4 bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase px-2">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></span> Réel
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase px-2">
                       <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]"></span> Prédiction
                    </div>
                 </div>
              </div>
              
              <div className="h-[400px] w-full relative z-10 min-w-0">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={displayData}>
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
                       <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} dy={10} />
                       <YAxis hide />
                       <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.8)', fontSize: '11px', fontWeight: 'bold', color: '#fff' }}
                          itemStyle={{ color: '#fff' }}
                       />
                       <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#10b981" 
                          strokeWidth={3} 
                          fillOpacity={1} 
                          fill="url(#colorReal)" 
                       />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* Sidebar Insights */}
        <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 h-full flex flex-col">
                <h4 className="text-sm font-black text-slate-200 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-amber-500" /> Facteurs de Risque
                </h4>
                
                <div className="space-y-4 flex-1">
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 relative group overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Risque Attrition</p>
                        <p className="text-sm font-bold text-slate-300">Stabilité Moyenne</p>
                        <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                            Le taux de renouvellement des cotisations montre un léger fléchissement (-2%) sur le secteur Étudiant.
                        </p>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 relative group overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Capacité d'Investissement</p>
                        <p className="text-sm font-bold text-slate-300">Haute</p>
                        <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                            Les réserves permettent de couvrir les charges du prochain Magal sans appel de fonds supplémentaire.
                        </p>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800">
                    <p className="text-[9px] font-mono text-slate-600 text-center">Dernier calcul : {new Date().toLocaleTimeString()}</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default PredictiveAnalytics;
