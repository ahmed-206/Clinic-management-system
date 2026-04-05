import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";

// 1. تعريف الصور المستوردة
import doc1 from '../../assets/heroImg/doc1.jpg';
import doc2 from '../../assets/heroImg/doc2.jpg';
import doc3 from '../../assets/heroImg/doc3.jpg';

export const Hero = () => {
  // 2. وضع الصور في مصفوفة لسهولة التنقل
  const images = [doc1, doc2, doc3];
  const [currentImage, setCurrentImage] = useState(0);

  // 3. تأثير التبديل التلقائي كل 5 ثوانٍ
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden pt-20">
      
      {/* Background Layer - الصور المتحركة */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {/* التدرج اللوني فوق الصورة لجعل النص واضحاً (Overlay) */}
            <div className="absolute inset-0 bg-primary/90 z-10" />
            
            <img
              src={images[currentImage]}
              className="w-full h-full object-cover"
              alt={`Medical Care ${currentImage + 1}`}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content Layer - النصوص في المنتصف */}
      <div className="relative z-20 w-full px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center space-y-8"
        >
       

          {/* العنوان الضخم */}
          <h1 className="text-2xl md:text-7xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight max-w-5xl">
            Book Your Clinic <br /> 
            
              Appointment
            in Seconds
          </h1>

          {/* وصف يخدم المريض والطبيب */}
          <p className="text-lg md:text-xl text-white/50 max-w-2xl leading-relaxed mx-auto font-light">
            Empowering patients with easy booking and providing doctors with 
            advanced clinic management. The future of healthcare is here.
          </p>

          {/* أزرار الأكشن */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to='/dashboard/book' 
                className="px-10 py-4 bg-white text-primary rounded-full font-bold text-lg shadow-2xl hover:bg-blue-50 transition-all"
              >
                Book an Appointment
              </Link>
            </motion.div>
            
           
          </div>

          {/* Slide Indicators - النقط السفلية */}
          <div className="flex gap-3 mt-12">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={`h-1.5 transition-all duration-500 rounded-full ${
                  idx === currentImage ? "w-12 bg-white" : "w-3 bg-white/30"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>

     
    </section>
  );
};