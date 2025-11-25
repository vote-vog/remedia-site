import { useState, useEffect, useRef } from "react";
import { ChatMessage, Message } from "./ChatMessage";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import sendMessageIcon from "@/assets/send-message.svg";
import { useProductActions } from "@/hooks/useProductActions";

const scenarios: Message[] = [
  // СЦЕНАРИЙ 1: ЗАПИСЬ СИМПТОМОВ (Понедельник)
  { id: "1", role: "ai", content: "Доброе утро! Как вы себя чувствуете сегодня?" },
  { id: "2", role: "user", content: "Привет. Так себе, суставы болят..." },
  
  { id: "3", role: "ai", content: "Понимаю. Расскажите, что именно беспокоит? Это поможет нам составить полную картину и найти путь к стойкой ремиссии!" },
  { id: "4", role: "user", content: "Особенно кисти рук, с утра скованность" },
  
  { id: "5", role: "ai", content: "Жаль это слышать. Давайте оценим интенсивность боли в кистях по шкале от 1 до 10." },
  { id: "6", role: "user", content: "Где-то на 7 из 10" },
  
  { id: "7", role: "ai", content: "Понял. А какой характер боли?" },
  { id: "8", role: "user", content: "Тупая, ноющая боль" },
  
  { id: "9", role: "ai", content: "Спасибо за детальное описание! Записал тупую боль в кистях, интенсивность 7/10. Это поможет нам отслеживать динамику и подобрать оптимальную терапию." },

  // СЦЕНАРИЙ 2: ЗАПИСЬ ЛЕКАРСТВ
  { id: "10", role: "ai", content: "А принимали сегодня лекарства?" },
  { id: "11", role: "user", content: "Да, метотрексат выпил вчера, как обычно" },
  
  { id: "12", role: "ai", content: "Понял! Давайте добавим метотрексат в ваш график приема. Это 15 мг раз в неделю?" },
  { id: "13", role: "user", content: "Да, верно, каждый вторник" },
  
  { id: "14", role: "ai", content: "✅ Отлично! Настроил напоминание на каждый вторник в 9:00. Также буду отслеживать эффективность терапии." },

  // 🔥 РАЗДЕЛИТЕЛЬ ДАТЫ - прошла неделя (Вторник)
  { id: "date-1", role: "system", content: "Вторник, 9:00", isDateDivider: true },
  
  // СЦЕНАРИЙ 3: УМНОЕ НАПОМИНАНИЕ
  { id: "15", role: "ai", content: "🔔 Напоминание: Время принять Метотрексат 15 мг" },
  { id: "16", role: "user", content: "Принял, спасибо за напоминание!" },
  
  { id: "17", role: "ai", content: "Отлично! Записал прием Метотрексата. Продолжайте в том же духе - регулярный прием ключевой для достижения ремиссии!" },

  // 🔥 РАЗДЕЛИТЕЛЬ ДАТЫ - прошло 3 месяца
  { id: "date-2", role: "system", content: "3 месяца спустя", isDateDivider: true },
  
  // СЦЕНАРИЙ 4: НАХОЖДЕНИЕ ЗАКОНОМЕРНОСТЕЙ
  { id: "18", role: "ai", content: "🎉 У меня для вас интересная находка! Анализирую ваши данные за последние 3 месяца...", showGraph: true },
  { id: "19", role: "ai", content: "Заметил закономерность: боль в суставах снижается на 30% в течение 48 часов после приема метотрексата. Это отличный результат!" },
  { id: "20", role: "ai", content: "Также вижу, что снижение количества паслёновых в рационе усиливает этот эффект еще на 15%." },

  // 🔥 РАЗДЕЛИТЕЛЬ ДАТЫ - следующий день
  { id: "date-3", role: "system", content: "Следующий день", isDateDivider: true },
  
  // СЦЕНАРИЙ 5: ПОДГОТОВКА К ВРАЧУ
  { id: "21", role: "ai", content: "👨‍⚕️ Вижу, что завтра прием у ревматолога. Подготовить отчет для врача?" },
  { id: "22", role: "user", content: "Да, пожалуйста, подготовьте" },
  { id: "23", role: "ai", content: "📋 Вот что у нас получилось:\n\n• Средняя интенсивность боли: 6.2/10\n• Эффективность метотрексата: +30%\n• Самочувствие улучшилось на 25%\n• Побочных эффектов не зафиксировано\n• Рекомендация: обсудить с врачом текущую дозировку", showPDF: true },
  
  // Завершение
  { id: "24", role: "ai", content: "Отчет готов! Не забудьте взять его с собой на прием. Желаю успешной консультации! 🍀" }
];

export const ChatDemo = () => {
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
  
  const { completeMilestone } = useProductActions();

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
      
      console.log('🎯 Demo completed - sending milestone event');
      completeMilestone('demo');
      
      // Показываем уведомление
      toast({
        title: "Демо завершено!",
        description: "Продолжайте исследовать возможности Remedia",
        variant: "default",
      });
    }
  }, [currentScenarioIndex, isStarted, completeMilestone, toast]);

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

  const handleSendMessage = () => {
    if (!currentUserText.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: currentUserText
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentUserText("");
    setIsWaitingForUserInput(false);
    setAiStatus("ИИ печатает...");
    setCurrentScenarioIndex(prev => prev + 1);
  };

  const handleDemoEnd = () => {
    setIsStarted(false);
    setCurrentUserText("");
    setAiStatus("Всегда на связи");
    toast({
      title: "Демонstration завершена!",
      description: "Нажмите на поле ввода, чтобы начать заново"
    });
  };

  const startDemo = () => {
    if (isStarted) return;

    // 🔥 Яндекс.Метрика - НАЧАЛО ДЕМО
    if (window.ym) {
      window.ym(12345678, 'reachGoal', 'demo_started');
      console.log('📊 Яндекс.Метрика: демо начато');
    }

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
    setAiStatus("ИИ печатает...");
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
      setAiStatus("ИИ печатает...");
      
      // 🔥 УВЕЛИЧЕННОЕ ВРЕМЯ МЕЖДУ СООБЩЕНИЯМИ ИИ
      const typingTime = 2000;
      const pauseBetweenAIMessages = 2500;
      
      timeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, currentMessage]);
        
        const nextMessage = scenarios[currentScenarioIndex + 1];
        if (nextMessage && nextMessage.role === "user") {
          setAiStatus("Автоматический ввод...");
          timeoutRef.current = setTimeout(() => {
            startAutoType(nextMessage.content);
          }, 1500);
        } else if (nextMessage && nextMessage.role === "ai") {
          setAiStatus("Анализирует...");
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
  }, [isStarted, currentScenarioIndex, isWaitingForUserInput, isAutoTyping]);

  useEffect(() => {
    if (isAutoTyping) {
      setAiStatus("Автоматический ввод...");
    }
  }, [isAutoTyping]);

  useEffect(() => {
    if (isWaitingForUserInput && currentUserText && !isAutoTyping) {
      setAiStatus("Нажмите отправить");
    }
  }, [isWaitingForUserInput, currentUserText, isAutoTyping]);

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
              <p className="text-base mb-2">👋 Добро пожаловать!</p>
              <p className="text-sm">Нажмите на поле ввода ниже, чтобы начать демонстрацию</p>
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
                  ? "Начните демонстрацию возможностей ИИ" 
                  : isAutoTyping 
                    ? "Печатает..." 
                    : "Ожидайте..."
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
              <div className="text-muted-foreground flex-shrink-0" title="Демонстрация запущена">
                
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
                  alt="Отправить" 
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