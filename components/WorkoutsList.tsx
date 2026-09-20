'use client'; // Метка «клиентский компонент»: нужен для поиска (useState)

import { useState } from 'react';
import Link from 'next/link';
import StartWorkoutButton from '@/components/StartWorkoutButton';
import { useLanguage } from '@/lib/LanguageContext';
import { getExercises } from '@/lib/data'; // Утилита для получения упражнений на нужном языке

import type { Exercise, Workout } from '@/types';

// Пропсы — тренировки одной категории, переданные серверной страницей
type Props = {
  workouts: Workout[];
};

export default function WorkoutsList({ workouts }: Props) {
  // Достаём язык и функцию перевода из контекста
  const { language, t } = useLanguage();

  // Получаем массив упражнений на текущем языке
  const exercises = getExercises(language);

  // Текущий текст в поле поиска
  const [searchQuery, setSearchQuery] = useState('');

  // Ищем упражнение в библиотеке по его id
  const getExerciseById = (id: string): Exercise | undefined =>
    exercises.find((exercise) => exercise.id === id);

  // Отбираем тренировки, у которых название ИЛИ описание содержит поисковый запрос
  const filteredWorkouts = workouts.filter((workout) => {
    const query = searchQuery.toLowerCase();
    const matchesTitle = workout.title.toLowerCase().includes(query);
    const matchesDescription = workout.description.toLowerCase().includes(query);
    return matchesTitle || matchesDescription;
  });

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={t('workouts.search')}
        className="w-full rounded-full border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-orange-500"
      />

      {filteredWorkouts.length === 0 ? (
        <p className="mt-6 text-gray-400">{t('workouts.notFound')}</p>
      ) : (
        <div className="mt-6 space-y-6">
          {filteredWorkouts.map((workout) => (
            <article key={workout.id} className="rounded-xl border border-gray-700 bg-gray-800 p-6">
              {/* Название тренировки — теперь на языке пользователя */}
              <h2 className="text-xl font-semibold text-white">{workout.title}</h2>
              {/* Описание — тоже на языке пользователя */}
              <p className="mt-2 text-sm text-gray-400">{workout.description}</p>

              <ul className="mt-4 divide-y divide-gray-700 border-y border-gray-700">
                {workout.exercises.map((item, index) => {
                  const exercise = getExerciseById(item.exerciseId);

                  return (
                    <li key={item.exerciseId} className="flex items-center justify-between gap-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="w-5 text-sm text-gray-500">{index + 1}.</span>
                        {exercise ? (
                          <Link
                            href={`/exercises/${exercise.id}`}
                            className="text-sm text-gray-200 transition-colors hover:text-orange-400"
                          >
                            {exercise.name}
                          </Link>
                        ) : (
                          // Запасной текст теперь берём из переводов
                          <span className="text-sm text-gray-200">
                            {t('training.unknownExercise')}
                          </span>
                        )}
                      </div>
                      <span className="whitespace-nowrap text-sm font-medium text-orange-400">
                        {item.sets} × {item.reps}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-4">
                <StartWorkoutButton
                  workoutId={workout.id}
                  workoutTitle={workout.title}
                  exercises={workout.exercises}
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}