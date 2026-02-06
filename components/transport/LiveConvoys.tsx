
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Radar, Navigation, AlertTriangle, Phone, MapPin, Bus, Clock, 
  CheckCircle, Gauge, Thermometer, Fuel, MessageSquare, Mic, 
  Video, X, Send, AlertOctagon, MoreVertical, Battery, Layers, 
  CloudRain, Zap, Radio, Map as MapIcon, User, Circle, Activity
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip } from 'recharts';
import { useData } from '../../contexts/DataContext';

// Fallback Mock Data if no active trips
const MOCK_CONVOY_DATA = [
  { 
    id: 'DEMO-001', name: 'Bus Demo - Alpha', status: 'En route', 
    location: 'Sortie Thiès', speed: 88, fuel: 72, temp: 85,
    eta: '13:45', driver: 'Simulation', phone: '770000000', 
    passengers: 45, capacity: 60, incidents: [], 
    drivingTime: '3h 15m', restTime: '0h 45m',
    checkpoints: [
        { name: 'Dakar', time: '07:00', status: 'passed' },
        { name: 'Thiès', time: '08:30', status: 'current' },
        { name: 'Touba', time: '11:30', status: 'pending' },
    ]
  }
];

const generateSpeedData = () => Array.from({ length: 30 }, (_, i) => ({ time: i, speed: 60 + Math.random() * 40 }));

