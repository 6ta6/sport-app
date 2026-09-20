'use client'; // Клиентский компонент: обрабатывает клик и работает с localStorage

import { useRouter } from 'next/navigation';
import type { WorkoutExercise } from '@/types';
import { useLanguage } from '@/lib/LanguageContext';

// Пропсы — данные тренировки, которую запускаем
type Props = {
  workoutId: string;
  workoutTitle: string;
  exercises: WorkoutExercise[];
};

export default function StartWorkoutButton({ workoutTitle, exercises }: Props) {
  const router = useRouter();
  // Достаём функцию перевода из контекста языка
  const { t } = useLanguage();

  const handleClick = (): void => {
    const workout = {
      title: workoutTitle,
      exercises: exercises,
    };

    // Сбрасываем старый прогресс перед записью новой тренировки
    localStorage.removeItem('activeWorkoutProgress');

    localStorage.setItem('activeWorkout', JSON.stringify(workout));
    router.push('/training');
  };

  return (
    <button
      onClick={handleClick}
      className="rounded-full bg-green-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-600"
    >
      {/* Текст кнопки берём из переводов.
          Эмодзи уже входит в значение ключа 'workouts.startButton'. */}
      {t('workouts.startButton')}
    </button>
  );
}