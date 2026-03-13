import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { CommissionType, GlobalRole } from '../types';
// Fixed: AuthContext path updated to contexts/
import { useAuth } from '../contexts/AuthContext';
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
    const userProfile = (members || []).find(m => m.id === user.id || m.email === user.email);
    
    // Le SG ou Admin a un droit de regard partout
    const isSGOrAdmin = userProfile?.role === GlobalRole.SG || userProfile?.role === GlobalRole.ADMIN;
    
    // 1. Vérifier si l'utilisateur appartient officiellement à la commission affichée
    const commissionAssignment = userProfile?.commissions?.find(c => c.type === activeCommission);
    const isMemberOfThisComm = !!commissionAssignment;
    
    // 2. Logique de Supervision (Droit de regard du SG/Admin sur les autres commissions)
    const isSupervising = isSGOrAdmin && activeCommission !== CommissionType.ADMINISTRATION;
    
    // 3. Droit d'édition : Membres de la commission ou Admin/SG
    // Pour l'instant on laisse assez large mais on respecte la structure
    const canEdit = isMemberOfThisComm || isSGOrAdmin;

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