import { useState, useEffect } from 'react';

// 🔥 ИСПОЛЬЗУЕМ SINGLETON ДЛЯ ГЛОБАЛЬНОГО СОСТОЯНИЯ
class GlobalCounter {
  private count: number = 247;
  private listeners: ((count: number) => void)[] = [];

  constructor() {
    // Загружаем из localStorage при инициализации
    const saved = localStorage.getItem('waitlist_count');
    if (saved) {
      this.count = parseInt(saved);
    }
  }

  getCount(): number {
    return this.count;
  }

  subscribe(listener: (count: number) => void): () => void {
    this.listeners.push(listener);
    // Возвращаем функцию отписки
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  increment(): void {
    this.count++;
    localStorage.setItem('waitlist_count', this.count.toString());
    // 🔥 УВЕДОМЛЯЕМ ВСЕХ ПОДПИСЧИКОВ СИНХРОННО
    this.listeners.forEach(listener => listener(this.count));
  }
}

// 🔥 ЕДИНЫЙ ЭКЗЕМПЛЯР ДЛЯ ВСЕГО ПРИЛОЖЕНИЯ
const globalCounter = new GlobalCounter();

export const useGlobalCounter = () => {
  const [count, setCount] = useState<number>(globalCounter.getCount());

  useEffect(() => {
    // 🔥 ПОДПИСЫВАЕМСЯ НА ИЗМЕНЕНИЯ
    const unsubscribe = globalCounter.subscribe((newCount) => {
      setCount(newCount);
    });

    // 🔥 ОТПИСЫВАЕМСЯ ПРИ РАЗМОНТИРОВАНИИ
    return unsubscribe;
  }, []);

  const increment = () => {
    globalCounter.increment();
  };

  return { 
    count, 
    increment 
  };
};