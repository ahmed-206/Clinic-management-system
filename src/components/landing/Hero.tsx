import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import d1 from '../../assets/heroImg/d1.jpg';
import d2 from '../../assets/heroImg/d2.jpg';
import d3 from '../../assets/heroImg/d3.jpg';
import { FaArrowRight } from 'react-icons/fa';

export const Hero = () => {
  const images = [d1, d2, d3];
  const [currentImage, setCurrentImage] = useState(0);
  const total = images.length;

  useEffect(() => {
    const timer = setInterval(() => setCurrentImage(p => (p + 1) % total), 5000);
    return () => clearInterval(timer);
  }, [total]);

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-neutral-100 px-4 py-20">

      
     

      {/* ── 1. Text block ── */}
      <div className="relative z-10 flex flex-col items-center text-center gap-3 mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-5xl font-bold text-secondary leading-[1.15] tracking-tight max-w-none md:whitespace-nowrap"
        >
          <span className="text-primary">Book</span> Your Clinic Appointment{' '} 
          <span className="text-primary">in Seconds</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-md md:text-base text-secondary/60  leading-relaxed max-w-none md:whitespace-nowrap"
        >
          Smart booking for patients. 
  Powerful management tools for doctors & clinics.
        </motion.p>
      </div>

      {/* ── 2. Wide image with button overlaid ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 w-full max-w-5xl"
      >
        {/* Card frame */}
        <div className="relative w-full aspect-21/9  overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.13)] border border-white/70">
          
          {/* Sliding images */}
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              src={images[currentImage]}
              alt={`Clinic ${currentImage + 1}`}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Inner vignette */}
          <div className="absolute inset-0 bg-linear-to-t from-neutral-900/30 via-transparent to-transparent" />

          {/* ── CTA button — floating on image bottom center ── */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20">
          
            <Link
              to="/dashboard/book"
              className="inline-flex items-center gap-2 bg-primary  backdrop-blur-md  text-white text-sm font-medium px-8 py-3.5 rounded-xl transition-all duration-200 hover:gap-3 shadow-lg"
            >
              Book an Appointment
              <FaArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="flex justify-center gap-2 mt-5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              className={`h-[3px] rounded-full transition-all duration-500 ${
                i === currentImage ? 'w-8 bg-primary' : 'w-2 bg-[#1a1a2e]/20'
              }`}
            />
          ))}
        </div>
      </motion.div>

    </section>
  );
};