import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import sechenovIcon from "@/assets/sechenov-icon.png";
import { useLanguage } from "@/hooks/useLanguage";

interface HeroSectionProps {
  onButtonClick?: () => void;
}

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

  // Элементы фичей для лучшей структуры
  const featureItems = [
    { icon: "📊", key: "charts" },
    { icon: "⏰", key: "notifications" },
    { icon: "📄", key: "reports" },
    { icon: "🤒", key: "symptoms" },
    { icon: "💊", key: "therapy" },
    { icon: "📈", key: "analysis" }
  ];

  return (
    <section className="relative py-20 px-4 overflow-hidden">
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
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg"
              onClick={scrollToWaitlist}
            >
              {t('hero.ctaButton')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Фичи */}
          <div className="flex flex-wrap gap-4 justify-center mb-20">
            {featureItems.map((feature, index) => (
              <div 
                key={feature.key}
                className="flex items-center gap-2 bg-card px-6 py-3 rounded-xl border border-border"
              >
                <span className="text-2xl">{feature.icon}</span>
                <span className="text-sm font-medium">
                  {t(`hero.features.${feature.key}`)}
                </span>
              </div>
            ))}
          </div>

          {/* 🔥 СЕЧЕНОВСКИЙ БЛОК С "ВЫПУСКНИК" */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-center gap-3"
          >
            {/* Иконка */}
            <img 
              src={sechenovIcon} 
              alt="Sechenov Tech" 
              className="w-12 h-12 object-contain opacity-80"
            />
            
            {/* Текст с "Выпускник" и ссылкой */}
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
            
            {/* Подпись под ссылкой */}
            <p className="text-sm text-muted-foreground">
              {t('hero.sechenov.program')}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};