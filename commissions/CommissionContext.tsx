
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CommissionType } from '../types';

interface CommissionState {
  activeTab: string;
  filters: Record<string, any>;
  selectedItemId: string | null;
  isEditMode: boolean;
}

interface CommissionContextType {
  state: CommissionState;
  setActiveTab: (tab: string) => void;
  setFilter: (key: string, value: any) => void;
  setSelectedItem: (id: string | null) => void;
  toggleEditMode: () => void;
}

const CommissionContext = createContext<CommissionContextType | undefined>(undefined);

export const CommissionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CommissionState>({
    activeTab: 'overview',
    filters: {},
    selectedItemId: null,
    isEditMode: false
  });

  const setActiveTab = (activeTab: string) => setState(prev => ({ ...prev, activeTab }));
  const setFilter = (key: string, value: any) => setState(prev => ({ 
    ...prev, 
    filters: { ...prev.filters, [key]: value } 
  }));
  const setSelectedItem = (selectedItemId: string | null) => setState(prev => ({ ...prev, selectedItemId }));
  const toggleEditMode = () => setState(prev => ({ ...prev, isEditMode: !prev.isEditMode }));

  return (
    <CommissionContext.Provider value={{ state, setActiveTab, setFilter, setSelectedItem, toggleEditMode }}>
      {children}
    </CommissionContext.Provider>
  );
};

export const useCommissionContext = () => {
  const context = useContext(CommissionContext);
  if (!context) throw new Error('useCommissionContext must be used within a CommissionProvider');
  return context;
};
