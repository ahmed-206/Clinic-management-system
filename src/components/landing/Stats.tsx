import { motion } from 'framer-motion';
import { Counter } from './Counter';

export const Stats = () => {
  const stats = [
    { label: "Active doctors", value: 50, suffix: "+" },
    { label: "Happy patients", value: 10, suffix: "k+" },
    { label: "Appointments", value: 25, suffix: "k+" },
    { label: "Support", value: 24, suffix: "/7" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }} 
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ 
              delay: i * 0.1, 
              duration: 0.5,
              ease: [0.21, 0.47, 0.32, 0.98] 
            }}
            whileHover={{ y: -5 }}
            className="group relative bg-primary border border-neutral-100 rounded-[28px] p-8 text-center transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
          >

            <div className="relative z-10 text-3xl md:text-4xl font-black text-white font-headline tracking-tight">
              <Counter from={0} to={s.value} />
              <span className="text-2xl md:text-3xl ml-0.5">{s.suffix}</span>
            </div>

            <div className="relative z-10 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-white mt-2  transition-colors">
              {s.label}
            </div>

            {/* نقطة مضيئة صغيرة في الأعلى */}
          </motion.div>
        ))}
      </div>
    </section>
  );
};