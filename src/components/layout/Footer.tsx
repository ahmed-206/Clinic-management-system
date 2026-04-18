import { HashLink } from "react-router-hash-link";
import { useSettings } from "../../hooks/admin/useSettings";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; 
import logoWhite from '../../assets/heroImg/doctori2.png'

export const Footer = () => {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();

  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // تأخير بسيط بين ظهور كل عمود
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    },
  };

  return (
    <footer className="w-full py-12 md:py-16 bg-primary mt-auto text-white border-t border-white/10 overflow-hidden">
      <motion.div 
        className="container mx-auto px-6 lg:px-12 text-center"
        initial="hidden"
        whileInView="visible" 
        viewport={{ once: true }} 
        variants={containerVariants}
      >
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 text-center md:text-left">
          
         
          <motion.div variants={itemVariants} className="flex flex-col gap-4 items-center md:items-start">
            <div>
        <Link to='/'><img src={logoWhite} alt="logo" height={124} width={124}/></Link>
      </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              Providing world-class healthcare services with the best specialists in the field.
            </p>
          </motion.div>

         
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <h3 className="text-lg font-bold uppercase tracking-wider text-white">Quick Links</h3>
            <nav className="flex flex-col gap-3 text-white/70">
              <Link to="/" className="text-base font-medium hover:translate-x-1 transition-all duration-300">Home</Link>
              <HashLink smooth to="/#features" className="text-base font-medium hover:translate-x-1 transition-all duration-300">Features</HashLink>
              <HashLink smooth to="/#how-it-works" className="text-base font-medium hover:translate-x-1 transition-all duration-300">How it works</HashLink>
            </nav>
          </motion.div>

         
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <h3 className="text-lg font-bold uppercase tracking-wider text-white">Legal & Support</h3>
            <nav className="flex flex-col gap-3 text-white/70">
              <Link to="/terms" className="text-base font-medium hover:translate-x-1 transition-all duration-300">Terms of Service</Link>
              <Link to="/privacy" className="text-base font-medium hover:translate-x-1 transition-all duration-300">Privacy Policy</Link>
              <Link to="contactus" className="text-base font-medium hover:translate-x-1 transition-all duration-300">Contact Us</Link>
            </nav>
          </motion.div>
        </div>

        
        <motion.div 
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-center items-center gap-4 text-white/40 text-sm"
        >
          <p>© {currentYear} {settings?.clinic_name}. All rights reserved.</p>
        </motion.div>
      </motion.div>
    </footer>
  );
};