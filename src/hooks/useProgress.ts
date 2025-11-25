// src/hooks/useProgress.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useEventBus } from './useEventBus';

// ==================== ТИПЫ ====================
export interface ProductionFacts {
  demoProduced: boolean;
  calculatorProduced: boolean; 
  calculatorCreditProduced: boolean;
  feedbackProduced: boolean;
  waitlistProduced: boolean;
  referralEvents: number; // 🎯 ЗАМЕНЯЕМ boolean на счетчик событий
  userId: string;
  userEmail?: string;
  isLoggedIn: boolean;
  referralCode: string;
}

export interface RegistrationData {
  email: string;
  agreeTerms: boolean;
}

// ==================== КОНСТАНТЫ ====================
const DEFAULT_FACTS: ProductionFacts = {
  demoProduced: false,
  calculatorProduced: false,
  calculatorCreditProduced: false, 
  feedbackProduced: false,
  waitlistProduced: false,
  referralEvents: 0, // 🎯 Начинаем с 0 событий
  userId: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  isLoggedIn: false,
  referralCode: `REF_${Date.now().toString(36).substr(-6)}`.toUpperCase()
};

// ==================== ЦЕНТРАЛЬНЫЙ ОФИС ====================
export const useProgress = () => {
  const [facts, setFacts] = useState<ProductionFacts>(() => loadFacts());
  const [showReferralPopup, setShowReferralPopup] = useState(false);
  const { on } = useEventBus();

  // 🚚 ПОЛУЧЕНИЕ ТОВАРОВ ОТ ЛОГИСТИКИ
  useEffect(() => {
    console.log('🏭 Центральный офис: запускаю прием товаров');

    const handleProduction = (event: { type: string; data?: any }) => {
      console.log(`📦 Центральный офис: получен товар "${event.type}"`);
      
      setFacts(prev => {
        const newFacts = { ...prev };
        
        switch (event.type) {
          case 'demo':
            newFacts.demoProduced = true;
            break;
          case 'calculator':
            newFacts.calculatorProduced = true;
            break;
          case 'calculatorCredit':
            newFacts.calculatorCreditProduced = true;
            break;
          case 'feedback':
            newFacts.feedbackProduced = true;
            break;
          case 'waitlist':
            newFacts.waitlistProduced = true;
            break;
          case 'referral':
            newFacts.referralEvents += 1; // 🎯 +1 событие вместо boolean
            break;
          default:
            console.warn('❌ Центральный офис: неизвестный тип товара:', event.type);
            return prev;
        }

        console.log('✅ Центральный офис: факт производства зафиксирован', newFacts);
        saveFacts(newFacts);
        return newFacts;
      });
    };

    const unsubscribe = on('milestone:completed', handleProduction);
    return unsubscribe;
  }, [on]);

  // 🎯 РАСЧЕТ ПРОГРЕССА
  const completionPercentage = useMemo(() => {
    let total = 0;
    
    if (facts.demoProduced) total += 20;
    if (facts.calculatorProduced) total += 20;
    if (facts.calculatorCreditProduced) total += 20;
    if (facts.feedbackProduced) total += 20;
    if (facts.waitlistProduced) total += 20;
    
    // 🎯 КАЖДОЕ РЕФЕРАЛЬНОЕ СОБЫТИЕ = +20%
    total += facts.referralEvents * 20;
    
    console.log('📊 Центральный офис: расчет прогресса', { 
      total, 
      referralEvents: facts.referralEvents,
      referralBonus: facts.referralEvents * 20 
    });
    return total;
  }, [facts]);

  // 🏢 HR: УСЛОВИЯ ДЛЯ REWARDS POPUP
  const shouldShowRewardsPopup = useMemo(() => {
    const producedGoods = [
      facts.demoProduced,
      facts.calculatorProduced,
      facts.calculatorCreditProduced, 
      facts.feedbackProduced
    ].filter(Boolean).length;
    
    const shouldShow = producedGoods >= 2 && !facts.waitlistProduced;
    console.log('🏢 HR Rewards: проверка', { producedGoods, shouldShow });
    return shouldShow;
  }, [facts]);

  // 🎯 ОБЪЕКТ PROGRESS ДЛЯ КОМПОНЕНТОВ
  const progress = useMemo(() => ({
    isLoggedIn: facts.isLoggedIn,
    userEmail: facts.userEmail,
    referralCode: facts.referralCode,
    referralEvents: facts.referralEvents, // 🎯 Добавляем счетчик событий
    demo: facts.demoProduced,
    calculator: facts.calculatorProduced,
    calculatorCredit: facts.calculatorCreditProduced,
    feedback: facts.feedbackProduced,
    waitlist: facts.waitlistProduced,
    userId: facts.userId,
    rewardsClaimed: false
  }), [facts]);

  // 🏭 ПРОИЗВОДСТВО waitlist ТОВАРА
  const produceWaitlist = useCallback(async (userData: RegistrationData) => {
    if (!userData.agreeTerms) {
      throw new Error('Требуется согласие с условиями');
    }

    console.log('🏭 Центральный офис: запускаю производство waitlist товара');
    
    setFacts(prev => {
      const newFacts = { 
        ...prev, 
        waitlistProduced: true,
        isLoggedIn: true,
        userEmail: userData.email
      };
      saveFacts(newFacts);
      return newFacts;
    });

    await sendProductionNotification(userData.email);
    console.log('✅ Центральный офис: waitlist товар произведен');
  }, []);

  // 🎯 УПРАВЛЕНИЕ REWARDS POPUP
  const [showRewardsPopup, setShowRewardsPopup] = useState(false);
  const [rewardsPopupMode, setRewardsPopupMode] = useState<'rewards' | 'profile'>('rewards');

  const handleOpenRewardsPopup = useCallback((mode: 'rewards' | 'profile') => {
    console.log('🎯 Открытие RewardsPopup в режиме:', mode);
    setRewardsPopupMode(mode);
    setShowRewardsPopup(true);
  }, []);

  const handleCloseRewardsPopup = useCallback(() => {
    console.log('❌ Закрытие RewardsPopup');
    setShowRewardsPopup(false);
  }, []);

  // 🎯 УПРАВЛЕНИЕ REFERRAL POPUP
  const handleOpenReferralPopup = useCallback(() => {
    console.log('📤 Открытие ReferralPopup');
    setShowReferralPopup(true);
  }, []);

  const handleCloseReferralPopup = useCallback(() => {
    console.log('❌ Закрытие ReferralPopup');
    setShowReferralPopup(false);
  }, []);

  // 🎯 ОБРАБОТКА РЕФЕРАЛЬНЫХ ССЫЛОК
  const processReferralLink = useCallback(() => {
    console.log('🔗 Обработка реферальной ссылки');
    // Логика будет добавлена позже
  }, []);

  // 🎯 ВОЗВРАТ ДАННЫХ
  return {
    // 📊 ДАННЫЕ
    progress,
    completionPercentage,
    productionFacts: facts,
    
    // 🏢 POPUP СОСТОЯНИЯ
    showRewardsPopup,
    showReferralPopup,
    showReferralSuccess: false,
    rewardsPopupMode,
    
    // 🏭 ФУНКЦИИ ПРОИЗВОДСТВА
    produceWaitlist,
    claimRewards: produceWaitlist,
    
    // 🎯 УПРАВЛЕНИЕ POPUP'АМИ
    handleOpenRewardsPopup,
    handleOpenReferralPopup, 
    handleCloseRewardsPopup,
    handleCloseReferralPopup,
    processReferralLink,
    
    isInitialized: true
  };
};

// ==================== УТИЛИТЫ ====================
const loadFacts = (): ProductionFacts => {
  try {
    const saved = localStorage.getItem('remedia-production-facts');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_FACTS, ...parsed };
    }
    return DEFAULT_FACTS;
  } catch {
    return DEFAULT_FACTS;
  }
};

const saveFacts = (facts: ProductionFacts) => {
  localStorage.setItem('remedia-production-facts', JSON.stringify(facts));
};

const sendProductionNotification = async (email: string) => {
  console.log('📨 Уведомление о производстве waitlist для:', email);
};