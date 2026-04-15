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
      <div className="text-center space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-primary font-headline">
          Four steps to your appointment
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {steps.map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="group relative bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 flex flex-col items-center text-center overflow-hidden"
          >

            <div className="relative mb-6 z-10">
              <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-lg font-bold text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                {s.n}
              </div>
              
              <div className="absolute inset-0 rounded-2xl border-4 border-primary/10 scale-125 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
            </div>

            <div className="space-y-3 z-10">
              <h3 className="text-lg md:text-xl font-bold text-secondary group-hover:text-primary transition-colors duration-300">
                {s.title}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed font-medium">
                {s.desc}
              </p>
            </div>

            <div className="absolute bottom-0 left-0 h-1 bg-primary w-0 group-hover:w-full transition-all duration-500" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};