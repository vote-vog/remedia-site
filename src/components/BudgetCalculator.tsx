// components/BudgetCalculator.tsx
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { ChatMessage, Message } from "./ChatMessage";
import { useProductActions } from "@/hooks/useProductActions";
import { useToast } from "@/hooks/use-toast";
import { useEngagementTracker } from "@/hooks/useEngagementTracker";

const features = [
  { id: 1, name: "💬 Естественный диалог с ИИ", price: 100, type: "feature" },
  { id: 2, name: "📊 Запись данных в формы и графики", price: 100, type: "feature" },
  { id: 3, name: "🔍 Умная аналитика взаимосвязей", price: 200, type: "feature" },
  { id: 4, name: "🔔 Уведомления и напоминания", price: 50, type: "feature" },
  { id: 5, name: "⌚ Данные с носимых устройств", price: 150, type: "feature" },
  { id: 6, name: "👨‍⚕️ Поддержка врача в чате", price: 200, type: "feature" }
];

const temptations = [
  { id: 7, name: "🚌 Проезд в автобусе", price: 50, type: "temptation" },
  { id: 8, name: "☕ Кружка кофе", price: 250, type: "temptation" },
  { id: 9, name: "🎬 Подписка на стриминг", price: 300, type: "temptation" },
  { id: 10, name: "🥔 Пачка чипсов", price: 150, type: "temptation" }
];

const allOptions = [...features, ...temptations];

// 🔥 ЦЕНЫ ДЛЯ КРЕДИТОВАНИЯ
const PRICES = {
  TOTAL_FUNCTIONALITY: 800, // Весь основной функционал
  CREDIT_DEDUCTION: 50      // Фиксированный вычет
};

