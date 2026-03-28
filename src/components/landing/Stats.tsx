import {motion } from 'framer-motion'
import { Counter } from './Counter';
export const Stats = () => {
  const statsData = [
    { label: "Active Doctors", value: 50, suffix: "+" },
    { label: "Happy Patients", value: 10, suffix: "k+" },
    { label: "Appointments", value: 25, suffix: "k+" },
    { label: "Support", value: 24, suffix: "/7" },
  ];
  return (
     <section className="max-w-7xl mx-auto px-6 py-12">
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: "backOut" }}
      className="bg-primary rounded-[30px] p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-8"
    >
      {statsData.map((stat, i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="text-center space-y-1"
        >
         <div className="text-3xl md:text-4xl font-black text-white flex justify-center items-center">
              {/* هنا استدعينا العداد */}
              <Counter from={0} to={stat.value} />
              <span>{stat.suffix}</span>
            </div>
            <div className="text-white/80 text-xs md:text-sm uppercase tracking-widest font-medium">
              {stat.label}
            </div>
        </motion.div>
      ))}
    </motion.div>
  </section>
  )
};