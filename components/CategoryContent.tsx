'use client'; // Клиентский компонент: использует хуки useLanguage и логику фильтрации

import CategoryHeader from '@/components/CategoryHeader';
import WorkoutsList from '@/components/WorkoutsList';
import { useLanguage } from '@/lib/LanguageContext';
import { getWorkouts } from '@/lib/data';
import { CATEGORY_LABELS } from '@/types';

// Пропсы: категория, переданная из серверной страницы
type Props = {
  category: string;
};

export default function CategoryContent({ category }: Props) {
  // Достаём язык и функцию перевода из контекста
  const { language, t } = useLanguage();

  // Получаем массив тренировок на текущем языке (уже нормализованный)
  const workouts = getWorkouts(language);

  // Проверяем, существует ли такая категория
  const isKnownCategory = Object.keys(CATEGORY_LABELS).includes(category);

  // Если категория не найдена — показываем заглушку через CategoryHeader
  if (!isKnownCategory) {
    return (
      <main className="min-h-screen bg-gray-900 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <CategoryHeader isNotFound={true} />
        </div>
      </main>
    );
  }

  // Категория существует — преобразуем тип для дальнейшей работы
  const currentCategory = category as keyof typeof CATEGORY_LABELS;

  // ЗАЩИТА: (workout.categories || []) — если поля вдруг нет,
  // подставится пустой массив, и .includes() вернёт false
  // вместо падения приложения.
  const categoryWorkouts = workouts.filter((workout) =>
    (workout.categories || []).includes(currentCategory)
  );

  return (
    <main className="min-h-screen bg-gray-900 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <CategoryHeader
          categoryLabelKey={`categories.${category}`}
          workoutsCount={categoryWorkouts.length}
        />
        <WorkoutsList workouts={categoryWorkouts} />
      </div>
    </main>
  );
}