import {
  LuCalendarCheck2,
  LuChartColumnDecreasing,
  LuShield,
} from "react-icons/lu";
import { motion } from "framer-motion";

export const Features = () => {
  const features = [
    {
      title: "Online booking",
      desc: "Patients book in seconds with real-time availability.",
      icon: <LuCalendarCheck2 size={22} />,
    },
    {
      title: "No double bookings",
      desc: "Smart conflict detection prevents scheduling overlaps.",
      icon: <LuShield size={22} />,
    },
    {
      title: "Clinic dashboard",
      desc: "Manage appointments and patient records from one place.",
      icon: <LuChartColumnDecreasing size={22} />,
    },
  ];

  return (
    <section
      id="features"
      className="relative max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-10 left-0 md:left-10 w-32 h-32 md:w-64 md:h-64 bg-primary/10 blur-[60px] md:blur-[100px] rounded-full" />
        <div className="absolute bottom-10 right-0 md:right-10 w-32 h-32 md:w-64 md:h-64 bg-blue-400/10 blur-[60px] md:blur-[100px] rounded-full" />
      </div>

      <div className="text-center space-y-4 mb-12 md:mb-16">
        <h2 className="text-2xl md:text-4xl font-bold text-primary font-headline px-2">
          Everything you need
        </h2>
        <p className="text-secondary text-sm md:text-base max-w-xl mx-auto leading-relaxed font-medium px-4">
          Powerful tools designed to manage your clinic efficiently and deliver
          the best patient experience.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
            whileHover={{ y: -8 }} // حركة خفيفة للأعلى عند الـ hover
            className="group relative p-6 md:p-8 bg-white border border-neutral-100 rounded-[24px] hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
          >
            {/* أيقونة مميزة */}
            <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-neutral-50 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
              {f.icon}
              <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <h3 className="text-base md:text-lg font-bold text-secondary mb-3 group-hover:text-primary transition-colors">
              {f.title}
            </h3>

            <p className="text-xs md:text-sm text-neutral-500 leading-relaxed font-medium">
              {f.desc}
            </p>

            <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-linear-to-r from-transparent via-primary to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};
