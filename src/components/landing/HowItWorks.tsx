import { motion } from 'framer-motion';

export const HowItWorks = () => {
  const steps = [
    { n: "01", title: "Choose a doctor", desc: "Browse specialists and find the right match." },
    { n: "02", title: "Pick a date", desc: "Select a day that fits your schedule." },
    { n: "03", title: "Select a time", desc: "Choose from live available slots." },
    { n: "04", title: "Confirm booking", desc: "Get instant confirmation for your visit." },
  ];

  return (
    <section id="how-it-works" className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 space-y-12 md:space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
   
        <h2 className="text-2xl md:text-4xl font-bold text-secondary font-headline">
          Four steps to your appointment
        </h2>
      </div>

      <div className="relative grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
        
        {/* Connecting Line (Desktop) */}
        <div className="hidden md:block absolute top-7 left-[10%] right-[10%] h-[2px] bg-neutral-100 z-0">
          {/* Animated Progress Line */}
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="h-full bg-linear-to-r from-primary/20 via-primary to-primary/20 origin-left"
          />
        </div>

        {steps.map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
            className="group relative z-10 text-center flex flex-col items-center"
          >
            {/* Step Number Circle */}
            <div className="relative mb-6">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white border-2 border-neutral-100 flex items-center justify-center text-xs md:text-sm font-bold text-neutral-400 group-hover:text-primary group-hover:border-primary transition-all duration-700 shadow-sm group-hover:shadow-primary/20 group-hover:shadow-xl">
                {s.n}
              </div>
              
              {/* Decorative Ring */}
              <div className="absolute inset-0 rounded-2xl border-4 border-primary/5 scale-125 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500" />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h3 className="text-base md:text-lg font-bold text-secondary group-hover:text-primary transition-colors duration-300">
                {s.title}
              </h3>
              <p className="text-xs md:text-sm text-neutral-500 leading-relaxed font-medium max-w-[200px] mx-auto">
                {s.desc}
              </p>
            </div>

            {/* Mobile Arrow/Indicator (Only visible on small screens between items) */}
            {i !== steps.length - 1 && (
              <div className="md:hidden mt-8 text-neutral-200">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 7 5 5-5 5"/><path d="m13 7 5 5-5 5"/></svg>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};