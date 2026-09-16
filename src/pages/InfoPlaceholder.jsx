/**
 * InfoPlaceholder.jsx — Página "Próximamente" para las rutas secundarias
 * (Cursos, Repasos, Donaciones).
 *
 * El objetivo de esta reconstrucción es mantener las rutas funcionando;
 * el contenido completo de esas páginas se agrega después.
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function InfoPlaceholder({ title }) {
  const { t } = useTranslation();

  // Título de la pestaña
  useEffect(() => {
    document.title = `LACV | ${title}`;
  }, [title]);

  return (
    <section className="info-section">
      <h1>{title}</h1>
      <span className="soon-badge">{t('soon')}</span>
      <div className="buttons">
        <Link to="/" className="button">
          {t('goBack')}
        </Link>
      </div>
    </section>
  );
}