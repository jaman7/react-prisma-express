import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import ChainedBackend from 'i18next-chained-backend';
import HttpBackend from 'i18next-http-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';

i18n
  .use(ChainedBackend) // Use ChainedBackend
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'pl'], // Limit to only 'en' and 'pl'
    debug: false,
    ns: ['common', 'projects'], // Add your namespaces here
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'], // Detect from localStorage first
      caches: ['localStorage'], // Cache detected language in localStorage
    },
    backend: {
      backends: [
        LocalStorageBackend, // Cache translations in localStorage
        HttpBackend, // Fallback to HTTP if not in localStorage
      ],
      backendOptions: [
        {
          // Options for LocalStorageBackend
          expirationTime: 7 * 24 * 60 * 60 * 1000, // Cache for 7 days
          prefix: 'i18next_res_', // Optional prefix for localStorage keys
        },
        {
          // Options for HttpBackend
          loadPath: '/i18/{{lng}}/{{ns}}.json', // Path to load translations
        },
      ],
    },
  });

export default i18n;
