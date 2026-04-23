import { motion } from 'framer-motion';
import {
  LuCalendarCheck2,
  LuShield,
  LuChartColumnDecreasing,
  LuBellRing,
  LuFileText,
  LuUsers,
} from 'react-icons/lu';

const features = [
  {
    icon: <LuCalendarCheck2 size={20} />,
    title: 'Patients book themselves',
    desc: 'No phone calls. No back-and-forth. Patients pick their slot and you get notified instantly.',
  },
  {
    icon: <LuShield size={20} />,
    title: 'Zero double bookings — ever',
    desc: 'Every slot is locked the moment it\'s taken. No more "sorry, that time is gone" calls.',
  },
  {
    icon: <LuChartColumnDecreasing size={20} />,
    title: 'Your full clinic in one dashboard',
    desc: 'Appointments, patient records, prescriptions and revenue — one screen, no spreadsheets.',
  },
  {
    icon: <LuBellRing size={20} />,
    title: 'Automatic patient reminders',
    desc: 'Patients get notified when their appointment is confirmed, changed, or completed.',
  },
  {
    icon: <LuFileText size={20} />,
    title: 'Digital prescriptions',
    desc: 'Write and store prescriptions digitally. Full medical history per patient, always accessible.',
  },
  {
    icon: <LuUsers size={20} />,
    title: 'Multi-doctor ready',
    desc: 'Add multiple doctors, each with their own schedule, speciality and availability.',
  },
];

export const Features = () => {
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
          Fix the problems that cost you patients
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-secondary/60 text-sm md:text-base max-w-lg mx-auto"
        >
          Every feature exists because a real clinic had a real problem.
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
                {f.title}
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                {f.desc}
              </p>
            </div>

            <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-linear-to-r from-transparent via-primary to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};
