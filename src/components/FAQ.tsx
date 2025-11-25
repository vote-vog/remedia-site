import { motion } from "framer-motion";
import { useState } from "react";

const faqItems = [
  {
    question: "Это заменяет врача?",
    answer: "Нет, это инструмент для лучшего взаимодействия с врачом. Мы помогаем собирать и анализировать данные, чтобы вы могли предоставить врачу полную картину вашего состояния."
  },
  {
    question: "Безопасны ли мои медицинские данные?",
    answer: "Все данные шифруются и хранятся анонимно. Мы соблюдаем медицинскую этику и федеральный закон 'О персональных данных'. Ваша конфиденциальность - наш приоритет."
  },
  {
    question: "Сколько это стоит?",
    answer: "Базовые функции бесплатны. Премиум-аналитика с расширенными отчетами будет доступна по подписке после запуска."
  },
  {
    question: "Нужны ли технические знания?",
    answer: "Нет! Интерфейс интуитивно понятен. Вы можете записывать симптомы голосом, а AI сам проведет весь анализ."
  },
  {
    question: "Как быстро я увижу результаты?",
    answer: "Первые закономерности AI находит уже через 1-2 недели использования. Полная картина формируется за 1-2 месяца регулярного ведения записей."
  },
  {
    question: "Можно ли использовать для других заболеваний?",
    answer: "Сейчас фокус на ревматоидных заболеваниях. В будущем планируем расширить на другие хронические заболевания."
  }
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
            Частые вопросы
          </h2>
          <p className="text-xl text-muted-foreground">
            Всё, что важно знать перед началом использования
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-card border border-border rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-muted/50 transition-colors"
              >
                <span className="font-semibold text-lg pr-4">{item.question}</span>
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
                    {item.answer}
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
              Остались вопросы?
            </h3>
            <p className="text-muted-foreground mb-4">
              Напишите <a 
                href="https://t.me/vote_vog" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline transition-all"
              >
                основателю в Telegram
              </a> - мы ответим в течение 24 часов
            </p>
            <p className="text-sm text-muted-foreground">
              ⚡ Среднее время ответа: 30 минут
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};