import { motion } from "framer-motion";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

const faqItemsData = [
  {
    questionKey: "faq.items.0.question",
    answerKey: "faq.items.0.answer"
  },
  {
    questionKey: "faq.items.1.question",
    answerKey: "faq.items.1.answer"
  },
  {
    questionKey: "faq.items.2.question",
    answerKey: "faq.items.2.answer"
  },
  {
    questionKey: "faq.items.3.question",
    answerKey: "faq.items.3.answer"
  },
  {
    questionKey: "faq.items.4.question",
    answerKey: "faq.items.4.answer"
  },
  {
    questionKey: "faq.items.5.question",
    answerKey: "faq.items.5.answer"
  }
];

interface FAQProps {
  onButtonClick?: () => void;
}

export const FAQ = ({ onButtonClick }: FAQProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useLanguage();

  const handleQuestionClick = (index: number) => {
    onButtonClick?.();
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 bg-muted/20">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('faq.title')}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t('faq.subtitle')}
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqItemsData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-card border border-border rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => handleQuestionClick(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-muted/50 transition-colors"
              >
                <span className="font-semibold text-lg pr-4">
                  {t(item.questionKey)}
                </span>
                <span className="text-2xl text-muted-foreground flex-shrink-0">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              
              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-4"
                >
                  <p className="text-muted-foreground leading-relaxed">
                    {t(item.answerKey)}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* 🔥 ОБНОВЛЕННЫЙ CTA С ССЫЛКОЙ НА ОСНОВАТЕЛЯ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-8">
            <h3 className="text-2xl font-semibold text-foreground mb-3">
              {t('faq.cta.title')}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t('faq.cta.description')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('faq.cta.responseTime')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};