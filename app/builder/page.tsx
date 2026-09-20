'use client'; // Метка «клиентский компонент»: код выполняется в браузере

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import type { Exercise, Equipment, MuscleGroup, WorkoutExercise } from '../../types';
import { useLanguage } from '@/lib/LanguageContext';
import { getExercises } from '@/lib/data'; // Утилита для получения упражнений на нужном языке

const MIN_TARGET = 1;
const MAX_TARGET = 10;
const DEFAULT_SETS = 3;
const DEFAULT_REPS = 10;

const GROUPS: MuscleGroup[] = ['arms', 'legs', 'back'];

// Маппинг значений инвентаря на ключи перевода
const EQUIPMENT_KEYS: Record<Equipment, string> = {
  none: 'equipment.none',
  dumbbells: 'equipment.dumbbells',
  barbell: 'equipment.barbell',
  kettlebell: 'equipment.kettlebell',
  'pull-up-bar': 'equipment.pullUpBar',
  bench: 'equipment.bench',
};

type SelectedExercises = Record<MuscleGroup, Exercise[]>;
type GroupTargets = Record<MuscleGroup, number>;

// Функция случайно перемешивает массив
function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

export default function BuilderPage() {
  // Достаём язык и функцию перевода из контекста
  const { language, t } = useLanguage();

  // Получаем массив упражнений на текущем языке
  const exercises = getExercises(language);

  const [selected, setSelected] = useState<SelectedExercises>({
    arms: [],
    legs: [],
    back: [],
  });

  const [targets, setTargets] = useState<GroupTargets>({
    arms: 2,
    legs: 2,
    back: 2,
  });

  const router = useRouter();

  const isAdded = (exercise: Exercise): boolean =>
    selected[exercise.muscleGroup].some((item) => item.id === exercise.id);

  const addExercise = (exercise: Exercise): void => {
    if (isAdded(exercise)) return;

    setSelected((prev) => ({
      ...prev,
      [exercise.muscleGroup]: [...prev[exercise.muscleGroup], exercise],
    }));
  };

  const removeExercise = (group: MuscleGroup, id: string): void => {
    setSelected((prev) => ({
      ...prev,
      [group]: prev[group].filter((item) => item.id !== id),
    }));
  };

  const changeTarget = (group: MuscleGroup, delta: number): void => {
    setTargets((prev) => {
      const newValue = Math.min(MAX_TARGET, Math.max(MIN_TARGET, prev[group] + delta));
      return { ...prev, [group]: newValue };
    });
  };

  const generateRandomWorkout = (): void => {
    const randomSelected: SelectedExercises = { arms: [], legs: [], back: [] };

    GROUPS.forEach((group) => {
      const groupExercises = exercises.filter((exercise) => exercise.muscleGroup === group);
      randomSelected[group] = shuffle(groupExercises).slice(0, targets[group]);
    });

    setSelected(randomSelected);
  };

  const canStart = GROUPS.every((group) => selected[group].length >= targets[group]);

  const startWorkout = (): void => {
    const workoutExercises: WorkoutExercise[] = GROUPS.flatMap((group) =>
      selected[group].map((exercise) => ({
        exerciseId: exercise.id,
        sets: DEFAULT_SETS,
        reps: DEFAULT_REPS,
      }))
    );

    const workout = {
      title: t('builder.workoutTitle'),
      exercises: workoutExercises,
    };

    localStorage.removeItem('activeWorkoutProgress');
    localStorage.setItem('activeWorkout', JSON.stringify(workout));
    router.push('/training');
  };

  return (
    <main className="min-h-screen bg-gray-900 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-white">{t('builder.title')}</h1>
        <p className="mt-2 text-gray-400">{t('builder.subtitle')}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={generateRandomWorkout}
            className="rounded-full bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600"
          >
            {t('builder.randomButton')}
          </button>

          <button
            onClick={startWorkout}
            disabled={!canStart}
            title={canStart ? t('builder.startButton') : t('builder.startHint')}
            className={
              canStart
                ? 'rounded-full bg-green-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-600'
                : 'rounded-full bg-gray-700 px-5 py-2.5 text-sm font-medium text-gray-500 opacity-50'
            }
          >
            {t('builder.startButton')}
          </button>
        </div>

        {!canStart && (
          <p className="mt-2 text-xs text-gray-500">{t('builder.startHint')}</p>
        )}

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <section>
            <h2 className="text-lg font-semibold text-white">{t('builder.libraryTitle')}</h2>
            <p className="mt-1 text-sm text-gray-500">{t('builder.libraryHint')}</p>

            <div className="mt-4 space-y-2">
              {exercises.map((exercise) => {
                const added = isAdded(exercise);

                return (
                  <button
                    key={exercise.id}
                    onClick={() => addExercise(exercise)}
                    className={
                      added
                        ? 'w-full rounded-xl border border-gray-700 bg-gray-800 p-4 text-left opacity-60'
                        : 'w-full rounded-xl border border-gray-700 bg-gray-800 p-4 text-left transition-colors hover:border-orange-500/60'
                    }
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-white">{exercise.name}</span>
                      {added && (
                        <span className="text-xs font-medium text-green-400">
                          {t('builder.addedLabel')}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-orange-500/20 px-2.5 py-0.5 text-xs text-orange-400">
                        {t(`muscles.${exercise.muscleGroup}`)}
                      </span>
                      <span className="rounded-full bg-gray-700 px-2.5 py-0.5 text-xs text-gray-300">
                        {t(EQUIPMENT_KEYS[exercise.equipment])}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">{t('builder.yourWorkout')}</h2>
            <p className="mt-1 text-sm text-gray-500">{t('builder.yourWorkoutHint')}</p>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {GROUPS.map((group) => {
                const items = selected[group];
                const isDone = items.length >= targets[group];

                return (
                  <div key={group} className="rounded-xl border border-gray-700 bg-gray-800 p-4">
                    <h3 className="font-semibold text-white">
                      {t(`muscles.${group}`)}{' '}
                      <span className={isDone ? 'text-green-400' : 'text-gray-500'}>
                        ({items.length}/{targets[group]})
                      </span>
                    </h3>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => changeTarget(group, -1)}
                        disabled={targets[group] <= MIN_TARGET}
                        aria-label={`− ${t(`muscles.${group}`)}`}
                        className="h-7 w-7 rounded-full bg-gray-700 text-sm text-gray-300 transition-colors hover:bg-orange-500 hover:text-white disabled:opacity-40"
                      >
                        −
                      </button>

                      <span className="min-w-16 text-center text-sm text-gray-400">
                        {t('builder.goal')}: {targets[group]}
                      </span>

                      <button
                        onClick={() => changeTarget(group, 1)}
                        disabled={targets[group] >= MAX_TARGET}
                        aria-label={`+ ${t(`muscles.${group}`)}`}
                        className="h-7 w-7 rounded-full bg-gray-700 text-sm text-gray-300 transition-colors hover:bg-orange-500 hover:text-white disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    {items.length === 0 ? (
                      <p className="mt-3 text-xs text-gray-500">{t('builder.emptyGroup')}</p>
                    ) : (
                      <ul className="mt-3 space-y-2">
                        {items.map((exercise) => (
                          <li
                            key={exercise.id}
                            className="flex items-center justify-between gap-2 rounded-lg bg-gray-900/60 px-3 py-2"
                          >
                            <span className="text-sm text-gray-200">{exercise.name}</span>
                            <button
                              onClick={() => removeExercise(group, exercise.id)}
                              aria-label={`× ${exercise.name}`}
                              className="px-1 text-lg leading-none text-gray-500 transition-colors hover:text-red-400"
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}