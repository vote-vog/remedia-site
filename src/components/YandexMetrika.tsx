// src/components/YandexMetrika.tsx
import { useEffect } from 'react';

const YANDEX_COUNTER_ID = 105508703;

export const YandexMetrika = () => {
  useEffect(() => {
    // Нативная интеграция Яндекс.Метрики
    if (typeof window !== 'undefined') {
      (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
      })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

      ym(YANDEX_COUNTER_ID, "init", {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
        ecommerce: true,
        trackHash: true
      });
    }
  }, []);

  return null; // Полностью невидимый
};