export const HowItWorks = () => {
  const steps = [
    { number: "01", title: "Choose a doctor", desc: "Browse our list of professional specialists." },
    { number: "02", title: "Pick a date", desc: "Select the day that suits your schedule best." },
    { number: "03", title: "Select a time", desc: "Choose from available real-time slots." },
    { number: "04", title: "Confirm booking", desc: "Get an instant confirmation for your visit." },
  ];

  return (
    <section id="how-it-works" className=" py-24 bg-white shadow-sm rounded-xl my-3">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-black text-gray-700">How It Works</h2>
          <p className="text-gray-500">Booking your next medical appointment is easier than ever.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative group">
              {/* السهم الموصل بين الخطوات (يظهر في الشاشات الكبيرة فقط) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full border-t-2 border-dashed border-gray-200 -translate-x-12 z-0"></div>
              )}
              
              <div className="relative z-10 bg-white p-8 rounded-[30px] border border-gray-100 shadow-sm hover:shadow-md transition-all text-center space-y-4">
                <div className="text-4xl font-black text-blue-100 group-hover:text-primary transition-colors duration-300">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-gray-700">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};