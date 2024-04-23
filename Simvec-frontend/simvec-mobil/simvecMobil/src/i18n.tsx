import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// Importing translation files
import en from './locales/en.json';
import fr from './locales/fr.json';
import tr from './locales/tr.json';
i18n
    .use(initReactI18next) // passes i18next instance to react-i18next
    .init({
        resources: {
            en: { translation: en },
            fr: { translation: fr },
            tr: { translation: tr }
        },
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });


export default i18n;
