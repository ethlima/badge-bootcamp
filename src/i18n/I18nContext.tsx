import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { LOCALES, strings, type Locale, type StringSet } from "./strings";

const STORAGE_KEY = "badge-bootcamp-locale";

function detectInitialLocale(): Locale {
  if (typeof window === "undefined") return "es";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "es" || stored === "en") return stored;
  } catch {
    // localStorage unavailable
  }
  const browser = (navigator.language || "es").slice(0, 2).toLowerCase();
  return browser === "en" ? "en" : "es";
}

type I18nContextValue = {
  locale: Locale;
  t: StringSet;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => detectInitialLocale());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // ignore
    }
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      t: strings[locale],
      setLocale: (next) => {
        if (LOCALES.includes(next)) setLocaleState(next);
      },
      toggleLocale: () => setLocaleState((prev) => (prev === "es" ? "en" : "es")),
    }),
    [locale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}

export function useT(): StringSet {
  return useI18n().t;
}
