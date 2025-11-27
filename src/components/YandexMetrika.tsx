// src/components/YandexMetrika.tsx (заменяем полностью)
import { YMetrika } from 'react-yandex-metrika';

export const YandexMetrika = () => (
  <YMetrika 
    account={105508703}
    options={{
      clickmap: true,
      trackLinks: true, 
      accurateTrackBounce: true,
      webvisor: true,
      ecommerce: true
    }}
  />
);