// src/hooks/useProductActions.ts
import { useCallback } from 'react';
import { useEventBus } from './useEventBus';

export const useProductActions = () => {
  const { emit } = useEventBus();

  // 🔥 ПРОСТОЙ метод для завершения этапов - только +20%
  const completeMilestone = useCallback((milestoneType: string) => {
    console.log('🎯 completeMilestone:', milestoneType);

    // 1. Отправляем простое событие для прогресса (+20%)
    emit('milestone:completed', { 
      type: milestoneType,
      timestamp: Date.now()
    });

    // 2. Отправляем детальное событие для аналитики (в Telegram)
    emit('analytics:track', {
      event: `${milestoneType}_completed`,
      timestamp: Date.now()
    });

  }, [emit]);

  return {
    completeMilestone
  };
};

export default useProductActions;