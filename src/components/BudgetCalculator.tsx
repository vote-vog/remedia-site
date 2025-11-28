// src/components/BudgetCalculator.tsx
import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { ChatMessage, Message } from "./ChatMessage";
import { useProductActions } from "@/hooks/useProductActions";
import { useToast } from "@/hooks/use-toast";
import { useEngagementTracker } from "@/hooks/useEngagementTracker";
import { useLanguage } from "@/hooks/useLanguage";

// 🔥 ОПТИМИЗИРОВАННАЯ КОНФИГУРАЦИЯ ВАЛЮТ
const CURRENCY_CONFIG = {
  rub: {
    symbol: '₽',
    baseBudget: 500,
    credit: {
      totalFunctionality: 800,
      deduction: 50,
      eligibility: {
        maxTemptations: 1,
        minFeatures: 1
      }
    },
    // Цены в рублях (оригинальные)
    prices: {
      features: [100, 100, 200, 50, 150, 200],
      temptations: [50, 250, 300, 150]
    }
  },
  usd: {
    symbol: '$',
    baseBudget: 20, // Увеличили бюджет до $20 для лучшего UX
    credit: {
      totalFunctionality: 32, // Увеличили до $32
      deduction: 2, // Увеличили вычет до $2
      eligibility: {
        maxTemptations: 1,
        minFeatures: 1
      }
    },
    // Цены в долларах (округленные для лучшего UX)
    prices: {
      features: [2, 2, 4, 1, 3, 4],    // Округлили до целых чисел
      temptations: [1, 5, 6, 3]        // Округлили до целых чисел
    }
  }
};

interface BudgetCalculatorProps {
  onButtonClick?: () => void;
}

