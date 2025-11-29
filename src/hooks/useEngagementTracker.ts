// src/hooks/useEngagementTracker.ts
import { useCallback, useMemo, useRef } from 'react';
import { useProgress } from './useProgress';

interface EngagementSession {
  sessionStart: number;
  actions: string[];
  maxScore: number;
  lastAlertTime: number;
  // 🔥 Храним просмотренные пасхалки и отправленные события
  viewedEggs: Set<string>; // ID просмотренных пасхалок
  sentEngagementEvents: Set<string>;
}

interface EngagementData {
  progress: number;
  eggsCount: number; // 🔥 Общее количество просмотренных пасхалок
  completedDemo: boolean;
  completedCalculator: boolean;
  usedCredit: boolean;
  referrals: number;
  email: string | null;
  lastAction: string;
  sessionDuration: number;
  totalActions: number;
}

// 🎯 КЛЮЧЕВЫЕ СОБЫТИЯ ВОВЛЕЧЕННОСТИ
const ENGAGEMENT_EVENTS = {
  // 🔥 ПАСХАЛКИ (трекаем при достижении порогов)
  EGGS: [
    'eggs_3_viewed',    // Просмотрено 3 пасхалки
    'eggs_7_viewed',    // Просмотрено 7 пасхалок  
    'eggs_9_viewed',    // Просмотрено 9 пасхалок
    'eggs_10_viewed'    // Просмотрено все 10 пасхалок
  ],
  // 🔥 КЛЮЧЕВЫЕ АКТИВНОСТИ
  ACTIVITIES: [
    'demo_completed',   // Пройден демо-чат
    'first_referral'    // Первый реферал
  ]
} as const;

// 🎯 ФУНКЦИЯ ПРОВЕРКИ СОБЫТИЙ ПАСХАЛОК
const checkEggEngagementEvents = (eggsCount: number, sentEvents: Set<string>) => {
  const events = [];
  
  if (eggsCount >= 3 && !sentEvents.has('eggs_3_viewed')) {
    events.push('eggs_3_viewed');
  }
  if (eggsCount >= 7 && !sentEvents.has('eggs_7_viewed')) {
    events.push('eggs_7_viewed');
  }
  if (eggsCount >= 9 && !sentEvents.has('eggs_9_viewed')) {
    events.push('eggs_9_viewed');
  }
  if (eggsCount >= 10 && !sentEvents.has('eggs_10_viewed')) {
    events.push('eggs_10_viewed');
  }
  
  return events;
};

// 🎯 ФУНКЦИЯ ПРОВЕРКИ СОБЫТИЙ АКТИВНОСТЕЙ
const checkActivityEngagementEvents = (
  completedDemo: boolean, 
  referrals: number, 
  sentEvents: Set<string>
) => {
  const events = [];
  
  if (completedDemo && !sentEvents.has('demo_completed')) {
    events.push('demo_completed');
  }
  if (referrals >= 1 && !sentEvents.has('first_referral')) {
    events.push('first_referral');
  }
  
  return events;
};

const calculateEngagementScore = (engagementData: EngagementData): number => {
  let score = 0;
  score += engagementData.progress * 0.3;
  score += Math.min(engagementData.eggsCount * 2, 20);
  if (engagementData.completedDemo) score += 15;
  if (engagementData.completedCalculator) score += 15;
  if (engagementData.usedCredit) score += 10;
  score += Math.min(engagementData.referrals * 5, 10);
  score += Math.min(engagementData.sessionDuration / 60000, 10);
  return Math.min(score, 100);
};

const getEngagementLevel = (score: number): string => {
  if (score >= 80) return 'expert';
  if (score >= 60) return 'advanced';
  if (score >= 40) return 'intermediate';
  if (score >= 20) return 'beginner';
  return 'newcomer';
};

