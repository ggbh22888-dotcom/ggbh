import { createContext, useContext, useEffect, useState } from 'react';
import { english } from './translations.js';

const LanguageContext = createContext(null);
export function translate(language, text) {
  return language === 'en' ? english[text] || text : text;
}
export function LanguageProvider({ children }) {
  const [language, updateLanguage] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('lang')) return params.get('lang') === 'en' ? 'en' : 'zh';
    if (params.get('paid') === 'true') {
      try {
        return JSON.parse(sessionStorage.getItem('gghb_form') || 'null')?.language === 'en' ? 'en' : 'zh';
      } catch { return 'zh'; }
    }
    return 'zh';
  });
  function setLanguage(next) {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', next);
    window.history.replaceState(null, '', url);
    updateLanguage(next);
  }
  useEffect(() => {
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-Hans';
    document.title = language === 'en' ? 'GGHB · Online BaZi Chart & Readings' : '果甘半壶 GGHB · 八字命盘线上测算';
    document.querySelector('meta[name="description"]')?.setAttribute('content', language === 'en'
      ? 'Discover your Four Pillars with your birth details. Explore AI BaZi readings, Five Elements, auspicious dates and Feng Shui guidance.'
      : '填入出生资料，即时排出八字命盘，AI 依五行喜忌撰写命盘初阅。完整命盘、择日日历、风水方位报告。');
  }, [language]);
  return <LanguageContext.Provider value={{ language, setLanguage, t: (text) => translate(language, text) }}>{children}</LanguageContext.Provider>;
}
export function useLanguage() { return useContext(LanguageContext); }
