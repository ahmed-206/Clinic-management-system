


const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-primary mb-6 border-b pb-4">
            
            Privacy Policy / سياسة الخصوصية
            </h1>
        
        <div className="space-y-8 text-gray-600 leading-relaxed">
          {/* English Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Data Collection</h2>
            <p>We collect personal information (name, email) and medical records (prescriptions, history) solely to provide our healthcare management services. All data is stored securely using Row Level Security (RLS) technology.</p>
          </section>

          {/* Arabic Section */}
          <section className="text-right" dir="rtl">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. جمع البيانات</h2>
            <p>نحن نجمع المعلومات الشخصية (الاسم، البريد الإلكتروني) والسجلات الطبية (الروشتات، التاريخ المرضي) فقط لتقديم خدمات إدارة الرعاية الصحية لدينا. يتم تخزين جميع البيانات بشكل آمن باستخدام تقنية RLS.</p>
          </section>

          <hr />

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Data Sharing</h2>
            <p>Your medical history is strictly confidential. It is only visible to you and the doctors you have booked appointments with. We never sell or share your data with third-party advertisers.</p>
          </section>

          <section className="text-right" dir="rtl">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. مشاركة البيانات</h2>
            <p>تاريخك الطبي سري للغاية. لا يمكن رؤيته إلا من قبلك ومن قبل الأطباء الذين حجزت مواعيد معهم. نحن لا نبيع أو نشارك بياناتك أبداً مع معلنين خارجيين.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;