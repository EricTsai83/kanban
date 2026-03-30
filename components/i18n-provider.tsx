"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  getDictionary,
  isLocale,
  type AppDictionary,
  type Locale,
} from "@/lib/i18n";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  copy: AppDictionary;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function syncDocumentMetadata(copy: AppDictionary, locale: Locale) {
  document.documentElement.lang = locale;
  document.title = copy.metadata.title;

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute("content", copy.metadata.description);
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_LOCALE;
    }

    const savedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocale(savedLocale) ? savedLocale : DEFAULT_LOCALE;
  });

  const copy = useMemo(() => getDictionary(locale), [locale]);

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    syncDocumentMetadata(copy, locale);
  }, [copy, locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      copy,
    }),
    [copy, locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider.");
  }

  return context;
}
