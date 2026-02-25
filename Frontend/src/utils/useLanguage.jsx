import { useState, useEffect, createContext, useContext } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('selectedLanguage');
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('selectedLanguage', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const translate = (key, translations, language = 'en') => {
  if (!translations[language]) return translations.en || '';
  return translations[language][key] || translations.en[key] || '';
};
