// src/components/EasterEggs.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { 
  X, Sparkles, Heart, Zap, Users, Target, Clock, Brain, Shield, Rocket, 
  Cpu, Activity, Dna, Network, Globe, Trophy, Star, Award
} from 'lucide-react';
import { useEngagementTracker } from '../hooks/useEngagementTracker';
import { useLanguage } from '../hooks/useLanguage';

interface EasterEgg {
  id: string;
  title: string;
  content: string;
  icon: React.ReactNode;
  position: { x: number; y: number };
  trigger: 'first-scroll' | 'first-click' | 'progress-click' | 'time-delay';
  delay?: number;
  condition?: () => boolean;
  weight?: number;
  bounce?: number;
}

interface EasterEggsProps {
  progressBarClicked?: boolean;
  anyButtonClicked?: boolean;
}

const EggContent = ({ egg, onClose }: { egg: EasterEgg; onClose: () => void }) => {
  const getEggColor = (eggId: string) => {
    const colors: { [key: string]: string } = {
      'for-everyone': 'rgba(16, 185, 129, 0.8)',
      'mission-control': 'rgba(6, 182, 212, 0.8)',
      'token-economy': 'rgba(14, 165, 233, 0.8)',
      'founder-story': 'rgba(59, 130, 246, 0.8)',
      'digital-twin': 'rgba(16, 185, 129, 0.8)',
      'privacy-first': 'rgba(6, 182, 212, 0.8)',
      'patient-power': 'rgba(14, 165, 233, 0.8)',
      'ai-revolution': 'rgba(59, 130, 246, 0.8)',
      'personalized-medicine': 'rgba(16, 185, 129, 0.8)',
      'health-ecosystem': 'rgba(6, 182, 212, 0.8)'
    };
    return colors[eggId] || 'rgba(6, 182, 212, 0.8)';
  };

  return (
    <div className="relative p-6">
      <button 
        onClick={onClose}
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
      
      <p 
        className="text-gray-700 leading-relaxed text-sm"
        dangerouslySetInnerHTML={{ __html: egg.content }}
      />
      
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
  );
};

