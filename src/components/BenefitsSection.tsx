import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useSafeHTML } from "@/hooks/useSafeHTML";
import { useState, useEffect } from "react";

const benefitsData = [
  {
    icon: "🔍",
    titleKey: "benefits.items.0.title",
    descriptionKey: "benefits.items.0.description",
    hoverKey: "0"
  },
  {
    icon: "🧘",
    titleKey: "benefits.items.1.title", 
    descriptionKey: "benefits.items.1.description",
    hoverKey: "1"
  },
  {
    icon: "🤝",
    titleKey: "benefits.items.2.title",
    descriptionKey: "benefits.items.2.description",
    hoverKey: "2"
  }
];

interface HoverItem {
  icon: string;
  title: string;
  description: string;
}

interface InteractiveBenefitCardProps {
  icon: string;
  titleKey: string;
  descriptionKey: string;
  hoverKey: string;
  index: number;
}

const InteractiveBenefitCard = ({ 
  icon, 
  titleKey, 
  descriptionKey,
  hoverKey,
  index 
}: InteractiveBenefitCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useLanguage();

  const isTouchDevice = typeof window !== 'undefined' ? 
    ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) : false;

  // Получаем данные для ховера через отдельные ключи
  const hoverTitle = t(`benefits.hoverDetails.${hoverKey}.title`);
  const hoverItems = [
    {
      icon: t(`benefits.hoverDetails.${hoverKey}.items.0.icon`),
      title: t(`benefits.hoverDetails.${hoverKey}.items.0.title`),
      description: t(`benefits.hoverDetails.${hoverKey}.items.0.description`)
    },
    {
      icon: t(`benefits.hoverDetails.${hoverKey}.items.1.icon`),
      title: t(`benefits.hoverDetails.${hoverKey}.items.1.title`),
      description: t(`benefits.hoverDetails.${hoverKey}.items.1.description`)
    },
    {
      icon: t(`benefits.hoverDetails.${hoverKey}.items.2.icon`),
      title: t(`benefits.hoverDetails.${hoverKey}.items.2.title`),
      description: t(`benefits.hoverDetails.${hoverKey}.items.2.description`)
    }
  ];

  const safeDescription = useSafeHTML(t(descriptionKey));

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
      className="bg-white p-8 rounded-2xl border-2 border-mint-200 hover:border-mint-400 hover:shadow-luxury transition-all duration-300 cursor-pointer relative group h-full overflow-hidden"
      whileHover={!isTouchDevice ? { y: -6, scale: 1.02 } : {}}
      onHoverStart={handleInteractionStart}
      onHoverEnd={handleInteractionEnd}
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Фоновая подсветка */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-mint-50/80 to-transparent opacity-0"
        animate={{ opacity: showDetails ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Анимированный индикатор с пульсацией */}
      {showIndicator && (
        <div className="absolute -top-3 -right-3">
          <motion.div
            className="w-6 h-6 bg-gradient-to-br from-mint-500 to-mint-600 rounded-full shadow-lg flex items-center justify-center"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.9, 1, 0.9],
              boxShadow: [
                '0 0 0 0 rgba(34, 197, 94, 0.7)',
                '0 0 0 8px rgba(34, 197, 94, 0)',
                '0 0 0 0 rgba(34, 197, 94, 0)'
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            <motion.div
              className="w-1.5 h-1.5 bg-white rounded-full"
              animate={{
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </motion.div>
        </div>
      )}

      <div className="relative z-10">
        {/* Иконка с анимацией */}
        <motion.div 
          className="text-5xl mb-4 relative inline-block"
          animate={{ 
            scale: showDetails ? 1.1 : 1,
            rotate: showDetails ? 3 : 0
          }}
          transition={{ duration: 0.3, type: "spring" }}
        >
          {icon}
          {/* Свечение иконки */}
          <motion.div
            className="absolute inset-0 text-5xl blur-md opacity-0"
            animate={{ opacity: showDetails ? 0.2 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {icon}
          </motion.div>
        </motion.div>

        <motion.h3 
          className="text-2xl font-semibold text-platinum-900 mb-3"
          animate={{ color: showDetails ? '#059669' : '#1f2937' }}
          transition={{ duration: 0.2 }}
        >
          {t(titleKey)}
        </motion.h3>
        
        <div 
          className="text-platinum-700 leading-relaxed mb-4"
          dangerouslySetInnerHTML={safeDescription}
        />

        <AnimatePresence>
          {showDetails && hoverItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-mint-100">
                <motion.h4 
                  className="font-semibold text-platinum-800 mb-4 text-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {hoverTitle}
                </motion.h4>
                <div className="space-y-4">
                  {hoverItems.map((item: HoverItem, idx: number) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <motion.div 
                        className="text-2xl flex-shrink-0 mt-1"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        {item.icon}
                      </motion.div>
                      <div className="flex-1">
                        <h5 className="font-medium text-platinum-900 text-sm mb-1">
                          {item.title}
                        </h5>
                        <p className="text-platinum-600 text-xs leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

interface BenefitsSectionProps {
  onButtonClick?: () => void;
}

export const BenefitsSection = ({ onButtonClick }: BenefitsSectionProps) => {
  const { t } = useLanguage();

  const founderStatusDescription = useSafeHTML(t('benefits.killerFeature.founderStatus.description'));
  const exclusiveBonusesDescription = useSafeHTML(t('benefits.killerFeature.exclusiveBonuses.description'));
  const dataImpactDescription = useSafeHTML(t('benefits.killerFeature.dataImpact.description'));

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

  return (
    <section id="benefits" className="py-20 px-4 bg-gradient-to-b from-mint-25 to-mint-50/70">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-platinum-900 mb-4">
            {t('benefits.title')}
          </h2>
          <p className="text-xl text-platinum-700 max-w-2xl mx-auto">
            {t('benefits.subtitle')}
          </p>
        </motion.div>

        {/* Кнопка перед преимуществами */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Button 
            size="lg" 
            className="bg-mint-500 hover:bg-mint-600 text-white px-8 py-3 text-lg font-semibold shadow-luxury hover:shadow-premium transition-all duration-300"
            onClick={scrollToWaitlist}
          >
            {t('benefits.ctaButton')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>

        {/* Сетка преимуществ с интерактивными карточками */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefitsData.map((benefit, index) => (
            <InteractiveBenefitCard
              key={benefit.titleKey}
              icon={benefit.icon}
              titleKey={benefit.titleKey}
              descriptionKey={benefit.descriptionKey}
              hoverKey={benefit.hoverKey}
              index={index}
            />
          ))}
        </div>

        {/* 🔥 КИЛЛЕР-ФИЧА: Сапфирово-золотой градиент */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="bg-gradient-to-br from-sapphire-600 via-bioblue-700 to-gold-500 rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden"
        >
          {/* Фоновые элементы */}
          <div className="absolute top-4 right-4 text-6xl opacity-20">⭐</div>
          <div className="absolute bottom-4 left-4 text-5xl opacity-20">👑</div>
          
          {/* Золотые акценты */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent"></div>
          
          <div className="relative z-10">
            <div className="text-6xl mb-6">🚀</div>
            
            <h3 
              className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-gold-300 to-gold-100 bg-clip-text text-transparent"
              dangerouslySetInnerHTML={{ __html: t('benefits.killerFeature.title') }}
            />
            
            <div className="grid md:grid-cols-2 gap-6 mb-8 text-left">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-gold-400/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-lg">👑</span>
                  </div>
                  <h4 className="font-bold text-lg text-gold-200">
                    {t('benefits.killerFeature.founderStatus.title')}
                  </h4>
                </div>
                <p 
                  className="text-sapphire-100 text-sm"
                  dangerouslySetInnerHTML={founderStatusDescription}
                />
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-mint-400/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-mint-400 to-mint-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-lg">💎</span>
                  </div>
                  <h4 className="font-bold text-lg text-mint-200">
                    {t('benefits.killerFeature.exclusiveBonuses.title')}
                  </h4>
                </div>
                <p 
                  className="text-sapphire-100 text-sm"
                  dangerouslySetInnerHTML={exclusiveBonusesDescription}
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-sapphire-500/30 to-gold-500/20 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/10">
              <p className="text-lg font-semibold mb-3 text-gold-200">
                {t('benefits.killerFeature.dataImpact.title')}
              </p>
              <p 
                className="text-sapphire-100"
                dangerouslySetInnerHTML={dataImpactDescription}
              />
            </div>

            <Button 
              size="lg"
              onClick={scrollToWaitlist}
              className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-platinum-900 font-bold text-lg py-6 px-12 shadow-premium hover:shadow-elegant transition-all duration-300 hover:scale-105 border-2 border-gold-300"
            >
              {t('benefits.killerFeature.ctaButton')}
            </Button>
            
            <p className="text-gold-300 text-sm mt-4 font-medium">
              {t('benefits.killerFeature.footer')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};