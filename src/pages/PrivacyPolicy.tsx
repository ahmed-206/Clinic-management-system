const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-neutral-50 py-20 px-4">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-[24px] shadow-sm border border-neutral-100">
        <header className="border-b border-neutral-100 pb-8 mb-10 text-center">
          <h1 className="text-3xl font-black text-neutral-900 font-headline mb-2">
            Privacy Policy
          </h1>
          <p className="text-primary font-bold">سياسة الخصوصية</p>
        </header>
        
        <div className="space-y-12">
          {/* Section 1 */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary " /> 
                1. Data Collection
              </h2>
              <p className="text-neutral-600 text-sm leading-relaxed">
                We collect personal information and medical records solely to provide healthcare services. All data is secured via RLS technology.
              </p>
            </section>
            <section className="text-right space-y-3" dir="rtl">
              <h2 className="text-lg font-bold text-neutral-900 flex items-center justify-end gap-2">
                1. جمع البيانات
                <span className="w-1.5 h-6 bg-primary " />
              </h2>
              <p className="text-neutral-600 text-sm leading-relaxed">
                نجمع معلوماتك الشخصية وسجلك الطبي لتقديم خدماتنا فقط. بياناتك محمية تماماً بتقنيات تشفير متطورة.
              </p>
            </section>
          </div>

          <hr className="border-neutral-50" />

          {/* Section 2 */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary " /> 
                2. Data Sharing
              </h2>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Your medical history is confidential. It is only visible to you and your booked doctors. We never sell your data.
              </p>
            </section>
            <section className="text-right space-y-3" dir="rtl">
              <h2 className="text-lg font-bold text-neutral-900 flex items-center justify-end gap-2">
                2. مشاركة البيانات
                <span className="w-1.5 h-6 bg-primary " />
              </h2>
              <p className="text-neutral-600 text-sm leading-relaxed">
                تاريخك الطبي سري ولن يراه إلا طبيبك المختص. نحن لا نقوم ببيع أو مشاركة بياناتك مع أي طرف ثالث.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;