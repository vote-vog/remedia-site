// src/components/YandexMetrika.tsx
import { YMInitializer } from 'react-yandex-metrika';

const YANDEX_COUNTER_ID = 105508703; // ⚡ Ваш реальный ID!

export const YandexMetrika = () => (
  <YMInitializer 
    accounts={[YANDEX_COUNTER_ID]} 
    options={{
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
      trackHash: true,
      ecommerce: true
    }}
    version="2"
  />
);