// ФАЙЛ: types/index.ts
// Здесь живут ВСЕ типы данных нашего приложения.

// ────────────────────────────────────────────────
// 1. СПРАВОЧНИКИ ДОПУСТИМЫХ ЗНАЧЕНИЙ
// ────────────────────────────────────────────────

export type MuscleGroup = 
  | 'arms' 
  | 'legs' 
  | 'back' 
  | 'shoulders' 
  | 'chest' 
  | 'core' 
  | 'combo';

export type Equipment =
  | 'none'
  | 'dumbbells'
  | 'barbell'
  | 'kettlebell'
  | 'pull-up-bar'
  | 'bench';

export type Difficulty = 'easy' | 'medium' | 'hard';

// УДАЛЕНЫ: bodybuilders и runners (не используются в тренировках)
export type WorkoutCategory =
  | 'wrestlers'
  | 'crossfit'
  | 'martial-arts';

// ────────────────────────────────────────────────
// 2. ОСНОВНЫЕ СУЩНОСТИ
// ────────────────────────────────────────────────

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  equipment: Equipment;
  difficulty: Difficulty;
  description: string;
  videoUrl?: string;
  defaultSets: number;
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
  categories: WorkoutCategory[];
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
  shoulders: 'Плечи',
  chest: 'Грудь',
  core: 'Кор',
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

// УДАЛЕНЫ: bodybuilders и runners
export const CATEGORY_LABELS: Record<WorkoutCategory, string> = {
  wrestlers: 'Борцы',
  crossfit: 'Кроссфит',
  'martial-arts': 'Единоборства',
};