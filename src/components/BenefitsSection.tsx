import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

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
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('benefits.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-semibold"
            onClick={scrollToWaitlist}
          >
            {t('benefits.ctaButton')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {benefitsData.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card p-8 rounded-2xl border border-border hover:shadow-lg transition-shadow"
            >
              <div className="text-5xl mb-4">{benefit.icon}</div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">
                {t(benefit.titleKey)}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t(benefit.descriptionKey)}
              </p>
            </motion.div>
          ))}
        </div>

        {/* 🔥 КИЛЛЕР-ФИЧА: Эмоциональный блок-апофеоз */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden"
        >
          {/* Фоновые элементы */}
          <div className="absolute top-4 right-4 text-6xl opacity-20">⚡</div>
          <div className="absolute bottom-4 left-4 text-5xl opacity-20">🎯</div>
          
          <div className="relative z-10">
            <div className="text-6xl mb-6">🚀</div>
            
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              {t('benefits.killerFeature.title')}
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8 text-left">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-lg">👑</span>
                  </div>
                  <h4 className="font-bold text-lg">
                    {t('benefits.killerFeature.founderStatus.title')}
                  </h4>
                </div>
                <p className="text-blue-100 text-sm">
                  {t('benefits.killerFeature.founderStatus.description')}
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-lg">💎</span>
                  </div>
                  <h4 className="font-bold text-lg">
                    {t('benefits.killerFeature.exclusiveBonuses.title')}
                  </h4>
                </div>
                <p className="text-blue-100 text-sm">
                  {t('benefits.killerFeature.exclusiveBonuses.description')}
                </p>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
              <p className="text-lg font-semibold mb-3">
                {t('benefits.killerFeature.dataImpact.title')}
              </p>
              <p className="text-blue-100">
                {t('benefits.killerFeature.dataImpact.description')}
              </p>
            </div>

            <Button 
              size="lg"
              onClick={scrollToWaitlist}
              className="bg-white text-blue-600 hover:bg-gray-100 font-bold text-lg py-6 px-12 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
            >
              {t('benefits.killerFeature.ctaButton')}
            </Button>
            
            <p className="text-blue-200 text-sm mt-4">
              {t('benefits.killerFeature.footer')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};