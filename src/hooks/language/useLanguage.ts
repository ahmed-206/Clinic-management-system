import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  
  useEffect(() => {
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = isArabic ? 'ar' : 'en';
  }, [isArabic]);

  const toggleLanguage = () => {
    i18n.changeLanguage(isArabic ? 'en' : 'ar');
  };

  const setLanguage = (lang: 'en' | 'ar') => {
    i18n.changeLanguage(lang);
  };

  return {
    language: i18n.language as 'en' | 'ar',
    isArabic,
    isRTL: isArabic,
    toggleLanguage,
    setLanguage,
  };
};