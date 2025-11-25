// src/components/EasterEggs.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { 
  X, Sparkles, Heart, Zap, Users, Target, Clock, Brain, Shield, Rocket, 
  Cpu, Activity, Dna, Network, Globe 
} from 'lucide-react';

interface EasterEgg {
  id: string;
  title: string;
  content: string;
  icon: React.ReactNode;
  position: { x: number; y: number };
  trigger: 'first-scroll' | 'first-click' | 'progress-click' | 'time-delay';
  delay?: number;
  condition?: () => boolean;
}

interface EasterEggsProps {
  progressBarClicked?: boolean;
  anyButtonClicked?: boolean;
}

export const EasterEggs = ({ progressBarClicked = false, anyButtonClicked = false }: EasterEggsProps) => {
  const [activeEggs, setActiveEggs] = useState<Set<string>>(new Set());
  const [visibleEgg, setVisibleEgg] = useState<string | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [hasClickedProgress, setHasClickedProgress] = useState(false);

  // Отслеживаем первый скролл
  useEffect(() => {
    const handleFirstScroll = () => {
      if (!hasScrolled) {
        setHasScrolled(true);
        // Активируем первую капсулу при первом скролле
        setTimeout(() => {
          setActiveEggs(prev => new Set(prev).add('for-everyone'));
        }, 1000);
      }
    };

    window.addEventListener('scroll', handleFirstScroll, { passive: true, once: true });
    return () => window.removeEventListener('scroll', handleFirstScroll);
  }, [hasScrolled]);

  // Отслеживаем клик по прогресс-бару
  useEffect(() => {
    if (progressBarClicked && !hasClickedProgress) {
      setHasClickedProgress(true);
      // Активируем капсулу про токены после клика на прогресс-бар
      setTimeout(() => {
        setActiveEggs(prev => new Set(prev).add('token-economy'));
      }, 500);
    }
  }, [progressBarClicked, hasClickedProgress]);

  // Отслеживаем любой клик по кнопкам
  useEffect(() => {
    if (anyButtonClicked) {
      // Активируем капсулу про основателя после любого клика
      setTimeout(() => {
        setActiveEggs(prev => new Set(prev).add('founder-story'));
      }, 800);
    }
  }, [anyButtonClicked]);

  const eggs: EasterEgg[] = [
    {
      id: 'for-everyone',
      title: 'Для всех 🎯',
      content: 'Вы здоровы или не болеете ревматоидным артритом? Ничего страшного! Мы начинаем с фокуса на хронические заболевания, но планируем помочь абсолютно всем в управлении здоровьем.',
      icon: <Globe className="w-5 h-5 text-red-500" />,
      position: { x: 85, y: 25 },
      trigger: 'first-scroll',
      condition: () => hasScrolled
    },
    {
      id: 'mission-control',
      title: 'Контроль, а не трекер 🎯',
      content: 'Мы создаем не "еще один трекер симптомов", а инструмент, который возвращает чувство контроля над собственной жизнью при хроническом заболевании.',
      icon: <Target className="w-5 h-5 text-purple-500" />,
      position: { x: 15, y: 35 },
      trigger: 'time-delay',
      delay: 15000 // 15 секунд
    },
    {
      id: 'token-economy',
      title: 'Токен-экономика 🪙',
      content: 'Знаете ли вы, что рынок медицинских данных оценивается в $5 млрд, но пациенты, ежедневно предоставляющие ценнейшую информацию, не получают за это ничего? Мы меняем эту парадигму: сначала внутри приложения, потом по всему миру!',
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      position: { x: 75, y: 65 },
      trigger: 'progress-click',
      condition: () => hasClickedProgress
    },
    {
      id: 'founder-story',
      title: 'История основателя 💫',
      content: 'Основатель потратил 6 месяцев на 30+ интервью с пациентами и врачами и провёл около тысячи часов за компьютером, прежде чем объявить об MVP, которое создано без внешних инвестиций!',
      icon: <Rocket className="w-5 h-5 text-blue-500" />,
      position: { x: 25, y: 75 },
      trigger: 'first-click'
    },
    {
      id: 'digital-twin',
      title: 'Цифровой Двойник 🧠',
      content: 'На цифровом двойнике за считанные дни можно будет тестировать новые лекарства, на что сейчас уходит десятки лет. От дневника симптомов к предиктивной медицине будущего!',
      icon: <Brain className="w-5 h-5 text-green-500" />,
      position: { x: 40, y: 20 },
      trigger: 'time-delay',
      delay: 30000 // 30 секунд
    },
    {
      id: 'privacy-first',
      title: 'Конфиденциальность 🛡️',
      content: 'Собранные в приложении данные анонимизируются и используются для движения науки и здравоохранения вперёд. Вы закладываете фундамент для здоровья следующих поколений!',
      icon: <Shield className="w-5 h-5 text-cyan-500" />,
      position: { x: 60, y: 50 },
      trigger: 'time-delay',
      delay: 45000 // 45 секунд
    },
    {
      id: 'patient-power',
      title: 'Сила пациентов 💪',
      content: 'Вместо того чтобы быть пассивными наблюдателями, пациенты становятся активными участниками исследований. Ваши данные - ваш голос в медицине будущего!',
      icon: <Activity className="w-5 h-5 text-orange-500" />,
      position: { x: 20, y: 15 },
      trigger: 'time-delay',
      delay: 60000 // 60 секунд
    },
    {
      id: 'ai-revolution',
      title: 'AI-революция в медицине 🤖',
      content: 'Только 3% медицинских данных сегодня используется для AI-исследований. Мы открываем доступ к остальным 97%, ускоряя разработку лекарств в 10 раз!',
      icon: <Cpu className="w-5 h-5 text-indigo-500" />,
      position: { x: 80, y: 40 },
      trigger: 'time-delay',
      delay: 75000 // 75 секунд
    },
    {
      id: 'personalized-medicine',
      title: 'Персонализированная медицина 🧬',
      content: 'Скоро лечение будет подбираться не по усредненным протоколам, где пациент не имеют уникальных особенностей, а на основе ваших уникальных данных. Мы строим этот будущий уже сегодня!',
      icon: <Dna className="w-5 h-5 text-pink-500" />,
      position: { x: 10, y: 80 },
      trigger: 'time-delay',
      delay: 90000 // 90 секунд
    },
    {
      id: 'health-ecosystem',
      title: 'Экосистема здоровья 🏥',
      content: 'Мы строим не приложение, а целую экосистему: пациенты + врачи + исследователи + фармакомпании. Все вместе мы сильнее!',
      icon: <Network className="w-5 h-5 text-violet-500" />,
      position: { x: 90, y: 70 },
      trigger: 'time-delay',
      delay: 105000 // 105 секунд
    }
  ];

  // Активация по времени
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    
    eggs.forEach(egg => {
      if (egg.trigger === 'time-delay' && !activeEggs.has(egg.id)) {
        const timeout = setTimeout(() => {
          console.log(`🎯 Activating easter egg: ${egg.id}`);
          setActiveEggs(prev => new Set(prev).add(egg.id));
        }, egg.delay || 30000);
        
        timeouts.push(timeout);
      }
    });

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [activeEggs]);

  const handleEggClick = useCallback((eggId: string) => {
    if (!activeEggs.has(eggId)) {
      setActiveEggs(prev => new Set(prev).add(eggId));
    }
    setVisibleEgg(eggId);
  }, [activeEggs]);

  const closeEgg = useCallback((eggId: string) => {
    setVisibleEgg(null);
    // Убираем капсулу после просмотра
    setTimeout(() => {
      setActiveEggs(prev => {
        const newSet = new Set(prev);
        newSet.delete(eggId);
        console.log(`🎯 Removed easter egg: ${eggId}`);
        return newSet;
      });
    }, 300);
  }, []);

  const closeCurrentEgg = useCallback(() => {
    if (visibleEgg) {
      closeEgg(visibleEgg);
    }
  }, [visibleEgg, closeEgg]);

  // Функция для получения цвета по ID
  const getEggColor = (eggId: string) => {
    const colors: { [key: string]: string } = {
      'for-everyone': 'rgba(239, 68, 68, 0.8)',
      'mission-control': 'rgba(147, 51, 234, 0.8)',
      'token-economy': 'rgba(234, 179, 8, 0.8)',
      'founder-story': 'rgba(59, 130, 246, 0.8)',
      'digital-twin': 'rgba(34, 197, 94, 0.8)',
      'privacy-first': 'rgba(6, 182, 212, 0.8)',
      'patient-power': 'rgba(249, 115, 22, 0.8)',
      'ai-revolution': 'rgba(99, 102, 241, 0.8)',
      'personalized-medicine': 'rgba(236, 72, 153, 0.8)',
      'health-ecosystem': 'rgba(139, 92, 246, 0.8)'
    };
    return colors[eggId] || 'rgba(139, 92, 246, 0.8)';
  };

  const getEggSize = (eggId: string) => {
    // Первые капсулы делаем более заметными
    const priorityEggs = ['for-everyone', 'mission-control', 'token-economy', 'founder-story'];
    return priorityEggs.includes(eggId) ? 'w-14 h-14' : 'w-12 h-12';
  };

  console.log('🎯 Active easter eggs:', Array.from(activeEggs));

  return (
    <>
      {/* Плавающие капсулки */}
      {eggs.map(egg => (
        <AnimatePresence key={egg.id}>
          {activeEggs.has(egg.id) && (
            <motion.button
              initial={{ scale: 0, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0, rotate: 180 }}
              whileHover={{ scale: 1.15, rotate: 5 }}
              className={`fixed z-40 cursor-pointer group`}
              style={{
                left: `${egg.position.x}%`,
                top: `${egg.position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => handleEggClick(egg.id)}
            >
              {/* Анимированный фон */}
              <motion.div
                className="absolute -inset-4 rounded-full opacity-70"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  background: `radial-gradient(circle, ${getEggColor(egg.id)}, transparent 70%)`,
                  filter: 'blur(12px)',
                }}
              />
              
              {/* Основная капсула - стиль как у прогресс-бара */}
              <motion.div
                className={`relative ${getEggSize(egg.id)} bg-white/95 backdrop-blur-xl rounded-2xl border-2 border-white/60 shadow-2xl flex items-center justify-center`}
                whileHover={{
                  boxShadow: `0 0 30px ${getEggColor(egg.id)}`,
                  borderColor: 'rgba(255,255,255,0.9)',
                }}
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.8))',
                }}
              >
                {/* Стеклянный эффект как у прогресс-бара */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 via-transparent to-white/10 mix-blend-overlay" />
                
                {/* Иконка */}
                <div className="relative z-10">
                  {egg.icon}
                </div>

                {/* Микро-анимация призыва */}
                <motion.div
                  className="absolute -inset-2 rounded-2xl border-2 border-white/40"
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.3, 0, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />

                {/* Блики как у прогресс-бара */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none">
                  <div className="absolute left-1 top-1 w-6 h-8 bg-white/30 rounded-full blur-lg" />
                  <div className="absolute right-1 top-2 w-4 h-4 bg-white/50 rounded-full blur-md" />
                </div>
              </motion.div>

              {/* Тултип при hover */}
              <motion.div
                className="absolute left-1/2 top-full mt-3 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 bg-gray-900/90 text-white text-xs py-2 px-3 rounded-lg whitespace-nowrap backdrop-blur-sm border border-gray-700"
                initial={{ y: -10 }}
                whileHover={{ y: 0 }}
              >
                {egg.title}
                <div className="absolute left-1/2 bottom-full transform -translate-x-1/2 w-2 h-2 bg-gray-900/90 rotate-45 border-l border-t border-gray-700" />
              </motion.div>
            </motion.button>
          )}
        </AnimatePresence>
      ))}

      {/* Попап с контентом */}
      <AnimatePresence>
        {visibleEgg && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-50 backdrop-blur-sm"
              onClick={closeCurrentEgg}
            />
            
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/50 max-w-sm w-full pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(255,255,255,0.92))'
                }}
              >
                {eggs.filter(egg => egg.id === visibleEgg).map(egg => (
                  <div key={egg.id} className="relative p-6">
                    <button 
                      onClick={() => closeEgg(egg.id)}
                      className="absolute right-4 top-4 p-1 hover:bg-gray-100/50 rounded-lg transition-colors z-10"
                    >
                      <X size={16} className="text-gray-500" />
                    </button>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${getEggColor(egg.id)}, ${getEggColor(egg.id)}CC)`,
                          boxShadow: `0 4px 15px ${getEggColor(egg.id)}40`
                        }}
                      >
                        {egg.icon}
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg">{egg.title}</h3>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {egg.content}
                    </p>
                    
                    <motion.div
                      className="flex gap-1 mt-4 justify-end"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1 h-1 rounded-full"
                          style={{ backgroundColor: getEggColor(egg.id) }}
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                        />
                      ))}
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};