import { motion } from "framer-motion";

const pilotResults = [
  {
    icon: "🎯",
    title: "Точность прогнозирования",
    value: "94%",
    description: "точность AI в определении связи между симптомами и триггерами"
  },
  {
    icon: "⏱️", 
    title: "Экономия времени",
    value: "3.5 часа",
    description: "средняя экономия времени на подготовку к визиту врача"
  },
  {
    icon: "📊",
    title: "Полнота данных",
    value: "87%",
    description: "пользователей ведут более полные записи о симптомах"
  }
];

export const PilotResults = () => {
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
            Результаты пилотного тестирования
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Данные из закрытого тестирования с участием медицинских экспертов
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {pilotResults.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{result.icon}</div>
              <div className="text-3xl font-bold text-primary mb-2">{result.value}</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{result.title}</h3>
              <p className="text-muted-foreground text-sm">{result.description}</p>
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
            <p className="text-blue-800 text-sm">
              🔬 <span className="font-semibold">Данные из тестирования алгоритмов</span> на исторических медицинских данных. 
              Реальные пользовательские результаты появятся после запуска.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};