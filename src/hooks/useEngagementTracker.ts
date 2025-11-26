// src/hooks/useEngagementTracker.ts
import { useCallback, useMemo } from 'react';
import { useProgress } from './useProgress';

// 🔥 TELEGRAM CONFIG ДЛЯ ВОВЛЕЧЕННОСТИ
const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

interface EngagementData {
  progress: number;
  eggsCount?: number;
  completedDemo: boolean;
  completedCalculator: boolean;
  usedCredit: boolean;
  referrals: number;
  email?: string;
  lastAction?: string;
}

export const useEngagementTracker = () => {
  const { progress, completionPercentage } = useProgress();

  // 🔥 ФУНКЦИЯ РАСЧЕТА ENGAGEMENT SCORE
  const calculateEngagementScore = useCallback((data: EngagementData) => {
    let score = 0;
    
    // Прогресс-бар (0-2 балла)
    score += Math.min(data.progress / 100, 2);
    
    // Пасхалки (+0.2 за каждую)
    score += (data.eggsCount || 0) * 0.2;
    
    // Демо-чат (+0.5)
    if (data.completedDemo) score += 0.5;
    
    // Калькулятор (+0.5)
    if (data.completedCalculator) score += 0.5;
    
    // Кредит в калькуляторе (+0.3)
    if (data.usedCredit) score += 0.3;
    
    // Рефералы (+0.1 за каждого)
    score += data.referrals * 0.1;
    
    return Math.round(score * 10) / 10; // Округление до 0.1
  }, []);

  // 🔥 ОПРЕДЕЛЕНИЕ УРОВНЯ ВОВЛЕЧЕННОСТИ
  const getEngagementLevel = useCallback((score: number) => {
    if (score >= 3.5) return 'max_engagement';     // 45%+ конверсия
    if (score >= 2.5) return 'high_engagement';    // 30%+ конверсия
    if (score >= 1.5) return 'medium_engagement';  // 15%+ конверсия
    if (score >= 0.5) return 'low_engagement';     // 5%+ конверсия
    return 'no_engagement';                        // 1-2% конверсия
  }, []);

  // 🔥 ОТПРАВКА В TELEGRAM ДЛЯ ВЫСОКОЙ ВОВЛЕЧЕННОСТИ
  const sendEngagementAlert = useCallback(async (data: EngagementData & { score: number; level: string }) => {
    const message = `🔥 ВЫСОКАЯ ВОВЛЕЧЕННОСТЬ!

👤 Пользователь: ${data.email || 'неизвестно'}
🎯 Engagement Score: ${data.score} (${data.level})
📊 Прогресс: ${data.progress}%
🥚 Пасхалок: ${data.eggsCount || 0}
🎮 Демо: ${data.completedDemo ? '✅' : '❌'}
🧮 Калькулятор: ${data.completedCalculator ? '✅' : '❌'}
💎 Кредит: ${data.usedCredit ? '✅' : '❌'}
👥 Рефералов: ${data.referrals}
📝 Последнее действие: ${data.lastAction || 'неизвестно'}

⏰ ${new Date().toLocaleString('ru-RU')}`;

    try {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        })
      });

      if (response.ok) {
        console.log('📊 Уведомление о вовлеченности отправлено в Telegram');
      }
    } catch (error) {
      console.error('Ошибка отправки уведомления о вовлеченности:', error);
    }
  }, []);

  // 🔥 ОСНОВНАЯ ФУНКЦИЯ ОТСЛЕЖИВАНИЯ
  const trackEngagement = useCallback((action: string, additionalData?: any) => {
    const engagementData: EngagementData = {
      progress: completionPercentage,
      eggsCount: additionalData?.eggsCount || 0,
      completedDemo: progress.demo || false,
      completedCalculator: progress.calculator || false,
      usedCredit: progress.calculatorCredit || false,
      referrals: progress.referralEvents || 0,
      email: progress.userEmail,
      lastAction: action
    };

    const engagementScore = calculateEngagementScore(engagementData);
    const engagementLevel = getEngagementLevel(engagementScore);

    // 📊 Яндекс.Метрика - ОТСЛЕЖИВАНИЕ ВОВЛЕЧЕННОСТИ
    if (window.ym) {
      window.ym(12345678, 'params', {
        engagement_score: engagementScore,
        engagement_level: engagementLevel,
        engagement_progress: completionPercentage,
        engagement_eggs: engagementData.eggsCount,
        engagement_demo: engagementData.completedDemo,
        engagement_calculator: engagementData.completedCalculator,
        engagement_credit: engagementData.usedCredit,
        engagement_referrals: engagementData.referrals,
        last_action: action,
        ...additionalData
      });

      console.log(`📊 Engagement tracked: ${action} | Score: ${engagementScore} | Level: ${engagementLevel}`);
    }

    // 🔥 TELEGRAM УВЕДОМЛЕНИЯ ДЛЯ ВЫСОКОЙ ВОВЛЕЧЕННОСТИ
    if (engagementScore >= 2.5) {
      sendEngagementAlert({
        ...engagementData,
        score: engagementScore,
        level: engagementLevel
      });
    }

    return {
      score: engagementScore,
      level: engagementLevel,
      data: engagementData
    };
  }, [completionPercentage, progress, calculateEngagementScore, getEngagementLevel, sendEngagementAlert]);

  // 🔥 АВТОМАТИЧЕСКОЕ ОТСЛЕЖИВАНИЕ ИЗМЕНЕНИЙ PROGRESS
  const currentEngagement = useMemo(() => {
    return trackEngagement('auto_track', { automatic: true });
  }, [trackEngagement]);

  return {
    trackEngagement,
    currentEngagement,
    calculateEngagementScore,
    getEngagementLevel
  };
};