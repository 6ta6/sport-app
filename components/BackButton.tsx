'use client'; // Метка «клиентский компонент»: код выполняется в браузере,
              // потому что используем router.back(), window.history и useLanguage

import { useRouter } from 'next/navigation'; // Хук для навигации между страницами
import { useLanguage } from '@/lib/LanguageContext'; // Хук перевода

// Компонент «Назад»: возвращает пользователя на предыдущую страницу
// в истории браузера. Если истории нет (страница открыта напрямую),
// переводит в библиотеку упражнений.
export default function BackButton() {
  const router = useRouter();
  // Достаём функцию перевода из контекста языка
  const { t } = useLanguage();

  const handleClick = (): void => {
    // window.history.length — количество страниц в истории браузера.
    // Если больше 1, значит есть куда вернуться.
    // Если равно 1, пользователь открыл страницу напрямую,
    // поэтому отправляем его в библиотеку упражнений.
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/exercises');
    }
  };

  return (
    // Текст кнопки теперь берём из переводов
    <button
      onClick={handleClick}
      className="text-sm text-orange-400 transition-colors hover:text-orange-300"
    >
      ← {t('back')}
    </button>
  );
}