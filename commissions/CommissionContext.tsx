import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { CommissionType, GlobalRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { useData } from '../contexts/DataContext';

interface CommissionContextType {
  activeCommission: CommissionType | null;
  canEdit: boolean;
  isSupervising: boolean;
  setActiveCommission: (type: CommissionType | null) => void;
}

const CommissionContext = createContext<CommissionContextType | undefined>(undefined);

export const CommissionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { members } = useData();
  const [activeCommission, setActiveCommission] = useState<CommissionType | null>(null);

  const permissions = useMemo(() => {
    if (!user || !activeCommission) return { canEdit: false, isSupervising: false };

    // Trouver le profil complet du membre
    const userProfile = members.find(m => m.id === user.id || m.email === user.email);
    
    // Le SG est dans la commission Administration
    const isSG = user.role === 'SG' || user.role === 'ADJOINT_SG';
    
    // 1. Vérifier si l'utilisateur appartient officiellement à la commission affichée
    const isMemberOfThisComm = userProfile?.commissions.some(c => c.type === activeCommission);
    
    // 2. Logique de Supervision (Droit de regard du SG sur les autres commissions)
    const isSupervising = isSG && activeCommission !== CommissionType.ADMINISTRATION;
    
    // 3. Droit d'édition : On doit être membre de la commission ET ne pas être en simple supervision
    const canEdit = isMemberOfThisComm && !isSupervising;

    return { canEdit, isSupervising };
  }, [user, activeCommission, members]);

  return (
    <CommissionContext.Provider value={{ 
      activeCommission, 
      setActiveCommission,
      canEdit: permissions.canEdit,
      isSupervising: permissions.isSupervising
    }}>
      {children}
    </CommissionContext.Provider>
  );
};

export const useCommissionContext = () => {
  const context = useContext(CommissionContext);
  if (!context) throw new Error('useCommissionContext must be used within a CommissionProvider');
  return context;
};