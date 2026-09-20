// ФАЙЛ: app/page.tsx
// Главная страница теперь — это список тренировок.
// При заходе на «/» сразу перенаправляем на «/workouts».
// Компонент ничего не рисует — только делает redirect на сервере.

import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/workouts');
}