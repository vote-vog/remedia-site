import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useGlobalCounter } from "@/hooks/useGlobalCounter";
import { useProgress } from "@/hooks/useProgress";
import { ReferralPopup } from "@/components/ReferralPopup";
import { RewardsPopup } from "@/components/RewardsPopup";
import { Share2, Crown, Users, Rocket, Star, Sparkles, Zap, Trophy, Gem, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";

export const WaitlistSection = () => {
  const { count } = useGlobalCounter();
  const { progress, handleOpenRewardsPopup, produceWaitlist } = useProgress();
  const [isReferralPopupOpen, setIsReferralPopupOpen] = React.useState(false);
  const [isRewardsPopupOpen, setIsRewardsPopupOpen] = React.useState(false);
  const { t } = useLanguage();
  
  // 🔥 УПРОЩЕННЫЕ СОСТОЯНИЯ ДЛЯ АНИМАЦИИ
  const [showTransition, setShowTransition] = useState(false);
  const [showNewState, setShowNewState] = useState(false);

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
      
      // 🔥 ЗАПУСКАЕМ КРАСИВУЮ АНИМАЦИЮ ПЕРЕХОДА
      startBeautifulTransition();
      
    } catch (error) {
      console.error('❌ WaitlistSection: ошибка сохранения прогресса', error);
    }
  }, [produceWaitlist]);

  // 🔥 УЛУЧШЕННАЯ ОБРАБОТКА WEB SHARE API
  const handleNativeShare = useCallback(async (referralLink: string) => {
    const shareData = {
      title: t('waitlist.share.title'),
      text: t('waitlist.share.text'),
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
  }, [t]);

  // 🔥 КРАСИВАЯ АНИМАЦИЯ ПЕРЕХОДА С ПАЛИТРОЙ БРЕНДА
  const startBeautifulTransition = useCallback(() => {
    console.log('🎬 Запуск красивой анимации перехода!');
    setShowTransition(true);
    
    // Показываем анимацию 2.5 секунды, затем переключаем состояние
    setTimeout(() => {
      setShowNewState(true);
      setTimeout(() => setShowTransition(false), 500);
    }, 2500);
  }, []);

  // 🔥 АНИМАЦИЯ ВОЛНЫ - брендовая палитра
  const WaveTransition = useMemo(() => () => (
    <motion.div
      className="fixed inset-0 z-50 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Многослойный градиентный фон в палитре бренда */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-mint-200/40 via-teal-300/30 to-blue-400/20 dark:from-[#004243]/40 dark:via-teal-500/20 dark:to-blue-600/20"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      
      {/* Главная волна - мятный цвет */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-mint-400/50 to-transparent dark:from-[#54F5DF]/50 dark:to-transparent"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ 
          scaleY: [0, 1.5, 1.2],
          opacity: [0, 0.9, 0.3]
        }}
        transition={{ 
          duration: 2,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      />
      
      {/* Вторичная волна - бирюзовый цвет */}
      <motion.div
        className="absolute bottom-10 left-0 right-0 h-32 bg-gradient-to-t from-teal-400/30 to-transparent dark:from-teal-500/30 dark:to-transparent"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ 
          scaleY: [0, 1.8, 1.4],
          opacity: [0, 0.6, 0.2]
        }}
        transition={{ 
          duration: 2.2,
          delay: 0.3,
          ease: "easeOut"
        }}
      />
      
      {/* Плавающие символы статуса */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`symbol-${i}`}
          className="absolute text-2xl"
          style={{
            left: `${5 + Math.random() * 90}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          initial={{
            scale: 0,
            y: 100,
            opacity: 0,
            rotate: -45,
          }}
          animate={{
            scale: [0, 1.4, 1],
            y: [100, -20, -80],
            opacity: [0, 0.9, 0.6, 0],
            rotate: [-45, 0, 45],
          }}
          transition={{
            duration: 2.5,
            delay: i * 0.15,
            ease: "easeOut"
          }}
        >
          {i % 4 === 0 ? "👑" : i % 4 === 1 ? "💎" : i % 4 === 2 ? "✨" : "🌟"}
        </motion.div>
      ))}
      
      {/* Текст подтверждения */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.2, opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <motion.div
          className="text-4xl mb-4"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, delay: 1 }}
        >
          🎉
        </motion.div>
        <motion.h3 
          className="text-2xl font-bold text-white bg-black/30 backdrop-blur-sm px-6 py-3 rounded-2xl dark:bg-[#004243]/80 dark:text-[#54F5DF]"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {t('waitlist.transition.welcome')}
        </motion.h3>
      </motion.div>
    </motion.div>
  ), [t]);

  // 🔥 АНИМАЦИЯ ПОЯВЛЕНИЯ КОНТЕНТА - брендовая палитра
  const ContentReveal = useMemo(() => () => (
    <motion.div
      className="fixed inset-0 z-40 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Центральный энергетический шар в палитре бренда */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-r from-mint-400/40 to-teal-500/40 blur-2xl dark:from-[#54F5DF]/30 dark:to-teal-600/40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [0, 2.5, 3],
          opacity: [0, 0.8, 0]
        }}
        transition={{ 
          duration: 1.5,
          ease: "easeOut"
        }}
      />
      
      {/* Концентрические круги */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`pulse-${i}`}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-mint-300/30 rounded-full dark:border-[#54F5DF]/20"
          style={{
            width: 80 + i * 100,
            height: 80 + i * 100,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1,
            opacity: [0, 0.3, 0]
          }}
          transition={{ 
            duration: 2,
            delay: i * 0.25,
            ease: "easeOut"
        }}
      />
    ))}
  </motion.div>
), []);

  // 🔥 ЗАПУСК АНИМАЦИИ ПРИ ИЗМЕНЕНИИ СОСТОЯНИЯ
  useEffect(() => {
    if (progress.waitlist && !showNewState) {
      console.log('🎬 Запуск анимации перехода в состояние основателя!');
      startBeautifulTransition();
    }
  }, [progress.waitlist, showNewState, startBeautifulTransition]);

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

  // 🔥 СОСТОЯНИЕ 2: ПОЛЬЗОВАТЕЛЬ ПОДПИСАЛСЯ - брендовый дизайн
  if (progress.waitlist && showNewState) {
    return (
      <>
        {/* 🔥 КРАСИВАЯ АНИМАЦИЯ ПЕРЕХОДА */}
        <AnimatePresence mode="wait">
          {showTransition && (
            <>
              <WaveTransition />
              <ContentReveal />
            </>
          )}
        </AnimatePresence>

        <motion.section 
          className="py-20 px-4 bg-gradient-to-br from-mint-25 via-white to-teal-50 dark:from-[#004243] dark:via-[#003334] dark:to-teal-900 relative overflow-hidden min-h-screen"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 1.2,
            delay: showTransition ? 2.0 : 0,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          
          {/* 🔥 ПРЕМИАЛЬНЫЙ ФОН ДЛЯ ОСНОВАТЕЛЕЙ */}
          <div className="absolute inset-0 opacity-10 dark:opacity-5">
            <div className="absolute top-1/4 left-1/4 text-8xl">👑</div>
            <div className="absolute top-1/3 right-1/4 text-7xl">💎</div>
            <div className="absolute bottom-1/4 left-1/3 text-6xl">✨</div>
            <div className="absolute bottom-1/3 right-1/3 text-7xl">🌟</div>
          </div>

          {/* Светящиеся акцентные элементы */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-mint-200/20 dark:bg-[#54F5DF]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-300/15 dark:bg-teal-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

          <div className="max-w-6xl mx-auto text-center relative z-10">
            
            {/* 🔥 ЭЛЕГАНТНЫЙ БЕЙДЖ ОСНОВАТЕЛЯ */}
            <motion.div 
              className="inline-flex items-center gap-4 bg-gradient-to-r from-mint-500/90 to-teal-600/90 dark:from-[#54F5DF] dark:to-teal-500 text-white dark:text-[#004243] text-sm font-semibold px-8 py-4 rounded-2xl mb-12 shadow-2xl border border-mint-300/40 dark:border-[#54F5DF]/60 backdrop-blur-sm"
              initial={{ scale: 0, y: -30, opacity: 0, rotateX: 90 }}
              animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 15,
                delay: showTransition ? 2.3 : 0.4 
              }}
            >
              <Award className="w-5 h-5 text-mint-100 dark:text-[#004243]" />
              <span className="tracking-widest text-mint-50 dark:text-[#004243] font-bold">
                {t('waitlist.founder.badge')}
              </span>
              <Gem className="w-5 h-5 text-mint-100 dark:text-[#004243]" />
            </motion.div>

            {/* 🔥 ГЛАВНЫЙ ЗАГОЛОВОК С АНИМАЦИЕЙ */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 1.0, 
                delay: showTransition ? 2.5 : 0.6,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-800 dark:text-white mb-6 leading-tight">
                {t('waitlist.founder.title.line1')}{" "}
                <span className="bg-gradient-to-r from-mint-600 to-teal-700 dark:from-[#54F5DF] dark:to-teal-400 bg-clip-text text-transparent">
                  {t('waitlist.founder.title.highlight')}
                </span>
              </h1>
              <motion.span 
                className="text-xl md:text-2xl text-slate-600 dark:text-teal-200 font-light block mt-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: showTransition ? 2.7 : 0.8 }}
              >
                {t('waitlist.founder.subtitle')}
              </motion.span>
            </motion.div>
            
            <motion.p 
              className="text-xl md:text-2xl text-slate-600 dark:text-teal-100 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 0.9, 
                delay: showTransition ? 2.8 : 1.0,
                ease: "easeOut"
              }}
            >
              {t('waitlist.founder.description')}
            </motion.p>

            {/* 🔥 УЛУЧШЕННЫЕ КАРТОЧКИ СТАТИСТИКИ */}
            <motion.div 
              className="grid md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 0.9, 
                delay: showTransition ? 3.0 : 1.2,
                staggerChildren: 0.15
              }}
            >
              
              {/* Карточка 1: Статус с анимацией */}
              <motion.div 
                className="bg-white/90 dark:bg-[#004243]/90 backdrop-blur-md border border-mint-200/80 dark:border-[#54F5DF]/30 rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group"
                whileHover={{ scale: 1.03 }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-mint-400 to-mint-600 dark:from-[#54F5DF] dark:to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-500">
                  <Crown className="text-white dark:text-[#004243] w-7 h-7" />
                </div>
                <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">
                  {t('waitlist.founder.cards.status.title')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-teal-200 leading-relaxed">
                  {t('waitlist.founder.cards.status.description')}
                </p>
              </motion.div>

              {/* Карточка 2: Сообщество с анимацией */}
              <motion.div 
                className="bg-white/90 dark:bg-[#004243]/90 backdrop-blur-md border border-teal-200/80 dark:border-teal-400/30 rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group"
                whileHover={{ scale: 1.03 }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 dark:from-teal-400 dark:to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-500">
                  <Users className="text-white dark:text-[#004243] w-7 h-7" />
                </div>
                <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">
                  {t('waitlist.founder.cards.community.title')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-teal-200 leading-relaxed">
                  <motion.strong 
                    className="text-3xl text-teal-600 dark:text-[#54F5DF] block mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: showTransition ? 3.2 : 1.4 }}
                  >
                    {count + 1}+
                  </motion.strong>
                  {t('waitlist.founder.cards.community.description')}
                </p>
              </motion.div>

              {/* Карточка 3: Миссия с анимацией */}
              <motion.div 
                className="bg-white/90 dark:bg-[#004243]/90 backdrop-blur-md border border-blue-200/80 dark:border-blue-400/30 rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group"
                whileHover={{ scale: 1.03 }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-500">
                  <Rocket className="text-white dark:text-[#004243] w-7 h-7" />
                </div>
                <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">
                  {t('waitlist.founder.cards.mission.title')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-teal-200 leading-relaxed">
                  {t('waitlist.founder.cards.mission.description')}
                </p>
              </motion.div>
            </motion.div>

            {/* 🔥 ПРИЗЫВ К ДЕЙСТВИЮ С УЛУЧШЕННОЙ АНИМАЦИЕЙ */}
            <motion.div 
              className="space-y-8 max-w-2xl mx-auto"
              initial={{ y: 35, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 0.9, 
                delay: showTransition ? 3.3 : 1.6,
                ease: "easeOut"
              }}
            >
              <motion.div 
                className="bg-gradient-to-r from-mint-50/80 to-teal-50/80 dark:from-[#54F5DF]/10 dark:to-teal-500/10 border border-mint-200 dark:border-[#54F5DF]/30 rounded-2xl p-6 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-sm text-mint-800 dark:text-[#54F5DF] font-medium mb-3 text-center">
                  {t('waitlist.founder.expandCommunity')}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-mint-700 dark:text-teal-300">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: showTransition ? 3.4 : 1.7 }}
                  >
                    <strong>{count + 1}+</strong> {t('waitlist.founder.foundersCount')}
                  </motion.span>
                  <span className="text-mint-400 dark:text-teal-500">•</span>
                  <span><strong>7</strong> {t('waitlist.founder.doctorsCount')}</span>
                  <span className="text-mint-400 dark:text-teal-500">•</span>
                  <span><strong>2</strong> {t('waitlist.founder.organizationsCount')}</span>
                </div>
              </motion.div>

              <div className="space-y-4">
                {/* 🔥 ЛЮКСОВАЯ АНИМИРОВАННАЯ КНОПКА */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: showTransition ? 3.5 : 1.8 }}
                >
                  <Button 
                    size="lg"
                    onClick={handleMainAction}
                    className="w-full bg-gradient-to-r from-mint-500 to-teal-600 hover:from-mint-600 hover:to-teal-700 dark:from-[#54F5DF] dark:to-teal-500 dark:hover:from-[#54F5DF] dark:hover:to-teal-400 text-white dark:text-[#004243] text-lg py-7 px-8 shadow-xl hover:shadow-2xl transition-all duration-500 font-semibold relative overflow-hidden group border-0"
                  >
                    {/* Анимация блесток */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    
                    {/* Светящийся эффект */}
                    <div className="absolute inset-0 bg-gradient-to-r from-mint-400/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 dark:from-[#54F5DF]/30 dark:to-teal-400/30" />
                    
                    <span className="flex items-center gap-3 relative z-10">
                      {!progress.userEmail ? (
                        <>
                          <Sparkles className="w-6 h-6" />
                          <span className="text-base tracking-wider">
                            {t('waitlist.founder.cta.try')}
                          </span>
                          <Zap className="w-6 h-6" />
                        </>
                      ) : (
                        <>
                          <Share2 className="w-6 h-6" />
                          <span className="text-base tracking-wider">
                            {t('waitlist.founder.cta.invite')}
                          </span>
                          <Trophy className="w-6 h-6" />
                        </>
                      )}
                    </span>
                  </Button>
                </motion.div>
                
                <motion.div 
                  className="space-y-2"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: showTransition ? 3.6 : 2.0 }}
                >
                  <p className="text-sm text-slate-600 dark:text-teal-200 text-center font-light">
                    {!progress.userEmail 
                      ? t('waitlist.founder.cta.subtitle.join')
                      : t('waitlist.founder.cta.subtitle.invite')
                    }
                  </p>
                  <p className="text-xs text-slate-500 dark:text-teal-300 text-center">
                    {!progress.userEmail 
                      ? t('waitlist.founder.cta.note.join')
                      : t('waitlist.founder.cta.note.invite')
                    }
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* 🔥 УЛУЧШЕННЫЕ БЛОКИ ДОПОЛНИТЕЛЬНОЙ ИНФОРМАЦИИ */}
            <motion.div 
              className="mt-16 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 0.9, 
                delay: showTransition ? 3.8 : 2.2,
                ease: "easeOut"
              }}
            >
              <motion.div 
                className="bg-white/90 dark:bg-[#004243]/90 backdrop-blur-md border border-slate-200 dark:border-teal-400/20 rounded-3xl p-8 text-left hover:shadow-xl transition-all duration-500 group"
                whileHover={{ y: -5 }}
              >
                <h3 className="font-bold text-xl mb-4 flex items-center gap-3 text-slate-800 dark:text-white">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                  >
                    <Star className="w-6 h-6 text-mint-500 dark:text-[#54F5DF]" />
                  </motion.div>
                  {t('waitlist.founder.privileges.title')}
                </h3>
                <ul className="text-sm text-slate-600 dark:text-teal-200 space-y-3">
                  {[
                    { icon: Gem, text: t('waitlist.founder.privileges.items.0'), color: "text-mint-500 dark:text-[#54F5DF]" },
                    { icon: Zap, text: t('waitlist.founder.privileges.items.1'), color: "text-teal-500 dark:text-teal-400" },
                    { icon: Rocket, text: t('waitlist.founder.privileges.items.2'), color: "text-blue-500 dark:text-blue-400" },
                    { icon: Crown, text: t('waitlist.founder.privileges.items.3'), color: "text-mint-500 dark:text-[#54F5DF]" }
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-start gap-3 group-hover:translate-x-1 transition-transform duration-300"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: showTransition ? 4.0 + index * 0.1 : 2.4 + index * 0.1 }}
                    >
                      <item.icon className={`w-5 h-5 ${item.color} mt-0.5 flex-shrink-0`} />
                      <span>{item.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div 
                className="bg-white/90 dark:bg-[#004243]/90 backdrop-blur-md border border-slate-200 dark:border-teal-400/20 rounded-3xl p-8 text-left hover:shadow-xl transition-all duration-500 group"
                whileHover={{ y: -5 }}
              >
                <h3 className="font-bold text-xl mb-4 flex items-center gap-3 text-slate-800 dark:text-white">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Rocket className="w-6 h-6 text-teal-500 dark:text-teal-400" />
                  </motion.div>
                  {t('waitlist.founder.timeline.title')}
                </h3>
                <ul className="text-sm text-slate-600 dark:text-teal-200 space-y-3">
                  {[
                    { marker: "→", text: t('waitlist.founder.timeline.items.0'), color: "text-mint-500 dark:text-[#54F5DF]" },
                    { marker: "→", text: t('waitlist.founder.timeline.items.1'), color: "text-teal-500 dark:text-teal-400" },
                    { marker: "→", text: t('waitlist.founder.timeline.items.2'), color: "text-blue-500 dark:text-blue-400" }
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-start gap-3 group-hover:translate-x-1 transition-transform duration-300"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: showTransition ? 4.2 + index * 0.1 : 2.6 + index * 0.1 }}
                    >
                      <span className={`font-semibold mt-0.5 flex-shrink-0 ${item.color}`}>{item.marker}</span>
                      <span>{item.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>

            {/* 🔥 ФИНАЛЬНОЕ ВДОХНОВЛЯЮЩЕЕ СООБЩЕНИЕ С АНИМАЦИЕЙ */}
            <motion.div 
              className="mt-16 p-8 border-l-4 border-mint-400 dark:border-[#54F5DF] bg-gradient-to-r from-mint-50/80 to-transparent dark:from-[#54F5DF]/10 dark:to-transparent rounded-2xl max-w-2xl mx-auto hover:shadow-lg transition-all duration-500 group"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: showTransition ? 4.5 : 3.0,
                ease: "easeOut"
              }}
              whileHover={{ scale: 1.02 }}
            >
              <motion.p 
                className="text-sm text-mint-800 dark:text-[#54F5DF] text-center font-light leading-relaxed"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: showTransition ? 4.7 : 3.2 }}
              >
                {t('waitlist.founder.finalMessage')}
              </motion.p>
            </motion.div>
          </div>
        </motion.section>

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

  // 🔥 СОСТОЯНИЕ 1: ПОЛЬЗОВАТЕЛЬ НЕ ПОДПИСАЛСЯ - брендовый дизайн
  return (
    <>
      <section id="waitlist" className="py-20 px-4 bg-gradient-to-b from-slate-50 to-mint-25 dark:from-[#004243] dark:to-teal-900 relative overflow-hidden">
        
        {/* Фоновые элементы - брендовая палитра */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-5">
          <div className="absolute top-10 left-10 text-6xl">🧬</div>
          <div className="absolute top-20 right-20 text-5xl">💫</div>
          <div className="absolute bottom-20 left-20 text-4xl">🔮</div>
          <div className="absolute bottom-10 right-10 text-6xl">🌊</div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          
          {/* Заголовок с акцентом на миссию */}
          <motion.div 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-mint-600 dark:from-[#54F5DF] dark:to-teal-400 text-white dark:text-[#004243] text-sm font-medium px-4 py-2 rounded-full mb-6 shadow-lg"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Rocket className="w-4 h-4" />
            <span>{t('waitlist.initial.badge')}</span>
          </motion.div>

          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 dark:text-white mb-6 leading-tight"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            {t('waitlist.initial.title.line1')}
            <br />
            {t('waitlist.initial.title.line2')}{" "}
            <span className="bg-gradient-to-r from-teal-600 to-mint-700 dark:from-[#54F5DF] dark:to-teal-400 bg-clip-text text-transparent">
              {t('waitlist.initial.title.highlight')}
            </span>{" "}
            {t('waitlist.initial.title.line3')}
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-slate-600 dark:text-teal-200 mb-8 max-w-3xl mx-auto leading-relaxed font-light"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.4 }}
          >
            {t('waitlist.initial.description')}
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
              className="bg-white/80 dark:bg-[#004243]/80 backdrop-blur-sm border border-mint-200 dark:border-[#54F5DF]/30 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-mint-400 to-mint-600 dark:from-[#54F5DF] dark:to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Sparkles className="w-6 h-6 text-white dark:text-[#004243]" />
              </div>
              <h3 className="font-semibold mb-3 text-slate-800 dark:text-white">
                {t('waitlist.initial.values.personal.title')}
              </h3>
              <p className="text-sm text-slate-600 dark:text-teal-200 leading-relaxed">
                {t('waitlist.initial.values.personal.description')}
              </p>
            </motion.div>

            {/* Ценность 2: Сообщество */}
            <motion.div 
              className="bg-white/80 dark:bg-[#004243]/80 backdrop-blur-sm border border-teal-200 dark:border-teal-400/30 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 dark:from-teal-400 dark:to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Users className="w-6 h-6 text-white dark:text-[#004243]" />
              </div>
              <h3 className="font-semibold mb-3 text-slate-800 dark:text-white">
                {t('waitlist.initial.values.community.title')}
              </h3>
              <p className="text-sm text-slate-600 dark:text-teal-200 leading-relaxed">
                {t('waitlist.initial.values.community.description')}
              </p>
            </motion.div>

            {/* Ценность 3: Наследие */}
            <motion.div 
              className="bg-white/80 dark:bg-[#004243]/80 backdrop-blur-sm border border-blue-200 dark:border-blue-400/30 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Trophy className="w-6 h-6 text-white dark:text-[#004243]" />
              </div>
              <h3 className="font-semibold mb-3 text-slate-800 dark:text-white">
                {t('waitlist.initial.values.legacy.title')}
              </h3>
              <p className="text-sm text-slate-600 dark:text-teal-200 leading-relaxed">
                {t('waitlist.initial.values.legacy.description')}
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
            <div className="bg-gradient-to-r from-mint-50 to-teal-50 dark:from-[#54F5DF]/10 dark:to-teal-500/10 border border-mint-200 dark:border-[#54F5DF]/30 rounded-2xl p-6">
              <p className="text-sm text-mint-800 dark:text-[#54F5DF] font-medium mb-3 text-center">
                {t('waitlist.initial.socialProof.title')}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-mint-700 dark:text-teal-300">
                <span><strong>{count}+</strong> {t('waitlist.initial.socialProof.users')}</span>
                <span className="text-mint-400 dark:text-teal-500">•</span>
                <span><strong>7</strong> {t('waitlist.initial.socialProof.doctors')}</span>
                <span className="text-mint-400 dark:text-teal-500">•</span>
                <span><strong>2</strong> {t('waitlist.initial.socialProof.organizations')}</span>
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
                  className="w-full bg-gradient-to-r from-teal-500 to-mint-600 hover:from-teal-600 hover:to-mint-700 dark:from-[#54F5DF] dark:to-teal-500 dark:hover:from-[#54F5DF] dark:hover:to-teal-400 text-white dark:text-[#004243] text-lg py-6 px-8 shadow-lg hover:shadow-xl transition-all duration-500 font-medium relative overflow-hidden group border border-mint-400/30 dark:border-[#54F5DF]/50"
                >
                  {/* 🔥 УЛУЧШЕННАЯ АНИМАЦИЯ БЛЕСТОК */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  
                  <span className="flex items-center gap-3 relative z-10">
                    {!progress.userEmail ? (
                      <>
                        <Rocket className="w-5 h-5" />
                        <span className="text-base tracking-wide">
                          {t('waitlist.initial.cta.becomeFounder')}
                        </span>
                        <Sparkles className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        <Share2 className="w-5 h-5" />
                        <span className="text-base tracking-wide">
                          {t('waitlist.initial.cta.inviteFriends')}
                        </span>
                        <Zap className="w-5 h-5" />
                      </>
                    )}
                  </span>
                </Button>
              </motion.div>
              
              <div className="space-y-2">
                <p className="text-sm text-slate-600 dark:text-teal-200 text-center font-light">
                  {!progress.userEmail 
                    ? t('waitlist.initial.cta.subtitle.join')
                    : t('waitlist.initial.cta.subtitle.invite')
                  }
                </p>
                <p className="text-xs text-slate-500 dark:text-teal-300 text-center">
                  {!progress.userEmail 
                    ? t('waitlist.initial.cta.note.join')
                    : t('waitlist.initial.cta.note.invite')
                  }
                </p>
              </div>
            </div>
          </motion.div>

          {/* Финальное сообщение о миссии */}
          <motion.div 
            className="mt-12 p-6 border-l-4 border-teal-400 dark:border-[#54F5DF] bg-teal-50 dark:bg-[#54F5DF]/10 rounded-r-2xl max-w-2xl mx-auto hover:shadow-md transition-all duration-500"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <p className="text-sm text-teal-800 dark:text-[#54F5DF] text-center font-light leading-relaxed">
              <strong className="font-medium">{t('waitlist.initial.mission.title')}</strong>{" "}
              {t('waitlist.initial.mission.description')}
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
};