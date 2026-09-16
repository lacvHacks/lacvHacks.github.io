/**
 * Home.jsx — Página principal (/) del sitio.
 *
 * Solo reconstruye la parte visual del original: Hero (avatar, título
 * animado y estadísticas) + accesos rápidos (YouTube / Discord / Donaciones).
 * Actualiza el título del navegador según el idioma.
 */

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Hero from '../components/home/Hero';
import Shortcuts from '../components/home/Shortcuts';

export default function Home() {
  const { t } = useTranslation();

  // Título de la pestaña del navegador ("LACV | Inicio")
  useEffect(() => {
    document.title = `LACV | ${t('pages.home')}`;
  }, [t]);

  return (
    <>
      <div className="container">
        <Hero />
      </div>
      <Shortcuts />
    </>
  );
}