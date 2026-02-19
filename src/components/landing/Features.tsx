import { LuCalendarCheck2, LuChartColumnDecreasing, LuShield } from "react-icons/lu";

export const Features = () => (
  <section id="features" className="max-w-7xl mx-auto px-6 py-24 space-y-16 bg-white shadow-sm rounded-xl">
    <div className="text-center space-y-4">
      <h2 className="text-4xl font-black text-gray-700">Main Features</h2>
      <p className="text-gray-500 max-w-2xl mx-auto">Everything you need to manage your clinic efficiently and provide the best patient experience.</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { title: "Online Booking", desc: "Patients can book appointments in seconds with real-time availability.", icon: <LuCalendarCheck2 className="text-primary"/> },
        { title: "No Double Bookings", desc: "Our smart algorithm prevents schedule conflicts automatically.", icon: <LuShield className="text-primary"/> },
        { title: "Clinic Dashboard", desc: "Staff can manage daily appointments and patient records easily.", icon: <LuChartColumnDecreasing className="text-primary"/> },
      ].map((f, i) => (
        <div key={i} className="group p-10 bg-white border border-gray-100 rounded-[35px] hover:border-primary hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-300">
          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-blue-50 group-hover:scale-110 transition-transform">
            {f.icon}
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-4">{f.title}</h3>
          <p className="text-gray-500 leading-relaxed text-sm">{f.desc}</p>
        </div>
      ))}
    </div>
  </section>
);