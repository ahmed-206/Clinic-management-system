export const Stats = () => (
  <section className="max-w-7xl mx-auto px-6 py-12">
    <div className="bg-primary rounded-[30px] p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-8">
      {[
        { label: "Active Doctors", value: "+50" },
        { label: "Happy Patients", value: "+10k" },
        { label: "Appointments", value: "+25k" },
        { label: "Support", value: "24/7" },
      ].map((stat, i) => (
        <div key={i} className="text-center space-y-1">
          <div className="text-3xl font-black text-white">{stat.value}</div>
          <div className="text-white text-sm uppercase tracking-widest">{stat.label}</div>
        </div>
      ))}
    </div>
  </section>
);