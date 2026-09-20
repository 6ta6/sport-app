'use client'; // Метка «клиентский компонент»: используется в браузере
              // (хуки, контекст, переключение языка)
import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Хук, который знает текущий адрес страницы
import type { ReactNode } from 'react';
// Провайдер языка и хук доступа к нему
import { LanguageProvider, useLanguage } from '@/lib/LanguageContext';

// Вкладки нижней навигации.
// Вместо готового текста храним КЛЮЧ перевода (labelKey) —
// сам текст достанем из словаря в момент отрисовки.
const NAV_ITEMS = [
  { href: '/workouts', icon: '🏋️', labelKey: 'nav.workouts' },
  { href: '/exercises', icon: '💪', labelKey: 'nav.exercises' },
  { href: '/builder', icon: '🛠️', labelKey: 'nav.builder' },
  { href: '/training', icon: '🚀', labelKey: 'nav.training' },
];

// Главный лейаут. Его задача — только «обернуть» приложение в провайдер языка.
// ВАЖНО: сам он не может вызывать useLanguage, потому что компонент
// не видит контекст, который он сам же и предоставляет. Поэтому вся
// «живая» часть вынесена в LayoutContent ниже.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // lang оставили «ru» статично: чтобы менять его динамически,
    // провайдер пришлось бы выносить выше <html>, что усложнило бы код
    <html lang="ru">
      <body className="bg-gray-900">
        {/* Оборачиваем ВСЁ дерево приложения в провайдер языка */}
        <LanguageProvider>
          <LayoutContent>{children}</LayoutContent>
        </LanguageProvider>
      </body>
    </html>
  );
}

// «Живая» часть лейаута: навигация, заголовок вкладки, кнопка языка.
// Находится ВНУТРИ провайдера, поэтому может пользоваться useLanguage.
function LayoutContent({ children }: { children: ReactNode }) {
  // Достаём из контекста текущий язык, функцию смены и функцию перевода
  const { language, setLanguage, t } = useLanguage();

  // Текущий адрес — для подсветки активной вкладки
  const pathname = usePathname();

  return (
    <>
      {/* Заголовок вкладки браузера — тоже переводится */}
      <title>{t('app.title')}</title>

      {/* Кнопка переключения языка — приклеена к правому верхнему углу.
          Показывает язык, НА КОТОРЫЙ переключит: сейчас русский — видим «EN»,
          сейчас английский — видим «RU». */}
      <button
        onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
        title="Переключить язык / Switch language"
        className="fixed right-3 top-3 z-50 rounded-full border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-gray-700"
      >
        {language === 'ru' ? 'EN' : 'RU'}
      </button>

      {/* Основное содержимое страницы с отступом снизу,
          чтобы нижняя навигация ничего не перекрывала */}
      <main className="pb-24">{children}</main>

      {/* ─── Нижняя навигация ─── */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-700 bg-gray-800">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-around">
          {NAV_ITEMS.map((item) => {
            // Вкладка активна, если адрес начинается с её пути
            // (например, '/workouts/wrestlers' подсветит «Тренировки»)
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
                {/* Текст вкладки берём из словаря по ключу */}
                {t(item.labelKey)}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}