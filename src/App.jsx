/**
 * App.jsx — Componente raíz: estructura general del sitio.
 *
 * Layout (igual al original):
 *   <div class="App">
 *     <Header />                 → logo + nav + idiomas + modo oscuro
 *     <main>                     → <PageTransition> + <Routes>
 *     <Footer />                 → redes sociales
 *
 * - PageTransition está keyed por pathname: cada cambio de ruta remonta el
 *   componente y reproduce los overlays de transición.
 * - Al navegar el scroll vuelve arriba.
 */

import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import InfoPlaceholder from './pages/InfoPlaceholder';
import NotFound from './pages/NotFound';
import { useTranslation } from 'react-i18next';

export default function App() {
  const location = useLocation();
  const { t } = useTranslation();

  // Al cambiar de ruta, subir el scroll al tope de la página.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="App">
      <Header />

      <main className="main">
        {/* Key = pathname → al navegar la transición se reproduce */}
        <PageTransition key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/cursos" element={<InfoPlaceholder title={t('pages.courses')} />} />
            <Route
              path="/repasos-coderhouse"
              element={<InfoPlaceholder title={t('pages.reviews')} />}
            />
            <Route
              path="/donaciones"
              element={<InfoPlaceholder title={t('pages.donations')} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </main>

      <Footer />
    </div>
  );
}