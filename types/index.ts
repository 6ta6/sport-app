// ФАЙЛ: types/index.ts
// Здесь живут ВСЕ типы данных нашего приложения.

// ────────────────────────────────────────────────
// 1. СПРАВОЧНИКИ ДОПУСТИМЫХ ЗНАЧЕНИЙ
// ────────────────────────────────────────────────

export type MuscleGroup = 'arms' | 'legs' | 'back' | 'combo';

export type Equipment =
  | 'none'
  | 'dumbbells'
  | 'barbell'
  | 'kettlebell'
  | 'pull-up-bar'
  | 'bench';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type WorkoutCategory =
  | 'wrestlers'
  | 'bodybuilders'
  | 'crossfit'
  | 'runners'
  | 'martial-arts';

// ────────────────────────────────────────────────
// 2. ОСНОВНЫЕ СУЩНОСТИ
// ────────────────────────────────────────────────

// Упражнение из библиотеки.
export interface Exercise {
  id: string;
  name: string;
  // Главная (первичная) группа мышц.
  // По этому полю работают фильтры и распределение в конструкторе.
  muscleGroup: MuscleGroup;
  // Дополнительные (вторичные) группы мышц.
  // Необязательное поле — у большинства упражнений его не будет.
  secondaryMuscles?: MuscleGroup[];
  equipment: Equipment;
  difficulty: Difficulty;
  description: string;
  videoUrl?: string; // ссылка на YouTube-видео с техникой (необязательная)
  // Рекомендуемое количество подходов (максимум из диапазона)
  defaultSets: number;
  // Рекомендуемое количество повторений (максимум из диапазона)
  defaultReps: number;
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: number;
}

export interface Workout {
  id: string;
  title: string;
  description: string;
  // НОВОЕ: массив категорий (тренировка может принадлежать нескольким)
  categories: WorkoutCategory[];
  // НОВОЕ: ссылка на видео тренировки (необязательная)
  videoUrl?: string;
  exercises: WorkoutExercise[];
}

export interface CustomWorkout {
  id: string;
  title: string;
  createdAt: string;
  exercises: WorkoutExercise[];
}

// ────────────────────────────────────────────────
// 3. СЛОВАРИ ДЛЯ ОТОБРАЖЕНИЯ НА ЭКРАНЕ
// ────────────────────────────────────────────────

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  arms: 'Руки',
  legs: 'Ноги',
  back: 'Спина',
  combo: 'Комбо',
};

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  none: 'Без инвентаря',
  dumbbells: 'Гантели',
  barbell: 'Штанга',
  kettlebell: 'Гиря',
  'pull-up-bar': 'Турник',
  bench: 'Скамья',
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Лёгкая',
  medium: 'Средняя',
  hard: 'Сложная',
};

export const CATEGORY_LABELS: Record<WorkoutCategory, string> = {
  wrestlers: 'Борцы',
  bodybuilders: 'Бодибилдеры',
  crossfit: 'Кроссфит',
  runners: 'Бегуны',
  'martial-arts': 'Единоборства',
};