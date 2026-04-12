

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-neutral-50 py-20 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-[32px] overflow-hidden shadow-sm border border-neutral-100">
        <div className="bg-primary p-12 text-center text-white">
          <h1 className="text-3xl font-black font-headline">Terms of Service</h1>
          <p className="opacity-80 mt-2 font-medium">شروط وأحكام الاستخدام</p>
        </div>

        <div className="grid md:grid-cols-2 divide-x divide-neutral-100">
          {/* English Column */}
          <div className="p-10 space-y-6">
            <h2 className="font-bold text-xl text-neutral-900">General Rules</h2>
            <p className="text-neutral-600 leading-relaxed">By using our platform, you agree that we are a management tool, not a direct medical provider.</p>
            <ul className="space-y-4">
              {['Provide accurate info', 'Prescriptions belong to doctors', 'No unauthorized access'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-neutral-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Arabic Column */}
          <div className="p-10 space-y-6 text-right" dir="rtl">
            <h2 className="font-bold text-xl text-neutral-900">القواعد العامة</h2>
            <p className="text-neutral-600 leading-relaxed">باستخدامك للمنصة، أنت توافق على أننا أداة تقنية لتنظيم المواعيد ولسنا جهة طبية مباشرة.</p>
            <ul className="space-y-4">
              {['تقديم معلومات دقيقة وصحيحة', 'الروشتات مسؤولية الطبيب فقط', 'يمنع محاولة الدخول غير المصرح'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-neutral-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;