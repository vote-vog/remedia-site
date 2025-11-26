// src/hooks/useEngagementTracker.ts
import { useCallback, useMemo, useRef } from 'react';
import { useProgress } from './useProgress';

// 🔥 ДОБАВЛЯЕМ ИНТЕРФЕЙСЫ ДЛЯ РАСШИРЕННОГО ТРЕКИНГА
interface EngagementSession {
  sessionStart: number;
  actions: string[];
  maxScore: number;
}

interface EngagementData {
  progress: number;
  eggsCount: number;
  completedDemo: boolean;
  completedCalculator: boolean;
  usedCredit: boolean;
  referrals: number;
  email: string | null;
  lastAction: string;
  sessionDuration: number;
  totalActions: number;
}

// 🎯 ФУНКЦИЯ РАСЧЕТА БАЛЛА ВОВЛЕЧЕННОСТИ (ПЕРЕМЕЩЕНА ВВЕРХ)
const calculateEngagementScore = (engagementData: EngagementData): number => {
  let score = 0;
  
  // Прогресс по сайту (макс 30 баллов)
  score += engagementData.progress * 0.3;
  
  // Собраны пасхалки (макс 20 баллов)
  score += Math.min(engagementData.eggsCount * 2, 20);
  
  // Завершены ключевые активности (макс 30 баллов)
  if (engagementData.completedDemo) score += 15;
  if (engagementData.completedCalculator) score += 15;
  
  // Использован кредит (10 баллов)
  if (engagementData.usedCredit) score += 10;
  
  // Рефералы (макс 10 баллов)
  score += Math.min(engagementData.referrals * 5, 10);
  
  // Длительность сессии (макс 10 баллов)
  score += Math.min(engagementData.sessionDuration / 60000, 10);
  
  return Math.min(score, 100);
};

// 🎯 ФУНКЦИЯ ОПРЕДЕЛЕНИЯ УРОВНЯ ВОВЛЕЧЕННОСТИ
const getEngagementLevel = (score: number): string => {
  if (score >= 80) return 'expert';
  if (score >= 60) return 'advanced';
  if (score >= 40) return 'intermediate';
  if (score >= 20) return 'beginner';
  return 'newcomer';
};

// 🔥 ОТПРАВКА В TELEGRAM ДЛЯ КРИТИЧЕСКИХ СОБЫТИЙ
const sendEngagementAlert = async (engagementData: any) => {
  const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;
  
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

  const message = `🎯 ENGAGEMENT ALERT
📊 Score: ${engagementData.score}/100
📈 Level: ${engagementData.level}
🏆 Progress: ${engagementData.progress}%
🥚 Eggs: ${engagementData.eggsCount}
⏰ Session: ${Math.round(engagementData.sessionDuration / 60000)}min
🔄 Actions: ${engagementData.totalActions}
⏰ ${new Date().toLocaleString('ru-RU')}`;

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
  } catch (error) {
    console.error('Ошибка отправки в Telegram:', error);
  }
};

export const useEngagementTracker = () => {
  const { progress, completionPercentage } = useProgress();
  
  // 🔥 СЕССИЯ ПОЛЬЗОВАТЕЛЯ ДЛЯ АНАЛИТИКИ ПОВЕДЕНИЯ
  const sessionRef = useRef<EngagementSession>({
    sessionStart: Date.now(),
    actions: [],
    maxScore: 0
  });

  // 🔥 ОПРЕДЕЛЕНИЕ КРИТИЧЕСКИХ СОБЫТИЙ
  const isCriticalAction = useCallback((action: string) => {
    const criticalActions = [
      'waitlist_signup',
      'founder_conversion', 
      'all_eggs_collected',
      'calculator_credit_used',
      'demo_completed',
      'progress_200_achieved'
    ];
    return criticalActions.includes(action);
  }, []);

  // 🔥 ОБНОВЛЕННАЯ ФУНКЦИЯ ТРЕКИНГА С СЕССИЕЙ
  const trackEngagement = useCallback((action: string, additionalData?: any) => {
    // Обновляем сессию
    sessionRef.current.actions.push(action);
    
    const engagementData: EngagementData = {
      progress: completionPercentage,
      eggsCount: additionalData?.eggsCount || 0,
      completedDemo: progress.demo || false,
      completedCalculator: progress.calculator || false,
      usedCredit: progress.calculatorCredit || false,
      referrals: progress.referralEvents || 0,
      email: progress.userEmail,
      lastAction: action,
      sessionDuration: Date.now() - sessionRef.current.sessionStart,
      totalActions: sessionRef.current.actions.length
    };

    const engagementScore = calculateEngagementScore(engagementData);
    const engagementLevel = getEngagementLevel(engagementScore);
    
    // Обновляем максимальный score сессии
    sessionRef.current.maxScore = Math.max(sessionRef.current.maxScore, engagementScore);

    // 📊 Яндекс.Метрика - РАСШИРЕННЫЕ ПАРАМЕТРЫ
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
        
        // 🔥 СЕССИОННЫЕ ДАННЫЕ
        session_duration: engagementData.sessionDuration,
        session_actions: engagementData.totalActions,
        session_max_score: sessionRef.current.maxScore,
        action_sequence: sessionRef.current.actions.join(' → '),
        
        last_action: action,
        ...additionalData
      });

      console.log(`📊 Engagement: ${action} | Score: ${engagementScore} | Level: ${engagementLevel} | Session: ${engagementData.totalActions} actions`);
    }

    // 🔥 TELEGRAM ДЛЯ КРИТИЧЕСКИХ СОБЫТИЙ
    if (engagementScore >= 25 || isCriticalAction(action)) {
      sendEngagementAlert({
        ...engagementData,
        score: engagementScore,
        level: engagementLevel,
        session_actions: sessionRef.current.actions.length,
        session_max_score: sessionRef.current.maxScore
      });
    }

    return {
      score: engagementScore,
      level: engagementLevel,
      data: engagementData,
      session: sessionRef.current
    };
  }, [completionPercentage, progress, isCriticalAction]);

  // 🔥 ФУНКЦИЯ ДЛЯ ПАТЧЕРНОГО ТРЕКИНГА (если нужно добавить в существующие компоненты)
  const patchTrackEngagement = useCallback((component: string, action: string, data?: any) => {
    return trackEngagement(`${component}_${action}`, data);
  }, [trackEngagement]);

  return {
    trackEngagement,
    patchTrackEngagement, // 🔥 ДЛЯ БЫСТРОГО ДОБАВЛЕНИЯ В СУЩЕСТВУЮЩИЙ КОД
    currentEngagement: useMemo(() => trackEngagement('auto_track', { automatic: true }), [trackEngagement]),
    getSession: () => sessionRef.current
  };
};