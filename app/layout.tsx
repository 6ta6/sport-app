'use client'; // Метка «клиентский компонент»: используется в браузере
              // (хуки, контекст, переключение языка)
import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { LanguageProvider, useLanguage } from '@/lib/LanguageContext';

const NAV_ITEMS = [
  { href: '/workouts', icon: '🏋️', labelKey: 'nav.workouts' },
  { href: '/exercises', icon: '💪', labelKey: 'nav.exercises' },
  { href: '/builder', icon: '🛠️', labelKey: 'nav.builder' },
  { href: '/training', icon: '🚀', labelKey: 'nav.training' },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="utf-8" />
        {/* КЛЮЧЕВОЙ мета-тег: viewport-fit=cover включает поддержку
            env(safe-area-inset-*). Без него safe area не работает! */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <title>Sport App</title>
      </head>
      {/* УБРАЛИ pt и pb с body — пусть safe area учитывается
          только там, где это нужно (внутри LayoutContent) */}
      <body className="bg-gray-900 text-white">
        <LanguageProvider>
          <LayoutContent>{children}</LayoutContent>
        </LanguageProvider>
      </body>
    </html>
  );
}

function LayoutContent({ children }: { children: ReactNode }) {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();

  return (
    <>
      {/* Кнопка переключения языка:
          top-[calc(env(safe-area-inset-top)+0.75rem)] —
          отступ от ВЕРХНЕЙ safe area (статус-бар) + 12px (0.75rem),
          чтобы кнопка не залезала под батарею/сигнал/время.
          На десктопе env(safe-area-inset-top) = 0,
          поэтому кнопка будет просто в 12px от верха. */}
      <button
        onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
        title="Переключить язык / Switch language"
        className="fixed right-3 z-50 rounded-full border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-gray-700"
        style={{
          top: 'calc(env(safe-area-inset-top, 0px) + 0.75rem)',
        }}
      >
        {language === 'ru' ? 'EN' : 'RU'}
      </button>

      {/* Основное содержимое с учётом safe area:
          - сверху: отступ под статус-бар + место для кнопки языка
          - снизу: отступ под нижнюю навигацию + safe area (Home indicator) */}
      <main
        className="pb-20"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top, 0px) + 3.5rem)',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 5rem)',
        }}
      >
        {children}
      </main>

      {/* Нижняя навигация с учётом safe area снизу (Home indicator на iPhone X+) */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-700 bg-gray-800"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-around">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-2 text-[10px] transition-colors ${
                  isActive ? 'text-orange-400' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {t(item.labelKey)}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}