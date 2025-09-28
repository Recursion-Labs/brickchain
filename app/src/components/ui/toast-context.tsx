'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastProps } from '@/components/ui/toast';

interface ToastContextType {
  toast: (props: Omit<ToastProps, 'onClose'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastItem extends ToastProps {
  id: string;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const toast = useCallback(({ duration = 5000, ...props }: Omit<ToastProps, 'onClose'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toastItem: ToastItem = {
      ...props,
      id,
      onClose: () => removeToast(id),
    };

    setToasts(prev => [...prev, toastItem]);

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 w-full md:max-w-[420px] p-4 space-y-4">
        {toasts.map(toastItem => (
          <Toast
            key={toastItem.id}
            title={toastItem.title}
            description={toastItem.description}
            variant={toastItem.variant}
            onClose={toastItem.onClose}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};