export const BudgetCalculator = ({ onButtonClick }: BudgetCalculatorProps) => {
  const { trackEngagement } = useEngagementTracker();
  const [messages, setMessages] = useState<Message[]>([]);
  const [budget, setBudget] = useState(500); // Начальный бюджет в рублях
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState<'selection' | 'credit' | 'feedback' | 'completed'>('selection');
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableCredit, setAvailableCredit] = useState(0);
  const [creditUsed, setCreditUsed] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<any[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { completeMilestone } = useProductActions();
  const { toast } = useToast();
  const { t, language } = useLanguage();

  // 🔥 ПОЛУЧЕНИЕ КОНФИГУРАЦИИ ВАЛЮТЫ
  const getCurrencyConfig = () => {
    return language === 'en' ? CURRENCY_CONFIG.usd : CURRENCY_CONFIG.rub;
  };

  // 🔥 КОНВЕРТАЦИЯ ЦЕН
  const convertPrice = (priceInRubles: number): string => {
    const config = getCurrencyConfig();
    if (language === 'en') {
      // Для долларов используем предустановленные цены
      return `${config.symbol}${priceInRubles}`;
    }
    return `${priceInRubles}${config.symbol}`;
  };

  const getBudgetDisplay = (): string => {
    const config = getCurrencyConfig();
    return `${config.baseBudget}${config.symbol}`;
  };

  const getCurrentBudget = (): number => {
    const config = getCurrencyConfig();
    return config.baseBudget;
  };

  const getCreditDisplay = (credit: number): string => {
    const config = getCurrencyConfig();
    return `${credit}${config.symbol}`;
  };

  // 🔥 ДИНАМИЧЕСКИЕ ОПЦИИ С ПЕРЕВОДАМИ И АДАПТИВНЫМИ ЦЕНАМИ
  const features = useMemo(() => {
    const config = getCurrencyConfig();
    return [
      { id: 1, name: t('calculator.options.features.1'), price: config.prices.features[0], type: "feature" },
      { id: 2, name: t('calculator.options.features.2'), price: config.prices.features[1], type: "feature" },
      { id: 3, name: t('calculator.options.features.3'), price: config.prices.features[2], type: "feature" },
      { id: 4, name: t('calculator.options.features.4'), price: config.prices.features[3], type: "feature" },
      { id: 5, name: t('calculator.options.features.5'), price: config.prices.features[4], type: "feature" },
      { id: 6, name: t('calculator.options.features.6'), price: config.prices.features[5], type: "feature" }
    ];
  }, [t, language]);

  const temptations = useMemo(() => {
    const config = getCurrencyConfig();
    return [
      { id: 7, name: t('calculator.options.temptations.1'), price: config.prices.temptations[0], type: "temptation" },
      { id: 8, name: t('calculator.options.temptations.2'), price: config.prices.temptations[1], type: "temptation" },
      { id: 9, name: t('calculator.options.temptations.3'), price: config.prices.temptations[2], type: "temptation" },
      { id: 10, name: t('calculator.options.temptations.4'), price: config.prices.temptations[3], type: "temptation" }
    ];
  }, [t, language]);

  const allOptions = useMemo(() => [...features, ...temptations], [features, temptations]);

  // 🔥 ИНИЦИАЛИЗАЦИЯ БЮДЖЕТА ПРИ СМЕНЕ ЯЗЫКА
  useEffect(() => {
    const config = getCurrencyConfig();
    setBudget(config.baseBudget);
  }, [language]);

  // 🔥 TELEGRAM CONFIG
  const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  // 🔥 ПЕРЕМЕШИВАНИЕ ОПЦИЙ ПРИ ИНИЦИАЛИЗАЦИИ
  useEffect(() => {
    const mixed = allOptions
      .map(option => ({ ...option, sortOrder: Math.random() }))
      .sort((a, b) => a.sortOrder - b.sortOrder);
    setShuffledOptions(mixed);
  }, [allOptions]);

  // 🔥 ФУНКЦИЯ РАСЧЕТА КРЕДИТА С УЧЕТОМ ВАЛЮТЫ
  const calculateCredit = () => {
    const selectedFeatures = selectedOptions.filter(id => id <= 6);
    const selectedAlternatives = selectedOptions.filter(id => id > 6);
    
    const currencyConfig = getCurrencyConfig();
    
    // 🔥 УСЛОВИЯ КРЕДИТОВАНИЯ:
    const isEligibleForCredit = 
      selectedAlternatives.length <= currencyConfig.credit.eligibility.maxTemptations &&
      selectedFeatures.length >= currencyConfig.credit.eligibility.minFeatures;

    if (!isEligibleForCredit) return 0;

    // 🔥 Формула: кредит = (весь функционал - купленный) - фиксированный вычет
    const purchasedMainFeatures = selectedFeatures
      .reduce((sum, id) => {
        const feature = features.find(f => f.id === id);
        return sum + (feature?.price || 0);
      }, 0);

    const credit = (currencyConfig.credit.totalFunctionality - purchasedMainFeatures) - currencyConfig.credit.deduction;
    
    return Math.max(credit, 0); // Не может быть отрицательным
  };

  // 🔥 ПЕРЕСЧЕТ КРЕДИТА ПРИ ИЗМЕНЕНИИ ВЫБОРА
  useEffect(() => {
    const credit = calculateCredit();
    setAvailableCredit(credit);
  }, [selectedOptions, language]);

  // 🔥 АВТОМАТИЧЕСКИЙ ПЕРЕХОД ПРИ ИСЧЕРПАНИИ КРЕДИТА
  useEffect(() => {
    if (currentStep === 'credit' && availableCredit <= 0 && creditUsed) {
      const timer = setTimeout(() => {
        proceedToFeedback();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [availableCredit, currentStep, creditUsed]);

  // 🔥 ОПЦИИ, ДОСТУПНЫЕ ДЛЯ ПОКУПКИ ЗА КРЕДИТ
  const getAvailableCreditOptions = () => {
    if (availableCredit <= 0) return [];
    
    return allOptions.filter(option => 
      !selectedOptions.includes(option.id) && // Еще не выбрано
      option.price <= availableCredit         // По карману
    );
  };

  // 🎯 ФУНКЦИЯ АНАЛИЗА СТРАТЕГИИ ВЫБОРА
  const getSelectionStrategy = () => {
    const features = selectedOptions.filter(id => id <= 6).length;
    const temptations = selectedOptions.filter(id => id > 6).length;
    
    if (features === 0 && temptations > 0) return 'only_temptations';
    if (features > 0 && temptations === 0) return 'only_features'; 
    if (features > temptations) return 'feature_focused';
    if (temptations > features) return 'temptation_focused';
    return 'balanced';
  };

  // 🔥 ИСПОЛЬЗОВАНИЕ КРЕДИТА ДЛЯ ПОКУПКИ ОПЦИИ
  const handleUseCredit = (optionId: number, price: number) => {
    const option = allOptions.find(o => o.id === optionId);
    
    setSelectedOptions(prev => [...prev, optionId]);
    setAvailableCredit(prev => prev - price);
    setCreditUsed(true);
    
    setMessages(prev => [...prev, {
      id: `user-credit-${Date.now()}`,
      role: "user",
      content: t('calculator.messages.useCredit', { option: option?.name })
    }]);

    // 🔥 Яндекс.Метрика - ИСПОЛЬЗОВАНИЕ КРЕДИТА
    if (window.ym) {
      window.ym(12345678, 'reachGoal', 'calculator_credit_used');
      console.log('📊 Яндекс.Метрика: кредит использован');
    }

    // 🔥 ОТСЛЕЖИВАЕМ ВОВЛЕЧЕННОСТЬ - ИСПОЛЬЗОВАНИЕ КРЕДИТА
    trackEngagement('calculator_credit_used', {
      option_id: optionId,
      option_name: option?.name,
      option_type: option?.type,
      credit_amount: price,
      remaining_credit: availableCredit - price
    });

    // AI ответ
    setTimeout(() => {
      const remainingCredit = availableCredit - price;
      let message = t('calculator.messages.creditUsed');
      
      if (remainingCredit > 0) {
        message += t('calculator.messages.creditRemaining', { 
          credit: getCreditDisplay(remainingCredit) 
        });
      } else {
        message += t('calculator.messages.creditExhausted');
      }
      
      setMessages(prev => [...prev, {
        id: `ai-credit-${Date.now()}`,
        role: "ai",
        content: message
      }]);
    }, 500);
  };

  // Начальное сообщение
  useEffect(() => {
    setMessages([
      {
        id: "1",
        role: "ai",
        content: t('calculator.messages.welcome', { budget: getBudgetDisplay() })
      },
      {
        id: "2", 
        role: "ai",
        content: t('calculator.messages.instruction')
      }
    ]);
  }, [t, language]);

  // Скролл вниз
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  // В handleSelectOption добавляем анализ выбора:
  const handleSelectOption = (optionId: number, price: number) => {
    const option = allOptions.find(o => o.id === optionId);
    const isFeature = optionId <= 6;
    
    if (selectedOptions.includes(optionId)) {
      // Уже выбрано - убираем
      setSelectedOptions(prev => prev.filter(id => id !== optionId));
      setBudget(prev => prev + price);
      
      setMessages(prev => [...prev, {
        id: `user-${Date.now()}`,
        role: "user", 
        content: t('calculator.messages.removeOption', { option: option?.name })
      }]);

      // 🔥 ОТСЛЕЖИВАЕМ ВОВЛЕЧЕННОСТЬ - УДАЛЕНИЕ ОПЦИИ
      trackEngagement('calculator_option_removed', {
        option_id: optionId,
        option_name: option?.name,
        option_type: option?.type,
        budget_remaining: budget + price
      });
    } else if (budget >= price) {
      // Выбираем новую опцию
      setSelectedOptions(prev => [...prev, optionId]);
      setBudget(prev => prev - price);
      
      setMessages(prev => [...prev, {
        id: `user-${Date.now()}`,
        role: "user",
        content: t('calculator.messages.selectOption', { option: option?.name })
      }]);

      // 🔥 ОТСЛЕЖИВАЕМ ВОВЛЕЧЕННОСТЬ - ВЫБОР ОПЦИИ
      trackEngagement('calculator_option_selected', {
        option_id: optionId,
        option_name: option?.name,
        option_type: isFeature ? 'feature' : 'temptation',
        option_price: price,
        budget_remaining: budget - price,
        total_selected: selectedOptions.length + 1,
        features_count: selectedOptions.filter(id => id <= 6).length + (isFeature ? 1 : 0),
        temptations_count: selectedOptions.filter(id => id > 6).length + (!isFeature ? 1 : 0),
        selection_strategy: getSelectionStrategy() // 🎯 анализируем стратегию выбора
      });

      // AI ответ
      setTimeout(() => {
        const remaining = budget - price;
        let message = t('calculator.messages.optionSelected', { 
          remaining: getCreditDisplay(remaining) 
        });
        
        if (remaining > 0) {
          message += t('calculator.messages.continueSelection');
        } else {
          message += t('calculator.messages.budgetExhausted');
        }
        
        setMessages(prev => [...prev, {
          id: `ai-${Date.now()}`,
          role: "ai",
          content: message
        }]);
      }, 500);
    } else {
      // Не хватает денег
      const missing = price - budget;
      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        role: "ai", 
        content: t('calculator.messages.insufficientFunds', { 
          missing: getCreditDisplay(missing) 
        })
      }]);

      // 🔥 ОТСЛЕЖИВАЕМ ВОВЛЕЧЕННОСТЬ - НЕУДАЧНАЯ ПОПЫТКА
      trackEngagement('calculator_option_failed', {
        option_id: optionId,
        option_name: option?.name,
        option_type: option?.type,
        option_price: price,
        budget_remaining: budget,
        missing_amount: price - budget
      });
    }
  };

  // 🔥 ЗАВЕРШЕНИЕ С ПРОВЕРКОЙ КРЕДИТА
  const handleComplete = () => {
    onButtonClick?.();
    
    const credit = calculateCredit();
    
    // 🔥 ОТСЛЕЖИВАЕМ ВОВЛЕЧЕННОСТЬ КАЛЬКУЛЯТОРА
    trackEngagement('calculator_completed', {
      selected_features: selectedOptions.filter(id => id <= 6).length,
      selected_temptations: selectedOptions.filter(id => id > 6).length,
      budget_remaining: budget,
      credit_eligible: credit > 0,
      credit_used: creditUsed,
      total_spent: getCurrentBudget() - budget,
      final_selection_strategy: getSelectionStrategy() // 🎯 финальная стратегия
    });
    
    // 🔥 Яндекс.Метрика - ЗАВЕРШЕНИЕ КАЛЬКУЛЯТОРА
    if (window.ym) {
      window.ym(12345678, 'reachGoal', 'calculator_completed');
      
      // Если доступен кредит
      if (credit > 0) {
        window.ym(12345678, 'reachGoal', 'calculator_credit_eligible');
      }
      
      console.log('📊 Яндекс.Метрика: калькулятор завершен');
    }
    
    // 🔥 ОТПРАВЛЯЕМ В TELEGRAM КЛЮЧЕВОЕ СОБЫТИЕ
    sendKeyEventToTelegram('ЗАВЕРШЕНИЕ СБОРКИ');

    // 🔥 ЕСЛИ ДОСТУПЕН КРЕДИТ - ПРЕДЛАГАЕМ ЕГО ИСПОЛЬЗОВАТЬ
    if (credit > 0 && !creditUsed) {
      setCurrentStep('credit');
      setMessages(prev => [...prev, {
        id: `user-complete-${Date.now()}`,
        role: "user",
        content: t('calculator.messages.ready')
      }]);

      // 🔥 ОТСЛЕЖИВАЕМ ВОВЛЕЧЕННОСТЬ - ПРЕДЛОЖЕНИЕ КРЕДИТА
      trackEngagement('calculator_credit_offered', {
        credit_amount: credit,
        selected_features: selectedOptions.filter(id => id <= 6).length,
        selected_temptations: selectedOptions.filter(id => id > 6).length,
        selection_strategy: getSelectionStrategy()
      });

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: `ai-credit-offer`,
          role: "ai",
          content: t('calculator.messages.creditOffer', { 
            credit: getCreditDisplay(credit) 
          })
        }]);
      }, 800);
    } else {
      // 🔥 ЕСЛИ КРЕДИТА НЕТ ИЛИ УЖЕ ИСПОЛЬЗОВАН - ПЕРЕХОДИМ К ОТЗЫВУ
      proceedToFeedback();
    }
  };

  // 🔥 ПРОДОЛЖЕНИЕ БЕЗ ИСПОЛЬЗОВАНИЯ КРЕДИТА
  const handleSkipCredit = () => {
    setCurrentStep('feedback');
    setMessages(prev => [...prev, {
      id: `user-skip-credit`,
      role: "user", 
      content: t('calculator.messages.skipCredit')
    }]);

    // 🔥 ОТСЛЕЖИВАЕМ ВОВЛЕЧЕННОСТЬ - ПРОПУСК КРЕДИТА
    trackEngagement('calculator_credit_skipped', {
      credit_amount: availableCredit,
      selected_features: selectedOptions.filter(id => id <= 6).length,
      selected_temptations: selectedOptions.filter(id => id > 6).length,
      selection_strategy: getSelectionStrategy()
    });

    // 🔥 ОТПРАВЛЯЕМ В TELEGRAM КЛЮЧЕВОЕ СОБЫТИЕ
    sendKeyEventToTelegram('ЗАВЕРШЕНИЕ (без кредита)');

    proceedToFeedback();
  };

  // 🔥 ПЕРЕХОД К ОТЗЫВУ С ЗАВЕРШЕНИЕМ ЭТАПА
  const proceedToFeedback = () => {
    setCurrentStep('feedback');

    // 🔥 ОТПРАВЛЯЕМ СОБЫТИЯ БЕЗ ПРОВЕРОК
    completeMilestone('calculator');
    
    if (creditUsed) {
      completeMilestone('calculatorCredit');
    }

    toast({
      title: creditUsed 
        ? t('calculator.toast.completedWithCredit.title') 
        : t('calculator.toast.completed.title'),
      description: creditUsed 
        ? t('calculator.toast.completedWithCredit.description')
        : t('calculator.toast.completed.description'),
      variant: "default",
    });

    setTimeout(() => {
      const totalSpent = getCurrentBudget() - budget + (creditUsed ? availableCredit : 0);
      const selectedFeatures = selectedOptions.filter(id => id <= 6).length;
      const selectedTemptations = selectedOptions.filter(id => id > 6).length;
      
      let completionMessage = t('calculator.messages.completion', {
        features: selectedFeatures,
        temptations: selectedTemptations,
        spent: getCreditDisplay(totalSpent)
      });
      
      if (creditUsed) {
        completionMessage += t('calculator.messages.creditUsedAmount', {
          credit: getCreditDisplay(availableCredit)
        });
      }
      
      completionMessage += t('calculator.messages.feedbackRequest');
      
      setMessages(prev => [...prev, {
        id: `ai-final`,
        role: "ai",
        content: completionMessage
      }]);
    }, 800);
  };

  // 🔥 ФУНКЦИЯ ОТПРАВКИ КЛЮЧЕВЫХ СОБЫТИЙ В TELEGRAM
  const sendKeyEventToTelegram = async (action: string) => {
    const selectedFeatures = selectedOptions.filter(id => id <= 6).length;
    const selectedTemptations = selectedOptions.filter(id => id > 6).length;
    const totalSpent = getCurrentBudget() - budget + (creditUsed ? availableCredit : 0);

    const message = `🎮 КАЛЬКУЛЯТОР: ${action}

📊 Выбрано функций: ${selectedFeatures}
🎁 Доп. опций: ${selectedTemptations}
💰 Потрачено: ${totalSpent}${language === 'en' ? '$' : '₽'}
🎯 Кредит: ${creditUsed ? 'Да' : 'Нет'}
🌐 Язык: ${language}

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
        console.log('📊 Ключевое событие отправлено в Telegram');
      }
    } catch (error) {
      console.error('Ошибка отправки в Telegram:', error);
    }
  };

  // 🔥 ФУНКЦИЯ ОТПРАВКИ ОТЗЫВА В TELEGRAM
  const sendFeedbackToTelegram = async () => {
    const selectedFeatures = selectedOptions.filter(id => id <= 6).length;
    const selectedTemptations = selectedOptions.filter(id => id > 6).length;
    const totalSpent = getCurrentBudget() - budget + (creditUsed ? availableCredit : 0);

    const message = `🎮 КАЛЬКУЛЯТОР: ОТЗЫВ

📊 Выбрано функций: ${selectedFeatures}
🎁 Доп. опций: ${selectedTemptations}
💰 Потрачено: ${totalSpent}${language === 'en' ? '$' : '₽'}
🎯 Кредит: ${creditUsed ? 'Да' : 'Нет'}
🌐 Язык: ${language}

💬 Отзыв: ${feedbackText}

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
        console.log('📊 Отзыв отправлен в Telegram');
      }
    } catch (error) {
      console.error('Ошибка отправки отзыва:', error);
    }
  };

  // Отправка отзыва в Telegram
  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) return;
    
    setIsSubmitting(true);

    // 🔥 Яндекс.Метрика - ОТПРАВКА ОТЗЫВА
    if (window.ym) {
      window.ym(12345678, 'reachGoal', 'calculator_feedback_submitted');
      console.log('📊 Яндекс.Метрика: отзыв отправлен');
    }

    // 🔥 ОТСЛЕЖИВАЕМ ВОВЛЕЧЕННОСТЬ - ОТПРАВКА ОТЗЫВА
    trackEngagement('calculator_feedback_submitted', {
      feedback_length: feedbackText.length,
      selected_features: selectedOptions.filter(id => id <= 6).length,
      selected_temptations: selectedOptions.filter(id => id > 6).length,
      credit_used: creditUsed,
      final_selection_strategy: getSelectionStrategy()
    });

    // 🔥 ОТПРАВЛЯЕМ ОТЗЫВ В TELEGRAM
    await sendFeedbackToTelegram();

    // 🔥 ОТПРАВЛЯЕМ СОБЫТИЕ ОТЗЫВА
    completeMilestone('feedback');

    setCurrentStep('completed');
    setMessages(prev => [...prev, {
      id: `user-feedback`,
      role: "user",
      content: feedbackText
    }]);

    toast({
      title: t('calculator.toast.feedbackSubmitted.title'),
      description: t('calculator.toast.feedbackSubmitted.description'),
      variant: "default",
    });

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `ai-thanks`,
        role: "ai", 
        content: t('calculator.messages.thanks')
      }]);
    }, 500);

    setIsSubmitting(false);
  };

  // Сброс калькулятора
  const handleReset = () => {
    const config = getCurrencyConfig();
    setBudget(config.baseBudget);
    setSelectedOptions([]);
    setCurrentStep('selection');
    setFeedbackText('');
    setAvailableCredit(0);
    setCreditUsed(false);
    
    // Перемешиваем заново
    const mixed = allOptions
      .map(option => ({ ...option, sortOrder: Math.random() }))
      .sort((a, b) => a.sortOrder - b.sortOrder);
    setShuffledOptions(mixed);
    
    // 🔥 ОТСЛЕЖИВАЕМ ВОВЛЕЧЕННОСТЬ - СБРОС КАЛЬКУЛЯТОРА
    trackEngagement('calculator_reset', {
      previous_selections: selectedOptions.length,
      previous_budget: budget,
      previous_strategy: getSelectionStrategy()
    });
    
    setMessages([
      {
        id: "reset-1",
        role: "ai",
        content: t('calculator.messages.reset')
      },
      {
        id: "reset-2",
        role: "ai",
        content: t('calculator.messages.resetInstruction')
      }
    ]);
  };

  const availableCreditOptions = getAvailableCreditOptions();

  return (
    <div className="w-full max-w-3xl mx-auto bg-card rounded-2xl shadow-lg overflow-hidden border border-border">
      {/* Хедер */}
      <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            🎮
          </div>
          <div>
            <h3 className="font-semibold">{t('calculator.title')}</h3>
            <p className="text-xs opacity-90">
              {t('calculator.budget')}: {getBudgetDisplay()}
              {availableCredit > 0 && ` + ${t('calculator.credit')}: ${getCreditDisplay(availableCredit)}`}
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleReset}
          className="text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10"
        >
          🔄 {t('calculator.reset')}
        </Button>
      </div>

      {/* Чат */}
      <div 
        ref={chatContainerRef}
        className="h-[500px] overflow-y-auto p-4 bg-background"
      >
        <AnimatePresence>
          {messages.map(message => (
            <ChatMessage 
              key={message.id} 
              message={message} 
            />
          ))}
        </AnimatePresence>

        {/* Шаг 1: Выбор всех опций */}
        {currentStep === 'selection' && (
          <div className="mt-4 space-y-3">
            <p className="text-sm font-medium text-muted-foreground text-center">
              {t('calculator.selection.title')}
            </p>
            
            <div className="grid grid-cols-1 gap-1.5">
              {shuffledOptions.map(option => (
                <Button
                  key={option.id}
                  variant={selectedOptions.includes(option.id) ? "default" : "outline"}
                  onClick={() => handleSelectOption(option.id, option.price)}
                  disabled={!selectedOptions.includes(option.id) && budget < option.price}
                  className={`justify-start h-auto py-1.5 px-2 w-full text-xs transition-all ${
                    option.type === 'temptation' 
                      ? selectedOptions.includes(option.id)
                        ? 'bg-rose-600 text-white hover:bg-rose-700'
                        : 'bg-rose-50/80 border-rose-200 text-rose-900 hover:bg-rose-100'
                      : selectedOptions.includes(option.id)
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-50/80 border-blue-200 text-blue-900 hover:bg-blue-100'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-left flex-1 pr-2 leading-tight">
                      {option.name}
                    </span>
                    <span className={`text-xs shrink-0 ${
                      selectedOptions.includes(option.id) ? 'text-white/90' : 'opacity-70'
                    }`}>
                      {convertPrice(option.price)}
                    </span>
                  </div>
                </Button>
              ))}
            </div>

            <Button 
              onClick={handleComplete}
              className="w-full mt-2 text-sm py-2"
              disabled={selectedOptions.filter(id => id <= 6).length === 0}
            >
              🎯 {t('calculator.completeButton', { budget: getBudgetDisplay() })}
            </Button>
            
            <div className="flex justify-center gap-4 text-xs text-muted-foreground mt-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-200 rounded-sm"></div>
                <span>{t('calculator.labels.features')}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-rose-200 rounded-sm"></div>
                <span>{t('calculator.labels.temptations')}</span>
              </div>
            </div>
          </div>
        )}

        {/* 🔥 ШАГ 2: ИСПОЛЬЗОВАНИЕ КРЕДИТА */}
        {currentStep === 'credit' && availableCredit > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 space-y-4"
          >
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-medium text-blue-800 mb-1 text-sm">{t('calculator.credit.available')}</p>
              <p className="text-xs text-blue-700">
                {t('calculator.credit.description', { credit: getCreditDisplay(availableCredit) })}
              </p>
            </div>

            {availableCreditOptions.length > 0 ? (
              <div className="grid grid-cols-1 gap-1.5">
                {availableCreditOptions.map(option => (
                  <Button
                    key={option.id}
                    variant="outline"
                    onClick={() => handleUseCredit(option.id, option.price)}
                    className="justify-start h-auto py-1.5 px-2 w-full text-xs border-blue-200 bg-blue-50 hover:bg-blue-100"
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-left flex-1 pr-2 leading-tight">
                        {option.name}
                      </span>
                      <span className="text-xs opacity-70 shrink-0">
                        {convertPrice(option.price)} ({t('calculator.credit.label')})
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-700 text-center">
                  {t('calculator.credit.noOptions')}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={handleSkipCredit}
                variant="outline"
                className="flex-1 text-sm py-2"
              >
                {t('calculator.credit.skip')}
              </Button>
              <Button 
                onClick={proceedToFeedback}
                className="flex-1 text-sm py-2"
              >
                {t('calculator.credit.finish')}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Шаг 3: Отзыв */}
        {currentStep === 'feedback' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 space-y-3"
          >
            <p className="text-sm font-medium">{t('calculator.feedback.title')}</p>
            <div className="flex gap-2">
              <Input
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder={t('calculator.feedback.placeholder')}
                className="flex-1 text-sm"
              />
              <Button 
                onClick={handleSubmitFeedback}
                disabled={!feedbackText.trim() || isSubmitting}
                className="text-sm py-2"
              >
                {isSubmitting ? "📤" : t('calculator.feedback.submit')}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('calculator.feedback.note')}
            </p>
          </motion.div>
        )}

        {/* Шаг 4: Завершено */}
        {currentStep === 'completed' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center"
          >
            <p className="font-medium text-green-800 mb-2">{t('calculator.completed.title')}</p>
            <p className="text-sm text-green-700">
              {t('calculator.completed.description')}
            </p>
            <Button 
              onClick={() => {
                const waitlistSection = document.getElementById('waitlist');
                if (waitlistSection) {
                  waitlistSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="mt-3 text-sm py-2"
            >
              {t('calculator.completed.button')}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};