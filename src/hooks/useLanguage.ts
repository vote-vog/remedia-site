// src/hooks/useLanguage.ts
import { useCallback } from 'react';
import translations from '@/data/translations.json';
import { useLanguageContext } from '@/context/LanguageContext';

type TranslationKey = string;

export const useLanguage = () => {
  const { language, setLanguage, toggleLanguage } = useLanguageContext();

  // Функция перевода с поддержкой переменных
  const t = useCallback((key: TranslationKey, variables: Record<string, string | number> = {}) => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation key "${key}" not found for language "${language}"`);
        return key; // Возвращаем ключ если перевод не найден
      }
    }
    
    // Заменяем переменные в строке
    let result = value;
    if (typeof result === 'string') {
      Object.keys(variables).forEach(variable => {
        result = result.replace(`{{${variable}}}`, String(variables[variable]));
      });
    }
    
    return result;
  }, [language]);

  return { 
    language, 
    setLanguage, 
    toggleLanguage,
    t 
  };
};