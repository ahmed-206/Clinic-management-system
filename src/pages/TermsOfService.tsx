

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-primary mb-8 flex items-center gap-3">
          
          Terms of Service / شروط الاستخدام
        </h1>

        <div className="grid md:grid-cols-2 gap-10">
          {/* English Column */}
          <div className="space-y-6 border-r pr-6">
            <h2 className="font-bold text-lg text-primary">General Terms</h2>
            <p className="text-sm text-gray-600">By using this platform, you agree that we are a management tool, not a medical provider. Emergency cases should contact local hospitals immediately.</p>
            <ul className="list-disc ml-5 text-sm text-gray-500 space-y-2">
              <li>Users must provide accurate personal info.</li>
              <li>Prescriptions are the sole responsibility of the issuing doctor.</li>
              <li>Unauthorized access attempt is strictly prohibited.</li>
            </ul>
          </div>

          {/* Arabic Column */}
          <div className="space-y-6 text-right" dir="rtl">
            <h2 className="font-bold text-lg text-primary">الشروط العامة</h2>
            <p className="text-sm text-gray-600">باستخدامك لهذه المنصة، فإنك توافق على أننا أداة إدارة ولسنا مزوداً طبياً. يجب على حالات الطوارئ الاتصال بالمستشفيات المحلية فوراً.</p>
            <ul className="list-disc mr-5 text-sm text-gray-500 space-y-2">
              <li>يجب على المستخدمين تقديم معلومات دقيقة.</li>
              <li>الروشتات هي مسؤولية الطبيب المصدر لها وحده.</li>
              <li>محاولات الدخول غير المصرح بها ممنوعة تماماً.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;