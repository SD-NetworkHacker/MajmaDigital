
import React, { Suspense } from 'react';
import { COMMISSION_REGISTRY } from './CommissionRegistry';
import { CommissionProvider } from './CommissionContext';
import { CommissionType } from '../types';
import { Loader2, AlertCircle } from 'lucide-react';

interface CommissionLoaderProps {
  type: CommissionType;
}

const CommissionLoader: React.FC<CommissionLoaderProps> = ({ type }) => {
  const config = COMMISSION_REGISTRY[type];

  if (!config) {
    return (
      <div className="p-12 bg-rose-50 border border-rose-100 rounded-[2.5rem] text-rose-800 flex items-center gap-6">
        <AlertCircle size={32} />
        <div>
          <h4 className="font-black text-lg">Configuration Introuvable</h4>
          <p className="text-sm opacity-80">La commission "{type}" n'est pas encore enregistrée dans le système central.</p>
        </div>
      </div>
    );
  }

  const { DashboardComponent } = config;

  return (
    <CommissionProvider>
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-40 gap-4 opacity-40">
          <Loader2 size={40} className="animate-spin text-emerald-600" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Initialisation du module {config.id}...</p>
        </div>
      }>
        <DashboardComponent />
      </Suspense>
    </CommissionProvider>
  );
};

export default CommissionLoader;
