// src/components/YandexMetrika.tsx
import { useEffect } from 'react';

export const YandexMetrika = () => {
  useEffect(() => {
    // Логируем события в консоль вместо отправки в Яндекс
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      if (args[0]?.includes?.('ym(')) {
        originalConsoleLog('🎯 Яндекс.Метрика (заглушка):', args[0]);
      }
      originalConsoleLog(...args);
    };

    // Эмуляция ym функции
    window.ym = (counterId: number, method: string, goal: string, params?: any) => {
      console.log(`🎯 Яндекс.Метрика: ${goal}`, { counterId, method, params });
      
      // Здесь можно добавить отправку в ваш Telegram для тестирования
      if (goal === 'waitlist_signup') {
        console.log('📧 Тест: Регистрация в листе ожидания');
      }
    };

    return () => {
      console.log = originalConsoleLog;
    };
  }, []);

  return null; // Не рендерим настоящий счетчик
};