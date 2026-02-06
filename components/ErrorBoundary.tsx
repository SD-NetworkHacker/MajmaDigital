
import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
          <div className="p-4 bg-rose-100 text-rose-600 rounded-full mb-6 shadow-lg">
             <AlertTriangle size={48} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">Une erreur est survenue</h1>
          <p className="text-slate-500 mb-8 max-w-md text-sm leading-relaxed">
            L'application a rencontré un problème critique. Cela peut être dû à une configuration manquante ou un problème de connexion.
          </p>
          <div className="p-4 bg-white border border-slate-200 rounded-xl mb-8 max-w-lg w-full overflow-auto text-left">
             <p className="text-[10px] font-mono text-rose-500 break-words">{this.state.error?.message}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all flex items-center gap-3 shadow-xl"
          >
            <RefreshCcw size={16} /> Recharger l'application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
