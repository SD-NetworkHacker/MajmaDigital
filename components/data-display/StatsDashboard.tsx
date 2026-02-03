
import React from 'react';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

export interface StatWidgetData {
  id: string;
  label: string;
  value: string | number;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  icon?: any;
  color?: string; // Tailwind class like 'text-emerald-500'
  bg?: string; // Tailwind class like 'bg-emerald-50'
}

export interface ChartConfig {
  title: string;
  type: 'area' | 'bar';
  data: any[];
  dataKey: string;
  xAxisKey: string;
  color: string;
  height?: number;
}

interface StatsDashboardProps {
  widgets: StatWidgetData[];
  mainChart?: ChartConfig;
  secondaryChart?: ChartConfig;
  layout?: 'grid' | 'list';
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ 
  widgets, 
  mainChart, 
  secondaryChart,
  layout = 'grid' 
}) => {
  
  const getTrendIcon = (direction: string) => {
    if (direction === 'up') return <TrendingUp size={12} />;
    if (direction === 'down') return <TrendingDown size={12} />;
    return <Minus size={12} />;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Widgets Grid */}
      <div className={`grid gap-6 ${layout === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'}`}>
        {widgets.map((widget) => (
          <div key={widget.id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
             <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${widget.bg || 'bg-slate-50'} ${widget.color || 'text-slate-600'} transition-transform group-hover:scale-110`}>
                   {widget.icon ? <widget.icon size={20} /> : <Activity size={20} />}
                </div>
                {widget.trend && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-black uppercase ${
                    widget.trend.direction === 'up' ? 'bg-emerald-50 text-emerald-600' : 
                    widget.trend.direction === 'down' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'
                  }`}>
                     {getTrendIcon(widget.trend.direction)} {widget.trend.value}
                  </div>
                )}
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{widget.label}</p>
                <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{widget.value}</h4>
             </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      {(mainChart || secondaryChart) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           
           {/* Main Chart (2/3 width) */}
           {mainChart && (
             <div className={`bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm ${secondaryChart ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8">{mainChart.title}</h4>
                <div style={{ height: mainChart.height || 300 }}>
                   <ResponsiveContainer width="100%" height="100%">
                      {mainChart.type === 'area' ? (
                        <AreaChart data={mainChart.data}>
                           <defs>
                              <linearGradient id={`gradient-${mainChart.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor={mainChart.color} stopOpacity={0.1}/>
                                 <stop offset="95%" stopColor={mainChart.color} stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                           <XAxis dataKey={mainChart.xAxisKey} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} />
                           <YAxis hide />
                           <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '11px', fontWeight: 'bold' }} />
                           <Area type="monotone" dataKey={mainChart.dataKey} stroke={mainChart.color} fill={`url(#gradient-${mainChart.dataKey})`} strokeWidth={3} />
                        </AreaChart>
                      ) : (
                        <BarChart data={mainChart.data}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                           <XAxis dataKey={mainChart.xAxisKey} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} />
                           <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '11px', fontWeight: 'bold' }} />
                           <Bar dataKey={mainChart.dataKey} fill={mainChart.color} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      )}
                   </ResponsiveContainer>
                </div>
             </div>
           )}

           {/* Secondary Chart (1/3 width) */}
           {secondaryChart && (
             <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                <div className="relative z-10">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 opacity-60">{secondaryChart.title}</h4>
                   <div style={{ height: secondaryChart.height || 200 }}>
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={secondaryChart.data}>
                            <XAxis dataKey={secondaryChart.xAxisKey} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} />
                            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                            <Bar dataKey={secondaryChart.dataKey} radius={[4, 4, 0, 0]}>
                               {secondaryChart.data.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? secondaryChart.color : '#ffffff'} fillOpacity={index % 2 === 0 ? 1 : 0.2} />
                               ))}
                            </Bar>
                         </BarChart>
                      </ResponsiveContainer>
                   </div>
                </div>
                {/* Decor */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default StatsDashboard;
