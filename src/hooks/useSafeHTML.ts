// hooks/useSafeHTML.ts
import { useMemo } from 'react';

/**
 * Хук для безопасного рендеринга HTML строк в React компонентах
 * @param htmlString - HTML строка для рендеринга
 * @returns Объект для использования с dangerouslySetInnerHTML
 */
export const useSafeHTML = (htmlString: string) => {
  return useMemo(() => {
    return { __html: htmlString };
  }, [htmlString]);
};