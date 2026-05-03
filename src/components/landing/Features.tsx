import { motion } from 'framer-motion';
import {
  LuCalendarCheck2,
  LuShield,
  LuChartColumnDecreasing,
  LuBellRing,
  LuFileText,
  LuUsers,
} from 'react-icons/lu';
import type { LandingKeys } from '../../i18n/types';
import { useLandingT } from '../../hooks/useT';

interface Feature {
  icon: React.ReactNode;
  title: LandingKeys;  
  desc: LandingKeys;   
}
const features :  Feature[] = [
  {
    icon: <LuCalendarCheck2 size={20} />,
    title: "features.bookSelf.title",
    desc: "features.bookSelf.desc",
  },
  {
    icon: <LuShield size={20} />,
    title: "features.noDouble.title",
    desc: "features.noDouble.desc",
  },
  {
    icon: <LuChartColumnDecreasing size={20} />,
    title: "features.dashboard.title",
    desc: "features.dashboard.desc",
  },
  {
    icon: <LuBellRing size={20} />,
    title: "features.reminders.title",
    desc: "features.reminders.desc",
  },
  {
    icon: <LuFileText size={20} />,
    title: "features.prescriptions.title",
    desc: "features.prescriptions.desc",
  },
  {
    icon: <LuUsers size={20} />,
    title: "features.multiDoctor.title",
    desc: "features.multiDoctor.desc",
  },
];

export const Features = () => {
  const tl = useLandingT();
  return (
    <section id="features" className="relative max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 overflow-hidden">

      <div className="absolute inset-0 -z-10 pointer-events-none opacity-30">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full" />
      </div>

      <div className="text-center space-y-3 mb-14">
     
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-4xl font-bold text-primary"
        >
          {tl('features.featuresTitle')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-secondary/60 text-sm md:text-base max-w-lg mx-auto"
        >
          {tl('features.featuresSubTitle')}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            whileHover={{ y: -6 }}
            className="group relative p-6 bg-white border border-neutral-100 rounded-2xl hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 flex flex-col gap-4"
          >
          

            <div className="w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500">
              {f.icon}
            </div>

            <div>
              <h3 className="text-base font-bold text-secondary mb-1.5 group-hover:text-primary transition-colors">
                {tl(f.title)}
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                {tl(f.desc)}
              </p>
            </div>

            <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-linear-to-r from-transparent via-primary to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};
