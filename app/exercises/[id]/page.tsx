// ФАЙЛ: app/exercises/[id]/page.tsx
// СЕРВЕРНЫЙ компонент: получает параметр id из адреса,
// генерирует статические параметры для экспорта и передаёт
// id в клиентский компонент ExerciseDetails.

import ExerciseDetails from '@/components/ExerciseDetails';
import exercisesData from '@/data/exercises.json';

// Функция генерации статических параметров для экспорта.
// Возвращает массив всех id упражнений — для каждого
// Next.js создаст статическую HTML-страницу при сборке.
export function generateStaticParams() {
  return exercisesData.map((exercise) => ({
    id: exercise.id,
  }));
}

// Тип пропсов страницы. В Next 16 параметр приходит как Promise
type Props = {
  params: Promise<{ id: string }>;
};

// Async-компонент: можно использовать await
export default async function ExerciseDetailsPage({ params }: Props) {
  const { id } = await params;

  // Передаём только id — компонент сам найдёт упражнение
  return <ExerciseDetails id={id} />;
}