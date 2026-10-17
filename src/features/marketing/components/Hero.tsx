import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import d1copy from '@/assets/heroImg/doctori.png';
import { FaArrowRight } from 'react-icons/fa';

import { useLandingT } from '@/hooks/useT';

export const Hero = () => {
  const tl = useLandingT();

  return (
    <section className="relative w-full min-h-[85vh] md:min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-neutral-100 px-4 py-12 md:py-24">
      
    

      
      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl w-full mx-auto">
        
        {/* 1. العنوان الرئيسي */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-6xl sm:text-6xl md:text-6xl lg:text-6xl font-bold text-primary leading-[1.2] tracking-tight px-2"
        >
          {tl('heroTitle.part1')}
          <br className="hidden sm:block" /> {tl('heroTitle.part2')}
        </motion.h1>


        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl flex items-center justify-center "
        >
          <div className="relative w-full aspect-3/1 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.img
                key={d1copy}
                src={d1copy}
                alt="DOCTORi Logo"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                className="w-full h-full object-contain"
              />
            </AnimatePresence>
          </div>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="z-20 "
        >
          <Link
            to="/dashboard/book"
            className="inline-flex items-center gap-2 bg-[#00c9c8] hover:bg-[#00b5b4] text-white text-xs sm:text-sm md:text-base font-semibold px-7 md:px-9 py-3 md:py-3.5 rounded-xl transition-all duration-200 hover:scale-105 shadow-md shadow-[#00c9c8]/20"
          >
            {tl('heroButton')}
            <FaArrowRight className="w-3 md:w-3.5 h-3 md:h-3.5" />
          </Link>
        </motion.div>

      </div>

    </section>
  );
};