const LiveConvoys: React.FC = () => {
  // --- STATE ---
  const { schedules } = useData();
  const [convoys, setConvoys] = useState<any[]>([]);
  const [selectedConvoy, setSelectedConvoy] = useState<any>(null);
  const [speedData, setSpeedData] = useState(generateSpeedData());
  const [activeTab, setActiveTab] = useState<'status' | 'route' | 'comms'>('status');
  const [messageInput, setMessageInput] = useState('');
  const [mapLayers, setMapLayers] = useState({ traffic: true, weather: false, satellite: false });

  // Load Trips from Context
  useEffect(() => {
    const activeTrips = schedules.filter(t => t.status === 'en_cours');
    
    if (activeTrips.length > 0) {
        // Map real trips to convoy view format
        const mappedConvoys = activeTrips.map(trip => ({
            id: trip.id,
            name: trip.eventTitle,
            status: 'En route',
            location: trip.stops[0]?.location || 'Départ', // Approx current location
            speed: Math.floor(Math.random() * 30) + 60, // Simulé
            fuel: Math.floor(Math.random() * 40) + 50, // Simulé
            temp: 85,
            eta: 'Calcul...',
            driver: 'Chauffeur Assigné', // Would need driver mapping
            phone: 'N/A',
            passengers: trip.seatsFilled,
            capacity: trip.totalCapacity,
            incidents: [],
            drivingTime: '1h 00m',
            restTime: '0h 00m',
            checkpoints: [
                { name: trip.origin, time: trip.departureTime, status: 'passed' },
                ...trip.stops.map(s => ({ name: s.location, time: s.time, status: 'pending' })),
                { name: trip.destination, time: 'Estimé', status: 'pending' }
            ]
        }));
        setConvoys(mappedConvoys);
        setSelectedConvoy(mappedConvoys[0]);
    } else {
        // Use Mock if empty for UX demo
        setConvoys(MOCK_CONVOY_DATA);
        setSelectedConvoy(MOCK_CONVOY_DATA[0]);
    }
  }, [schedules]);

  // Simulation Télémétrie Live
  useEffect(() => {
    if(!selectedConvoy) return;
    
    const interval = setInterval(() => {
      setSpeedData(prev => {
        const lastSpeed = prev[prev.length - 1].speed;
        const newSpeed = selectedConvoy.status === 'Arrêt' ? 0 : Math.max(0, Math.min(110, lastSpeed + (Math.random() * 10 - 5)));
        return [...prev.slice(1), { time: prev[prev.length - 1].time + 1, speed: newSpeed }];
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedConvoy]);

  // Handlers
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    alert(`Message envoyé au canal sécurisé du convoi ${selectedConvoy?.name}`);
    setMessageInput('');
  };

  const handleSOS = () => {
      if(confirm("ACTIVER LE PROTOCOLE D'URGENCE POUR TOUTE LA FLOTTE ?")) {
          alert("Signal SOS envoyé à toutes les unités. Canaux prioritaires ouverts.");
      }
  };

  if (!selectedConvoy) return <div className="p-10 text-center text-white">Chargement du système de suivi...</div>;

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6 animate-in fade-in duration-500 relative bg-[#0f172a] text-slate-300 p-6 -mx-4 sm:-mx-6 lg:-mx-8 lg:-my-8 rounded-none lg:rounded-[3rem] overflow-hidden">
      
      {/* Background Grid FX */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>

      {/* HEADER OPERATIONS */}
      <div className="flex justify-between items-center shrink-0 z-10">
         <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-500">
                <Radar size={24} className="animate-[spin_4s_linear_infinite]" />
            </div>
            <div>
                <h3 className="text-2xl font-black text-white tracking-tight uppercase">Live Operations</h3>
                <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-500">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    SYSTEM ONLINE • {convoys.length} UNITÉS ACTIVES
                </div>
            </div>
         </div>

         <div className="flex gap-3">
             <button 
                onClick={handleSOS}
                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all animate-pulse flex items-center gap-2"
             >
                <AlertOctagon size={16}/> Broadcast SOS
             </button>
         </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="flex-1 flex gap-6 overflow-hidden z-10">
         
         {/* COL 1: CONVOY LIST */}
         <div className="w-80 flex flex-col gap-4 bg-slate-900/50 border border-slate-800 rounded-[2rem] p-4 overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center px-2 pb-2 border-b border-slate-800 mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Flotte</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Status</span>
            </div>
            {convoys.map((convoy) => (
               <div 
                  key={convoy.id}
                  onClick={() => setSelectedConvoy(convoy)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${
                     selectedConvoy?.id === convoy.id 
                        ? 'bg-slate-800 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]' 
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
               >
                  {selectedConvoy?.id === convoy.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>}
                  <div className="flex justify-between items-start mb-2 pl-2">
                     <div>
                        <h4 className={`text-xs font-black uppercase tracking-wide leading-tight ${selectedConvoy?.id === convoy.id ? 'text-white' : 'text-slate-400'}`}>{convoy.name}</h4>
                        <p className="text-[9px] font-mono text-slate-600 mt-0.5">{convoy.id}</p>
                     </div>
                     <Bus size={14} className={selectedConvoy?.id === convoy.id ? 'text-orange-500' : 'text-slate-600'} />
                  </div>
                  <div className="flex justify-between items-center pl-2">
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <MapPin size={10} /> {convoy.location}
                      </div>
                      {convoy.status === 'Alerte' ? (
                          <AlertTriangle size={14} className="text-red-500 animate-bounce" />
                      ) : (
                          <span className={`w-2 h-2 rounded-full ${convoy.status === 'Arrêt' ? 'bg-slate-500' : 'bg-emerald-500'}`}></span>
                      )}
                  </div>
               </div>
            ))}
         </div>

         {/* COL 2: MAP / RADAR */}
         <div className="flex-1 bg-slate-900 border border-slate-800 rounded-[2.5rem] relative overflow-hidden flex flex-col">
            {/* Map Layers Controls */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                <button onClick={() => setMapLayers(p => ({...p, traffic: !p.traffic}))} className={`p-2 rounded-lg backdrop-blur-md border transition-all ${mapLayers.traffic ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-slate-900/50 border-slate-700 text-slate-500'}`} title="Trafic"><Navigation size={16}/></button>
                <button onClick={() => setMapLayers(p => ({...p, weather: !p.weather}))} className={`p-2 rounded-lg backdrop-blur-md border transition-all ${mapLayers.weather ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-slate-900/50 border-slate-700 text-slate-500'}`} title="Météo"><CloudRain size={16}/></button>
                <button onClick={() => setMapLayers(p => ({...p, satellite: !p.satellite}))} className={`p-2 rounded-lg backdrop-blur-md border transition-all ${mapLayers.satellite ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-slate-900/50 border-slate-700 text-slate-500'}`} title="Satellite"><Layers size={16}/></button>
            </div>

            {/* Map Visual (Simulated) */}
            <div className="flex-1 relative flex items-center justify-center bg-[#0B1121]">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black"></div>
                
                {/* Simulated Road Path */}
                <svg className="absolute w-full h-full stroke-slate-700 stroke-[3] fill-none opacity-50" viewBox="0 0 800 600">
                     <path d="M100,500 C300,450 400,400 500,300 S700,100 750,50" />
                </svg>

                {/* Convoy Positions */}
                {convoys.map((c, i) => (
                    <div 
                        key={c.id} 
                        className="absolute transition-all duration-1000"
                        style={{ 
                            left: `${20 + (i * 15)}%`, 
                            top: `${70 - (i * 15)}%` 
                        }}
                    >
                        <div className={`relative group cursor-pointer ${selectedConvoy?.id === c.id ? 'z-50' : 'z-10'}`} onClick={() => setSelectedConvoy(c)}>
                            <div className={`w-4 h-4 rounded-full border-2 border-white shadow-[0_0_20px_currentColor] transition-all ${
                                c.status === 'Alerte' ? 'bg-red-500 text-red-500 animate-ping' : 
                                selectedConvoy?.id === c.id ? 'bg-orange-500 text-orange-500 scale-125' : 'bg-emerald-500 text-emerald-500'
                            }`}></div>
                             <div className={`absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[8px] font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity ${selectedConvoy?.id === c.id ? 'opacity-100' : ''}`}>
                                {c.name}
                             </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom HUD */}
            <div className="h-16 bg-slate-900/80 backdrop-blur-md border-t border-slate-800 flex items-center px-6 gap-8">
               <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Activity size={14} className="text-emerald-500"/>
                  <span>LAT: 14.7167</span>
                  <span>LNG: -17.4677</span>
               </div>
               <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-[30%] h-full bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-[shimmer_2s_infinite]"></div>
               </div>
               <div className="text-[10px] font-black uppercase text-slate-500">Live Satellite Feed</div>
            </div>
         </div>

         {/* COL 3: COCKPIT (DETAILS) */}
         <div className="w-[400px] flex flex-col bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shrink-0">
            {/* Driver Header */}
            <div className="p-6 bg-slate-800/50 border-b border-slate-700">
               <div className="flex justify-between items-start mb-4">
                  <div>
                     <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Unité Sélectionnée</p>
                     <h2 className="text-xl font-black text-white">{selectedConvoy.name}</h2>
                  </div>
                  <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center border border-slate-600">
                     <User size={18} className="text-slate-300"/>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                     <p className="text-[9px] text-slate-500 uppercase font-bold">Chauffeur</p>
                     <p className="text-xs font-bold text-white truncate">{selectedConvoy.driver}</p>
                     <div className="flex items-center gap-1 mt-1">
                        <Battery size={10} className="text-emerald-500"/>
                        <span className="text-[9px] text-emerald-500">Repos: {selectedConvoy.restTime}</span>
                     </div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                     <p className="text-[9px] text-slate-500 uppercase font-bold">Passagers</p>
                     <div className="flex items-end gap-1">
                        <span className="text-lg font-black text-white">{selectedConvoy.passengers}</span>
                        <span className="text-[10px] text-slate-500 mb-1">/ {selectedConvoy.capacity}</span>
                     </div>
                     <div className="w-full h-1 bg-slate-800 rounded-full mt-1">
                        <div className="h-full bg-blue-500" style={{width: `${(selectedConvoy.passengers/selectedConvoy.capacity)*100}%`}}></div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800">
               <button onClick={() => setActiveTab('status')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'status' ? 'text-white bg-slate-800 border-b-2 border-orange-500' : 'text-slate-500 hover:text-slate-300'}`}>Status</button>
               <button onClick={() => setActiveTab('route')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'route' ? 'text-white bg-slate-800 border-b-2 border-orange-500' : 'text-slate-500 hover:text-slate-300'}`}>Route</button>
               <button onClick={() => setActiveTab('comms')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'comms' ? 'text-white bg-slate-800 border-b-2 border-orange-500' : 'text-slate-500 hover:text-slate-300'}`}>Radio</button>
            </div>

            {/* TAB CONTENT */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-900/50">
               
               {activeTab === 'status' && (
                  <div className="space-y-6">
                     {/* Circular Gauges Row */}
                     <div className="flex justify-between px-2">
                        <div className="text-center">
                           <div className="w-16 h-16 rounded-full border-4 border-slate-800 flex items-center justify-center relative mb-2">
                              <span className="text-lg font-black text-white">{Math.round(speedData[speedData.length-1].speed)}</span>
                              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                                 <path className="stroke-orange-500 fill-none stroke-[3]" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                              </svg>
                           </div>
                           <p className="text-[9px] font-bold text-slate-500 uppercase">Km/h</p>
                        </div>
                        <div className="text-center">
                           <div className="w-16 h-16 rounded-full border-4 border-slate-800 flex items-center justify-center relative mb-2">
                              <span className="text-lg font-black text-white">{selectedConvoy.fuel}%</span>
                              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                                 <path className="stroke-blue-500 fill-none stroke-[3]" strokeDasharray={`${selectedConvoy.fuel}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                              </svg>
                           </div>
                           <p className="text-[9px] font-bold text-slate-500 uppercase">Fuel</p>
                        </div>
                        <div className="text-center">
                           <div className="w-16 h-16 rounded-full border-4 border-slate-800 flex items-center justify-center relative mb-2">
                              <span className={`text-lg font-black ${selectedConvoy.temp > 100 ? 'text-red-500' : 'text-emerald-500'}`}>{selectedConvoy.temp}°</span>
                           </div>
                           <p className="text-[9px] font-bold text-slate-500 uppercase">Moteur</p>
                        </div>
                     </div>

                     {/* Live Chart */}
                     <div className="h-32 w-full bg-slate-950/50 rounded-xl border border-slate-800 p-2">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={speedData}>
                              <defs>
                                 <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                                 </linearGradient>
                              </defs>
                              <YAxis hide domain={[0, 140]} />
                              <Area type="monotone" dataKey="speed" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorSpeed)" isAnimationActive={false} />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
               )}

               {activeTab === 'route' && (
                  <div className="relative pl-6 space-y-8 before:absolute before:left-[21px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                     {selectedConvoy.checkpoints.map((cp: any, i: number) => (
                        <div key={i} className="relative flex items-center gap-4 group">
                           <div className={`w-3 h-3 rounded-full border-2 border-slate-900 z-10 ${
                              cp.status === 'passed' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 
                              cp.status === 'current' ? 'bg-orange-500 animate-pulse' : 'bg-slate-700'
                           }`}></div>
                           <div className={`flex-1 p-3 rounded-xl border transition-all ${
                              cp.status === 'current' ? 'bg-slate-800 border-orange-500/30' : 'bg-slate-900/50 border-slate-800'
                           }`}>
                              <div className="flex justify-between items-center">
                                 <span className={`text-xs font-bold ${cp.status === 'current' ? 'text-white' : 'text-slate-400'}`}>{cp.name}</span>
                                 <span className="text-[10px] font-mono text-slate-500">{cp.time}</span>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}

               {activeTab === 'comms' && (
                  <div className="flex flex-col h-full">
                     <div className="flex-1 space-y-3 mb-4">
                        <div className="bg-slate-800/50 p-3 rounded-xl rounded-tl-none border border-slate-700">
                           <p className="text-[10px] font-bold text-orange-400 mb-1">QG Ops</p>
                           <p className="text-xs text-slate-300">Position confirmée. Pause prévue dans 15 min ?</p>
                        </div>
                        <div className="bg-slate-800 p-3 rounded-xl rounded-tr-none border border-slate-700 ml-auto">
                           <p className="text-[10px] font-bold text-emerald-400 mb-1">Chauffeur</p>
                           <p className="text-xs text-slate-300">Affirmatif. RAS sur le véhicule.</p>
                        </div>
                     </div>
                     
                     <div className="flex gap-2 p-2 bg-slate-800 rounded-xl border border-slate-700">
                        <input 
                           type="text" 
                           className="flex-1 bg-transparent text-xs text-white outline-none placeholder-slate-500"
                           placeholder="Message au chauffeur..."
                           value={messageInput}
                           onChange={(e) => setMessageInput(e.target.value)}
                        />
                        <button onClick={handleSendMessage} className="p-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors">
                           <Send size={14}/>
                        </button>
                     </div>
                  </div>
               )}

            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-slate-800/50 border-t border-slate-800 grid grid-cols-2 gap-3">
               <button className="py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                  <Phone size={14}/> Appel
               </button>
               <button className="py-3 bg-red-900/50 border border-red-500/50 text-red-400 hover:bg-red-900/80 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                  <AlertOctagon size={14}/> Incident
               </button>
            </div>
         </div>

      </div>
    </div>
  );
};

export default LiveConvoys;
