
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import d1copy from '../../assets/heroImg/d1 copy.png'
import { FaArrowRight } from 'react-icons/fa';

import { useLandingT } from '../../hooks/useT';

export const Hero = () => {
const tl = useLandingT()

  return (
    <section className="relative w-full min-h-[80vh] md:min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-neutral-100 px-4 py-20">

      <div className="absolute inset-0 z-0 ">
    
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-primary-100 rounded-[100%] blur-[120px] pointer-events-none" />
    
  </div>
     

      {/* ── 1. Text block ── */}
      <div className="relative z-10 flex flex-col items-center text-center gap-3 mb-2 mt-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-primary leading-[1.15] tracking-tight  "
        >
           {tl('heroTitle.part1')}
          <br />
          {tl('heroTitle.part2')}
         
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-sm md:text-base lg:text-lg text-secondary font-medium  leading-relaxed max-w-2xl px-2"
        >
           {tl('heroSubTitle')}
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
        <div className="relative w-full aspect-video md:aspect-21/9   overflow-hidden ">
          
          {/* Sliding images */}
          <AnimatePresence mode="wait">
            <motion.img
              key={d1copy}
              src={d1copy}
              alt="Clinic"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>

         

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20">
          
            <Link
              to="/dashboard/book"
              className="inline-flex items-center gap-2 bg-primary border border-white backdrop-blur-md  text-white text-xs md:text-sm font-medium px-6 md:px-8 py-3 md:py-3.5 rounded-xl transition-all duration-200 hover:gap-3 shadow-lg"
            >
              {tl('heroButton')}
              <FaArrowRight className="w-3 md:w-3.5 h-3 md:h-3.5" />
            </Link>
          </div>
        </div>

      
      </motion.div>

    </section>
  );
};