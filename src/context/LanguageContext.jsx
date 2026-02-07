import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState('en');

    const setLanguage = (nextLang) => {
        if (!nextLang) return;
        setLang(nextLang);
    };

    const toggleLanguage = () => {
        setLang(prev => prev === 'en' ? 'fr' : 'en');
    };

    const t = (translations) => {
        if (translations === null || translations === undefined) return '';
        if (React.isValidElement(translations)) return translations;
        if (typeof translations !== 'object' || Array.isArray(translations)) return translations;
        return translations[lang] || translations['en'] || '';
    };

    return (
        <LanguageContext.Provider value={{ lang, toggleLanguage, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
