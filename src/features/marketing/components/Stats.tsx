import { motion } from 'framer-motion';
import { Counter } from '@/features/marketing/components/Counter';
import { useTranslation } from 'react-i18next';
import { LuStethoscope, LuHeartPulse, LuCalendarCheck, LuHeadset } from 'react-icons/lu';

interface StatItem {
  label: string;
  value: number;
  suffix: string;
}

const STAT_ICONS = [
  LuStethoscope,   
  LuHeartPulse,    
  LuCalendarCheck, 
  LuHeadset,       
];

export const Stats = () => {
  const { t } = useTranslation('landing');

  const statsObj = t('stats', { returnObjects: true }) as Record<string, StatItem>;
  const stats = Object.values(statsObj);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
        {stats.map((s, i) => {
          const IconComponent = STAT_ICONS[i % STAT_ICONS.length];

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.1,
                duration: 0.4,
                ease: 'easeOut',
              }}
              className="flex items-center justify-center gap-3.5"
            >
              
                <IconComponent className="w-10 h-10 text-primary" />

              {/* Text & Counter Content */}
              <div className="flex flex-col justify-center leading-none">
                <div className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight flex items-baseline">
                  <Counter from={0} to={s.value} />
                  <span className="text-2xl md:text-3xl font-bold ml-0.5">{s.suffix}</span>
                </div>

                <div className="text-sm md:text-base font-semibold text-heading uppercase tracking-wide mt-1">
                  {s.label}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};