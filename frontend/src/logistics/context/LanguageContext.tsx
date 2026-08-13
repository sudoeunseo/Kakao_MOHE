import React, { createContext, useContext, useState } from 'react';
import { translateText } from '../utils/translations';

export type Lang = 'KO' | 'EN';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (ko: string, en?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
  lang?: Lang;
  onLangChange?: (lang: Lang) => void;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  lang: externalLang,
  onLangChange,
}) => {
  const [internalLang, setInternalLang] = useState<Lang>('KO');

  const currentLang = externalLang !== undefined ? externalLang : internalLang;

  const handleSetLang = (newLang: Lang) => {
    if (onLangChange) {
      onLangChange(newLang);
    }
    setInternalLang(newLang);
  };

  const toggleLang = () => {
    handleSetLang(currentLang === 'KO' ? 'EN' : 'KO');
  };

  const t = (ko: string, en?: string): string => {
    if (currentLang === 'EN') {
      if (en) return en;
      return translateText(ko, 'EN');
    }
    return ko;
  };

  return (
    <LanguageContext.Provider value={{ lang: currentLang, setLang: handleSetLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      lang: 'KO',
      setLang: () => {},
      toggleLang: () => {},
      t: (ko: string, en?: string) => (en ? en : ko),
    };
  }
  return context;
};
