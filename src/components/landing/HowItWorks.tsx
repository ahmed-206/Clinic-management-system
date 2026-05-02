import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';


type Tab = 'clinic' | 'patient';

export const HowItWorks = () => {
  const {t} = useTranslation('landing')
  const [tab, setTab] = useState<Tab>('clinic');
  

  const steps = t(
    tab === 'clinic'
      ? 'howItWorks.clinicTab'
      : 'howItWorks.patientTab',
    { returnObjects: true }
  ) as {
    n: string;
    title: string;
    desc: string;
  }[];
  return (
    <section id="how-it-works" className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">

      <div className="text-center space-y-4 mb-10">
   
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-4xl font-bold text-primary"
        >
          {t('howItWorks.howItWorksTitle')}
        </motion.h2>

        {/* tab toggle */}
        <div className="flex justify-center mt-4">
          <div className="inline-flex bg-neutral-100 p-1 rounded-xl">
            {(['clinic', 'patient'] as Tab[]).map((tabKey) => (
              <button
                key={tabKey}
                onClick={() => setTab(tabKey)}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  tab === tabKey
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-secondary/50 hover:text-secondary'
                }`}
              >
                {t(
                  tabKey === 'clinic'
                    ? 'howItWorks.tab.forClinic'
                    : 'howItWorks.tab.forPatient'
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="group relative bg-white p-7 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 flex flex-col items-center text-center overflow-hidden"
            >
              <div className="relative mb-5">
                <div className=" rounded-2xl bg-primary/5 flex items-center justify-center text-base font-bold text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 w-12 h-12">
                  {s.n}
                </div>
              </div>

              <h3 className="text-base font-bold text-secondary mb-2 group-hover:text-primary transition-colors duration-300">
                {s.title}
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                {s.desc}
              </p>

              <div className="absolute bottom-0 left-0 h-1 bg-primary w-0 group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};
