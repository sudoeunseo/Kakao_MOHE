import { useMemo, useState } from "react";
import LanguageContext from "./LanguageContext";

function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() =>
    localStorage.getItem("moheLanguage") === "en" ? "en" : "ko",
  );

  function setLanguage(nextLanguage) {
    const next = nextLanguage === "en" ? "en" : "ko";
    localStorage.setItem("moheLanguage", next);
    setLanguageState(next);
  }

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (ko, en) => (language === "en" ? en : ko),
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export default LanguageProvider;
