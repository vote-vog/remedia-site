// src/components/ProgressBar.tsx
import { motion, useScroll, useTransform, useInView, animate } from "framer-motion";
import { useProgress } from "@/hooks/useProgress";
import { useToast } from "@/hooks/use-toast";
import { useRef, useEffect, useState } from "react";

interface ProgressBarProps {
  onOpenRewards?: () => void;
  onOpenReferral?: () => void;
}

export const ProgressBar = ({ onOpenRewards, onOpenReferral }: ProgressBarProps) => {
  const { completionPercentage, progress } = useProgress();
  const { toast } = useToast();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-20%" });

  const isOverPlan = completionPercentage > 100;
  const isNearLimit = completionPercentage > 90 && !isOverPlan;
  const isMaxPower = completionPercentage >= 200;

  // Логика с ПУСТОТОЙ: капсула заполняется снизу вверх
  const totalDisplayHeight = 100;
  const baseHeight = Math.min(completionPercentage, 100);
  const magicHeight = isOverPlan 
    ? Math.min(completionPercentage - 100, 100)
    : 0;

  // Оптимизация производительности
  const optimizedBubbleCount = isOverPlan ? 4 : 6;
  const optimizedParticlesCount = isOverPlan ? 30 : 40;

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.12], [0, 1]);

  // Эффекты для 200%
  const [isExploding, setIsExploding] = useState(false);
  
  // 🔥 НОВЫЕ СОСТОЯНИЯ ДЛЯ АНИМАЦИЙ
  const [isProgressAnimating, setIsProgressAnimating] = useState(false);
  const [isFlashAnimating, setIsFlashAnimating] = useState(false);
  const [prevProgress, setPrevProgress] = useState(completionPercentage);

  // Анимация при изменении прогресса
  useEffect(() => {
    if (prevProgress !== completionPercentage) {
      // Запускаем анимацию "колокольчика"
      setIsProgressAnimating(true);
      
      // Запускаем вспышку фона
      setIsFlashAnimating(true);
      
      // Сбрасываем анимации через короткое время
      const progressTimer = setTimeout(() => setIsProgressAnimating(false), 600);
      const flashTimer = setTimeout(() => setIsFlashAnimating(false), 300);
      
      setPrevProgress(completionPercentage);
      
      return () => {
        clearTimeout(progressTimer);
        clearTimeout(flashTimer);
      };
    }
  }, [completionPercentage, prevProgress]);

  // Эффекты для 200%
  useEffect(() => {
    if (isMaxPower && !isExploding) {
      setIsExploding(true);
      const timer = setTimeout(() => setIsExploding(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isMaxPower, isExploding]);

  // Звуковые эффекты
  const playClickSound = () => {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      try {
        const context = new AudioContext();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        oscillator.frequency.value = isOverPlan ? 800 : 600;
        gainNode.gain.value = 0.1;
        
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.1);
        oscillator.stop(context.currentTime + 0.1);
      } catch (error) {
        console.log('Audio not supported');
      }
    }
  };

  // ЛОГИКА ВЫЗОВА ПОПАПОВ
  const handleClick = () => {
    playClickSound();
    
    // 🔥 Яндекс.Метрика - КЛИК ПО ПРОГРЕССБАРУ
    if (window.ym) {
      const goalName = !progress.userEmail ? 'progressbar_waitlist_click' : 'progressbar_referral_click';
      window.ym(12345678, 'reachGoal', goalName);
      
      // Дополнительные параметры для аналитики
      window.ym(12345678, 'params', {
        progress_percentage: Math.round(completionPercentage),
        is_over_plan: isOverPlan,
        is_max_power: isMaxPower,
        user_has_email: !!progress.userEmail
      });
      
      console.log(`📊 Яндекс.Метрика: ${goalName} at ${completionPercentage}%`);
    }
    
    if (!progress.userEmail) {
      console.log('🎯 ProgressBar: Opening rewards popup for waitlist');
      onOpenRewards?.();
      toast({
        title: "Получите бонусы!",
        description: "Подпишитесь на лист ожидания",
        variant: "default",
      });
    } else {
      console.log('🎯 ProgressBar: Opening referral popup');
      onOpenReferral?.();
      toast({
        title: "Поделитесь с друзьями!",
        description: "Приглашайте и получайте бонусы",
        variant: "default",
      });
    }
  };

  // Определение темы
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDark(mediaQuery.matches);
      
      const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="fixed top-24 right-6 z-50 select-none"
      style={{ opacity }}
      role="progressbar"
      aria-valuenow={completionPercentage}
      aria-valuemin={0}
      aria-valuemax={200}
      aria-label={`Прогресс использования: ${completionPercentage}%`}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={isInView ? { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        rotate: isMaxPower ? [0, -5, 5, -3, 3, 0] : 0
      } : {}}
      transition={{ 
        duration: 0.5, 
        type: "spring",
        rotate: { duration: 2, repeat: isMaxPower ? Infinity : 0, ease: "easeInOut" }
      }}
    >
      {/* 🔥 УСИЛЕННЫЙ ФОН С АНИМАЦИЕЙ ВСПЫШКИ */}
      {isMaxPower && (
        <>
          <motion.div
            className="absolute -inset-10 rounded-full z-0"
            animate={{
              scale: [1, 1.8, 1],
              rotate: [0, 180, 360],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              background: "conic-gradient(from 0deg, #ff0080, #8000ff, #0080ff, #00ff80, #ff0080)",
              filter: "blur(15px)",
            }}
          />
          
          <motion.div
            className="absolute -inset-8 rounded-full z-0"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              background: "radial-gradient(circle, #ff00ff, #00ffff, transparent 70%)",
              filter: "blur(20px)",
            }}
          />
        </>
      )}

      {/* 🔥 АНИМАЦИЯ ВСПЫШКИ ПРИ ИЗМЕНЕНИИ ПРОГРЕССА */}
      {isFlashAnimating && (
        <motion.div
          className="absolute -inset-12 rounded-full z-0 pointer-events-none"
          initial={{ 
            scale: 0.8, 
            opacity: 0,
            background: isOverPlan 
              ? "radial-gradient(circle, #fbbf24, #f59e0b, transparent 60%)"
              : "radial-gradient(circle, #6366f1, #8b5cf6, transparent 60%)"
          }}
          animate={{ 
            scale: [0.8, 2.5, 1.2],
            opacity: [0, 0.8, 0],
          }}
          transition={{ 
            duration: 0.6,
            ease: "easeOut"
          }}
          style={{
            filter: "blur(25px)",
          }}
          onAnimationComplete={() => setIsFlashAnimating(false)}
        />
      )}

      <motion.button
        className="relative block cursor-pointer group"
        onClick={handleClick}
        whileHover={{ scale: isMaxPower ? 1.1 : 1.05 }}
        whileTap={{ scale: isMaxPower ? 0.9 : 0.95 }}
        // 🔥 АНИМАЦИЯ КОЛОКОЛЬЧИКА ПРИ ИЗМЕНЕНИИ ПРОГРЕССА
        animate={isProgressAnimating ? {
          x: [0, -4, 4, -3, 3, 0],
          y: [0, -2, 2, -1, 1, 0],
          rotate: [0, -3, 3, -2, 2, 0],
          transition: { 
            duration: 0.6,
            ease: "easeInOut"
          }
        } : isNearLimit ? {
          x: [0, -1, 1, -1, 1, 0],
          transition: { duration: 0.5, repeat: Infinity, repeatType: "loop" }
        } : isMaxPower ? {
          scale: [1, 1.05, 1],
          transition: { duration: 0.3, repeat: Infinity }
        } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        style={{
          cursor: isMaxPower ? 
            `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><text x='16' y='20' text-anchor='middle' fill='%23ff00ff' font-size='18'>💥</text></svg>") 16 16, pointer` :
            isOverPlan ? 
            `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><text x='16' y='20' text-anchor='middle' fill='%23f59e0b' font-size='18'>✨</text></svg>") 16 16, pointer` :
            `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><text x='16' y='20' text-anchor='middle' fill='%238b5cf6' font-size='18'>👆</text></svg>") 16 16, pointer`
        }}
      >
        {/* 🔥 УСИЛЕННЫЙ АНИМИРОВАННЫЙ ФОН */}
        <motion.div
          className="absolute -inset-6 rounded-full"
          animate={{ 
            scale: isMaxPower ? [1, 1.8, 1.4] : isOverPlan ? [1, 1.3, 1] : [1, 1.25, 1], 
            opacity: isMaxPower ? [0.6, 1, 0.8] : isOverPlan ? [0.4, 0.7, 0.4] : [0.25, 0.45, 0.25],
          }}
          whileHover={{
            scale: isMaxPower ? [1.4, 2, 1.4] : isOverPlan ? [1.3, 1.5, 1.3] : [1.25, 1.4, 1.25],
            opacity: isMaxPower ? [0.8, 1, 0.8] : isOverPlan ? [0.7, 0.9, 0.7] : [0.45, 0.6, 0.45]
          }}
          transition={{ 
            duration: isMaxPower ? 1 : isOverPlan ? 3 : 4,
          }}
          style={{
            background: isMaxPower 
              ? "radial-gradient(circle at center, #ff00ff 0%, #00ffff 25%, #ffff00 50%, #ff0080 75%, transparent 100%)"
              : isOverPlan 
              ? "radial-gradient(circle at center, #fbbf24 0%, #f59e0b 40%, transparent 75%)"
              : "radial-gradient(circle at center, #6366f1 0%, #8b5cf6 40%, transparent 75%)",
            filter: "blur(20px)",
          }}
        />

        {/* 🔥 ДОПОЛНИТЕЛЬНАЯ ВСПЫШКА ПРИ АНИМАЦИИ ПРОГРЕССА */}
        {isProgressAnimating && (
          <motion.div
            className="absolute -inset-4 rounded-full z-5 pointer-events-none"
            initial={{ 
              scale: 1,
              opacity: 0,
              background: isOverPlan 
                ? "radial-gradient(circle, #fef3c7, transparent 70%)"
                : "radial-gradient(circle, #e0e7ff, transparent 70%)"
            }}
            animate={{ 
              scale: [1, 1.8, 1],
              opacity: [0, 0.4, 0],
            }}
            transition={{ 
              duration: 0.5,
              ease: "easeOut"
            }}
            style={{
              filter: "blur(15px)",
            }}
          />
        )}

        {/* ВЗРЫВ ЧАСТИЦ ПРИ 200% */}
        {isMaxPower && (
          <div className="absolute -inset-10 z-5 pointer-events-none">
            {[...Array(25)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  background: `hsl(${i * 15}, 100%, 60%)`,
                  boxShadow: `0 0 20px hsl(${i * 15}, 100%, 60%)`,
                }}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  x: [0, Math.cos(i * 0.25) * 120, Math.cos(i * 0.5) * 80],
                  y: [0, Math.sin(i * 0.25) * 120, Math.sin(i * 0.5) * 80],
                  opacity: [1, 1, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        )}

        {/* ИНДИКАТОР СТАТУСА */}
        <motion.div
          className="absolute -top-2 -right-2 z-10"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ 
            scale: 1, 
            rotate: 0,
            y: isMaxPower ? [0, -10, 0] : 0
          }}
          // 🔥 АНИМАЦИЯ КОЛОКОЛЬЧИКА ДЛЯ ИНДИКАТОРА
          animate={isProgressAnimating ? {
            scale: [1, 1.3, 1],
            rotate: [0, 15, -15, 10, -10, 0],
            transition: { 
              duration: 0.6,
              ease: "easeInOut"
            }
          } : {
            scale: 1, 
            rotate: 0,
            y: isMaxPower ? [0, -10, 0] : 0
          }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            delay: 0.2,
            y: { duration: 0.5, repeat: isMaxPower ? Infinity : 0 }
          }}
        >
          {!progress.userEmail ? (
            // 🎁 ИКОНКА ПОДАРКА ДЛЯ НОВЫХ ПОЛЬЗОВАТЕЛЕЙ
            <motion.div
              className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
              whileHover={{ rotate: 15, scale: 1.1 }}
              animate={{ 
                scale: isMaxPower ? [1, 1.3, 1] : [1, 1.1, 1],
                rotate: isMaxPower ? [0, 180, 360] : [0, 5, 0],
                boxShadow: isMaxPower 
                  ? ['0 0 0px #ff00ff', '0 0 30px #ff00ff', '0 0 0px #00ffff']
                  : ['0 0 0px rgba(234, 179, 8, 0)', '0 0 20px rgba(234, 179, 8, 0.6)', '0 0 0px rgba(234, 179, 8, 0)']
              }}
              transition={{ 
                duration: isMaxPower ? 1 : 2, 
                repeat: Infinity,
                repeatDelay: isMaxPower ? 0 : 3
              }}
            >
              <motion.span 
                className="text-xs font-bold text-white"
                animate={isMaxPower ? { scale: [1, 1.5, 1] } : {}}
                transition={{ duration: 0.5, repeat: isMaxPower ? Infinity : 0 }}
              >
                🎁
              </motion.span>
            </motion.div>
          ) : (
            // 👥 ИКОНКА ЛЮДЕЙ ДЛЯ ПОЛЬЗОВАТЕЛЕЙ С EMAIL + 💃🕺 ТАНЕЦ ДЛЯ 200+%
            <motion.div
              className={`${
                isMaxPower 
                  ? "w-7 h-7 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500" 
                  : "w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500"
              } rounded-full flex items-center justify-center shadow-lg border-2 border-white`}
              whileHover={{ 
                rotate: isMaxPower ? 360 : -15, 
                scale: isMaxPower ? 1.2 : 1.1 
              }}
              animate={{ 
                scale: isMaxPower ? [1, 1.4, 1] : [1, 1.1, 1],
                rotate: isMaxPower ? [0, -180, -360, -540, -720] : [0, -5, 0],
                boxShadow: isMaxPower 
                  ? [
                      '0 0 0px #ff00ff', 
                      '0 0 25px #ff00ff', 
                      '0 0 0px #00ffff',
                      '0 0 25px #00ffff',
                      '0 0 0px #ff00ff'
                    ]
                  : ['0 0 0px rgba(34, 197, 94, 0)', '0 0 20px rgba(34, 197, 94, 0.6)', '0 0 0px rgba(34, 197, 94, 0)']
              }}
              transition={{ 
                duration: isMaxPower ? 2 : 2, 
                repeat: Infinity,
                repeatDelay: isMaxPower ? 0 : 3
              }}
            >
              <motion.div 
                className="flex items-center justify-center"
                animate={isMaxPower ? {
                  x: [0, -2, 2, -2, 2, 0],
                  y: [0, -3, 0, 3, 0, -3]
                } : {}}
                transition={{ 
                  duration: 0.8, 
                  repeat: isMaxPower ? Infinity : 0,
                  ease: "easeInOut"
                }}
              >
                <motion.span 
                  className="text-xs font-bold text-white"
                  animate={isMaxPower ? { 
                    scale: [1, 1.3, 1],
                    filter: ["hue-rotate(0deg)", "hue-rotate(180deg)", "hue-rotate(360deg)"]
                  } : {}}
                  transition={{ 
                    duration: 1.5, 
                    repeat: isMaxPower ? Infinity : 0 
                  }}
                >
                  {isMaxPower ? "💃🕺" : "👥"}
                </motion.span>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* КАПСУЛА С ЖИДКОСТЯМИ */}
        <div className="relative w-8 h-16">
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                WebkitMaskImage: "radial-gradient(circle at center, black 68%, transparent 100%)",
                maskImage: "radial-gradient(circle at center, black 68%, transparent 100%)",
              }}
            >
              {/* Стекло капсулы */}
              <motion.div 
                className="absolute inset-0 rounded-full bg-white/8 backdrop-blur-xl border group-hover:border-white/50 transition-all duration-300"
                animate={{
                  borderColor: isMaxPower 
                    ? ['rgba(255,0,255,0.5)', 'rgba(0,255,255,0.5)', 'rgba(255,255,0,0.5)', 'rgba(255,0,255,0.5)']
                    : ['rgba(255,255,255,0.35)'],
                  boxShadow: isMaxPower
                    ? ['0 0 0px #ff00ff', '0 0 20px #ff00ff', '0 0 40px #00ffff', '0 0 0px #ff00ff']
                    : ['none']
                }}
                transition={{
                  duration: isMaxPower ? 2 : 0.3,
                  repeat: isMaxPower ? Infinity : 0
                }}
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 via-transparent to-white/10 mix-blend-overlay" />

              {/* 2. Градиентный переход между жидкостями */}
              {isOverPlan && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 origin-bottom overflow-hidden rounded-full z-15"
                  style={{ 
                    height: `${Math.min(magicHeight + 8, 100)}%`,
                    mixBlendMode: 'overlay',
                    opacity: isMaxPower ? 0.6 : 0.4
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.min(magicHeight + 8, 100)}%` }}
                  transition={{ type: "spring", stiffness: 60, damping: 10, delay: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/30 via-purple-400/40 to-pink-400/30 rounded-full" />
                </motion.div>
              )}

              {/* 3. МАЛАХИТОВАЯ ЖИДКОСТЬ — ЗАПОЛНЯЕТСЯ СНИЗУ ВВЕРХ */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 origin-bottom overflow-hidden rounded-full z-10"
                style={{ 
                  height: `${baseHeight}%`,
                }}
                initial={{ height: 0 }}
                animate={{ height: `${baseHeight}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 22 }}
              >
                {/* Основной малахитовый градиент */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D9488] via-[#14B8A6] to-[#5EEAD4]/90" />
                
                {/* Эффекты малахитовой жидкости ТОЛЬКО когда нет переполнения */}
                {!isOverPlan && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-400/30 to-white/20 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-900/40 mix-blend-multiply" />

                    {/* Реалистичные пузырьки */}
                    <div className="absolute inset-x-0 bottom-0">
                      {[...Array(optimizedBubbleCount)].map((_, i) => (
                        <motion.div
                          key={`b${i}`}
                          className="absolute rounded-full border border-white/40"
                          style={{
                            width: i < 2 ? 5 : i < 3 ? 3 : 2,
                            height: i < 2 ? 5 : i < 3 ? 3 : 2,
                            left: `${12 + i * 15}%`,
                            bottom: -10,
                            background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), transparent 60%)",
                            boxShadow: "inset 0 1px 3px white, 0 0 8px rgba(52,211,153,0.4)",
                          }}
                          animate={{
                            y: [0, -180],
                            x: [0, Math.sin(i) * 10, -Math.sin(i) * 8, 0],
                            opacity: [0, 0.8, 0.6, 0],
                          }}
                          transition={{
                            duration: 8 + i * 1.5,
                            repeat: Infinity,
                            ease: "easeOut",
                            delay: i * 1.2,
                          }}
                        />
                      ))}
                    </div>

                    {/* Мелкая взвесь */}
                    <div className="absolute inset-0 opacity-70">
                      {[...Array(optimizedParticlesCount)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute rounded-full bg-white/60"
                          style={{
                            width: Math.random() * 2 + 0.8,
                            height: Math.random() * 2 + 0.8,
                            left: `${Math.random() * 100}%`,
                            bottom: `${Math.random() * 90}%`,
                          }}
                          animate={{ y: [0, -30 - Math.random() * 40], opacity: [0.4, 0.9, 0.4] }}
                          transition={{
                            duration: 4 + Math.random() * 5,
                            repeat: Infinity,
                            delay: Math.random() * 3,
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Мениск малахитовой жидкости */}
                {!isOverPlan && baseHeight > 0 && (
                  <div className="absolute inset-x-1 top-0 pointer-events-none" style={{ height: "28px", transform: "translateY(-50%)" }}>
                    <div
                      className="w-full h-full"
                      style={{
                        background: `
                          radial-gradient(
                            ellipse at center top,
                            rgba(255,255,255,0.95) 0%,
                            rgba(180,255,240,0.7) 30%,
                            rgba(100,255,200,0.35) 55%,
                            rgba(20,184,166,0.25) 80%,
                            transparent 100%
                          )
                        `,
                        clipPath: "ellipse(100% 60% at 50% 0%)",
                        filter: "blur(1.8px)",
                      }}
                    />
                    <div
                      className="absolute inset-x-0 top-0 h-10"
                      style={{
                        background: "linear-gradient(to bottom, rgba(13,148,136,0.85) 0%, transparent 80%)",
                        clipPath: "ellipse(90% 45% at 50% 0%)",
                        filter: "blur(1.2px)",
                      }}
                    />
                    <motion.div
                      className="absolute inset-x-4 top-3 h-1.5 rounded-full"
                      style={{
                        background: "linear-gradient(to right, transparent, white, transparent)",
                        filter: "blur(2.5px)",
                        boxShadow: "0 0 14px rgba(255,255,255,0.95)",
                      }}
                      animate={{ opacity: [0.75, 1, 0.75] }}
                      transition={{ duration: 2.8, repeat: Infinity }}
                    />
                  </div>
                )}
              </motion.div>

              {/* 4. МАГИЧЕСКАЯ ЖИДКОСТЬ — НАКЛАДЫВАЕТСЯ СВЕРХУ */}
              {isOverPlan && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 origin-bottom overflow-hidden rounded-full z-20"
                  style={{ 
                    height: `${magicHeight}%`,
                    mixBlendMode: isMaxPower ? 'difference' : 'screen'
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${magicHeight}%` }}
                  transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.1 }}
                >
                  {/* ЯРКИЙ ФИОЛЕТОВЫЙ ГРАДИЕНТ */}
                  <motion.div 
                    className="absolute inset-0"
                    animate={isMaxPower ? {
                      background: [
                        'linear-gradient(to top, #ff0080, #8000ff, #0080ff)',
                        'linear-gradient(to top, #8000ff, #0080ff, #ff0080)',
                        'linear-gradient(to top, #0080ff, #ff0080, #8000ff)'
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: isMaxPower ? Infinity : 0 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-500 via-fuchsia-500 to-pink-500" />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-300/50 to-transparent mix-blend-screen" />

                  {/* ЗОЛОТИСТЫЕ ПУЗЫРЬКИ ЭНЕРГИИ */}
                  <div className="absolute inset-0">
                    {[...Array(isMaxPower ? 12 : optimizedBubbleCount)].map((_, i) => (
                      <motion.div
                        key={`magic-bubble-${i}`}
                        className="absolute rounded-full"
                        style={{
                          width: isMaxPower ? Math.random() * 6 + 3 : Math.random() * 3 + 2,
                          height: isMaxPower ? Math.random() * 6 + 3 : Math.random() * 3 + 2,
                          left: `${15 + i * (isMaxPower ? 8 : 15)}%`,
                          bottom: '10%',
                          background: isMaxPower 
                            ? `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), hsl(${i * 30}, 100%, 60%) 40%, transparent)`
                            : "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(255,215,0,0.8) 40%, rgba(218,165,32,0.6) 70%, transparent)",
                          boxShadow: isMaxPower 
                            ? `0 0 25px hsl(${i * 30}, 100%, 60%)`
                            : "0 0 15px rgba(255,215,0,0.9), inset 0 1px 3px rgba(255,255,255,0.8)",
                        }}
                        animate={{
                          y: [0, -50 - Math.random() * (isMaxPower ? 50 : 30)],
                          x: [0, Math.sin(i) * (isMaxPower ? 15 : 8), -Math.sin(i) * (isMaxPower ? 12 : 6), 0],
                          scale: [0.8, isMaxPower ? 2 : 1.3, 0.9],
                          opacity: [0, 1, 0],
                          rotate: isMaxPower ? [0, 180, 360] : [0, 0, 0],
                        }}
                        transition={{
                          duration: isMaxPower ? 1 + Math.random() : 2 + Math.random() * 1,
                          repeat: Infinity,
                          ease: "easeOut",
                          delay: i * (isMaxPower ? 0.1 : 0.3),
                        }}
                      />
                    ))}
                  </div>

                  {/* ЗОЛОТИСТЫЕ ИСКРЫ */}
                  <div className="absolute inset-0">
                    {[...Array(isMaxPower ? 15 : 4)].map((_, i) => (
                      <motion.div
                        key={`spark-${i}`}
                        className="absolute rounded-full"
                        style={{
                          width: isMaxPower ? 1 : 0.5,
                          height: isMaxPower ? 1 : 0.5,
                          left: `${20 + i * (isMaxPower ? 6 : 15)}%`,
                          bottom: '20%',
                          background: isMaxPower
                            ? `radial-gradient(circle, rgba(255,255,255,0.9), hsl(${i * 24}, 100%, 60%) 60%)`
                            : "radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,215,0,0.9) 60%, rgba(218,165,32,0.7))",
                          boxShadow: isMaxPower
                            ? `0 0 15px hsl(${i * 24}, 100%, 60%)`
                            : "0 0 8px rgba(255,215,0,0.8)",
                        }}
                        animate={{
                          y: [0, isMaxPower ? -80 : -40],
                          x: [0, 15 - Math.random() * (isMaxPower ? 60 : 30)],
                          opacity: [0, 1, 0],
                          scale: [0, isMaxPower ? 3 : 1.5, 0],
                        }}
                        transition={{
                          duration: isMaxPower ? 1 + i * 0.1 : 1.5 + i * 0.2,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                      />
                    ))}
                  </div>

                  {/* СВЕЧЕНИЯ */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-yellow-200/30 blur-xl" />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-400/20 to-transparent blur-lg" />
                </motion.div>
              )}

              {/* 5. БЛИКИ И ОТРАЖЕНИЯ */}
              <div className="absolute inset-0 pointer-events-none z-30">
                <div className="absolute left-1 top-2 w-4 h-10 bg-white/40 rounded-full blur-xl opacity-70" />

                <motion.div
                  animate={{ 
                    opacity: [0.75, 1, 0.75], 
                    scale: [1, 1.08, 1],
                    rotate: isMaxPower ? [0, 90, 180, 270, 360] : [0, 0, 0]
                  }}
                  transition={{ 
                    duration: isMaxPower ? 2 : 3, 
                    repeat: Infinity,
                    rotate: { duration: 3, repeat: isMaxPower ? Infinity : 0 }
                  }}
                >
                  <div
                    className="absolute right-0.5 top-1 w-6 h-10 rounded-full"
                    style={{
                      background: "radial-gradient(ellipse at 20% 20%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 45%, transparent 70%)",
                      filter: "blur(5px)",
                      transform: "rotate(20deg)",
                    }}
                  />
                  <motion.div
                    className="absolute right-3.5 top-4 w-2 h-2 rounded-full bg-white"
                    style={{ boxShadow: "0 0 16px 6px white" }}
                    animate={{ 
                      scale: isMaxPower ? [1, 2, 1] : [1, 1.4, 1],
                      boxShadow: isMaxPower 
                        ? ['0 0 16px 6px white', '0 0 30px 10px #ff00ff', '0 0 16px 6px white']
                        : ['0 0 16px 6px white']
                    }}
                    transition={{ 
                      duration: isMaxPower ? 0.5 : 2, 
                      repeat: Infinity 
                    }}
                  />
                </motion.div>

                <motion.div 
                  className="absolute inset-0 rounded-full border transition-colors duration-300"
                  animate={{
                    borderColor: isMaxPower 
                      ? ['rgba(255,0,255,0.8)', 'rgba(0,255,255,0.8)', 'rgba(255,255,0,0.8)']
                      : ['rgba(255,255,255,0.3)'],
                    boxShadow: isMaxPower
                      ? ['0 0 0px #ff00ff', '0 0 30px #ff00ff', '0 0 0px #00ffff']
                      : ['none']
                  }}
                  transition={{
                    duration: isMaxPower ? 1 : 0.3,
                    repeat: isMaxPower ? Infinity : 0
                  }}
                />
              </div>
            </div>

            {/* 6. УСИЛЕННАЯ АУРА */}
            {isOverPlan && (
              <motion.div
                className="absolute -inset-5 rounded-full z-0"
                animate={{
                  scale: isMaxPower ? [1, 2, 1.5] : [1, 1.6, 1],
                  opacity: isMaxPower ? [0.6, 0.9, 0.7] : [0.4, 0.8, 0.4],
                  rotate: isMaxPower ? [0, 180, 360] : [0, 0, 0]
                }}
                transition={{ 
                  duration: isMaxPower ? 2 : 1.8, 
                  repeat: Infinity,
                  rotate: { duration: 4, repeat: isMaxPower ? Infinity : 0 }
                }}
                style={{
                  background: isMaxPower
                    ? "conic-gradient(from 0deg, #ff0080, #8000ff, #0080ff, #00ff80, #ff0080)"
                    : "radial-gradient(circle at center, rgba(251, 191, 36, 0.6) 0%, rgba(245, 158, 11, 0.5) 30%, rgba(168, 85, 247, 0.4) 60%, transparent 80%)",
                  filter: "blur(30px)",
                }}
              />
            )}
          </div>
        </div>

        {/* ПРОЦЕНТНЫЙ ИНДИКАТОР */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <motion.div 
            className={`text-xs font-bold px-2 py-1 rounded-full shadow-sm border transition-all duration-300 ${
              isMaxPower 
                ? 'text-white bg-gradient-to-r from-pink-500 to-purple-500 border-pink-300' 
                : isDark 
                  ? 'text-gray-300 bg-gray-800/90 border-gray-600' 
                  : 'text-gray-700 bg-white/90 border-gray-200'
            }`}
            animate={isMaxPower ? {
              scale: [1, 1.2, 1],
              boxShadow: ['0 0 0px #ff00ff', '0 0 20px #ff00ff', '0 0 0px #00ffff']
            } : isProgressAnimating ? {
              scale: [1, 1.15, 1],
              backgroundColor: isOverPlan 
                ? ['#f59e0b', '#fbbf24', '#f59e0b']
                : ['#6366f1', '#8b5cf6', '#6366f1'],
              transition: { duration: 0.4 }
            } : {}}
            transition={{ duration: 1, repeat: isMaxPower ? Infinity : 0 }}
          >
            {Math.round(completionPercentage)}%
            {isOverPlan && (
              <motion.span 
                className="ml-1"
                animate={isMaxPower ? { scale: [1, 1.5, 1] } : isProgressAnimating ? {
                  scale: [1, 1.3, 1],
                  rotate: [0, 15, -15, 0]
                } : {}}
                transition={{ duration: 0.5, repeat: isMaxPower ? Infinity : 0 }}
              >
                {isMaxPower ? '💥' : '✨'}
              </motion.span>
            )}
          </motion.div>
        </div>

        {/* ТУЛТИПЫ С СООБЩЕНИЯМИ */}
        <motion.div
          className="absolute right-full top-1/2 transform -translate-y-1/2 mr-3 opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 bg-gray-900 text-white text-xs py-2 px-3 rounded-lg shadow-xl max-w-xs border border-gray-700"
          initial={{ x: -10, scale: 0.9 }}
          whileHover={{ x: 0, scale: 1 }}
        >
          <div className="font-semibold mb-1 flex items-center gap-2">
            {!progress.userEmail ? (
              // 🎁 СООБЩЕНИЕ ДЛЯ НОВЫХ ПОЛЬЗОВАТЕЛЕЙ
              <>🎁 <span>Получить бонусы</span></>
            ) : (
              // 👥 СООБЩЕНИЕ ДЛЯ ПОЛЬЗОВАТЕЛЕЙ С EMAIL + 💃🕺 ТАНЕЦ ДЛЯ 200+%
              <motion.div 
                className="flex items-center gap-2"
                animate={isMaxPower ? {
                  scale: [1, 1.05, 1],
                } : {}}
                transition={{ duration: 0.5, repeat: isMaxPower ? Infinity : 0 }}
              >
                {isMaxPower ? (
                  <>
                    <motion.span
                      animate={{ 
                        rotate: [0, -10, 10, -10, 0],
                        y: [0, -2, 0, 2, 0]
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      💃
                    </motion.span>
                    <span>ТАНЕЦ ЭНЕРГИИ!</span>
                    <motion.span
                      animate={{ 
                        rotate: [0, 10, -10, 10, 0],
                        y: [0, 2, 0, -2, 0]
                      }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    >
                      🕺
                    </motion.span>
                  </>
                ) : (
                  <>👥 <span>Пригласить друзей</span></>
                )}
              </motion.div>
            )}
          </div>
          <div className="text-gray-300 text-xs">
            {isMaxPower 
              ? `МАКСИМАЛЬНАЯ МОЩНОСТЬ! 200% 🔥` 
              : isOverPlan 
              ? `Переполнение: +${Math.round(completionPercentage - 100)}% ${completionPercentage >= 180 ? '⚡' : '✨'}` 
              : `Прогресс: ${Math.round(completionPercentage)}%${isNearLimit ? ' ⚠️' : ''}`
            }
          </div>
          <div className="absolute top-1/2 right-0 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45 border-r border-b border-gray-700" />
        </motion.div>
      </motion.button>
    </motion.div>
  );
};