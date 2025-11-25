import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useGlobalCounter } from "@/hooks/useGlobalCounter";
import { useProgress } from "@/hooks/useProgress";
import { ReferralPopup } from "@/components/ReferralPopup";
import { RewardsPopup } from "@/components/RewardsPopup";
import { Share2, Crown, Users, Rocket, Star, Sparkles, Zap, Trophy, Gem, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// 🔥 ВЫНЕСЕМ КОНСТАНТЫ ДЛЯ ПРОИЗВОДИТЕЛЬНОСТИ
const GLITCH_STRIPE_COUNT = 8;
const ORGANIZE_STRIPE_COUNT = 10;
const EXPAND_STRIPE_COUNT = 6;
const CELEBRATION_EMOJI_COUNT = 12;

export const WaitlistSection = () => {
  const { count } = useGlobalCounter();
  const { progress, handleOpenRewardsPopup, produceWaitlist } = useProgress();
  const [isReferralPopupOpen, setIsReferralPopupOpen] = React.useState(false);
  const [isRewardsPopupOpen, setIsRewardsPopupOpen] = React.useState(false);
  
  // 🔥 СОСТОЯНИЯ ДЛЯ АНИМАЦИИ ПЕРЕХОДА
  const [showTransition, setShowTransition] = useState(false);
  const [showNewState, setShowNewState] = useState(false);
  const [transitionPhase, setTransitionPhase] = useState<'idle' | 'glitch' | 'organize' | 'expand' | 'reveal'>('idle');

  // 🔥 МЕМОИЗАЦИЯ ОБРАБОТЧИКОВ
  const handleMainAction = useCallback(() => {
    console.log('🎯 WaitlistSection: Handling main action');
    
    if (window.ym) {
      window.ym(12345678, 'reachGoal', 'waitlist_cta_click');
      console.log('📊 Яндекс.Метрика: цель waitlist_cta_click отправлена');
    }
    
    if (window.gtag) {
      window.gtag('event', 'waitlist_click', {
        event_category: 'conversion',
        event_label: 'waitlist_section'
      });
      console.log('📊 GA4: событие waitlist_click отправлено');
    }
    
    if (!progress.userEmail) {
      console.log('🎯 WaitlistSection: Opening rewards popup for waitlist');
      setIsRewardsPopupOpen(true);
    } else {
      console.log('🎯 WaitlistSection: Opening referral popup');
      setIsReferralPopupOpen(true);
    }
  }, [progress.userEmail]);

  const handleOpenReferral = useCallback(() => {
    console.log('🎯 Opening referral popup');
    
    if (window.ym) {
      window.ym(12345678, 'reachGoal', 'referral_cta_click');
      console.log('📊 Яндекс.Метрика: цель referral_cta_click отправлена');
    }
    
    if (window.gtag) {
      window.gtag('event', 'referral_click', {
        event_category: 'engagement',
        event_label: 'founder_referral'
      });
      console.log('📊 GA4: событие referral_click отправлено');
    }
    
    setIsReferralPopupOpen(true);
  }, []);

  const handleCloseReferralPopup = useCallback(() => {
    console.log('🎯 Closing referral popup');
    setIsReferralPopupOpen(false);
  }, []);

  const handleCloseRewardsPopup = useCallback(() => {
    console.log('🎯 Closing rewards popup');
    setIsRewardsPopupOpen(false);
  }, []);

  const handleClaimRewards = useCallback(async (userData: { 
    email: string; 
    disease: string; 
    problem: string;
    notifyMethod: string;
    contactDetails: string;
    agreeTerms: boolean;
  }) => {
    console.log('🎯 WaitlistSection: данные получены от RewardsPopup', userData);
    
    try {
      await produceWaitlist(userData);
      console.log('✅ WaitlistSection: прогресс сохранен, пользователь стал основателем');
      
      setIsRewardsPopupOpen(false);
      
      setTimeout(() => {
        console.log('🔄 WaitlistSection: Auto-refreshing page to update progress...');
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('❌ WaitlistSection: ошибка сохранения прогресса', error);
    }
  }, [produceWaitlist]);

  // 🔥 УЛУЧШЕННАЯ ОБРАБОТКА WEB SHARE API
  const handleNativeShare = useCallback(async (referralLink: string) => {
    const shareData = {
      title: 'Remedia - приложение для управления здоровьем',
      text: 'Привет! Посмотри крутое приложение для управления здоровьем. Оно помогает отслеживать симптомы, принимать лекарства и консультироваться с AI-помощником!',
      url: referralLink,
    };

    try {
      if (!navigator.share) {
        throw new Error('Web Share API not supported');
      }
      
      await navigator.share(shareData);
      console.log('✅ Web Share успешен');
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('ℹ️ Пользователь отменил шеринг');
        return;
      }
      
      console.error('❌ Web Share ошибка:', error);
      // Автоматический fallback на копирование
      await navigator.clipboard.writeText(referralLink);
      console.log('📋 Автоматически скопировано в буфер');
    }
  }, []);

  // 🔥 ЗАПУСК АНИМАЦИИ ПРИ ИЗМЕНЕНИИ СОСТОЯНИЯ
  useEffect(() => {
    if (progress.waitlist && !showNewState) {
      console.log('🎬 Запуск люксового перехода!');
      startLuxuryTransition();
    }
  }, [progress.waitlist, showNewState]);

  const startLuxuryTransition = useCallback(() => {
    setShowTransition(true);
    setTransitionPhase('glitch');
    
    // 🔥 ЛЮКСОВЫЕ ТАЙМИНГИ - как у премиальных брендов
    setTimeout(() => {
      setTransitionPhase('organize');
      
      setTimeout(() => {
        setTransitionPhase('expand');
        
        setTimeout(() => {
          setTransitionPhase('reveal');
          
          setTimeout(() => {
            setShowNewState(true);
            setShowTransition(false);
            setTransitionPhase('idle');
          }, 800); // Увеличенная задержка для плавности
          
        }, 1200);
      }, 1000);
    }, 1200); // Уменьшено для лучшего UX
  }, []);

  // 🔥 ОПТИМИЗИРОВАННЫЕ КОМПОНЕНТЫ АНИМАЦИИ
  const GlitchOverlay = useMemo(() => () => (
    <motion.div
      className="fixed inset-0 z-50 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ willChange: 'opacity' }}
    >
      {[...Array(GLITCH_STRIPE_COUNT)].map((_, i) => (
        <motion.div
          key={`glitch-${i}`}
          className="absolute left-0 right-0 bg-white mix-blend-overlay"
          style={{
            height: Math.random() * 8 + 2,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.6 + 0.2,
          }}
          animate={{
            y: [0, -8, 6, -4, 3, 0],
            opacity: [0.2, 0.6, 0.1, 0.4, 0.15, 0.2],
            scaleX: [1, 1.05, 0.95, 1.03, 0.97, 1],
          }}
          transition={{
            duration: 0.4 + Math.random() * 0.3,
            repeat: Infinity,
            repeatType: "reverse",
            delay: Math.random() * 0.3,
            ease: "easeInOut"
          }}
        />
      ))}
    </motion.div>
  ), []);

  const OrganizingStripes = useMemo(() => () => (
    <motion.div
      className="fixed inset-0 z-50 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ willChange: 'opacity' }}
    >
      {[...Array(ORGANIZE_STRIPE_COUNT)].map((_, i) => (
        <motion.div
          key={`organize-${i}`}
          className="absolute left-0 right-0 mix-blend-screen"
          style={{
            height: 4 + (i % 2),
            top: `${(i / ORGANIZE_STRIPE_COUNT) * 100}%`,
            background: i % 2 === 0 
              ? "linear-gradient(to right, rgba(102, 221, 204, 0.7), rgba(102, 204, 255, 0.7))" // Мятный + биоюзовый
              : "linear-gradient(to right, rgba(212, 175, 55, 0.6), rgba(255, 215, 0, 0.6))", // Золотистый
          }}
          initial={{
            y: -80,
            opacity: 0,
            scaleX: 0,
          }}
          animate={{
            y: 0,
            opacity: [0.3, 0.7, 0.5],
            scaleX: 1,
          }}
          transition={{
            duration: 1.2, // Увеличенная длительность для плавности
            delay: i * 0.08,
            ease: [0.25, 0.46, 0.45, 0.94] // Люксовый easing
          }}
        />
      ))}
    </motion.div>
  ), []);

  const ExpandingTransition = useMemo(() => () => (
    <motion.div
      className="fixed inset-0 z-50"
      initial={{ 
        background: "linear-gradient(to bottom, rgba(102, 221, 204, 0.05), rgba(102, 204, 255, 0.05))",
        opacity: 0 
      }}
      animate={{ 
        background: [
          "linear-gradient(to bottom, rgba(102, 221, 204, 0.1), rgba(102, 204, 255, 0.1))",
          "linear-gradient(to bottom, rgba(102, 221, 204, 0.4), rgba(102, 204, 255, 0.4))",
          "linear-gradient(to bottom, rgba(16, 185, 129, 0.8), rgba(6, 182, 212, 0.8))", // Биоюзовый градиент
        ],
        opacity: 1 
      }}
      transition={{ 
        duration: 1.4,
        ease: [0.33, 1, 0.68, 1] // Супер-плавный easing
      }}
      style={{ willChange: 'background, opacity' }}
    >
      {[...Array(EXPAND_STRIPE_COUNT)].map((_, i) => (
        <motion.div
          key={`expand-${i}`}
          className="absolute inset-x-0 bg-white/15 mix-blend-overlay"
          style={{
            height: 15,
            top: `${(i / EXPAND_STRIPE_COUNT) * 100}%`,
          }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: [0, 1, 25] }}
          transition={{
            duration: 1.2,
            delay: i * 0.15,
            ease: [0.34, 1.56, 0.64, 1] // Плавное ускорение
          }}
          style={{ willChange: 'transform' }}
        />
      ))}
    </motion.div>
  ), []);

  const CelebrationEmojis = useMemo(() => () => (
    <motion.div
      className="fixed inset-0 z-50 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ willChange: 'opacity' }}
    >
      {[
        "💎", "🌟", "✨", "🎯", "🔮", "🌊", 
        "💫", "🔥", "🌈", "⚡", "💼", "🏆"
      ].slice(0, CELEBRATION_EMOJI_COUNT).map((emoji, i) => (
        <motion.div
          key={`emoji-${i}`}
          className="absolute text-2xl" // Уменьшен размер для элегантности
          style={{
            left: `${25 + Math.random() * 50}%`,
            top: `${25 + Math.random() * 50}%`,
          }}
          initial={{
            scale: 0,
            rotate: -120,
            opacity: 0,
          }}
          animate={{
            scale: [0, 1.2, 0.9, 1],
            rotate: [120, -45, 15, 0],
            opacity: [0, 0.8, 1, 1],
            y: [80, -25, 10, 0],
            x: [-30, 15, -5, 0],
          }}
          transition={{
            duration: 1.8, // Увеличенная длительность
            delay: i * 0.12,
            ease: [0.34, 1.3, 0.64, 1] // Люксовый bouncing
          }}
          style={{ willChange: 'transform, opacity' }}
        >
          {emoji}
        </motion.div>
      ))}
    </motion.div>
  ), []);

  // 🔥 АНАЛИТИКА: Отслеживание просмотра секции waitlist
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.ym && !progress.waitlist) {
        window.ym(12345678, 'reachGoal', 'waitlist_section_view');
        console.log('📊 Яндекс.Метрика: цель waitlist_section_view отправлена');
      }
      
      if (window.gtag && !progress.waitlist) {
        window.gtag('event', 'waitlist_section_view', {
          event_category: 'engagement',
          event_label: 'waitlist_impression'
        });
        console.log('📊 GA4: событие waitlist_section_view отправлено');
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [progress.waitlist]);

  // 🔥 СОСТОЯНИЕ 2: ПОЛЬЗОВАТЕЛЬ ПОДПИСАЛСЯ
  if (progress.waitlist && showNewState) {
    return (
      <>
        {/* 🔥 АНИМАЦИЯ ПЕРЕХОДА */}
        <AnimatePresence>
          {showTransition && (
            <>
              {transitionPhase === 'glitch' && <GlitchOverlay />}
              {transitionPhase === 'organize' && <OrganizingStripes />}
              {transitionPhase === 'expand' && <ExpandingTransition />}
              {transitionPhase === 'reveal' && <CelebrationEmojis />}
            </>
          )}
        </AnimatePresence>

        <motion.section 
          className="py-20 px-4 bg-gradient-to-b from-mint-25 to-bioblue-50 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 1.2, 
            ease: [0.25, 0.46, 0.45, 0.94] 
          }}
        >
          
          {/* Фоновые элементы для "основателя" - премиальная палитра */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="absolute top-10 left-10 text-6xl">💎</div>
            <div className="absolute top-20 right-20 text-5xl">🌊</div>
            <div className="absolute bottom-20 left-20 text-4xl">🔮</div>
            <div className="absolute bottom-10 right-10 text-6xl">🎯</div>
          </div>

          <div className="max-w-6xl mx-auto text-center relative z-10">
            
            {/* 🔥 ПРЕМИАЛЬНЫЙ БЕЙДЖ ОСНОВАТЕЛЯ */}
            <motion.div 
              className="inline-flex items-center gap-3 bg-gradient-to-r from-mint-500 to-bioblue-600 text-white text-sm font-semibold px-6 py-3 rounded-full mb-8 shadow-lg border border-gold-200/30"
              initial={{ scale: 0, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 15,
                delay: 0.3 
              }}
            >
              <Award className="w-4 h-4 text-gold-300" />
              <span className="tracking-wide">ОСНОВАТЕЛЬ REMEDIA</span>
              <Gem className="w-4 h-4 text-gold-300" />
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 mb-6 leading-tight"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 1.0, 
                delay: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              Добро пожаловать в{" "}
              <span className="bg-gradient-to-r from-mint-600 to-bioblue-700 bg-clip-text text-transparent">
                сообщество
              </span>
              <br />
              <span className="text-lg md:text-xl text-slate-600 font-light mt-2 block">
                создающих будущее медицины
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed font-light"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 0.9, 
                delay: 0.7,
                ease: "easeOut"
              }}
            >
              Теперь вы — часть <strong className="text-slate-800">эксклюзивного сообщества</strong>, 
              формирующего новую эру персонализированного здравоохранения.
            </motion.p>

            {/* Статистика основателя */}
            <motion.div 
              className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 0.9, 
                delay: 0.9,
                staggerChildren: 0.1
              }}
            >
              
              {/* Карточка 1: Ваш статус */}
              <motion.div 
                className="bg-white/80 backdrop-blur-sm border border-mint-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-mint-400 to-mint-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <Crown className="text-white w-5 h-5" />
                </div>
                <h3 className="font-semibold mb-3 text-slate-800">Статус Основателя</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Пожизненный доступ к эксклюзивным функциям и прямое влияние на развитие платформы
                </p>
              </motion.div>

              {/* Карточка 2: Сообщество */}
              <motion.div 
                className="bg-white/80 backdrop-blur-sm border border-bioblue-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-bioblue-400 to-bioblue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <Users className="text-white w-5 h-5" />
                </div>
                <h3 className="font-semibold mb-3 text-slate-800">Вы среди первых</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  <strong className="text-2xl text-bioblue-600">{count + 1}+</strong><br />
                  человек уже создают будущее медицины вместе с нами
                </p>
              </motion.div>

              {/* Карточка 3: Миссия */}
              <motion.div 
                className="bg-white/80 backdrop-blur-sm border border-gold-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <Rocket className="text-white w-5 h-5" />
                </div>
                <h3 className="font-semibold mb-3 text-slate-800">Ваша роль</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Вы одновременно и Проповедник, и Строитель новой системы здравоохранения
                </p>
              </motion.div>
            </motion.div>

            {/* Призыв к действию - пригласить друзей */}
            <motion.div 
              className="space-y-8 max-w-2xl mx-auto"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 0.9, 
                delay: 1.1,
                ease: "easeOut"
              }}
            >
              <div className="bg-gradient-to-r from-mint-50 to-bioblue-50 border border-mint-200 rounded-2xl p-6">
                <p className="text-sm text-mint-800 font-medium mb-3 text-center">
                  💎 Расширяйте наше сообщество основателей:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-mint-700">
                  <span><strong>{count + 1}+</strong> основателей</span>
                  <span className="text-mint-400">•</span>
                  <span><strong>7</strong> врачей и специалистов</span>
                  <span className="text-mint-400">•</span>
                  <span><strong>2</strong> медицинские организации</span>
                </div>
              </div>

              <div className="space-y-4">
                {/* 🔥 ЛЮКСОВАЯ КНОПКА ДЛЯ ОСНОВАТЕЛЕЙ */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button 
                    size="lg"
                    onClick={handleMainAction}
                    className="w-full bg-gradient-to-r from-mint-500 to-bioblue-600 hover:from-mint-600 hover:to-bioblue-700 text-white text-lg py-6 px-8 shadow-lg hover:shadow-xl transition-all duration-500 font-medium relative overflow-hidden group border border-bioblue-400/30"
                  >
                    {/* 🔥 УЛУЧШЕННАЯ АНИМАЦИЯ БЛЕСТОК */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    
                    <span className="flex items-center gap-3 relative z-10">
                      {!progress.userEmail ? (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span className="text-base tracking-wide">Стать Основателем</span>
                          <Zap className="w-5 h-5" />
                        </>
                      ) : (
                        <>
                          <Share2 className="w-5 h-5" />
                          <span className="text-base tracking-wide">Пригласить друзей</span>
                          <Trophy className="w-5 h-5" />
                        </>
                      )}
                    </span>
                  </Button>
                </motion.div>
                
                <div className="space-y-2">
                  <p className="text-sm text-slate-600 text-center font-light">
                    {!progress.userEmail 
                      ? "Присоединяйтесь к закрытой группе первых пользователей"
                      : "Помогите друзьям и близким обрести контроль над здоровьем"
                    }
                  </p>
                  <p className="text-xs text-slate-500 text-center">
                    {!progress.userEmail 
                      ? "Получите пожизненный статус основателя и влияние на развитие"
                      : "Получайте +20% к прогрессу за каждого приглашенного друга"
                    }
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Дополнительная информация для основателей */}
            <motion.div 
              className="mt-12 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
              initial={{ y: 35, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 0.9, 
                delay: 1.3,
                ease: "easeOut"
              }}
            >
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 text-left hover:shadow-md transition-all duration-500">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-slate-800">
                  <Star className="w-5 h-5 text-gold-500" />
                  Ваши привилегии
                </h3>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <Gem className="w-4 h-4 text-mint-500 mt-0.5 flex-shrink-0" />
                    <span>Пожизненный статус Foundation Member</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-bioblue-500 mt-0.5 flex-shrink-0" />
                    <span>Участие в закрытых AMA с командой</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Rocket className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                    <span>Ранний доступ ко всем новым функциям</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Crown className="w-4 h-4 text-mint-500 mt-0.5 flex-shrink-0" />
                    <span>Влияние на roadmap продукта</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 text-left hover:shadow-md transition-all duration-500">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-slate-800">
                  <Rocket className="w-5 h-5 text-bioblue-500" />
                  Что будет дальше?
                </h3>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-mint-500 font-medium mt-0.5">→</span>
                    <span><strong>Следующие 2 недели:</strong> SechenovTech Acceleration DemoDay</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-bioblue-500 font-medium mt-0.5">→</span>
                    <span><strong>Январь:</strong> Закрытый бета-тест с вашим участием</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 font-medium mt-0.5">→</span>
                    <span><strong>3 месяца:</strong> Цифровой двойник здоровья</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Финальное вдохновляющее сообщение */}
            <motion.div 
              className="mt-12 p-6 border-l-4 border-mint-400 bg-mint-50 rounded-r-2xl max-w-2xl mx-auto hover:shadow-md transition-all duration-500"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: 1.5,
                ease: "easeOut"
              }}
            >
              <p className="text-sm text-mint-800 text-center font-light leading-relaxed">
                <strong className="font-medium">Благодарим за доверие нашей миссии.</strong> Вместе мы создаем среду, 
                где управление здоровьем становится осознанным и управляемым процессом. 
                Ваш вклад — неотъемлемая часть этих изменений.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* 🔥 ОБА ПОПАПА */}
        <ReferralPopup
          isOpen={isReferralPopupOpen}
          onClose={handleCloseReferralPopup}
          referralCode="REM-FOUNDER"
          userEmail={progress.userEmail}
          onNativeShare={handleNativeShare} // Передаем улучшенный обработчик
        />

        <RewardsPopup
          isOpen={isRewardsPopupOpen}
          onClose={handleCloseRewardsPopup}
          onClaim={handleClaimRewards}
          initialMode="rewards"
        />
      </>
    );
  }

  // 🔥 СОСТОЯНИЕ 1: ПОЛЬЗОВАТЕЛЬ НЕ ПОДПИСАЛСЯ - УЛУЧШЕННАЯ ВЕРСИЯ
  if (!progress.waitlist) {
    return (
      <>
        <section id="waitlist" className="py-20 px-4 bg-gradient-to-b from-slate-50 to-mint-25 relative overflow-hidden">
          
          {/* Фоновые элементы - премиальная палитра */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute top-10 left-10 text-6xl">🧬</div>
            <div className="absolute top-20 right-20 text-5xl">💫</div>
            <div className="absolute bottom-20 left-20 text-4xl">🔮</div>
            <div className="absolute bottom-10 right-10 text-6xl">🌊</div>
          </div>

          <div className="max-w-6xl mx-auto text-center relative z-10">
            
            {/* Заголовок с акцентом на миссию */}
            <motion.div 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-bioblue-500 to-mint-600 text-white text-sm font-medium px-4 py-2 rounded-full mb-6 shadow-lg"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Rocket className="w-4 h-4" />
              <span>СТАНЬТЕ ЧАСТЬЮ ПЕРЕМЕН</span>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 mb-6 leading-tight"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
            >
              Попробовав приложение.
              <br />
              Вы <span className="bg-gradient-to-r from-bioblue-600 to-mint-700 bg-clip-text text-transparent">создаете будущее</span> здравоохранения.
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed font-light"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.4 }}
            >
              Присоединяйтесь к сообществу первых пользователей, которые помогают нам построить{" "}
              <strong className="text-slate-800">первый в мире "цифровой двойник" здоровья</strong> — 
              систему, которая учится на вашем опыте и делает медицину персонализированной для всех.
            </motion.p>

            {/* Упрощенные ценности */}
            <motion.div 
              className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.6, staggerChildren: 0.1 }}
            >
              
              {/* Ценность 1: Личная польза */}
              <motion.div 
                className="bg-white/80 backdrop-blur-sm border border-mint-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-mint-400 to-mint-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-3 text-slate-800">Польза для вас</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Начните понимать свое тело. Получайте персонализированные инсайты о том, что действительно влияет на ваше самочувствие.
                </p>
              </motion.div>

              {/* Ценность 2: Сообщество */}
              <motion.div 
                className="bg-white/80 backdrop-blur-sm border border-bioblue-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-bioblue-400 to-bioblue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-3 text-slate-800">Влияние на продукт</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Ваш голос будет услышан. Помогайте нам создавать функции, которые действительно решают ваши проблемы.
                </p>
              </motion.div>

              {/* Ценность 3: Наследие */}
              <motion.div 
                className="bg-white/80 backdrop-blur-sm border border-gold-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-3 text-slate-800">Изменение системы</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Ваш опыт поможет тысячам других людей. Вместе мы создаем медицину, которая слушает и понимает пациента.
                </p>
              </motion.div>
            </motion.div>

            {/* Social Proof + CTA */}
            <motion.div 
              className="space-y-8 max-w-2xl mx-auto"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.8 }}
            >
              <div className="bg-gradient-to-r from-mint-50 to-bioblue-50 border border-mint-200 rounded-2xl p-6">
                <p className="text-sm text-mint-800 font-medium mb-3 text-center">
                  💎 Уже формируют будущее с нами:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-mint-700">
                  <span><strong>{count}+</strong> первых пользователей</span>
                  <span className="text-mint-400">•</span>
                  <span><strong>7</strong> врачей и специалистов</span>
                  <span className="text-mint-400">•</span>
                  <span><strong>2</strong> медицинские организации</span>
                </div>
              </div>

              <div className="space-y-4">
                {/* 🔥 ЛЮКСОВАЯ КНОПКА ДЛЯ НОВЫХ ПОЛЬЗОВАТЕЛЕЙ */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button 
                    size="lg"
                    onClick={handleMainAction}
                    className="w-full bg-gradient-to-r from-bioblue-500 to-mint-600 hover:from-bioblue-600 hover:to-mint-700 text-white text-lg py-6 px-8 shadow-lg hover:shadow-xl transition-all duration-500 font-medium relative overflow-hidden group border border-mint-400/30"
                  >
                    {/* 🔥 УЛУЧШЕННАЯ АНИМАЦИЯ БЛЕСТОК */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    
                    <span className="flex items-center gap-3 relative z-10">
                      {!progress.userEmail ? (
                        <>
                          <Rocket className="w-5 h-5" />
                          <span className="text-base tracking-wide">Стать Основателем</span>
                          <Sparkles className="w-5 h-5" />
                        </>
                      ) : (
                        <>
                          <Share2 className="w-5 h-5" />
                          <span className="text-base tracking-wide">Пригласить друзей</span>
                          <Zap className="w-5 h-5" />
                        </>
                      )}
                    </span>
                  </Button>
                </motion.div>
                
                <div className="space-y-2">
                  <p className="text-sm text-slate-600 text-center font-light">
                    {!progress.userEmail 
                      ? "Присоединяйтесь к закрытой группе первых пользователей"
                      : "Помогите друзьям и близким обрести контроль над здоровьем"
                    }
                  </p>
                  <p className="text-xs text-slate-500 text-center">
                    {!progress.userEmail 
                      ? "Получите пожизненный статус основателя и влияние на развитие"
                      : "Получайте +20% к прогрессу за каждого приглашенного друга"
                    }
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Финальное сообщение о миссии */}
            <motion.div 
              className="mt-12 p-6 border-l-4 border-bioblue-400 bg-bioblue-50 rounded-r-2xl max-w-2xl mx-auto hover:shadow-md transition-all duration-500"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <p className="text-sm text-bioblue-800 text-center font-light leading-relaxed">
                <strong className="font-medium">Наша миссия:</strong> Вернуть человеку с хроническим заболеванием чувство контроля над собственной жизнью. 
                Мы начинаем с простого дневника, но строим будущее, где здоровье — это не лотерея, а осознанный выбор.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 🔥 ОБА ПОПАПА */}
        <ReferralPopup
          isOpen={isReferralPopupOpen}
          onClose={handleCloseReferralPopup}
          referralCode="REM-FOUNDER"
          userEmail={progress.userEmail}
          onNativeShare={handleNativeShare}
        />

        <RewardsPopup
          isOpen={isRewardsPopupOpen}
          onClose={handleCloseRewardsPopup}
          onClaim={handleClaimRewards}
          initialMode="rewards"
        />
      </>
    );
  }

  // 🔥 ПРОМЕЖУТОЧНОЕ СОСТОЯНИЕ - ПОКАЗЫВАЕМ ПЕРВОЕ СОСТОЯНИЕ С АНИМАЦИЕЙ
  return (
    <>
      <AnimatePresence>
        {showTransition && (
          <>
            {transitionPhase === 'glitch' && <GlitchOverlay />}
            {transitionPhase === 'organize' && <OrganizingStripes />}
            {transitionPhase === 'expand' && <ExpandingTransition />}
            {transitionPhase === 'reveal' && <CelebrationEmojis />}
          </>
        )}
      </AnimatePresence>

      {/* Показываем первое состояние во время анимации */}
      <section id="waitlist" className="py-20 px-4 bg-gradient-to-b from-slate-50 to-mint-25 relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center">
          {/* Скелетон для загрузки */}
          <div className="animate-pulse">
            <div className="h-6 w-48 bg-slate-200 rounded-full mx-auto mb-6"></div>
            <div className="h-12 bg-slate-200 rounded-lg mb-4 max-w-2xl mx-auto"></div>
            <div className="h-4 bg-slate-200 rounded mb-8 max-w-3xl mx-auto"></div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6">
                  <div className="w-12 h-12 bg-slate-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-full mb-1"></div>
                  <div className="h-3 bg-slate-200 rounded w-5/6 mx-auto"></div>
                </div>
              ))}
            </div>
            
            <div className="h-14 bg-slate-200 rounded-lg max-w-2xl mx-auto"></div>
          </div>
        </div>
      </section>
    </>
  );
};