export const BudgetCalculator = () => {
  const { trackEngagement } = useEngagementTracker();
  const [messages, setMessages] = useState<Message[]>([]);
  const [budget, setBudget] = useState(500);
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

  // 🔥 TELEGRAM CONFIG
  const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  // 🔥 ПЕРЕМЕШИВАНИЕ ОПЦИЙ ПРИ ИНИЦИАЛИЗАЦИИ
  useEffect(() => {
    const mixed = [...features, ...temptations]
      .map(option => ({ ...option, sortOrder: Math.random() }))
      .sort((a, b) => a.sortOrder - b.sortOrder);
    setShuffledOptions(mixed);
  }, []);

  // 🔥 ФУНКЦИЯ ОТПРАВКИ КЛЮЧЕВЫХ СОБЫТИЙ В TELEGRAM
  const sendKeyEventToTelegram = async (action: string) => {
    const selectedFeatures = selectedOptions.filter(id => id <= 6).length;
    const selectedTemptations = selectedOptions.filter(id => id > 6).length;
    const totalSpent = 500 - budget + (creditUsed ? availableCredit : 0);

    const message = `🎮 КАЛЬКУЛЯТОР: ${action}

📊 Выбрано функций: ${selectedFeatures}
🎁 Доп. опций: ${selectedTemptations}
💰 Потрачено: ${totalSpent}₽
🎯 Кредит: ${creditUsed ? 'Да' : 'Нет'}

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
    const totalSpent = 500 - budget + (creditUsed ? availableCredit : 0);

    const message = `🎮 КАЛЬКУЛЯТОР: ОТЗЫВ

📊 Выбрано функций: ${selectedFeatures}
🎁 Доп. опций: ${selectedTemptations}
💰 Потрачено: ${totalSpent}₽
🎯 Кредит: ${creditUsed ? 'Да' : 'Нет'}

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

  // 🔥 ФУНКЦИЯ РАСЧЕТА КРЕДИТА
  const calculateCredit = () => {
    const selectedFeatures = selectedOptions.filter(id => id <= 6);
    const selectedAlternatives = selectedOptions.filter(id => id > 6);
    
    // 🔥 НОВЫЕ УСЛОВИЯ КРЕДИТОВАНИЯ:
    const isEligibleForCredit = 
      selectedAlternatives.length <= 1 && // Не больше 1 соблазна
      selectedFeatures.length > 0;        // Выбрал хотя бы 1 функцию

    if (!isEligibleForCredit) return 0;

    // 🔥 Формула: кредит = (весь функционал - купленный) - 50₽
    const purchasedMainFeatures = selectedFeatures
      .reduce((sum, id) => {
        const feature = features.find(f => f.id === id);
        return sum + (feature?.price || 0);
      }, 0);

    const credit = (PRICES.TOTAL_FUNCTIONALITY - purchasedMainFeatures) - PRICES.CREDIT_DEDUCTION;
    
    return Math.max(credit, 0); // Не может быть отрицательным
  };

  // 🔥 ПЕРЕСЧЕТ КРЕДИТА ПРИ ИЗМЕНЕНИИ ВЫБОРА
  useEffect(() => {
    const credit = calculateCredit();
    setAvailableCredit(credit);
  }, [selectedOptions]);

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

  // 🔥 ИСПОЛЬЗОВАНИЕ КРЕДИТА ДЛЯ ПОКУПКИ ОПЦИИ
  const handleUseCredit = (optionId: number, price: number) => {
    const option = allOptions.find(o => o.id === optionId);
    
    setSelectedOptions(prev => [...prev, optionId]);
    setAvailableCredit(prev => prev - price);
    setCreditUsed(true);
    
    setMessages(prev => [...prev, {
      id: `user-credit-${Date.now()}`,
      role: "user",
      content: `Использую кредит: ${option?.name}`
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
      let message = `Отлично! Куплено за кредит. `;
      
      if (remainingCredit > 0) {
        message += `Осталось кредита: ${remainingCredit}₽. Можете выбрать еще что-то или завершить.`;
      } else {
        message += "🎉 Кредит исчерпан! Переходим к отзыву...";
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
        content: `Привет! У вас есть 500₽. Давайте создадим приложение вашей мечты для управления здоровьем!`
      },
      {
        id: "2", 
        role: "ai",
        content: `💡 **Важно:** Вы не обязаны тратить весь бюджет! Выбирайте только то, что действительно нужно.\n\nВыберите что хотите:`
      }
    ]);
  }, []);

  // Скролл вниз
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  // Выбор опции
  const handleSelectOption = (optionId: number, price: number) => {
    const option = allOptions.find(o => o.id === optionId);
    
    if (selectedOptions.includes(optionId)) {
      // Уже выбрано - убираем
      setSelectedOptions(prev => prev.filter(id => id !== optionId));
      setBudget(prev => prev + price);
      
      setMessages(prev => [...prev, {
        id: `user-${Date.now()}`,
        role: "user", 
        content: `Убираю: ${option?.name}`
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
        content: `Выбираю: ${option?.name}`
      }]);

      // 🔥 ОТСЛЕЖИВАЕМ ВОВЛЕЧЕННОСТЬ - ВЫБОР ОПЦИИ
      trackEngagement('calculator_option_selected', {
        option_id: optionId,
        option_name: option?.name,
        option_type: option?.type,
        option_price: price,
        budget_remaining: budget - price,
        total_selected: selectedOptions.length + 1
      });

      // AI ответ
      setTimeout(() => {
        const remaining = budget - price;
        let message = `Отлично! Осталось ${remaining}₽. `;
        
        if (remaining > 0) {
          message += "Продолжайте выбирать или нажмите 'Завершить сборку' если готовы.";
        } else {
          message += "Бюджет исчерпан! Нажмите 'Завершить сборку'.";
        }
        
        setMessages(prev => [...prev, {
          id: `ai-${Date.now()}`,
          role: "ai",
          content: message
        }]);
      }, 500);
    } else {
      // Не хватает денег
      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        role: "ai", 
        content: `Не хватает ${price - budget}₽. Выберите другую опцию или завершите сборку.`
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
    const credit = calculateCredit();
    
    // 🔥 ОТСЛЕЖИВАЕМ ВОВЛЕЧЕННОСТЬ КАЛЬКУЛЯТОРА
    trackEngagement('calculator_completed', {
      selected_features: selectedOptions.filter(id => id <= 6).length,
      selected_temptations: selectedOptions.filter(id => id > 6).length,
      budget_remaining: budget,
      credit_eligible: credit > 0,
      credit_used: creditUsed,
      total_spent: 500 - budget
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
        content: "Готово!"
      }]);

      // 🔥 ОТСЛЕЖИВАЕМ ВОВЛЕЧЕННОСТЬ - ПРЕДЛОЖЕНИЕ КРЕДИТА
      trackEngagement('calculator_credit_offered', {
        credit_amount: credit,
        selected_features: selectedOptions.filter(id => id <= 6).length,
        selected_temptations: selectedOptions.filter(id => id > 6).length
      });

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: `ai-credit-offer`,
          role: "ai",
          content: `🎉 ВЫ ПОЛУЧАЕТЕ КРЕДИТ ${credit}₽!\n\nВы проявили осознанность:\n• Выбрали здоровье над сиюминутными удовольствиями\n• Ограничились только 1 дополнительной опцией\n\n💎 Теперь можете докупить ВСЕ функции приложения кроме одной, которую сочтёте наименее полезной!\n\nЭто ваша награда за прагматичный выбор!`
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
      content: "Пропускаю кредит"
    }]);

    // 🔥 ОТСЛЕЖИВАЕМ ВОВЛЕЧЕННОСТЬ - ПРОПУСК КРЕДИТА
    trackEngagement('calculator_credit_skipped', {
      credit_amount: availableCredit,
      selected_features: selectedOptions.filter(id => id <= 6).length,
      selected_temptations: selectedOptions.filter(id => id > 6).length
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
      title: creditUsed ? "Сборка завершена с кредитом! 🎉" : "Сборка завершена! 🎉",
      description: creditUsed 
        ? "Использована система кредитования! Поделитесь мнением для получения бонусов" 
        : "Сборка завершена! Поделитесь мнением для получения бонусов",
      variant: "default",
    });

    setTimeout(() => {
      const totalSpent = 500 - budget + (creditUsed ? availableCredit : 0);
      const selectedFeatures = selectedOptions.filter(id => id <= 6).length;
      const selectedTemptations = selectedOptions.filter(id => id > 6).length;
      
      let completionMessage = `🎉 Ваше идеальное приложение готово!\n\n• Выбрано функций: ${selectedFeatures}\n• Доп. опций: ${selectedTemptations}\n• Потрачено: ${totalSpent}₽`;
      
      if (creditUsed) {
        completionMessage += `\n• Использовано кредита: ${availableCredit}₽`;
      }
      
      completionMessage += `\n\nКакие функции добавить? Ваш отзыв поможет нам стать лучше!`;
      
      setMessages(prev => [...prev, {
        id: `ai-final`,
        role: "ai",
        content: completionMessage
      }]);
    }, 800);
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
      credit_used: creditUsed
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
      title: "Спасибо за отзыв! 🎉",
      description: "Ваш отзыв очень ценен для нас!",
      variant: "default",
    });

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `ai-thanks`,
        role: "ai", 
        content: "Спасибо за ваш отзыв! Это очень ценно для нас 💙\n\nВы получили бонусы за отзыв!"
      }]);
    }, 500);

    setIsSubmitting(false);
  };

  // Сброс калькулятора
  const handleReset = () => {
    setBudget(500);
    setSelectedOptions([]);
    setCurrentStep('selection');
    setFeedbackText('');
    setAvailableCredit(0);
    setCreditUsed(false);
    
    // Перемешиваем заново
    const mixed = [...features, ...temptations]
      .map(option => ({ ...option, sortOrder: Math.random() }))
      .sort((a, b) => a.sortOrder - b.sortOrder);
    setShuffledOptions(mixed);
    
    // 🔥 ОТСЛЕЖИВАЕМ ВОВЛЕЧЕННОСТЬ - СБРОС КАЛЬКУЛЯТОРА
    trackEngagement('calculator_reset', {
      previous_selections: selectedOptions.length,
      previous_budget: budget
    });
    
    setMessages([
      {
        id: "reset-1",
        role: "ai",
        content: "Отлично! Начинаем заново. У вас снова 500₽!"
      },
      {
        id: "reset-2",
        role: "ai",
        content: "Выберите что хотите:"
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
            <h3 className="font-semibold">Сборка приложения</h3>
            <p className="text-xs opacity-90">
              Бюджет: {budget}₽ 
              {availableCredit > 0 && ` + Кредит: ${availableCredit}₽`}
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleReset}
          className="text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10"
        >
          🔄 Сбросить
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
              🎯 Выберите опции (перемешаны для удобства):
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
                      {option.price}₽
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
              🎯 Завершить сборку ({budget}₽ осталось)
            </Button>
            
            <div className="flex justify-center gap-4 text-xs text-muted-foreground mt-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-200 rounded-sm"></div>
                <span>Функции приложения</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-rose-200 rounded-sm"></div>
                <span>Альтернативные опции</span>
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
              <p className="font-medium text-blue-800 mb-1 text-sm">💎 Вам доступен кредит!</p>
              <p className="text-xs text-blue-700">
                Вы можете докупить функции на {availableCredit}₽. Выберите что хотите добавить:
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
                        {option.price}₽ (кредит)
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-700 text-center">
                  🎉 Вы уже выбрали всё доступное за кредит! Нажмите "Завершить"
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={handleSkipCredit}
                variant="outline"
                className="flex-1 text-sm py-2"
              >
                Пропустить кредит
              </Button>
              <Button 
                onClick={proceedToFeedback}
                className="flex-1 text-sm py-2"
              >
                Завершить
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
            <p className="text-sm font-medium">Ваш отзыв о будущем приложении:</p>
            <div className="flex gap-2">
              <Input
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Что понравилось? Что можно улучшить? Какие функции добавили бы Вы?"
                className="flex-1 text-sm"
              />
              <Button 
                onClick={handleSubmitFeedback}
                disabled={!feedbackText.trim() || isSubmitting}
                className="text-sm py-2"
              >
                {isSubmitting ? "📤" : "Отправить"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Отзыв придет основателю и поможет сделать приложение лучше
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
            <p className="font-medium text-green-800 mb-2">Спасибо за ваше участие! 🎉</p>
            <p className="text-sm text-green-700">
              Ваш отзыв очень важен для нас. Хотите продолжить знакомство с Remedia?
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
              Перейти к списку ожидания
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};