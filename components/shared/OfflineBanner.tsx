
import React, { useState, useEffect } from 'react';
import { WifiOff, Database } from 'lucide-react';

const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Keep "Back online" message for a few seconds
      setTimeout(() => setIsVisible(false), 3000);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setIsVisible(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isVisible && isOnline) return null;

  return (
    <div className={`transition-all duration-500 ease-in-out transform ${!isOnline ? 'bg-amber-500' : 'bg-emerald-500'} text-white px-4 py-2 flex justify-center items-center gap-3 shadow-md relative z-50`}>
      {!isOnline ? (
        <>
          <WifiOff size={14} className="animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">Mode Hors Ligne Activé</span>
          <span className="text-xs font-medium hidden sm:inline opacity-90">- Données locales uniquement.</span>
        </>
      ) : (
        <>
          <Database size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest">Connexion rétablie</span>
          <span className="text-xs font-medium hidden sm:inline opacity-90">- Synchronisation en cours...</span>
        </>
      )}
    </div>
  );
};

export default OfflineBanner;
