import React, { useState } from 'react';
import supabase from '../supabase';
import { toast } from 'sonner';
import { useSettings } from '../hooks/admin/useSettings';
import { LuPhone } from "react-icons/lu";
import { FaRegEnvelope } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";



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

  const divStyle = "flex flex-col gap-2 items-start";
  const lableStyle = "text-lg font-medium text-gray-700";
  const inputSyle =
    "w-full h-12 rounded-xl border border-gray-400 bg-transparent px-4 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all";
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 bg-gray-50 rounded-3xl overflow-hidden shadow-xl">
        {/* Info Side */}
        <div className="bg-primary p-12 text-white flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6">Contact Us / تواصل معنا</h2>
          <p className="mb-8 text-blue-100">Have questions? We are here to help you 24/7.</p>
          <div className="space-y-4">
            <div className="flex items-center gap-4"><span><GrLocation /></span> Egypt, Cairo</div>
            <div className="flex items-center gap-4"><span><LuPhone /></span> {settings?.clinic_phone}</div>
            <div className="flex items-center gap-4"><span><FaRegEnvelope /></span> {settings?.clinic_email}</div>
          </div>
        </div>

        {/* Form Side */}
        <form onSubmit={handleSubmit} className="p-12 space-y-4">
          <div className={divStyle}>
            <label className={lableStyle}>Name / الاسم</label>
            <input name="name" required className={inputSyle} />
          </div>
          <div className={divStyle}>
            <label className={lableStyle}>Email / البريد</label>
            <input name="email" type="email" required className={inputSyle} />
          </div>
          <div className={divStyle}>
            <label className={lableStyle}>Message / الرسالة</label>
            <textarea name="message" rows={4} required className={inputSyle}/>
          </div>
          <button 
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition shadow-lg shadow-primary/20"
          >
            {loading ? 'Sending...' : 'Send Message / إرسال'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;