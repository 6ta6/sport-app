// ФАЙЛ: app/exercises/[id]/page.tsx
// Тонкая серверная обёртка: получает параметр id из адреса
// и передаёт его в клиентский компонент ExerciseDetails.
// Вся логика поиска упражнения и подготовки данных переехала в компонент.

import ExerciseDetails from '@/components/ExerciseDetails';

// Тип пропсов страницы. В Next 16 параметр приходит как Promise
type Props = {
  params: Promise<{ id: string }>;
};

// async-компонент: можно использовать await
export default async function ExerciseDetailsPage({ params }: Props) {
  const { id } = await params;

  // Передаём только id — компонент сам найдёт упражнение
  return <ExerciseDetails id={id} />;
}