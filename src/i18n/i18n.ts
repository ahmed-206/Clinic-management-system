import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import enCommon from './locales/en/common.json';
import enNav from './locales/en/nav.json';
import enLanding from './locales/en/landing.json';

import arCommon from './locales/ar/common.json';
import arNav from './locales/ar/nav.json';
import arLanding from './locales/ar/landing.json';


i18n

  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: {
      en: {
      common: enCommon,
      nav: enNav,
      landing: enLanding,
    },
    ar: {
      common: arCommon,
      nav: arNav,
      landing: arLanding,
    },
    },
    ns: ['common', 'nav'], 
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