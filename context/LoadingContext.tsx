
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loadingCount, setLoadingCount] = useState(0);

  const showLoading = () => setLoadingCount((prev) => prev + 1);
  const hideLoading = () => setLoadingCount((prev) => Math.max(0, prev - 1));

  return (
    <LoadingContext.Provider value={{ isLoading: loadingCount > 0, showLoading, hideLoading }}>
      {children}
      {loadingCount > 0 && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/80 backdrop-blur-md transition-opacity duration-300">
          <div className="relative flex flex-col items-center">
            {/* Logo Container avec effet de pulsation */}
            <div className="relative w-24 h-24 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-emerald-500/20 animate-pulse-slow border border-slate-800">
               {/* Effet de lueur derrière */}
               <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full animate-pulse"></div>
               
               {/* Symbole Logo */}
               <span className="relative font-arabic text-6xl text-emerald-500 pb-2 drop-shadow-md select-none">م</span>
               
               {/* Cercle de chargement rotatif autour */}
               <div className="absolute inset-0 border-2 border-emerald-500/30 rounded-[1.5rem] clip-path-loading animate-[spin_3s_linear_infinite]"></div>
            </div>
            
            <div className="mt-6 flex flex-col items-center gap-1">
               <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] animate-pulse">Chargement</span>
               <div className="flex gap-1">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce delay-0"></div>
                  <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce delay-150"></div>
                  <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce delay-300"></div>
               </div>
            </div>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) throw new Error('useLoading must be used within a LoadingProvider');
  return context;
};
