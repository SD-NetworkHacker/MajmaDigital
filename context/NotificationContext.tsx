import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type?: NotificationType, duration?: number) => void;
  removeNotification: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback((message: string, type: NotificationType = 'info', duration = 5000) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    if (duration) {
      setTimeout(() => removeNotification(id), duration);
    }
  }, [removeNotification]);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`pointer-events-auto px-4 py-3 rounded-lg shadow-lg text-white transform transition-all duration-300 hover:scale-105 cursor-pointer flex items-center justify-between ${
              n.type === 'success' ? 'bg-green-600' :
              n.type === 'error' ? 'bg-red-600' :
              n.type === 'warning' ? 'bg-orange-500' : 'bg-blue-600'
            }`}
            onClick={() => removeNotification(n.id)}
          >
            <span>{n.message}</span>
            <span className="ml-4 text-sm opacity-70">✕</span>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};