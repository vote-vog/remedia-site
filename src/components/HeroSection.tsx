import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import sechenovIcon from "@/assets/sechenov-icon.png";

export const HeroSection = () => {
  const scrollToWaitlist = () => {
    const waitlistSection = document.getElementById('waitlist');
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

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
            Перестаньте в одиночку гадать,<br />что поможет.
            <span className="text-primary"> Начните понимать.</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Простой AI-помощник, который превращает ваши ежедневные наблюдения в чате в ясные закономерности, которые могут упустить врачи 
          </p>

          <div className="flex justify-center mb-16">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg"
              onClick={scrollToWaitlist}
            >
              Начать бесплатно
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>


          <div className="flex flex-wrap gap-4 justify-center mb-20">
            <div className="flex items-center gap-2 bg-card px-6 py-3 rounded-xl border border-border">
              <span className="text-2xl">📊</span>
              <span className="text-sm font-medium">Структурированные графики</span>
            </div>
            <div className="flex items-center gap-2 bg-card px-6 py-3 rounded-xl border border-border">
              <span className="text-2xl">⏰</span>
              <span className="text-sm font-medium">Умные уведомления</span>
            </div>
            <div className="flex items-center gap-2 bg-card px-6 py-3 rounded-xl border border-border">
              <span className="text-2xl">📄</span>
              <span className="text-sm font-medium">Информативные отчеты для врача</span>
            </div>
            <div className="flex items-center gap-2 bg-card px-6 py-3 rounded-xl border border-border">
              <span className="text-2xl">🤒</span>
              <span className="text-sm font-medium">Отслеживание симптомов в чате</span>
            </div>
            <div className="flex items-center gap-2 bg-card px-6 py-3 rounded-xl border border-border">
              <span className="text-2xl">💊</span>
              <span className="text-sm font-medium">Отслеживание терапии</span>
            </div>
            <div className="flex items-center gap-2 bg-card px-6 py-3 rounded-xl border border-border">
              <span className="text-2xl">📈</span>
              <span className="text-sm font-medium">Анализ образа жизни и других факторов</span>
            </div>
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
                Выпускник
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
              Акселерационная программа Первого МГМУ
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};