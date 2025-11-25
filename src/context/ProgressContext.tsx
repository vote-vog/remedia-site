import React, { createContext, useContext, ReactNode } from 'react';
import { useProgress as useProgressHook } from '../hooks/useProgress';

// Создаем контекст с типом из нашего основного хука
const ProgressContext = createContext<ReturnType<typeof useProgressHook> | undefined>(undefined);

interface ProgressProviderProps {
  children: ReactNode;
}

// 🔥 ПРОСТОЙ ПРОВАЙДЕР - только обертка над useProgress
export const ProgressProvider: React.FC<ProgressProviderProps> = ({ children }) => {
  const progressData = useProgressHook();

  return (
    <ProgressContext.Provider value={progressData}>
      {children}
    </ProgressContext.Provider>
  );
};

// 🔥 ХУК ДЛЯ ИСПОЛЬЗОВАНИЯ КОНТЕКСТА
export const useProgressContext = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgressContext must be used within a ProgressProvider');
  }
  return context;
};

// 🔥 ДЛЯ ОБРАТНОЙ СОВМЕСТИМОСТИ - но лучше использовать useProgressContext
export const useProgress = useProgressContext;