// 🔥 СООБЩЕНИЕ ДЛЯ СОБЫТИЙ ВОВЛЕЧЕННОСТИ
const sendEngagementAlert = async (event: string, engagementData: any) => {
  const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;
  
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

  // 🎯 ФОРМАТИРОВАНИЕ СООБЩЕНИЙ ДЛЯ РАЗНЫХ ТИПОВ СОБЫТИЙ
  const eventTitles: Record<string, string> = {
    'eggs_3_viewed': '🥚 Просмотрено 3 пасхалки',
    'eggs_7_viewed': '🔍 Просмотрено 7 пасхалок', 
    'eggs_9_viewed': '🎯 Просмотрено 9 пасхалок',
    'eggs_10_viewed': '🏆 Все 10 пасхалок просмотрены!',
    'demo_completed': '💬 Демо-чат пройден',
    'first_referral': '🤝 Получен первый реферал'
  };

  const eventDescriptions: Record<string, string> = {
    'eggs_3_viewed': 'Пользователь активно исследует сайт',
    'eggs_7_viewed': 'Высокий уровень вовлеченности в контент',
    'eggs_9_viewed': 'Почти все пасхалки найдены',
    'eggs_10_viewed': 'Идеальное вовлечение - все пасхалки найдены!',
    'demo_completed': 'Пользователь прошел демонстрацию функционала',
    'first_referral': 'Начал привлекать других пользователей'
  };

  const message = `🎯 USER ENGAGEMENT EVENT
${eventTitles[event]}
📝 ${eventDescriptions[event]}
📊 Engagement Score: ${engagementData.score}/100
📈 Level: ${engagementData.level}
🏆 Overall Progress: ${engagementData.progress}%
🥚 Total Eggs Viewed: ${engagementData.eggsCount}/10
👥 Referrals: ${engagementData.referrals}
⏰ Session: ${Math.round(engagementData.sessionDuration / 60000)}min
🔄 Total Actions: ${engagementData.totalActions}
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
  
  const sessionRef = useRef<EngagementSession>({
    sessionStart: Date.now(),
    actions: [],
    maxScore: 0,
    lastAlertTime: 0,
    viewedEggs: new Set(), // 🔥 Храним ID просмотренных пасхалок
    sentEngagementEvents: new Set()
  });

  // 🔥 ДОБАВЛЕНИЕ ПРОСМОТРЕННОЙ ПАСХАЛКИ
  const trackEggView = useCallback((eggId: string) => {
    // Добавляем пасхалку в Set (дубликаты игнорируются)
    sessionRef.current.viewedEggs.add(eggId);
    
    // Получаем общее количество уникальных просмотренных пасхалок
    const eggsCount = sessionRef.current.viewedEggs.size;
    
    console.log(`🥚 Egg viewed: ${eggId}, Total: ${eggsCount}/10`);
    
    // Трекаем событие с обновленным количеством
    return trackEngagement('egg_viewed', { 
      eggId,
      eggsCount 
    });
  }, []);

  // 🔥 ПРОВЕРКА ЯВЛЯЕТСЯ ЛИ СОБЫТИЕ КЛЮЧЕВЫМ ДЛЯ ВОВЛЕЧЕННОСТИ
  const isEngagementEvent = useCallback((event: string) => {
    return [...ENGAGEMENT_EVENTS.EGGS, ...ENGAGEMENT_EVENTS.ACTIVITIES].includes(event);
  }, []);

  // 🔥 ОСНОВНАЯ ФУНКЦИЯ ТРЕКИНГА ВОВЛЕЧЕННОСТИ
  const trackEngagement = useCallback((action: string, additionalData?: any) => {
    // Пропускаем авто-трекинг
    if (action === 'auto_track') return null;
    
    sessionRef.current.actions.push(action);
    const currentTime = Date.now();
    
    // 🔥 РАСЧЕТ КОЛИЧЕСТВА ПРОСМОТРЕННЫХ ПАСХАЛОК
    const eggsCount = sessionRef.current.viewedEggs.size;

    const engagementData: EngagementData = {
      progress: completionPercentage,
      eggsCount: eggsCount, // 🔥 Используем реальное количество
      completedDemo: progress.demo || false,
      completedCalculator: progress.calculator || false,
      usedCredit: progress.calculatorCredit || false,
      referrals: progress.referralEvents || 0,
      email: progress.userEmail,
      lastAction: action,
      sessionDuration: currentTime - sessionRef.current.sessionStart,
      totalActions: sessionRef.current.actions.length
    };

    const engagementScore = calculateEngagementScore(engagementData);
    const engagementLevel = getEngagementLevel(engagementScore);
    sessionRef.current.maxScore = Math.max(sessionRef.current.maxScore, engagementScore);

    // 📊 Яндекс.Метрика
    if (window.ym) {
      window.ym(12345678, 'params', {
        engagement_score: engagementScore,
        engagement_level: engagementLevel,
        eggs_count: eggsCount,
        last_action: action,
        ...additionalData
      });
      console.log(`📊 Engagement: ${action} | Eggs: ${eggsCount}/10 | Score: ${engagementScore}`);
    }

    // 🔥 АВТОМАТИЧЕСКАЯ ПРОВЕРКА СОБЫТИЙ ВОВЛЕЧЕННОСТИ
    const eggEvents = checkEggEngagementEvents(eggsCount, sessionRef.current.sentEngagementEvents);
    const activityEvents = checkActivityEngagementEvents(
      engagementData.completedDemo, 
      engagementData.referrals, 
      sessionRef.current.sentEngagementEvents
    );
    
    const allEngagementEvents = [...eggEvents, ...activityEvents];
    
    // Отправляем события вовлеченности и помечаем как отправленные
    allEngagementEvents.forEach(event => {
      sendEngagementAlert(event, {
        ...engagementData,
        score: engagementScore,
        level: engagementLevel
      });
      
      sessionRef.current.sentEngagementEvents.add(event);
    });

    return {
      score: engagementScore,
      level: engagementLevel,
      data: engagementData,
      session: sessionRef.current,
      engagementEvents: allEngagementEvents
    };
  }, [completionPercentage, progress, isEngagementEvent]);

  return {
    trackEngagement,
    trackEggView, // 🔥 СПЕЦИАЛЬНЫЙ МЕТОД ДЛЯ ТРЕКИНГА ПАСХАЛОК
    getCurrentEngagement: () => trackEngagement('status_check'),
    getSession: () => sessionRef.current,
    // 🔥 ДОПОЛНИТЕЛЬНЫЕ МЕТОДЫ
    trackDemoCompleted: () => trackEngagement('demo_completed'),
    trackReferral: (referralsCount: number) => trackEngagement('referral_added', { referrals: referralsCount }),
    // 🔥 ДЛЯ ОТЛАДКИ
    getViewedEggsCount: () => sessionRef.current.viewedEggs.size,
    getViewedEggs: () => Array.from(sessionRef.current.viewedEggs)
  };
};