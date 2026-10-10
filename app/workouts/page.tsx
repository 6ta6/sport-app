'use client'; // Метка «клиентский компонент»: нужна, чтобы использовать хук useLanguage

import Link from 'next/link';

import type { WorkoutCategory } from '../../types';
import { useLanguage } from '@/lib/LanguageContext';
import { getWorkouts } from '@/lib/data';

// Порядок, в котором показываем категории
const CATEGORIES: WorkoutCategory[] = ['wrestlers', 'bodybuilders', 'crossfit', 'runners', 'martial-arts'];

export default function WorkoutsPage() {
  // Достаём язык и функцию перевода из контекста
  const { language, t } = useLanguage();

  // Получаем массив тренировок на текущем языке
  const workouts = getWorkouts(language);

  return (
    <main className="min-h-screen bg-gray-900 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-white">{t('workouts.title')}</h1>
        <p className="mt-2 text-gray-400">{t('workouts.subtitle')}</p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CATEGORIES.map((category) => {
            // НОВОЕ: считаем, сколько тренировок в этой категории
            // Теперь categories — массив, поэтому используем includes
            const count = workouts.filter((workout) => workout.categories.includes(category)).length;

            return (
              <Link
                key={category}
                href={`/workouts/${category}`}
                className="rounded-xl border border-gray-700 bg-gray-800 p-6 transition-colors hover:border-orange-500/60"
              >
                <h2 className="text-xl font-bold text-white">{t(`categories.${category}`)}</h2>
                <p className="mt-2 text-sm text-gray-400">
                  {t('workouts.workoutsCount')}: {count}
                </p>
                <p className="mt-4 text-sm font-medium text-orange-400">→</p>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}