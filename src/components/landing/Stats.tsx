import { motion } from 'framer-motion';
import { Counter } from './Counter';

import { useTranslation } from 'react-i18next';

interface StatItem {
  label: string;
  value: number;
  suffix: string;
}
export const Stats = () => {
 const { t } = useTranslation('landing');

 
  const statsObj = t('stats', { returnObjects: true }) as Record<string, StatItem>;

  
  const stats = Object.values(statsObj);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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

            <div className="relative z-10 text-3xl md:text-4xl font-bold text-white font-headline tracking-tight">
              <Counter from={0} to={s.value} />
              <span className="text-2xl md:text-3xl ml-0.5">{s.suffix}</span>
            </div>

            <div className="relative z-10 text-md md:text-md font-black uppercase tracking-[0.2em] text-white mt-2  transition-colors">
              {s.label}
            </div>

           
          </motion.div>
        ))}
      </div>
    </section>
  );
};