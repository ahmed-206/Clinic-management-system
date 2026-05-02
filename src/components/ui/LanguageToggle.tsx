// src/components/ui/LanguageToggle.tsx
import { useLanguage } from '../../hooks/language/useLanguage';

export const LanguageToggle = () => {
  const { isArabic, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-primary/40 text-sm font-medium text-secondary transition-all"
    >
      {isArabic ? (
        <>
          <span>EN</span>
          <span className="text-xs text-gray-400">English</span>
        </>
      ) : (
        <>
          <span>ع</span>
          <span className="text-xs text-gray-400">العربية</span>
        </>
      )}
    </button>
  );
};