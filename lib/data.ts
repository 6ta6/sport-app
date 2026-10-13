// ФАЙЛ: lib/data.ts
// Утилита доступа к данным: выбирает нужный набор упражнений или тренировок
// в зависимости от текущего языка приложения.
//
// НОВОЕ: добавлена нормализация тренировок — защита от старых или повреждённых
// данных, где поле называлось category (строка), а не categories (массив).

import type { Language } from './translations';
import type { Exercise, Workout, WorkoutCategory, WorkoutExercise } from '@/types';

// Импортируем оба набора упражнений
import exercisesRu from '@/data/exercises.json';
import exercisesEn from '@/data/exercises.en.json';

// Импортируем оба набора тренировок
import workoutsRu from '@/data/workouts.json';
import workoutsEn from '@/data/workouts.en.json';

// Отдаёт массив упражнений на заданном языке.
export function getExercises(language: Language): Exercise[] {
  return (language === 'en' ? exercisesEn : exercisesRu) as Exercise[];
}

// «Сырой» тип тренировки: описывает оба возможных формата данных.
// Оба поля категорий необязательные, чтобы поймать повреждённые данные.
type RawWorkout = {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  exercises: WorkoutExercise[];
  categories?: WorkoutCategory[]; // новый формат — массив
  category?: WorkoutCategory;     // старый формат — строка (для совместимости)
};

// Нормализация тренировок: гарантирует, что у каждой тренировки
// будет поле categories (массив), даже если данные пришли в старом формате
// или в файле оказался не тот массив (например, упражнения вместо тренировок).
function normalizeWorkouts(raw: unknown): Workout[] {
  // Защита: если данные не массив — возвращаем пустой список
  if (!Array.isArray(raw)) return [];

  const list = raw as RawWorkout[];

  return list
    // Отфильтровываем объекты без id — это явные «не тренировки»
    .filter((item) => item && typeof item === 'object' && typeof item.id === 'string')
    .map((item) => {
      let categories: WorkoutCategory[] = [];

      if (Array.isArray(item.categories)) {
        // Новый формат — используем как есть
        categories = item.categories;
      } else if (typeof item.category === 'string') {
        // Старый формат — превращаем одну категорию в массив
        categories = [item.category];
      }
      // Если нет ни того, ни другого — categories останется пустым массивом,
      // тренировка не попадёт ни в одну категорию, но приложение не упадёт

      return { ...item, categories } as Workout;
    });
}

// Отдаёт массив тренировок на заданном языке (уже нормализованный).
export function getWorkouts(language: Language): Workout[] {
  return normalizeWorkouts(language === 'en' ? workoutsEn : workoutsRu);
}