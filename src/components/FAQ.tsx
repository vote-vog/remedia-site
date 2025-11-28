import { motion } from "framer-motion";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useSafeHTML } from "@/hooks/useSafeHTML";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight } from "lucide-react";

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
  const ctaDescription = useSafeHTML(t('faq.cta.description'));

  const handleQuestionClick = (index: number) => {
    onButtonClick?.();
    setOpenIndex(openIndex === index ? null : index);
  };

  const TelegramLink = ({ children }: { children: React.ReactNode }) => (
    <a 
      href="https://t.me/remedia_startup" 
      target="_blank" 
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 font-medium underline transition-colors"
    >
      {/* SVG иконка Telegram */}
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.78 5.42-.9 6.8-.06.67-.36.89-.89.56-2.45-1.83-3.57-2.98-5.79-4.78-.54-.45-.92-.68-.88-1.07.03-.28.42-.44.92-.64 2.17-.91 3.61-1.51 5.71-2.41.56-.23 1.05-.1.85.45z"/>
      </svg>
      {children}
    </a>
  );

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-mint-25 to-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            {t('faq.title')}
          </h2>
          <p className="text-xl text-slate-600">
            {t('faq.subtitle')}
          </p>
        </motion.div>

        <div className="space-y-4 mb-12">
          {faqItemsData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white border border-mint-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <button
                onClick={() => handleQuestionClick(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-mint-25 transition-colors"
              >
                <span className="font-semibold text-lg pr-4 text-slate-800">
                  {t(item.questionKey)}
                </span>
                <span className="text-2xl text-teal-500 flex-shrink-0">
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
                  <p className="text-slate-600 leading-relaxed">
                    {t(item.answerKey)}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* 🔥 ОБНОВЛЕННЫЙ CTA С ПРЯМЫМИ КАНАЛАМИ СВЯЗИ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-teal-50 to-mint-50 border border-teal-200 rounded-2xl p-8">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-teal-600" />
            </div>
            
            <h3 className="text-2xl font-semibold text-slate-800 mb-3">
              {t('faq.cta.title')}
            </h3>
            
            <p 
              className="text-slate-600 mb-6"
              dangerouslySetInnerHTML={ctaDescription}
            />
            
            {/* Прямые кнопки связи */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
                href="https://t.me/remedia_startup"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.78 5.42-.9 6.8-.06.67-.36.89-.89.56-2.45-1.83-3.57-2.98-5.79-4.78-.54-.45-.92-.68-.88-1.07.03-.28.42-.44.92-.64 2.17-.91 3.61-1.51 5.71-2.41.56-.23 1.05-.1.85.45z"/>
                </svg>
                Telegram
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.a>
              
              <motion.a
                href="mailto:hello@remedia.com"
                className="group bg-white border border-mint-300 hover:border-teal-400 text-slate-700 hover:text-slate-900 px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                 email
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </div>
            
            <p className="text-sm text-slate-500 mt-4">
              {t('faq.cta.responseTime')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};