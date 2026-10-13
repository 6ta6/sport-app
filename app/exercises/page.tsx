'use client'; // Метка «клиентский компонент»: выполняется в браузере

import { useState } from 'react';
import Link from 'next/link';

import type { Exercise, MuscleGroup, Equipment, Difficulty } from '../../types';
import { useLanguage } from '@/lib/LanguageContext';
import { getExercises } from '@/lib/data';

// НОВОЕ: варианты фильтров по группе мышц — теперь 8 кнопок
const FILTERS: { value: MuscleGroup | 'all'; labelKey: string }[] = [
  { value: 'all', labelKey: 'exercises.filterAll' },
  { value: 'arms', labelKey: 'exercises.filterArms' },
  { value: 'legs', labelKey: 'exercises.filterLegs' },
  { value: 'back', labelKey: 'exercises.filterBack' },
  { value: 'shoulders', labelKey: 'exercises.filterShoulders' },
  { value: 'chest', labelKey: 'exercises.filterChest' },
  { value: 'core', labelKey: 'exercises.filterCore' },
  { value: 'combo', labelKey: 'exercises.filterCombo' },
];

// Маппинг значений инвентаря на ключи перевода
const EQUIPMENT_KEYS: Record<Equipment, string> = {
  none: 'equipment.none',
  dumbbells: 'equipment.dumbbells',
  barbell: 'equipment.barbell',
  kettlebell: 'equipment.kettlebell',
  'pull-up-bar': 'equipment.pullUpBar',
  bench: 'equipment.bench',
};

// Цвета бейджей сложности
const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  easy: 'bg-green-500/20 text-green-400',
  medium: 'bg-amber-500/20 text-amber-400',
  hard: 'bg-red-500/20 text-red-400',
};

// Цвета бейджей инвентаря
const EQUIPMENT_STYLES: Record<Equipment, string> = {
  none: 'bg-sky-500/20 text-sky-400',
  dumbbells: 'bg-gray-700 text-gray-300',
  barbell: 'bg-gray-700 text-gray-300',
  kettlebell: 'bg-gray-700 text-gray-300',
  'pull-up-bar': 'bg-gray-700 text-gray-300',
  bench: 'bg-gray-700 text-gray-300',
};

export default function ExercisesPage() {
  const { language, t } = useLanguage();
  const exercises = getExercises(language);

  const [activeFilter, setActiveFilter] = useState<MuscleGroup | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // ФИЛЬТРАЦИЯ НЕ МЕНЯЕТСЯ: проверяем только ГЛАВНУЮ группу мышц.
  const filteredExercises = exercises.filter((exercise) => {
    const matchesGroup =
      activeFilter === 'all' || exercise.muscleGroup === activeFilter;
    const matchesSearch = exercise.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-gray-900 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-white">{t('exercises.title')}</h1>
        <p className="mt-2 text-gray-400">{t('exercises.subtitle')}</p>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('exercises.search')}
          className="mt-6 w-full rounded-full border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-orange-500"
        />

        <div className="mt-4 flex flex-wrap gap-2">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.value;
            return (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={
                  isActive
                    ? 'rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors'
                    : 'rounded-full bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700'
                }
              >
                {t(filter.labelKey)}
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-sm text-gray-500">
          {t('exercises.found')}: {filteredExercises.length}
        </p>

        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredExercises.map((exercise) => (
            <article
              key={exercise.id}
              className="rounded-xl border border-gray-700 bg-gray-800 p-5"
            >
              <Link
                href={`/exercises/${exercise.id}`}
                className="text-lg font-semibold text-white transition-colors hover:text-orange-400"
              >
                {exercise.name}
              </Link>

              {/* Бейджи: главная группа → вторичные группы → инвентарь → сложность */}
              <div className="mt-3 flex flex-wrap gap-2">
                {/* 1. Главная группа мышц — ОРАНЖЕВАЯ */}
                <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-medium text-orange-400">
                  {t(`muscles.${exercise.muscleGroup}`)}
                </span>

                {/* 2. Вторичные группы мышц — РОЗОВЫЕ */}
                {exercise.secondaryMuscles?.map((muscle) => (
                  <span
                    key={muscle}
                    className="rounded-full bg-pink-500/20 px-3 py-1 text-xs font-medium text-pink-400"
                  >
                    {t(`muscles.${muscle}`)}
                  </span>
                ))}

                {/* 3. Инвентарь */}
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${EQUIPMENT_STYLES[exercise.equipment]}`}>
                  {t(EQUIPMENT_KEYS[exercise.equipment])}
                </span>

                {/* 4. Сложность */}
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${DIFFICULTY_STYLES[exercise.difficulty]}`}>
                  {t(`difficulty.${exercise.difficulty}`)}
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-gray-400">
                {exercise.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}