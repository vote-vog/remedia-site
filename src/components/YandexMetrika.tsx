// src/components/YandexMetrika.tsx
import { useEffect } from 'react';

const YANDEX_COUNTER_ID = 105508703;

export const YandexMetrika = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Ждем загрузки DOM
    setTimeout(() => {
      // Нативная интеграция Яндекс.Метрики
      (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a);
      })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

      // Инициализация счетчика
      if (window.ym) {
        window.ym(YANDEX_COUNTER_ID, "init", {
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true,
          ecommerce: true,
          trackHash: true
        });
        
        console.log('✅ Яндекс.Метрика инициализирована');
      }
    }, 1000);

  }, []);

  return null;
};