export const EasterEggs = ({ progressBarClicked = false, anyButtonClicked = false }: EasterEggsProps) => {
  const { trackEggView, trackEngagement } = useEngagementTracker();
  const { t } = useLanguage();
  const [activeEggs, setActiveEggs] = useState<Set<string>>(new Set());
  const [visibleEgg, setVisibleEgg] = useState<string | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [hasClickedProgress, setHasClickedProgress] = useState(false);
  const [viewedEggs, setViewedEggs] = useState<Set<string>>(new Set());
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);

  const eggs: EasterEgg[] = [
    {
      id: 'for-everyone',
      title: t('easterEggs.eggs.forEveryone.title'),
      content: t('easterEggs.eggs.forEveryone.content'),
      icon: <Globe className="w-5 h-5" />,
      position: { x: 50, y: 70 },
      trigger: 'first-scroll',
      condition: () => hasScrolled,
      weight: 1.0,
      bounce: 0.8
    },
    {
      id: 'mission-control',
      title: t('easterEggs.eggs.missionControl.title'),
      content: t('easterEggs.eggs.missionControl.content'),
      icon: <Target className="w-5 h-5" />,
      position: { x: 15, y: 35 },
      trigger: 'time-delay',
      delay: 15000,
      weight: 1.2,
      bounce: 0.7
    },
    {
      id: 'token-economy',
      title: t('easterEggs.eggs.tokenEconomy.title'),
      content: t('easterEggs.eggs.tokenEconomy.content'),
      icon: <Zap className="w-5 h-5" />,
      position: { x: 75, y: 65 },
      trigger: 'progress-click',
      condition: () => hasClickedProgress,
      weight: 0.8,
      bounce: 0.9
    },
    {
      id: 'founder-story',
      title: t('easterEggs.eggs.founderStory.title'),
      content: t('easterEggs.eggs.founderStory.content'),
      icon: <Rocket className="w-5 h-5" />,
      position: { x: 25, y: 75 },
      trigger: 'first-click',
      weight: 1.5,
      bounce: 0.6
    },
    {
      id: 'digital-twin',
      title: t('easterEggs.eggs.digitalTwin.title'),
      content: t('easterEggs.eggs.digitalTwin.content'),
      icon: <Brain className="w-5 h-5" />,
      position: { x: 40, y: 20 },
      trigger: 'time-delay',
      delay: 30000,
      weight: 1.1,
      bounce: 0.75
    },
    {
      id: 'privacy-first',
      title: t('easterEggs.eggs.privacyFirst.title'),
      content: t('easterEggs.eggs.privacyFirst.content'),
      icon: <Shield className="w-5 h-5" />,
      position: { x: 60, y: 50 },
      trigger: 'time-delay',
      delay: 45000,
      weight: 1.3,
      bounce: 0.65
    },
    {
      id: 'patient-power',
      title: t('easterEggs.eggs.patientPower.title'),
      content: t('easterEggs.eggs.patientPower.content'),
      icon: <Activity className="w-5 h-5" />,
      position: { x: 20, y: 15 },
      trigger: 'time-delay',
      delay: 60000,
      weight: 0.9,
      bounce: 0.85
    },
    {
      id: 'ai-revolution',
      title: t('easterEggs.eggs.aiRevolution.title'),
      content: t('easterEggs.eggs.aiRevolution.content'),
      icon: <Cpu className="w-5 h-5" />,
      position: { x: 80, y: 40 },
      trigger: 'time-delay',
      delay: 75000,
      weight: 1.4,
      bounce: 0.6
    },
    {
      id: 'personalized-medicine',
      title: t('easterEggs.eggs.personalizedMedicine.title'),
      content: t('easterEggs.eggs.personalizedMedicine.content'),
      icon: <Dna className="w-5 h-5" />,
      position: { x: 10, y: 80 },
      trigger: 'time-delay',
      delay: 90000,
      weight: 1.0,
      bounce: 0.8
    },
    {
      id: 'health-ecosystem',
      title: t('easterEggs.eggs.healthEcosystem.title'),
      content: t('easterEggs.eggs.healthEcosystem.content'),
      icon: <Network className="w-5 h-5" />,
      position: { x: 90, y: 70 },
      trigger: 'time-delay',
      delay: 105000,
      weight: 1.6,
      bounce: 0.5
    }
  ];

  const getRandomPositionWithPhysics = useCallback((egg: EasterEgg) => {
    const startY = -10;
    const startX = Math.random() * 80 + 10;
    
    const finalY = Math.min(egg.position.y + (Math.random() * 20 - 10), 85);
    
    return {
      startX,
      startY,
      finalX: startX,
      finalY,
      duration: 1.5 + (egg.weight || 1) * 0.5,
      bounce: egg.bounce || 0.7
    };
  }, []);

  useEffect(() => {
    const savedViewedEggs = sessionStorage.getItem('easterEggs_viewed');
    if (savedViewedEggs) {
      try {
        const parsed = JSON.parse(savedViewedEggs);
        setViewedEggs(new Set(parsed));
      } catch (e) {
        console.log('No saved easter eggs state');
      }
    }
  }, []);

  useEffect(() => {
    if (viewedEggs.size > 0) {
      sessionStorage.setItem('easterEggs_viewed', JSON.stringify(Array.from(viewedEggs)));
    }
  }, [viewedEggs]);

  const canActivateEgg = useCallback((eggId: string) => {
    return !viewedEggs.has(eggId);
  }, [viewedEggs]);

  useEffect(() => {
    const handleFirstScroll = () => {
      if (!hasScrolled) {
        setHasScrolled(true);
        setTimeout(() => {
          if (canActivateEgg('for-everyone')) {
            setActiveEggs(prev => new Set(prev).add('for-everyone'));
          }
        }, 1000);
      }
    };

    window.addEventListener('scroll', handleFirstScroll, { passive: true, once: true });
    return () => window.removeEventListener('scroll', handleFirstScroll);
  }, [hasScrolled, canActivateEgg]);

  useEffect(() => {
    if (progressBarClicked && !hasClickedProgress) {
      setHasClickedProgress(true);
      setTimeout(() => {
        if (canActivateEgg('token-economy')) {
          setActiveEggs(prev => new Set(prev).add('token-economy'));
        }
      }, 500);
    }
  }, [progressBarClicked, hasClickedProgress, canActivateEgg]);

  useEffect(() => {
    if (anyButtonClicked) {
      setTimeout(() => {
        if (canActivateEgg('founder-story')) {
          setActiveEggs(prev => new Set(prev).add('founder-story'));
        }
      }, 800);
    }
  }, [anyButtonClicked, canActivateEgg]);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    
    eggs.forEach(egg => {
      if (egg.trigger === 'time-delay' && !activeEggs.has(egg.id) && canActivateEgg(egg.id)) {
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
  }, [activeEggs, canActivateEgg]);

  const checkAllEggsCompleted = useCallback((newViewedEggs: Set<string>) => {
    const allEggIds = eggs.map(egg => egg.id);
    const allCompleted = allEggIds.every(id => newViewedEggs.has(id));
    
    if (allCompleted && newViewedEggs.size === allEggIds.length) {
      console.log('🎉 Все пасхалки собраны!');
      trackEngagement('all_eggs_collected', {
        total_eggs: allEggIds.length,
        session_eggs: newViewedEggs.size
      });
      setTimeout(() => {
        setShowCompletionPopup(true);
      }, 1000);
    }
  }, [eggs, trackEngagement]);

  const handleEggClick = useCallback((eggId: string) => {
    if (!activeEggs.has(eggId) && canActivateEgg(eggId)) {
      setActiveEggs(prev => new Set(prev).add(eggId));
    }
    setVisibleEgg(eggId);
    
    trackEggView(eggId);
  }, [activeEggs, canActivateEgg, trackEggView]);

  const closeEgg = useCallback((eggId: string) => {
    setVisibleEgg(null);
    
    setViewedEggs(prev => {
      const newSet = new Set(prev).add(eggId);
      checkAllEggsCompleted(newSet);
      return newSet;
    });
    
    setTimeout(() => {
      setActiveEggs(prev => {
        const newSet = new Set(prev);
        newSet.delete(eggId);
        console.log(`🎯 Removed easter egg: ${eggId} (viewed)`);
        return newSet;
      });
    }, 300);
  }, [checkAllEggsCompleted]);

  const closeCurrentEgg = useCallback(() => {
    if (visibleEgg) {
      closeEgg(visibleEgg);
    }
  }, [visibleEgg, closeEgg]);

  const handleCloseCompletionPopup = useCallback(() => {
    setShowCompletionPopup(false);
  }, []);

  const getEggColor = (eggId: string) => {
    const colors: { [key: string]: string } = {
      'for-everyone': 'rgba(16, 185, 129, 0.8)',
      'mission-control': 'rgba(6, 182, 212, 0.8)',
      'token-economy': 'rgba(14, 165, 233, 0.8)',
      'founder-story': 'rgba(59, 130, 246, 0.8)',
      'digital-twin': 'rgba(16, 185, 129, 0.8)',
      'privacy-first': 'rgba(6, 182, 212, 0.8)',
      'patient-power': 'rgba(14, 165, 233, 0.8)',
      'ai-revolution': 'rgba(59, 130, 246, 0.8)',
      'personalized-medicine': 'rgba(16, 185, 129, 0.8)',
      'health-ecosystem': 'rgba(6, 182, 212, 0.8)'
    };
    return colors[eggId] || 'rgba(6, 182, 212, 0.8)';
  };

  const getEggSize = (eggId: string) => {
    const egg = eggs.find(e => e.id === eggId);
    const baseSize = egg?.weight && egg.weight > 1.3 ? 'w-16 h-16' : 
                    egg?.weight && egg.weight < 0.9 ? 'w-10 h-10' : 'w-12 h-12';
    return baseSize;
  };

  const EggWithPhysics = ({ egg }: { egg: EasterEgg }) => {
    const physics = getRandomPositionWithPhysics(egg);
    
    return (
      <motion.button
        initial={{ 
          scale: 0, 
          opacity: 0, 
          rotate: -180,
          x: `${physics.startX}vw`,
          y: `${physics.startY}vh`
        }}
        animate={{ 
          scale: 1, 
          opacity: 1, 
          rotate: 0,
          x: `${physics.finalX}vw`,
          y: `${physics.finalY}vh`,
          transition: {
            type: "spring",
            damping: 20 - (egg.bounce || 0.7) * 15,
            stiffness: 100 + (egg.weight || 1) * 50,
            mass: egg.weight || 1,
            bounce: egg.bounce || 0.7,
            duration: physics.duration
          }
        }}
        whileHover={{ 
          scale: 1.15, 
          rotate: 5,
          y: `${physics.finalY}vh - 5px`,
          transition: { type: "spring", stiffness: 400 }
        }}
        whileTap={{ 
          scale: 0.95,
          transition: { type: "spring", stiffness: 600 }
        }}
        className={`fixed z-40 cursor-pointer group`}
        style={{
          left: 0,
          top: 0,
          transform: 'none'
        }}
        onClick={() => handleEggClick(egg.id)}
      >
        <motion.div
          className="absolute -inset-4 rounded-full opacity-70"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 2 + (egg.weight || 1) * 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: `radial-gradient(circle, ${getEggColor(egg.id)}, transparent 70%)`,
            filter: 'blur(12px)',
          }}
        />
        
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
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 via-transparent to-white/10 mix-blend-overlay" />
          
          <div className="relative z-10" style={{ color: getEggColor(egg.id).replace('0.8', '1') }}>
            {egg.icon}
          </div>

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

          <div className="absolute inset-0 rounded-2xl pointer-events-none">
            <div className="absolute left-1 top-1 w-6 h-8 bg-white/30 rounded-full blur-lg" />
            <div className="absolute right-1 top-2 w-4 h-4 bg-white/50 rounded-full blur-md" />
          </div>
        </motion.div>

        <motion.div
          className="absolute left-1/2 top-full mt-3 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 bg-gray-900/90 text-white text-xs py-2 px-3 rounded-lg whitespace-nowrap backdrop-blur-sm border border-gray-700"
          initial={{ y: -10 }}
          whileHover={{ y: 0 }}
        >
          {egg.title}
          <div className="absolute left-1/2 bottom-full transform -translate-x-1/2 w-2 h-2 bg-gray-900/90 rotate-45 border-l border-t border-gray-700" />
        </motion.div>
      </motion.button>
    );
  };

  console.log('🎯 Active easter eggs:', Array.from(activeEggs));
  console.log('👀 Viewed easter eggs:', Array.from(viewedEggs));

  return (
    <>
      {/* Кнопка для тестирования (временно) */}
      {process.env.NODE_ENV === 'development' && (
        <button 
          onClick={() => setActiveEggs(prev => new Set(prev).add('for-everyone'))}
          style={{ 
            position: 'fixed', 
            top: 10, 
            right: 10, 
            zIndex: 1000,
            background: '#06b6d4',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Тест яйцо
        </button>
      )}

      {/* Плавающие капсулки с физикой */}
      {eggs.map(egg => (
        <AnimatePresence key={egg.id}>
          {activeEggs.has(egg.id) && canActivateEgg(egg.id) && (
            <EggWithPhysics egg={egg} />
          )}
        </AnimatePresence>
      ))}

      {/* Попап с контентом яйца */}
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
                  <EggContent 
                    key={egg.id} 
                    egg={egg} 
                    onClose={() => closeEgg(egg.id)} 
                  />
                ))}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Вау-попап при сборе всех яиц */}
      <AnimatePresence>
        {showCompletionPopup && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gradient-to-br from-teal-500/20 via-cyan-500/20 to-blue-500/20 z-50 backdrop-blur-xl"
              onClick={handleCloseCompletionPopup}
            />
            
            <div className="fixed inset-0 z-50 pointer-events-none">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-cyan-400 text-xl"
                  initial={{ 
                    x: Math.random() * window.innerWidth,
                    y: -50,
                    rotate: 0,
                    scale: 0
                  }}
                  animate={{
                    y: window.innerHeight + 100,
                    rotate: 360,
                    scale: [0, 1, 0.5, 0],
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    delay: Math.random() * 0.5,
                    ease: "easeOut"
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                  }}
                >
                  {Math.random() > 0.5 ? '✨' : '💎'}
                </motion.div>
              ))}
            </div>

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ scale: 0, opacity: 0, rotateY: 180 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0, opacity: 0, rotateY: -180 }}
                transition={{ type: "spring", damping: 15, stiffness: 200 }}
                className="bg-gradient-to-br from-teal-400 via-cyan-400 to-blue-500 p-1 rounded-3xl shadow-2xl max-w-md w-full pointer-events-auto"
              >
                <div className="bg-white rounded-2xl p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/10 mix-blend-overlay" />
                  
                  <motion.div
                    className="absolute inset-0 opacity-10"
                    animate={{
                      background: [
                        'radial-gradient(circle at 20% 80%, #0d9488 0%, transparent 50%)',
                        'radial-gradient(circle at 80% 20%, #06b6d4 0%, transparent 50%)',
                        'radial-gradient(circle at 40% 40%, #3b82f6 0%, transparent 50%)',
                        'radial-gradient(circle at 20% 80%, #0d9488 0%, transparent 50%)',
                      ],
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                  />

                  <div className="relative z-10">
                    <div className="flex justify-center gap-4 mb-6">
                      <motion.div
                        initial={{ scale: 0, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ delay: 0.2, type: "spring" }}
                      >
                        <Trophy className="w-16 h-16 text-teal-500" fill="currentColor" />
                      </motion.div>
                      <motion.div
                        initial={{ scale: 0, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ delay: 0.4, type: "spring" }}
                      >
                        <Award className="w-16 h-16 text-cyan-500" fill="currentColor" />
                      </motion.div>
                      <motion.div
                        initial={{ scale: 0, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ delay: 0.6, type: "spring" }}
                      >
                        <Star className="w-16 h-16 text-blue-500" fill="currentColor" />
                      </motion.div>
                    </div>

                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-4"
                    >
                      {t('easterEggs.completion.title')}
                    </motion.h3>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0 }}
                      className="text-gray-700 text-lg leading-relaxed mb-6"
                      dangerouslySetInnerHTML={{ __html: t('easterEggs.completion.description') }}
                    />

                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.2 }}
                      className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4 border-2 border-teal-200/50 mb-6"
                    >
                      <p className="text-sm text-teal-800 font-medium">
                        {t('easterEggs.completion.ps')}
                      </p>
                    </motion.div>

                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4 }}
                      onClick={handleCloseCompletionPopup}
                      className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      {t('easterEggs.completion.continueButton')}
                    </motion.button>
                  </div>

                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-cyan-400"
                        animate={{
                          y: [0, -30, 0],
                          x: [0, Math.sin(i) * 20, 0],
                          rotate: [0, 180, 360],
                          scale: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 3 + i,
                          repeat: Infinity,
                          delay: i * 0.5,
                        }}
                        style={{
                          left: `${20 + i * 10}%`,
                          top: `${10 + (i % 3) * 30}%`,
                        }}
                      >
                        {i % 2 === 0 ? '✦' : '❖'}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};