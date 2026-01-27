
import React, { useState, useEffect } from 'react';
import { User, Car, Phone, Award, Star, MapPin } from 'lucide-react';
import { Driver } from '../../types';
import { getDrivers } from '../../services/transportService';

const DriverRoster: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    getDrivers().then(setDrivers);
  }, []);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Effectif Chauffeurs</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map(driver => (
          <div key={driver.id} className="glass-card p-6 bg-white border border-slate-100 hover:border-orange-200 hover:shadow-lg transition-all group">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-600 transition-all">
                   <User size={32} />
                </div>
                <div>
                   <h4 className="text-lg font-black text-slate-900">{driver.name}</h4>
                   <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                     driver.status === 'disponible' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                   }`}>{driver.status}</span>
                </div>
             </div>

             <div className="space-y-3 pt-6 border-t border-slate-50">
                <div className="flex items-center justify-between text-xs">
                   <span className="text-slate-500 font-bold flex items-center gap-2"><Car size={14}/> Permis</span>
                   <span className="font-black text-slate-800">{driver.licenseType}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                   <span className="text-slate-500 font-bold flex items-center gap-2"><Phone size={14}/> Contact</span>
                   <span className="font-mono text-slate-800">{driver.phone}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                   <span className="text-slate-500 font-bold flex items-center gap-2"><Award size={14}/> Trajets</span>
                   <span className="font-black text-orange-600">{driver.tripsCompleted}</span>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverRoster;
