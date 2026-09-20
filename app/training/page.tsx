'use client'; // Метка «клиентский компонент»: код выполняется в браузере

import { useEffect, useState } from 'react';
import Link from 'next/link';

import type { Exercise, WorkoutExercise } from '../../types';
import { useLanguage } from '@/lib/LanguageContext';
import { getExercises } from '@/lib/data'; // Утилита для получения упражнений на нужном языке

// Форма тренировки, которая лежит в localStorage
type ActiveWorkout = {
  title: string;
  exercises: WorkoutExercise[];
};

// Форма прогресса, которую сохраняем отдельно
type WorkoutProgress = {
  currentIndex: number;
  currentSet: number;
};

const PROGRESS_KEY = 'activeWorkoutProgress';

export default function TrainingPage() {
  // Достаём язык и функцию перевода из контекста
  const { language, t } = useLanguage();

  // Получаем массив упражнений на текущем языке
  const exercises = getExercises(language);

  const [workout, setWorkout] = useState<ActiveWorkout | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect выполняется ПОСЛЕ первой отрисовки страницы
  useEffect(() => {
    const savedWorkout = localStorage.getItem('activeWorkout');
    let parsedWorkout: ActiveWorkout | null = null;

    if (savedWorkout) {
      try {
        parsedWorkout = JSON.parse(savedWorkout) as ActiveWorkout;
        setWorkout(parsedWorkout);
      } catch {
        setWorkout(null);
      }
    }

    if (parsedWorkout) {
      const savedProgress = localStorage.getItem(PROGRESS_KEY);

      if (savedProgress) {
        try {
          const progress = JSON.parse(savedProgress) as WorkoutProgress;

          if (progress.currentIndex >= 0 && progress.currentIndex < parsedWorkout.exercises.length) {
            setCurrentIndex(progress.currentIndex);

            const currentExercise = parsedWorkout.exercises[progress.currentIndex];
            if (progress.currentSet >= 1 && progress.currentSet <= currentExercise.sets) {
              setCurrentSet(progress.currentSet);
            }
          }
        } catch {
          // Используем значения по умолчанию
        }
      }
    }

    setIsLoading(false);
  }, []);

  // Ищем полное описание упражнения в библиотеке по его id
  const findExercise = (id: string): Exercise | undefined =>
    exercises.find((exercise) => exercise.id === id);

  const handleCompleteSet = (): void => {
    if (!workout) return;

    const current = workout.exercises[currentIndex];

    let nextIndex = currentIndex;
    let nextSet = currentSet;
    let finished = false;

    if (currentSet < current.sets) {
      nextSet = currentSet + 1;
    } else if (currentIndex + 1 < workout.exercises.length) {
      nextIndex = currentIndex + 1;
      nextSet = 1;
    } else {
      finished = true;
    }

    if (finished) {
      setIsFinished(true);
      localStorage.removeItem('activeWorkout');
      localStorage.removeItem(PROGRESS_KEY);
    } else {
      setCurrentIndex(nextIndex);
      setCurrentSet(nextSet);

      const progress: WorkoutProgress = {
        currentIndex: nextIndex,
        currentSet: nextSet,
      };
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    }
  };

  if (isLoading) {
    return <main className="min-h-screen bg-gray-900" />;
  }

  if (!workout) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 px-4 text-center">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">{t('training.noActive')}</h1>
        <p className="mt-3 max-w-sm text-gray-400">{t('training.noActiveHint')}</p>
        <Link
          href="/builder"
          className="mt-8 rounded-full bg-orange-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-orange-600"
        >
          {t('training.backToBuilder')}
        </Link>
      </main>
    );
  }

  if (isFinished) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 px-4 text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          {t('training.finished')} 🎉
        </h1>
        <p className="mt-3 text-gray-400">
          «{workout.title}»: {t('training.finishedStats')} — {workout.exercises.length}.{' '}
          {t('training.finishedCongrats')}
        </p>
        <Link
          href="/"
          className="mt-8 rounded-full bg-orange-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-orange-600"
        >
          {t('training.backHome')}
        </Link>
      </main>
    );
  }

  const current = workout.exercises[currentIndex];
  const exerciseInfo = findExercise(current.exerciseId);

  const totalSets = workout.exercises.reduce((sum, item) => sum + item.sets, 0);

  const doneSets =
    workout.exercises.slice(0, currentIndex).reduce((sum, item) => sum + item.sets, 0) +
    (currentSet - 1);

  const progressPercent = totalSets > 0 ? (doneSets / totalSets) * 100 : 0;

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-40 h-1.5 bg-gray-800">
        <div
          className="h-full bg-orange-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 px-4 py-10 text-center">
        {exerciseInfo && (
          <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-medium text-orange-400">
            {t(`muscles.${exerciseInfo.muscleGroup}`)}
          </span>
        )}

        <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          {exerciseInfo ? exerciseInfo.name : t('training.unknownExercise')}
        </h1>

        <p className="mt-4 text-lg text-gray-400">
          {t('training.task')}: {current.sets} × {current.reps}
        </p>

        <div className="mt-8 space-y-1 text-sm text-gray-500">
          <p>
            {t('training.exerciseLabel')} {currentIndex + 1} {t('training.of')}{' '}
            {workout.exercises.length}
          </p>
          <p>
            {t('training.setLabel')} {currentSet} {t('training.of')} {current.sets}
          </p>
        </div>

        {current && (
          <Link
            href={`/exercises/${current.exerciseId}`}
            className="mt-6 rounded-full bg-gray-700 px-5 py-2.5 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-600"
          >
            {t('training.reviewExercise')}
          </Link>
        )}

        <button
          onClick={handleCompleteSet}
          className="mt-8 w-full max-w-sm rounded-2xl bg-orange-500 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-orange-600"
        >
          {t('training.completeSet')}
        </button>
      </main>
    </>
  );
}