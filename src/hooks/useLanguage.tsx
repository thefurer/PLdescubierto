
import { create } from 'zustand';

type Language = 'es' | 'en';

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguage = create<LanguageStore>((set) => ({
  language: 'es',
  setLanguage: (lang) => set({ language: lang }),
}));
