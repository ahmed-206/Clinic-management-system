import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const clinicSteps = [
  {
    n: '01',
    title: 'Add your schedule',
    desc: 'Set your working hours, slot duration and days off — once. Never touch it again unless you want to.',
  },
  {
    n: '02',
    title: 'Share your booking link',
    desc: 'Send patients your link via WhatsApp or add it to your Instagram bio. That\'s your entire marketing.',
  },
  {
    n: '03',
    title: 'Get notified instantly',
    desc: 'Every new booking triggers a real-time notification. Confirm, cancel or view details in one click.',
  },
  {
    n: '04',
    title: 'Manage & prescribe',
    desc: 'Complete appointments, write digital prescriptions and build a full patient history automatically.',
  },
];

const patientSteps = [
  {
    n: '01',
    title: 'Choose a doctor',
    desc: 'Browse available specialists and read their profiles — no account needed to look.',
  },
  {
    n: '02',
    title: 'Pick a date & time',
    desc: 'See live available slots. No phone calls. No waiting on hold.',
  },
  {
    n: '03',
    title: 'Enter patient details',
    desc: 'Book for yourself or a family member — each with their own medical record.',
  },
  {
    n: '04',
    title: 'Done — get confirmation',
    desc: 'Instant confirmation notification. The clinic handles the rest.',
  },
];

type Tab = 'clinic' | 'patient';

export const HowItWorks = () => {
  const [tab, setTab] = useState<Tab>('clinic');
  const steps = tab === 'clinic' ? clinicSteps : patientSteps;

  return (
    <section id="how-it-works" className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">

      <div className="text-center space-y-4 mb-10">
   
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-4xl font-bold text-primary"
        >
          How it works
        </motion.h2>

        {/* tab toggle */}
        <div className="flex justify-center mt-4">
          <div className="inline-flex bg-neutral-100 p-1 rounded-xl">
            {(['clinic', 'patient'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  tab === t
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-secondary/50 hover:text-secondary'
                }`}
              >
                {t === 'clinic' ? 'For your clinic' : 'For your patients'}
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
