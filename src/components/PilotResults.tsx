import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useSafeHTML } from "@/hooks/useSafeHTML";

const pilotResultsData = [
  {
    icon: "🎯",
    titleKey: "pilotResults.items.0.title",
    value: "94%",
    descriptionKey: "pilotResults.items.0.description"
  },
  {
    icon: "⏱️", 
    titleKey: "pilotResults.items.1.title",
    value: "3.5", // 🔥 ИСПРАВЛЕНО: используем value вместо valueKey
    descriptionKey: "pilotResults.items.1.description"
  },
  {
    icon: "📊",
    titleKey: "pilotResults.items.2.title",
    value: "87%",
    descriptionKey: "pilotResults.items.2.description"
  }
];

interface PilotResultsProps {
  onButtonClick?: () => void;
}

export const PilotResults = ({ onButtonClick }: PilotResultsProps) => {
  const { t } = useLanguage();
  const disclaimer = useSafeHTML(t('pilotResults.disclaimer'));

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-muted/20 to-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('pilotResults.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('pilotResults.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {pilotResultsData.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{result.icon}</div>
              <div className="text-3xl font-bold text-primary mb-2">
                {result.value} {/* 🔥 Теперь здесь будет "3.5 часа" */}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t(result.titleKey)}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t(result.descriptionKey)}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Пояснение */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 max-w-2xl mx-auto">
            <p 
              className="text-blue-800 text-sm"
              dangerouslySetInnerHTML={disclaimer}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};