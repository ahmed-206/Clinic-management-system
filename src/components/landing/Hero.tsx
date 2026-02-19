import doc1 from '../../assets/heroImg/doc1.jpg'
import doc2 from '../../assets/heroImg/doc2.jpg'
import doc3 from '../../assets/heroImg/doc3.jpg'
import { useEffect, useState } from 'react';
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
    <div className="space-y-8">
      <h1 className="text-5xl md:text-6xl font-black text-gray-700 leading-[1.1] tracking-tight">
        Book Your Clinic <br /> 
        <span className="text-primary">Appointment</span> in Seconds
      </h1>
      <p className="text-xl text-gray-500 max-w-md leading-relaxed">
        Simple, fast, and reliable scheduling for patients and clinics. Experience healthcare management at its best.
      </p>
      <button className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg  hover:scale-105 transition-all shadow-lg shadow-shadow cursor-pointer">
        Book an Appointment
      </button>
    </div>
    <div className="relative">
      <div className="w-full aspect-square bg-gray-100 rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
        {/* يمكنك وضع صورة طبيب هنا لاحقاً */}
        <div className="relative w-full h-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400 font-bold">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="Doctor"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-2000 ease-in-out ${
                index === currentImage ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      </div>
      {/* لمسة ديكور بسيطة خلف الصورة */}
      <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full border-2 border-shadow rounded-[40px]"></div>
    </div>
  </section>
  )
};