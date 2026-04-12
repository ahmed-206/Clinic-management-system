import { LuCalendarCheck2, LuChartColumnDecreasing, LuShield } from "react-icons/lu";
import { motion } from 'framer-motion';

export const Features = () => {
  const features = [
    { title: "Online booking", desc: "Patients book in seconds with real-time availability.", icon: <LuCalendarCheck2 size={22} /> },
    { title: "No double bookings", desc: "Smart conflict detection prevents scheduling overlaps.", icon: <LuShield size={22} /> },
    { title: "Clinic dashboard", desc: "Manage appointments and patient records from one place.", icon: <LuChartColumnDecreasing size={22} /> },
  ];

  return (
    <section id="features" className="relative max-w-7xl mx-auto px-6 py-24 overflow-hidden">
      
      {/* خلفية جمالية خفيفة (تظهر فقط في الشاشات الكبيرة) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-24 left-10 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-24 right-10 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full" />
      </div>

      <div className="text-center space-y-4 mb-16">
  
        
        <h2 className="text-3xl md:text-4xl font-black text-secondary font-headline">
          Everything you need
        </h2>
        <p className="text-neutral-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-medium">
          Powerful tools designed to manage your clinic efficiently and deliver the best patient experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {features.map((f, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
            whileHover={{ y: -8 }} // حركة خفيفة للأعلى عند الـ hover
            className="group relative p-8 bg-white border border-neutral-100 rounded-[24px] hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
          >
            {/* أيقونة مميزة */}
            <div className="relative w-14 h-14 rounded-2xl bg-neutral-50 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
              {f.icon}
              {/* شعاع خلف الأيقونة يظهر عند الـ hover */}
              <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <h3 className="text-lg font-bold text-secondary mb-3 group-hover:text-primary transition-colors">
              {f.title}
            </h3>
            
            <p className="text-sm text-neutral-500 leading-relaxed font-medium">
              {f.desc}
            </p>

            {/* خط جمالي أسفل الكارت يمتد عند الـ hover */}
            <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-linear-to-r from-transparent via-primary/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};