import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import sechenovIcon from "@/assets/sechenov-icon.png";
import { useLanguage } from "@/hooks/useLanguage";
import { useState, useEffect } from "react";

interface HeroSectionProps {
  onButtonClick?: () => void;
}

// Компонент для фич с умным ховером/тапом
const FeatureWithDetails = ({ 
  icon, 
  titleKey, 
  benefitKey, 
  mechanismKey 
}: { 
  icon: string;
  titleKey: string;
  benefitKey: string;
  mechanismKey: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useLanguage();
  
  const isTouchDevice = typeof window !== 'undefined' ? 
    ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) : false;

  const handleInteractionStart = () => {
    if (!isTouchDevice) {
      setIsHovered(true);
    }
  };

  const handleInteractionEnd = () => {
    if (!isTouchDevice) {
      setIsHovered(false);
    }
  };

  const handleClick = () => {
    if (isTouchDevice) {
      setIsExpanded(!isExpanded);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isExpanded && isTouchDevice) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isExpanded, isTouchDevice]);

  const showDetails = isExpanded || (!isTouchDevice && isHovered);
  const showIndicator = !showDetails;

  return (
    <motion.div 
      className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border-2 border-mint-200 hover:border-mint-400 transition-all duration-300 cursor-pointer group relative overflow-hidden"
      whileHover={!isTouchDevice ? { y: -4, scale: 1.02 } : {}}
      whileTap={isTouchDevice ? { scale: 0.98 } : {}}
      onHoverStart={handleInteractionStart}
      onHoverEnd={handleInteractionEnd}
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      {/* Градиентная подсветка при взаимодействии */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-mint-100/50 to-transparent opacity-0"
        animate={{ opacity: showDetails ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Анимированный бордер */}
      <motion.div
        className="absolute inset-0 rounded-xl border-2 border-transparent"
        animate={{ 
          borderColor: showDetails ? 'rgba(34, 197, 94, 0.3)' : 'transparent'
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Пульсирующий индикатор с анимацией "дыхания" */}
      {showIndicator && (
        <div className="absolute -top-2 -right-2">
          <motion.div
            className="w-4 h-4 bg-gradient-to-br from-mint-400 to-mint-600 rounded-full shadow-lg"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.8, 1, 0.8],
              boxShadow: [
                '0 0 0 0 rgba(34, 197, 94, 0.7)',
                '0 0 0 6px rgba(34, 197, 94, 0)',
                '0 0 0 0 rgba(34, 197, 94, 0)'
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
          {/* Внутренняя точка */}
          <motion.div
            className="absolute inset-0 m-auto w-1 h-1 bg-white rounded-full"
            animate={{
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </div>
      )}

      {/* Контент карточки */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <motion.div 
            className="text-2xl relative"
            animate={{ 
              scale: showDetails ? 1.15 : 1,
              rotate: showDetails ? 5 : 0
            }}
            transition={{ duration: 0.3, type: "spring" }}
          >
            {icon}
            {/* Свечение иконки */}
            <motion.div
              className="absolute inset-0 text-2xl blur-sm opacity-0"
              animate={{ opacity: showDetails ? 0.3 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {icon}
            </motion.div>
          </motion.div>
          
          <div className="flex-1">
            <motion.h4 
              className="font-semibold text-platinum-900 text-sm"
              animate={{ color: showDetails ? '#059669' : '#1f2937' }}
              transition={{ duration: 0.2 }}
            >
              {t(titleKey)}
            </motion.h4>
            <p className="text-xs text-platinum-700 mt-1 leading-relaxed">
              {t(benefitKey)}
            </p>
          </div>
          
          {/* Анимированный индикатор состояния с подсказкой */}
          <motion.div
            className="relative"
            animate={{ 
              rotate: showDetails ? 180 : 0,
              scale: showDetails ? 1.3 : 1
            }}
            transition={{ duration: 0.3, type: "spring" }}
          >
            <div className="text-mint-500 transition-colors flex-shrink-0">
              {showDetails ? "🔍" : "📖"}
            </div>
            
            {/* Микро-анимация вокруг индикатора */}
            {showIndicator && (
              <motion.div
                className="absolute inset-0 border-2 border-mint-300 rounded-full"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              />
            )}
          </motion.div>
        </div>

        {/* Плавное раскрытие механизма работы */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ 
                duration: 0.4,
                ease: "easeOut"
              }}
              className="mt-3 pt-3 border-t border-mint-100"
            >
              <motion.div 
                className="text-xs text-platinum-600 bg-white/80 rounded-lg p-3 border border-mint-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 mb-2"
                >
                  <motion.span 
                    className="text-mint-600"
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    🛠️
                  </motion.span>
                  <strong className="text-mint-700 text-sm">
                    {t('hero.howItWorks') || 'Как это работает:'}
                  </strong>
                </motion.div>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="leading-relaxed"
                >
                  {t(mechanismKey)}
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export const HeroSection = ({ onButtonClick }: HeroSectionProps) => {
  const { t } = useLanguage();

  const scrollToWaitlist = () => {
    onButtonClick?.();
    const waitlistSection = document.getElementById('waitlist');
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Фичи с раскрытием - чат в центре как главная фича
  const featuresData = [
    // Центральная фича - чат
    {
      icon: "💬",
      titleKey: "hero.features.chat",
      benefitKey: "hero.benefits.chat",
      mechanismKey: "hero.mechanism.chat",
      isMain: true
    },
    // Остальные фичи
    {
      icon: "⏰",
      titleKey: "hero.features.notifications",
      benefitKey: "hero.benefits.notifications",
      mechanismKey: "hero.mechanism.notifications"
    },
    {
      icon: "📄", 
      titleKey: "hero.features.reports",
      benefitKey: "hero.benefits.reports",
      mechanismKey: "hero.mechanism.reports"
    },
    {
      icon: "🤒",
      titleKey: "hero.features.symptoms", 
      benefitKey: "hero.benefits.symptoms",
      mechanismKey: "hero.mechanism.symptoms"
    },
    {
      icon: "💊",
      titleKey: "hero.features.therapy",
      benefitKey: "hero.benefits.therapy",
      mechanismKey: "hero.mechanism.therapy"
    },
    {
      icon: "📈",
      titleKey: "hero.features.analysis",
      benefitKey: "hero.benefits.analysis",  
      mechanismKey: "hero.mechanism.analysis"
    },
    {
      icon: "🎯",
      titleKey: "hero.features.goals",
      benefitKey: "hero.benefits.goals", 
      mechanismKey: "hero.mechanism.goals"
    }
  ];

  const mainFeature = featuresData[0]; // Чат
  const otherFeatures = featuresData.slice(1); // Остальные фичи

  return (
    <section id="hero" className="relative py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 -z-10" />

      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            {t('hero.title.line1')}<br />{t('hero.title.line2')}
            <span className="text-primary"> {t('hero.title.highlight')}</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            {t('hero.subtitle')}
          </p>

          <div className="flex justify-center mb-16">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={scrollToWaitlist}
            >
              {t('hero.ctaButton')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Сетка фич с умным ховером - чат в центре сверху */}
          <div className="max-w-4xl mx-auto mb-20">
            {/* Главная фича - чат */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="max-w-md mx-auto">
                <FeatureWithDetails
                  icon={mainFeature.icon}
                  titleKey={mainFeature.titleKey}
                  benefitKey={mainFeature.benefitKey}
                  mechanismKey={mainFeature.mechanismKey}
                />
              </div>
            </motion.div>

            {/* Остальные фичи в сетке 2x3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherFeatures.map((feature, index) => (
                <FeatureWithDetails
                  key={feature.titleKey}
                  icon={feature.icon}
                  titleKey={feature.titleKey}
                  benefitKey={feature.benefitKey}
                  mechanismKey={feature.mechanismKey}
                />
              ))}
            </div>
          </div>

          {/* Инструкция для пользователя */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-sm text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            <p>💡 <strong>{t('hero.hoverInstruction') || 'Наведите на карточки чтобы узнать, как работает каждая функция'}</strong></p>
          </motion.div>

          {/* 🔥 СЕЧЕНОВСКИЙ БЛОК С "ВЫПУСКНИК" */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-center gap-3"
          >
            <img 
              src={sechenovIcon} 
              alt="Sechenov Tech" 
              className="w-12 h-12 object-contain opacity-80"
            />
            
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg text-muted-foreground">
                {t('hero.sechenov.graduate')}
              </span>
              <a 
                href="https://sechenov.tech/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-2xl md:text-3xl font-bold text-blue-800 hover:text-blue-700 transition-colors duration-200 underline hover:no-underline"
              >
                SECHENOV TECH
              </a>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {t('hero.sechenov.program')}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};