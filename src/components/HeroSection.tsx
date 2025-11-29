import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import sechenovIcon from "@/assets/sechenov-icon.png";
import { useLanguage } from "@/hooks/useLanguage";
import { useState, useEffect } from "react";

interface HeroSectionProps {
  onButtonClick?: () => void;
}

// Компонент для фич с умным ховером
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
  const [detailLevel, setDetailLevel] = useState(0);
  const { t } = useLanguage();
  
  // Определяем тип устройства
  const isTouchDevice = typeof window !== 'undefined' ? 
    ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) : false;
  
  const interactionDelay = isTouchDevice ? 0 : 500;

  // Умная логика раскрытия на ховер
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isHovered) {
      timer = setTimeout(() => {
        setIsExpanded(true);
        setDetailLevel(1);
        
        if (!isTouchDevice) {
          setTimeout(() => setDetailLevel(2), 800);
        }
      }, interactionDelay);
    } else {
      setIsExpanded(false);
      setDetailLevel(0);
    }
    
    return () => clearTimeout(timer);
  }, [isHovered, interactionDelay, isTouchDevice]);

  const handleClick = () => {
    if (isTouchDevice) {
      setIsExpanded(!isExpanded);
      setDetailLevel(isExpanded ? 0 : 2);
    }
  };

  return (
    <motion.div 
      className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-mint-200 hover:border-mint-300 transition-all cursor-pointer group relative"
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => !isTouchDevice && setIsHovered(true)}
      onHoverEnd={() => !isTouchDevice && setIsHovered(false)}
      onTouchStart={() => isTouchDevice && setIsHovered(true)}
      onTouchEnd={() => isTouchDevice && setTimeout(() => setIsHovered(false), 150)}
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      {/* Микро-анимация "приглашения" */}
      {!isHovered && !isExpanded && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-mint-400 rounded-full opacity-70"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      )}

      {/* Заголовок с умным индикатором */}
      <div className="flex items-center gap-3">
        <motion.div 
          className="text-2xl"
          animate={{ 
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? 5 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          {icon}
        </motion.div>
        
        <div className="flex-1">
          <h4 className="font-semibold text-platinum-900 text-sm">
            {t(titleKey)}
          </h4>
          <p className="text-xs text-platinum-700 mt-1 leading-relaxed">
            {t(benefitKey)}
          </p>
        </div>
        
        {/* Умный индикатор состояния */}
        <motion.div
          animate={{ 
            rotate: isExpanded ? 180 : 0,
            scale: isHovered ? 1.2 : 1
          }}
          className="text-mint-500 transition-colors flex-shrink-0"
          transition={{ duration: 0.3 }}
        >
          {isHovered || isExpanded ? "🔍" : "📖"}
        </motion.div>
      </div>

      {/* Плавное раскрытие механизма работы */}
      <AnimatePresence>
        {isExpanded && (
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
              className="text-xs text-platinum-600 bg-mint-50 rounded-lg p-3"
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
                <span className="text-mint-600">🛠️</span>
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

              {/* Индикатор прогресса чтения для десктопа */}
              {!isTouchDevice && detailLevel > 0 && (
                <motion.div 
                  className="flex gap-1 mt-2 justify-end"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {[1, 2].map((level) => (
                    <motion.div
                      key={level}
                      className={`w-1.5 h-1.5 rounded-full ${
                        detailLevel >= level ? 'bg-mint-500' : 'bg-mint-200'
                      }`}
                      animate={{
                        scale: detailLevel >= level ? 1.2 : 1
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Подсказка для пользователя */}
      {!isTouchDevice && !isExpanded && (
        <motion.div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          initial={{ y: 5 }}
          animate={{ y: 0 }}
        >
          <div className="bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
            {t('hero.hoverHint') || 'Наведите для деталей'}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
          </div>
        </motion.div>
      )}
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