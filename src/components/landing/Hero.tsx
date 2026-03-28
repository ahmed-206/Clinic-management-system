import doc1 from '../../assets/heroImg/doc1.jpg'
import doc2 from '../../assets/heroImg/doc2.jpg'
import doc3 from '../../assets/heroImg/doc3.jpg'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
export const Hero = () => {
  const images = [doc1, doc2, doc3];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000); // تبديل كل 4 ثواني
    return () => clearInterval(timer);
  }, [images.length]);
  return (

    <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    <motion.div 
    initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
    className="space-y-8">
      <h1 className="text-5xl md:text-6xl font-black text-gray-700 leading-[1.1] tracking-tight">
        Book Your Clinic <br /> 
        <span className="text-primary">Appointment</span> in Seconds
      </h1>
      <p className="text-xl text-gray-500 max-w-md leading-relaxed">
        Simple, fast, and reliable scheduling for patients and clinics. Experience healthcare management at its best.
      </p>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to='/dashboard/book' className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg shadow-shadow cursor-pointer">
            Book an Appointment
          </Link>
        </motion.div>
    </motion.div>
    <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative"
      >
        <div className="relative w-full aspect-square bg-gray-100 rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              src={images[currentImage]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover "
              alt="Doctor"
            />
          </AnimatePresence>
        </div>
        <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full border-2 border-shadow rounded-[40px]"></div>
      </motion.div>
  </section>
  )
};