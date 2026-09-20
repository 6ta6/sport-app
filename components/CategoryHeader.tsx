'use client'; // Клиентский компонент: использует хук useLanguage

import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

// Пропсы компонента.
// Все три необязательные: для случая «категория не найдена» достаточно
// передать только isNotFound, а для обычной страницы — ключ и счётчик.
type Props = {
  categoryLabelKey?: string; // ключ перевода категории, например 'categories.wrestlers'
  workoutsCount?: number;    // количество тренировок в категории
  isNotFound?: boolean;      // true, если категория не существует
};

export default function CategoryHeader({ categoryLabelKey, workoutsCount, isNotFound }: Props) {
  // Достаём функцию перевода из контекста языка
  const { t } = useLanguage();

  return (
    <>
      {/* Кнопка «Назад» — возвращает к списку категорий.
          Стрелку рисуем сами, а слово берём из переводов. */}
      <Link
        href="/workouts"
        className="text-sm text-orange-400 transition-colors hover:text-orange-300"
      >
        ← {t('back')}
      </Link>

      {isNotFound ? (
        // ═══ Категория не найдена ═══
        <>
          <h1 className="mt-4 text-3xl font-bold text-white">
            {t('workouts.categoryNotFound')}
          </h1>
          {/* Пояснение теперь тоже берём из словаря переводов */}
          <p className="mt-2 text-gray-400">
            {t('workouts.categoryNotFoundDesc')}
          </p>
        </>
      ) : (
        // ═══ Обычная страница категории ═══
        <>
          {/* Заголовок с названием категории.
              Оператор ! говорит TypeScript: «я уверен, что categoryLabelKey
              передан, если мы в этой ветке (не isNotFound)». */}
          <h1 className="mt-4 text-3xl font-bold text-white">
            {t(categoryLabelKey!)}
          </h1>
          {/* Счётчик тренировок */}
          <p className="mt-2 text-gray-400">
            {t('workouts.workoutsCount')}: {workoutsCount}
          </p>
        </>
      )}
    </>
  );
}