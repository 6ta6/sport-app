// ФАЙЛ: app/workouts/[category]/page.tsx
// СЕРВЕРНЫЙ компонент: получает параметр категории из адреса,
// генерирует статические параметры для экспорта и передаёт
// категорию в клиентский компонент CategoryContent.

import CategoryContent from '@/components/CategoryContent';
import { CATEGORY_LABELS } from '@/types';

// Функция генерации статических параметров для экспорта.
// Возвращает массив всех допустимых категорий — для каждой
// Next.js создаст статическую HTML-страницу при сборке.
export function generateStaticParams() {
  return Object.keys(CATEGORY_LABELS).map((category) => ({
    category,
  }));
}

// Тип пропсов страницы. В Next 16 параметр приходит как Promise
type Props = {
  params: Promise<{ category: string }>;
};

// Async-компонент: можно использовать await
export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  // Передаём категорию в клиентский компонент, который уже
  // занимается всей логикой: получением данных, фильтрацией и отрисовкой
  return <CategoryContent category={category} />;
}