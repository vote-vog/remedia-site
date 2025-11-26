// src/components/YandexMetrika.tsx
import { useEffect } from 'react';

const YANDEX_COUNTER_ID = 105508703;

export const YandexMetrika = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Проверяем не загружена ли уже метрика
    if (window.ym) {
      console.log('✅ Яндекс.Метрика уже загружена');
      return;
    }

    // Нативная загрузка Яндекс.Метрики
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://mc.yandex.ru/metrika/tag.js';
    
    script.onload = () => {
      // Ждем полной инициализации
      setTimeout(() => {
        if (window.ym) {
          window.ym(YANDEX_COUNTER_ID, 'init', {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true,
            ecommerce: true,
            trackHash: true
          });
          console.log('🎯 Яндекс.Метрика полностью инициализирована');
        }
      }, 1000);
    };

    document.head.appendChild(script);

  }, []);

  return null;
};