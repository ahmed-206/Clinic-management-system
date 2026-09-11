import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import LanguageDetector from 'i18next-browser-languagedetector';
import { en } from '@/i18n/locales/en/index';
import { ar } from '@/i18n/locales/ar/index';


i18n

  
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: { en, ar }, 
    defaultNS: 'common',
    debug: true,
    
    supportedLngs: ['en', 'ar'],
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    detection: {
      // رتب مصادر اكتشاف اللغة
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'], // يحفظ اختيار المستخدم
    },
  });


export default i18n;