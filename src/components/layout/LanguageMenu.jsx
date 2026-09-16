/**
 * LanguageMenu.jsx — Selector de idioma (12 idiomas).
 *
 * Comportamiento clonado del bundle original:
 *  - Un botón-globo abre un menú desplegable con los idiomas.
 *  - El idioma activo queda marcado con la clase .active.
 *  - Al elegir idioma: se llama i18n.changeLanguage(), se guarda en
 *    localStorage ("i18nextLng", misma clave que usaba el original) y se
 *    sincronizan los atributos lang y dir del <html> (árabe = RTL).
 *  - Animación de entrada: desliza desde abajo con opacidad 0 (delay 1.5s
 *    en la carga inicial; 0.5s cuando se abrió/cerró el menú móvil).
 *
 * La lista de idiomas y el helper applyLanguage viven en src/i18n.js para
 * tener una única fuente de verdad.
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { IconGlobe } from '../icons';
import { LANGUAGES, applyLanguage } from '../../i18n';

export default function LanguageMenu({ menuActive = false }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  // Referencias para la animación de entrada
  const containerRef = useRef(null);

  // Código de idioma activo sin región (por si i18next devuelve "pt-BR", etc.)
  const activeCode = (i18n.language || 'es').split('-')[0];

  /**
   * Animación del bloque completo (globo + menú):
   * entra desde abajo en la carga inicial (delay 1.5) y vuelve a animarse
   * (delay 0.5) cuando se abre/cierra el menú móvil.
   */
  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;

    const ctx = gsap.context(() => {
      gsap.from(element, {
        y: 100,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(2)',
        delay: menuActive ? 0.5 : 1.5,
      });
    }, element);

    return () => ctx.revert();
  }, [menuActive]);

  // Cierra el menú desplegable si se abre el menú móvil
  useEffect(() => {
    if (menuActive) setOpen(false);
  }, [menuActive]);

  /**
   * Cambia de idioma:
   *  - i18n.changeLanguage() re-renderiza todo con los textos nuevos
   *  - applyLanguage() sincroniza lang + dir del <html> y persiste en
   *    localStorage (i18nextLng)
   */
  const handleLanguage = (code) => {
    i18n.changeLanguage(code);
    applyLanguage(code);
    setOpen(false); // y cierra el desplegable
  };

  return (
    <div
      className="languages"
      ref={containerRef}
      aria-label="Selector de idioma"
    >
      {/* Globo: abre/cierra el desplegable */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Cambiar idioma"
      >
        <IconGlobe className="languages-open-menu" />
      </button>

      {/* Menú desplegable (visible cuando .active) */}
      <div className={`languages-menu${open ? ' active' : ''}`}>
        {LANGUAGES.map(({ code, label }) => (
          <button
            key={code}
            type="button"
            className={activeCode === code ? 'active' : ''}
            onClick={() => handleLanguage(code)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
