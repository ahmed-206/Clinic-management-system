import React, { useState } from 'react';
import supabase from '../supabase';
import { toast } from 'sonner';
import { useSettings } from '../hooks/admin/useSettings';
import { LuPhone } from "react-icons/lu";
import { FaRegEnvelope } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";
import { Button } from '../components/ui/Button';



const ContactUs = () => {
  const [loading, setLoading] = useState(false);
    const {settings} = useSettings();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const { error } = await supabase.from('contact_messages').insert({
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    });

    if (error) toast.error("Failed to send message");
    else {
      toast.success("Message sent successfully!");
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  };

 const labelStyle = "text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1";
  const inputStyle = "w-full h-12 rounded-xl border border-neutral-200 bg-neutral-50 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-neutral-300";

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full grid md:grid-cols-5 gap-0 bg-white rounded-[32px] overflow-hidden shadow-xl border border-neutral-100">
        
        {/* Info Side (2/5 of the width) */}
        <div className="md:col-span-2 bg-primary p-12 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold font-headline leading-tight">Contact Us / تواصل معنا</h2>
            <p className="mt-4 opacity-80 font-medium">نحن هنا لمساعدتك على مدار الساعة.</p>
          </div>

          <div className="space-y-6">
            {[
              { icon: <GrLocation />, text: "Egypt, Cairo" },
              { icon: <LuPhone />, text: settings?.clinic_phone },
              { icon: <FaRegEnvelope />, text: settings?.clinic_email }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 text-sm font-medium">
                <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>

        {/* Form Side (3/5 of the width) */}
        <form onSubmit={handleSubmit} className="md:col-span-3 p-12 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className={labelStyle}>Full Name / الاسم</label>
              <input name="name" required className={inputStyle} placeholder="John Doe" />
            </div>
            <div className="flex flex-col">
              <label className={labelStyle}>Email / البريد</label>
              <input name="email" type="email" required className={inputStyle} placeholder="example@mail.com" />
            </div>
          </div>
          
          <div className="flex flex-col">
            <label className={labelStyle}>Message / الرسالة</label>
            <textarea name="message" rows={4} required className={`${inputStyle} h-32 py-4 resize-none`} placeholder="How can we help you?" />
          </div>

          <Button 
            variant="primary" 
            isLoading={loading}
            className="w-full !h-14 !rounded-xl text-lg"
          >
            {loading ? 'Sending...' : 'Send Message / إرسال'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;