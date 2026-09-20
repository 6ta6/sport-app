'use client'; // Метка «клиентский компонент»: страница стала клиентской,
              // чтобы получать тренировки на нужном языке через getWorkouts(language).
              // В клиентских компонентах Next.js 16 параметры URL читаются
              // через хук useParams, а не через props.params.

import { useParams } from 'next/navigation';
import CategoryHeader from '@/components/CategoryHeader';
import WorkoutsList from '@/components/WorkoutsList';
import { useLanguage } from '@/lib/LanguageContext';
import { getWorkouts } from '@/lib/data'; // Утилита для получения тренировок на нужном языке

// CATEGORY_LABELS нужен ТОЛЬКО для проверки валидности категории
// (получаем список допустимых ключей). Для отображения названий
// он больше не используется — этим занимается CategoryHeader через t().
import { CATEGORY_LABELS } from '@/types';

export default function CategoryPage() {
  // Достаём язык и функцию перевода из контекста
  const { language, t } = useLanguage();

  // Получаем параметр category из URL через хук useParams.
  // useParams возвращает объект с параметрами, category — это строка.
  const params = useParams();
  const category = params.category as string;

  // Получаем массив тренировок на текущем языке
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

  // Отбираем тренировки только выбранной категории
  const categoryWorkouts = workouts.filter(
    (workout) => workout.category === currentCategory
  );

  return (
    <main className="min-h-screen bg-gray-900 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Заголовок, кнопка «Назад» и счётчик — в клиентском компоненте */}
        <CategoryHeader
          categoryLabelKey={`categories.${category}`}
          workoutsCount={categoryWorkouts.length}
        />
        {/* Список тренировок с поиском */}
        <WorkoutsList workouts={categoryWorkouts} />
      </div>
    </main>
  );
}