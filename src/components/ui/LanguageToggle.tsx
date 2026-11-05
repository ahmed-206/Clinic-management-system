import { useLanguage } from '@/hooks/language/useLanguage';


export const LanguageToggle = () => {
  const { isArabic, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center  px-3 py-1.5 text-sm font-medium text-white  cursor-pointer transition-all"
    >
      {isArabic ? (
        <>
          <span>ENG</span>
        
        </>
      ) : (
        <>
          <span>AR</span>
        
        </>
      )}
    </button>
  );
};