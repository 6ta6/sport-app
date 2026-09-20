// ФАЙЛ: lib/data.ts
// Утилита доступа к данным: выбирает нужный набор упражнений или тренировок
// в зависимости от текущего языка приложения.
//
// Вместо прямого импорта JSON-файлов на страницах используем эти функции:
//   const exercises = getExercises(language);
//   const workouts = getWorkouts(language);
//
// Без директивы 'use client' — это обычные функции,
// которые удобно вызывать и в серверных, и в клиентских компонентах.

import type { Language } from './translations';
import type { Exercise, Workout } from '@/types';

// Импортируем оба набора упражнений
import exercisesRu from '@/data/exercises.json';
import exercisesEn from '@/data/exercises.en.json';

// Импортируем оба набора тренировок
import workoutsRu from '@/data/workouts.json';
import workoutsEn from '@/data/workouts.en.json';

// Отдаёт массив упражнений на заданном языке.
// Преобразование as Exercise[] нужно, потому что JSON-импорт
// считает поля «просто строками», а мы точно знаем, что значения
// muscleGroup/equipment/difficulty — это наши объединения типов.
export function getExercises(language: Language): Exercise[] {
  return (language === 'en' ? exercisesEn : exercisesRu) as Exercise[];
}

// Отдаёт массив тренировок на заданном языке.
// Преобразование as Workout[] нужно по той же причине.
export function getWorkouts(language: Language): Workout[] {
  return (language === 'en' ? workoutsEn : workoutsRu) as Workout[];
}