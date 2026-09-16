/**
 * NotFound.jsx — Página 404.
 *
 * Misma estructura que la del original: un "404" grande, el mensaje de
 * página no encontrada y sugerencias para volver o buscar los repasos.
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();

  // Título de la pestaña (igual al original: "LACV | Página no encontrada")
  useEffect(() => {
    document.title = `LACV | ${t('notFound')}`;
  }, [t]);

  return (
    <section className="not-found">
      <div className="container">
        <h1>404</h1>
        <p>{t('notFound')}</p>
        <p>{t('changedRoutes')}</p>
        {/* Ayuda rápida hacia los repasos de Coderhouse */}
        <p>
          {t('lookingForCH')}{' '}
          <Link to="/repasos-coderhouse" className="button">
            {t('clickHere')}
          </Link>
        </p>
        <div className="buttons">
          <Link to="/" className="button button-orange">
            {t('goBack')}
          </Link>
        </div>
      </div>
    </section>
  );
}