import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from './fr.json';
import en from './en.json';
import fon from './fon.json';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng: 'fr',
    fallbackLng: 'fr',
    resources: {
      fr: { translation: fr },
      en: { translation: en },
      fon: { translation: fon },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
