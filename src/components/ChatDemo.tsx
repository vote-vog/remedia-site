// src/components/ChatDemo.tsx
import { useState, useEffect, useRef, useMemo } from "react";
import { ChatMessage, Message } from "./ChatMessage";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import sendMessageIcon from "@/assets/send-message.svg";
import { useProductActions } from "@/hooks/useProductActions";
import { useEngagementTracker } from "@/hooks/useEngagementTracker";
import { useLanguage } from "@/hooks/useLanguage";

interface ChatDemoProps {
  onButtonClick?: () => void;
}

export const ChatDemo = ({ onButtonClick }: ChatDemoProps) => {
  const { trackEngagement } = useEngagementTracker();
  const [demoStartTime] = useState(Date.now());
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isWaitingForUserInput, setIsWaitingForUserInput] = useState(false);
  const [currentUserText, setCurrentUserText] = useState("");
  const [isAutoTyping, setIsAutoTyping] = useState(false);
  const [aiStatus, setAiStatus] = useState("Всегда на связи");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const { completeMilestone } = useProductActions();

  // 🔥 ИСПРАВЛЕНИЕ: Мемоизируем сценарии чтобы они не пересоздавались
  const scenarios = useMemo(() => [
    // СЦЕНАРИЙ 1: ЗАПИСЬ СИМПТОМОВ (Понедельник)
    { id: "1", role: "ai", content: t('chatDemo.scenarios.1') },
    { id: "2", role: "user", content: t('chatDemo.scenarios.2') },
    
    { id: "3", role: "ai", content: t('chatDemo.scenarios.3') },
    { id: "4", role: "user", content: t('chatDemo.scenarios.4') },
    
    { id: "5", role: "ai", content: t('chatDemo.scenarios.5') },
    { id: "6", role: "user", content: t('chatDemo.scenarios.6') },
    
    { id: "7", role: "ai", content: t('chatDemo.scenarios.7') },
    { id: "8", role: "user", content: t('chatDemo.scenarios.8') },
    
    { id: "9", role: "ai", content: t('chatDemo.scenarios.9') },

    // СЦЕНАРИЙ 2: ЗАПИСЬ ЛЕКАРСТВ
    { id: "10", role: "ai", content: t('chatDemo.scenarios.10') },
    { id: "11", role: "user", content: t('chatDemo.scenarios.11') },
    
    { id: "12", role: "ai", content: t('chatDemo.scenarios.12') },
    { id: "13", role: "user", content: t('chatDemo.scenarios.13') },
    
    { id: "14", role: "ai", content: t('chatDemo.scenarios.14') },

    // 🔥 РАЗДЕЛИТЕЛЬ ДАТЫ - прошла неделя (Вторник)
    { id: "date-1", role: "system", content: t('chatDemo.scenarios.date1'), isDateDivider: true },
    
    // СЦЕНАРИЙ 3: УМНОЕ НАПОМИНАНИЕ
    { id: "15", role: "ai", content: t('chatDemo.scenarios.15') },
    { id: "16", role: "user", content: t('chatDemo.scenarios.16') },
    
    { id: "17", role: "ai", content: t('chatDemo.scenarios.17') },

    // 🔥 РАЗДЕЛИТЕЛЬ ДАТЫ - прошло 3 месяца
    { id: "date-2", role: "system", content: t('chatDemo.scenarios.date2'), isDateDivider: true },
    
    // СЦЕНАРИЙ 4: НАХОЖДЕНИЕ ЗАКОНОМЕРНОСТЕЙ
    { id: "18", role: "ai", content: t('chatDemo.scenarios.18'), showGraph: true },
    { id: "19", role: "ai", content: t('chatDemo.scenarios.19') },
    { id: "20", role: "ai", content: t('chatDemo.scenarios.20') },

    // 🔥 РАЗДЕЛИТЕЛЬ ДАТЫ - следующий день
    { id: "date-3", role: "system", content: t('chatDemo.scenarios.date3'), isDateDivider: true },
    
    // СЦЕНАРИЙ 5: ПОДГОТОВКА К ВРАЧУ
    { id: "21", role: "ai", content: t('chatDemo.scenarios.21') },
    { id: "22", role: "user", content: t('chatDemo.scenarios.22') },
    { id: "23", role: "ai", content: t('chatDemo.scenarios.23'), showPDF: true },
    
    // Завершение
    { id: "24", role: "ai", content: t('chatDemo.scenarios.24') }
  ], [t]); // 🔥 Зависимость от t - пересоздается только при смене языка

  // 🔥 АНИМАЦИЯ МОРГАНИЯ ДЛЯ ПЛЕЙСХОЛДЕРА
  const [isPulsing, setIsPulsing] = useState(true);
  // 🔥 АНИМАЦИЯ МОРГАНИЯ ДЛЯ КНОПКИ ОТПРАВКИ
  const [isButtonPulsing, setIsButtonPulsing] = useState(false);

  useEffect(() => {
    if (!isStarted) {
      const pulseInterval = setInterval(() => {
        setIsPulsing(prev => !prev);
      }, 1500);
      
      return () => clearInterval(pulseInterval);
    } else {
      setIsPulsing(false);
    }
  }, [isStarted]);

  // 🔥 АНИМАЦИЯ МОРГАНИЯ КНОПКИ ОТПРАВКИ
  useEffect(() => {
    if (isStarted && isWaitingForUserInput && currentUserText.trim() && !isAutoTyping) {
      const buttonPulseInterval = setInterval(() => {
        setIsButtonPulsing(prev => !prev);
      }, 800);
      
      return () => clearInterval(buttonPulseInterval);
    } else {
      setIsButtonPulsing(false);
    }
  }, [isStarted, isWaitingForUserInput, currentUserText, isAutoTyping]);

  // 🔥 ИСПРАВЛЕНИЕ: Сбрасываем демо при смене языка
  useEffect(() => {
    if (isStarted) {
      // Если демо запущено - перезапускаем его с новыми переводами
      setIsStarted(false);
      setMessages([]);
      setCurrentScenarioIndex(0);
      setCurrentUserText("");
      setIsTyping(false);
      setIsAutoTyping(false);
      setIsWaitingForUserInput(false);
      setAiStatus(t('chatDemo.aiStatus.ready'));
      
      toast({
        title: t('chatDemo.toast.languageChanged.title'),
        description: t('chatDemo.toast.languageChanged.description'),
        variant: "default",
      });
    }
  }, [t]); // Срабатывает при смене языка

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    if (messages.length > 0 || isTyping) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages.length, isTyping]);

  // ✅ УПРОЩЕННАЯ ЛОГИКА ЗАВЕРШЕНИЯ ДЕМО - ПРОСТО ОТПРАВЛЯЕМ СОБЫТИЕ
  useEffect(() => {
    // Когда демо завершено - отправляем события
    if (currentScenarioIndex >= scenarios.length && isStarted) {
      // 🔥 Яндекс.Метрика - ЗАВЕРШЕНИЕ ДЕМО
      if (window.ym) {
        window.ym(12345678, 'reachGoal', 'demo_completed');
        console.log('📊 Яндекс.Метрика: демо завершено');
      }
      
      // 🔥 ОТСЛЕЖИВАЕМ ВОВЛЕЧЕННОСТЬ ДЕМО
      const demoDuration = Date.now() - demoStartTime;
      trackEngagement('demo_completed', {
        demo_duration: demoDuration,
        messages_viewed: messages.length,
        scenarios_completed: scenarios.length
      });
      
      console.log('🎯 Demo completed - sending milestone event');
      completeMilestone('demo');
      
      // Показываем уведомление
      toast({
        title: t('chatDemo.toast.completed.title'),
        description: t('chatDemo.toast.completed.description'),
        variant: "default",
      });
    }
  }, [currentScenarioIndex, isStarted, completeMilestone, toast, trackEngagement, demoStartTime, messages.length, t, scenarios.length]);

  // 🎯 ТРЕКИНГ СПЕЦИАЛЬНЫХ СООБЩЕНИЙ
  useEffect(() => {
    if (messages.some(m => m.showGraph || m.showPDF)) {
      trackEngagement('demo_special_content', {
        has_graph: messages.some(m => m.showGraph),
        has_pdf: messages.some(m => m.showPDF),
        scenario_stage: currentScenarioIndex
      });
    }
  }, [messages, trackEngagement, currentScenarioIndex]);

  const startAutoType = (text: string) => {
    setIsAutoTyping(true);
    setCurrentUserText("");
    
    let index = 0;
    
    const typeNextChar = () => {
      if (index < text.length) {
        const nextChar = text[index];
        setCurrentUserText(prev => prev + nextChar);
        index++;
        timeoutRef.current = setTimeout(typeNextChar, 50);
      } else {
        setIsAutoTyping(false);
        setIsWaitingForUserInput(true);
        inputRef.current?.focus();
      }
    };
    
    typeNextChar();
  };

  // В обработчике отправки сообщения:
  const handleSendMessage = () => {
    if (!currentUserText.trim()) return;

    // 🔥 ОТСЛЕЖИВАЕМ ВОВЛЕЧЕННОСТЬ - ОТПРАВКА СООБЩЕНИЯ
    trackEngagement('demo_message_sent', {
      message_length: currentUserText.length,
      message_content_snippet: currentUserText.substring(0, 20), // 🎯 фрагмент сообщения
      scenario_progress: currentScenarioIndex,
      total_messages: messages.length + 1,
      time_to_first_message: Date.now() - demoStartTime
    });

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: currentUserText
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentUserText("");
    setIsWaitingForUserInput(false);
    setAiStatus(t('chatDemo.aiStatus.typing'));
    setCurrentScenarioIndex(prev => prev + 1);
  };

  const handleDemoEnd = () => {
    setIsStarted(false);
    setCurrentUserText("");
    setAiStatus(t('chatDemo.aiStatus.ready'));
    
    // 🔥 ОТСЛЕЖИВАЕМ ВОВЛЕЧЕННОСТЬ - ПРЕРЫВАНИЕ ДЕМО
    const demoDuration = Date.now() - demoStartTime;
    trackEngagement('demo_interrupted', {
      demo_duration: demoDuration,
      messages_viewed: messages.length,
      scenarios_completed: currentScenarioIndex
    });
    
    toast({
      title: t('chatDemo.toast.interrupted.title'),
      description: t('chatDemo.toast.interrupted.description')
    });
  };

  const startDemo = () => {
    if (isStarted) return;

    onButtonClick?.();

    // 🔥 Яндекс.Метрика - НАЧАЛО ДЕМО
    if (window.ym) {
      window.ym(12345678, 'reachGoal', 'demo_started');
      console.log('📊 Яндекс.Метрика: демо начато');
    }

    // 🔥 ОТСЛЕЖИВАЕМ ВОВЛЕЧЕННОСТЬ - НАЧАЛО ДЕМО
    trackEngagement('demo_started', {
      start_time: demoStartTime,
      total_scenarios: scenarios.length
    });

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setMessages([]);
    setCurrentScenarioIndex(0);
    setCurrentUserText("");
    setIsTyping(false);
    setIsAutoTyping(false);
    setIsStarted(true);
    setIsWaitingForUserInput(false);
    setAiStatus(t('chatDemo.aiStatus.typing'));
  };

  useEffect(() => {
    if (!isStarted || currentScenarioIndex >= scenarios.length) {
      if (currentScenarioIndex >= scenarios.length && isStarted) {
        handleDemoEnd();
      }
      return;
    }

    const currentMessage = scenarios[currentScenarioIndex];
    
    if (currentMessage.role === "system") {
      setMessages(prev => [...prev, currentMessage]);
      setCurrentScenarioIndex(prev => prev + 1);
      return;
    }
    
    if (currentMessage.role === "ai" && !isWaitingForUserInput && !isAutoTyping) {
      setIsTyping(true);
      setAiStatus(t('chatDemo.aiStatus.typing'));
      
      // 🔥 ОТСЛЕЖИВАЕМ ВОВЛЕЧЕННОСТЬ - ПОЛУЧЕНИЕ СООБЩЕНИЯ ОТ ИИ
      if (currentMessage.showGraph || currentMessage.showPDF) {
        trackEngagement('demo_special_message', {
          message_type: currentMessage.showGraph ? 'graph' : 'pdf',
          scenario_index: currentScenarioIndex,
          message_content: currentMessage.content.substring(0, 100) + '...'
        });
      }
      
      // 🔥 УВЕЛИЧЕННОЕ ВРЕМЯ МЕЖДУ СООБЩЕНИЯМИ ИИ
      const typingTime = 2000;
      const pauseBetweenAIMessages = 2500;
      
      timeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, currentMessage]);
        
        const nextMessage = scenarios[currentScenarioIndex + 1];
        if (nextMessage && nextMessage.role === "user") {
          setAiStatus(t('chatDemo.aiStatus.autoTyping'));
          timeoutRef.current = setTimeout(() => {
            startAutoType(nextMessage.content);
          }, 1500);
        } else if (nextMessage && nextMessage.role === "ai") {
          setAiStatus(t('chatDemo.aiStatus.analyzing'));
          timeoutRef.current = setTimeout(() => {
            setCurrentScenarioIndex(prev => prev + 1);
          }, pauseBetweenAIMessages);
        } else {
          setCurrentScenarioIndex(prev => prev + 1);
        }
      }, typingTime);
    }
    
    if (currentMessage.role === "user" && !isWaitingForUserInput && !isAutoTyping) {
      setCurrentScenarioIndex(prev => prev + 1);
    }
  }, [isStarted, currentScenarioIndex, isWaitingForUserInput, isAutoTyping, trackEngagement, t, scenarios]);

  useEffect(() => {
    if (isAutoTyping) {
      setAiStatus(t('chatDemo.aiStatus.autoTyping'));
    }
  }, [isAutoTyping, t]);

  useEffect(() => {
    if (isWaitingForUserInput && currentUserText && !isAutoTyping) {
      setAiStatus(t('chatDemo.aiStatus.pressSend'));
    }
  }, [isWaitingForUserInput, currentUserText, isAutoTyping, t]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto bg-card rounded-2xl shadow-lg overflow-hidden border border-border">
      <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          🤖
        </div>
        <div>
          <h3 className="font-semibold">Remedia</h3>
          <p className="text-xs opacity-90">{aiStatus}</p>
        </div>
      </div>

      <div 
        ref={chatContainerRef}
        className="h-[500px] overflow-y-auto p-4 bg-background text-sm"
      >
        <AnimatePresence>
          {messages.map(message => (
            <ChatMessage 
              key={message.id} 
              message={message} 
            />
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <ChatMessage 
            message={{ id: "typing", role: "ai", content: "" }}
            isTyping={true}
          />
        )}
        
        {!isStarted && messages.length === 0 && (
          <div className="text-center text-muted-foreground py-20">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-base mb-2">👋 {t('chatDemo.welcome.title')}</p>
              <p className="text-sm">{t('chatDemo.welcome.subtitle')}</p>
            </motion.div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          <motion.div 
            className={`flex-1 flex items-center gap-2 border rounded-xl px-4 py-3 transition-colors ${
              !isStarted 
                ? "bg-background border-border cursor-text hover:border-primary" 
                : "bg-muted/30 border-muted cursor-not-allowed"
            }`}
            onClick={!isStarted ? startDemo : undefined}
            tabIndex={!isStarted ? 0 : -1}
            animate={!isStarted && isPulsing ? {
              boxShadow: [
                "0 0 0 0px rgba(59, 130, 246, 0)",
                "0 0 0 3px rgba(59, 130, 246, 0.3)",
                "0 0 0 0px rgba(59, 130, 246, 0)"
              ]
            } : {}}
            transition={{
              duration: 1.5,
              repeat: !isStarted ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            <input 
              ref={inputRef}
              type="text"
              value={currentUserText}
              onChange={() => {}}
              placeholder={
                !isStarted 
                  ? t('chatDemo.input.placeholder.start') 
                  : isAutoTyping 
                    ? t('chatDemo.input.placeholder.typing')
                    : t('chatDemo.input.placeholder.waiting')
              }
              className={`flex-1 bg-transparent outline-none w-full text-sm ${
                isStarted 
                  ? "text-foreground cursor-not-allowed placeholder:text-muted-foreground"
                  : "text-foreground placeholder:text-muted-foreground"
              }`}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && currentUserText.trim() && !isAutoTyping && isWaitingForUserInput) {
                  handleSendMessage();
                }
              }}
              readOnly={true}
              style={{ 
                pointerEvents: isStarted ? 'none' : 'auto',
                userSelect: isStarted ? 'none' : 'auto'
              }}
            />
            
            {!isStarted && (
              <motion.div
                animate={{ opacity: isPulsing ? 1 : 0.3 }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-primary"
              >
                 👈 
              </motion.div>
            )}
            
            {isStarted && (
              <div className="text-muted-foreground flex-shrink-0" title={t('chatDemo.input.demoRunning')}>
                
              </div>
            )}
          </motion.div>
          
          {isStarted && (
            <motion.button
              onClick={handleSendMessage}
              disabled={!currentUserText.trim() || isAutoTyping || !isWaitingForUserInput}
              className="px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center relative overflow-hidden"
              animate={
                isButtonPulsing
                  ? {
                      scale: [1, 1.05, 1],
                      boxShadow: [
                        "0 0 0 0px rgba(255, 255, 255, 0.4)",
                        "0 0 0 8px rgba(255, 255, 255, 0.2)",
                        "0 0 0 0px rgba(255, 255, 255, 0)"
                      ]
                    }
                  : {}
              }
              transition={{
                duration: 0.8,
                repeat: isButtonPulsing ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              {isAutoTyping ? (
                "⏳"
              ) : (
                <motion.img 
                  src={sendMessageIcon} 
                  alt={t('chatDemo.sendButton.alt')} 
                  className="w-5 h-5 filter brightness-0 invert"
                  animate={
                    isButtonPulsing
                      ? {
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.7, 1]
                        }
                      : {}
                  }
                  transition={{
                    duration: 0.8,
                    repeat: isButtonPulsing ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};