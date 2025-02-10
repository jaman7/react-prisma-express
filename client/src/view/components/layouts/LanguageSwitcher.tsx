import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng); // Change language in i18next
    localStorage.setItem('i18nextLng', lng); // Persist language in localStorage
  };

  return (
    <div>
      <button onClick={() => handleLanguageChange('en')}>English</button>
      <button onClick={() => handleLanguageChange('pl')}>Polski</button>
    </div>
  );
};

export default LanguageSwitcher;
