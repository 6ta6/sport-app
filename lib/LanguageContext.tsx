'use client'; // Метка «клиентский компонент»: контекст с состоянием
              // работает только в браузере

import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Language } from './translations';
import { TRANSLATIONS } from './translations';

// Описываем, что именно контекст будет раздавать компонентам:
// - language: текущий язык
// - setLanguage: функция для смены языка
// - t: функция перевода (от слова translate)
type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

// Создаём сам контекст. Пока провайдер не установлен — значение null.
// Это нужно, чтобы хук ниже мог заметить ошибку использования.
const LanguageContext = createContext<LanguageContextValue | null>(null);

// Провайдер — компонент-«обёртка»: всё, что вложено между его тегами,
// получает доступ к языку через хук useLanguage.
export function LanguageProvider({ children }: { children: ReactNode }) {
  // Текущий язык. По умолчанию русский.
  // Если в браузере сохранён другой — заменим его в useEffect ниже.
  const [language, setLanguageState] = useState<Language>('ru');

  // При первом появлении на странице читаем сохранённый язык из браузера
  useEffect(() => {
    const saved = localStorage.getItem('language');
    // Берём значение, только если оно одно из двух допустимых —
    // защита от битых или неожиданных данных
    if (saved === 'ru' || saved === 'en') {
      setLanguageState(saved);
    }
  }, []); // Пустой массив — «выполни один раз после первой отрисовки»

  // Смена языка: обновляем состояние И сразу запоминаем выбор в браузере,
  // чтобы в следующий визит язык сохранился
  const setLanguage = (newLanguage: Language): void => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  // Функция перевода: по ключу возвращает текст на текущем языке.
  // Если ключа в словаре нет — возвращаем сам ключ: так отсутствие
  // перевода сразу видно на экране, и страница не ломается.
  const t = (key: string): string => {
    const value = TRANSLATIONS[language][key];
    return value ?? key; // ?? — «если слева пусто, возьми справа»
  };

  // Раздаём данные всем детям
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Хук для удобного доступа к контексту из любого компонента
export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);

  // Если контекст пустой — значит, компонент не обёрнут в <LanguageProvider>.
  // Бросаем ошибку с понятным сообщением, чтобы проблему было легко найти.
  if (!context) {
    throw new Error('useLanguage можно использовать только внутри <LanguageProvider>');
  }

  return context;
}