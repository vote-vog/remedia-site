import { useState, useEffect } from 'react';

export const useCounter = (initialCount: number = 247) => {
  const [count, setCount] = useState(initialCount);

  // Загружаем данные из localStorage при монтировании
  useEffect(() => {
    const savedCount = localStorage.getItem('waitlist_count');
    if (savedCount) {
      const saved = parseInt(savedCount, 10);
      setCount(saved);
    }
  }, []);

  const increment = () => {
    setCount(prev => {
      const newCount = prev + 1;
      // Сохраняем в localStorage
      localStorage.setItem('waitlist_count', newCount.toString());
      return newCount;
    });
  };

  const resetCounter = () => {
    setCount(initialCount);
    localStorage.removeItem('waitlist_count');
  };

  return {
    count,
    increment,
    resetCounter
  };
};