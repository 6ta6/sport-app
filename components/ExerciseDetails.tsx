'use client'; // Клиентский компонент: использует хук useLanguage для переводов

import Link from 'next/link';
import type { Exercise, Equipment } from '@/types';
import { useLanguage } from '@/lib/LanguageContext';
import { getExercises } from '@/lib/data';
import BackButton from '@/components/BackButton';

// Маппинг значений инвентаря из JSON на ключи перевода
const EQUIPMENT_KEYS: Record<Equipment, string> = {
  none: 'equipment.none',
  dumbbells: 'equipment.dumbbells',
  barbell: 'equipment.barbell',
  kettlebell: 'equipment.kettlebell',
  'pull-up-bar': 'equipment.pullUpBar',
  bench: 'equipment.bench',
};

// Пропсы: только id упражнения
type Props = {
  id: string;
};

// Функция преобразует обычную ссылку на YouTube в ссылку для встраивания
function getEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/);
  if (!match) return null;

  const videoId = match[1];
  return `https://www.youtube.com/embed/${videoId}`;
}

export default function ExerciseDetails({ id }: Props) {
  const { language, t } = useLanguage();
  const exercises = getExercises(language);
  const exercise = exercises.find((ex) => ex.id === id) ?? null;
  const embedUrl = exercise?.videoUrl ? getEmbedUrl(exercise.videoUrl) : null;

  // ═══ Особый случай: упражнение не найдено ═══
  if (!exercise) {
    return (
      <main className="min-h-screen bg-gray-900 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <Link href="/exercises" className="text-sm text-orange-400 transition-colors hover:text-orange-300">
            ← {t('back')}
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-white">
            {t('exercise.notFound')}
          </h1>
          <p className="mt-2 text-gray-400">
            {t('exercise.notFoundDesc')}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <BackButton />

        <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          {exercise.name}
        </h1>

        {/* Бейджи: группа мышц (главная + вторичные), инвентарь, сложность */}
        <div className="mt-4 flex flex-wrap gap-2">
          {/* Главная группа мышц — ОРАНЖЕВАЯ, всегда есть */}
          <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-medium text-orange-400">
            {t(`muscles.${exercise.muscleGroup}`)}
          </span>

          {/* Вторичные группы мышц — РОЗОВЫЕ, чтобы отличались от главной.
              Оператор ?. — если secondaryMuscles нет, ничего не отрисуется. */}
          {exercise.secondaryMuscles?.map((muscle) => (
            <span
              key={muscle}
              className="rounded-full bg-pink-500/20 px-3 py-1 text-xs font-medium text-pink-400"
            >
              {t(`muscles.${muscle}`)}
            </span>
          ))}

          {/* Инвентарь */}
          <span className="rounded-full bg-gray-700 px-3 py-1 text-xs font-medium text-gray-300">
            {t(EQUIPMENT_KEYS[exercise.equipment])}
          </span>

          {/* Сложность */}
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              exercise.difficulty === 'easy'
                ? 'bg-green-500/20 text-green-400'
                : exercise.difficulty === 'medium'
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-red-500/20 text-red-400'
            }`}
          >
            {t(`difficulty.${exercise.difficulty}`)}
          </span>
        </div>

        <p className="mt-6 text-base leading-relaxed text-gray-300">
          {exercise.description}
        </p>

        {/* Блок с видео */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-white">{t('exercise.video')}</h2>

          {!exercise.videoUrl && (
            <p className="mt-4 rounded-xl border border-gray-700 bg-gray-800 p-6 text-sm text-gray-500">
              {t('exercise.noVideo')}
            </p>
          )}

          {exercise.videoUrl && !embedUrl && (
            <a
              href={exercise.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-xl bg-orange-500 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-orange-600"
            >
              {t('exercise.watchOnYoutube')}
            </a>
          )}

          {embedUrl && (
            <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-xl border border-gray-700">
              <iframe
                src={embedUrl}
                title={`${t('exercise.video')}: ${exercise.name}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                frameBorder={0}
                className="absolute inset-0 h-full w-full"
              />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}