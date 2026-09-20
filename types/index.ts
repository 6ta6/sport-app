// ============================================================
// ФАЙЛ: types/index.ts
// Здесь живут ВСЕ типы данных нашего приложения.
// Отсюда мы будем импортировать их на страницы и в компоненты.
// ============================================================

// ────────────────────────────────────────────────
// 1. СПРАВОЧНИКИ ДОПУСТИМЫХ ЗНАЧЕНИЙ
// ────────────────────────────────────────────────

export type MuscleGroup = 'arms' | 'legs' | 'back';

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
  | 'runners';

// ────────────────────────────────────────────────
// 2. ОСНОВНЫЕ СУЩНОСТИ
// ────────────────────────────────────────────────

// Упражнение из библиотеки.
// Знак ? после поля означает «необязательное» — может отсутствовать.
// Добавили videoUrl для страницы деталей упражнения.
export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
  difficulty: Difficulty;
  description: string;
  videoUrl?: string; // ссылка на YouTube-видео с техникой (необязательная)
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
  category: WorkoutCategory;
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
};