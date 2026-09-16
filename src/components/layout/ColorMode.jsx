/**
 * ColorMode.jsx — Botón para alternar modo claro / oscuro.
 *
 * Aplica (o quita) la clase `dark-mode` en <html>. El CSS define que las
 * variables --clr-* cambian cuando <html> tiene esa clase. La preferencia
 * se guarda en localStorage para sobrevivir a recargas.
 */

import { useEffect, useState } from 'react';
import { IconMoon, IconSun } from '../icons';

export default function ColorMode() {
  // Lee la preferencia guardada (por defecto: modo claro)
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem('isDark') === 'true';
    } catch {
      return false;
    }
  });

  // Cada vez que cambia isDark, aplica/remueve la clase en <html> y la guarda
  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', isDark);
    try {
      localStorage.setItem('isDark', String(isDark));
    } catch {
      /* localStorage no disponible */
    }
  }, [isDark]);

  return (
    <button
      type="button"
      className="color-mode"
      aria-label={isDark ? 'Modo claro' : 'Modo oscuro'}
      onClick={() => setIsDark((value) => !value)}
    >
      {/* Luna = modo actual claro (click → oscuro) ; Sol = modo oscuro */}
      {isDark ? <IconSun /> : <IconMoon />}
    </button>
  );
}