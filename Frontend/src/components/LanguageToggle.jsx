import { useLanguage } from '../utils/useLanguage';
import './languageToggle.css';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button 
      className="language-toggle" 
      onClick={toggleLanguage}
      aria-label="Toggle language"
      title={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
    >
      {language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
    </button>
  );
}
