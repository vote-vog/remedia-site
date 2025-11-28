import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useSafeHTML } from "@/hooks/useSafeHTML";

const benefitsData = [
  {
    icon: "🔍",
    titleKey: "benefits.items.0.title",
    descriptionKey: "benefits.items.0.description"
  },
  {
    icon: "💊",
    titleKey: "benefits.items.1.title",
    descriptionKey: "benefits.items.1.description"
  },
  {
    icon: "🤝",
    titleKey: "benefits.items.2.title",
    descriptionKey: "benefits.items.2.description"
  },
  {
    icon: "🎯",
    titleKey: "benefits.items.3.title",
    descriptionKey: "benefits.items.3.description"
  }
];

interface BenefitsSectionProps {
  onButtonClick?: () => void;
}

export const BenefitsSection = ({ onButtonClick }: BenefitsSectionProps) => {
  const { t } = useLanguage();

  // Используем useSafeHTML для всех описаний с HTML
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
    <section className="py-20 px-4 bg-gradient-to-b from-mint-25 to-mint-50/70">
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

        <div className="grid md:grid-cols-2 gap-8">
          {benefitsData.map((benefit, index) => {
            // Для каждого benefit создаем безопасный HTML
            const safeDescription = useSafeHTML(t(benefit.descriptionKey));
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-mint-200 hover:border-mint-300 hover:shadow-luxury transition-all duration-300"
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-2xl font-semibold text-platinum-900 mb-3">
                  {t(benefit.titleKey)}
                </h3>
                <p 
                  className="text-platinum-700 leading-relaxed"
                  dangerouslySetInnerHTML={safeDescription}
                />
              </motion.div>
            );
          })}
        </div>

        {/* 🔥 КИЛЛЕР-ФИЧА: Сапфирово-золотой градиент */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 bg-gradient-to-br from-sapphire-600 via-bioblue-700 to-gold-500 rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden"
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