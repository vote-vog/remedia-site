// src/components/YandexMetrika.tsx
import { useEffect } from 'react';

const YANDEX_COUNTER_ID = 105508703;

// Добавляем объявление типа
declare global {
  interface Window {
    ym: (...args: any[]) => void;
  }
}

export const YandexMetrika = () => {
  useEffect(() => {
    // Пропускаем на сервере
    if (typeof window === 'undefined') return;

    // Если уже инициализирована - выходим
    if (window.ym) {
      console.log('✅ Яндекс.Метрика уже загружена');
      return;
    }

    // Создаем функцию ym
    window.ym = function(...args: any[]) {
      (window.ym.a = window.ym.a || []).push(args);
    };
    window.ym.l = new Date().getTime();

    // Загружаем скрипт
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://mc.yandex.ru/metrika/tag.js';
    
    script.onload = () => {
      console.log('🎯 Скрипт Яндекс.Метрики загружен');
      // Инициализация счетчика
      window.ym(YANDEX_COUNTER_ID, 'init', {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true
      });
    };

    script.onerror = () => {
      console.error('❌ Ошибка загрузки Яндекс.Метрики');
    };

    // Добавляем скрипт в head
    document.head.appendChild(script);

  }, []);

  return null;
};