/**
 * Header.jsx — Barra de navegación (logo + menú + idiomas + modo oscuro).
 *
 * Comportamiento reconstruido del bundle original:
 *  - El header entero entra escalando desde 0 con rebote (back.out).
 *  - El logo (@lacvHacks) se divide en letras (SplitType); cada letra entra
 *    deslizándose desde la izquierda y, al pasar el mouse, sube 10px y se
 *    pinta con el color primario.
 *  - Los ítems del menú entran deslizándose desde arriba.
 *  - En pantallas chicas el menú se convierte en un botón hamburguesa que
 *    abre un menú a pantalla completa (clase .menu-active).
 *  - Mide su propia altura y la publica como --header-height para que el
 *    Hero calcule su alto (100vh - header).
 */

import { useLayoutEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import SplitType from 'split-type';
import LanguageMenu from './LanguageMenu';
import ColorMode from './ColorMode';
import { IconHamburger, IconClose } from '../icons';

// Rutas del menú. tooltipKey agrega un tooltip (data-tooltip) al hover.
const NAV_ITEMS = [
  { to: '/', labelKey: 'header.home' },
  { to: '/cursos', labelKey: 'header.courses', tooltipKey: 'header.soon' },
  { to: '/repasos-coderhouse', labelKey: 'header.reviews', tooltipKey: 'header.coderhouse' },
  { to: '/donaciones', labelKey: 'header.donations' },
];

export default function Header() {
  const { t } = useTranslation();
  const [menuActive, setMenuActive] = useState(false);

  // Refs para animaciones y mediciones
  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const navItemsRef = useRef([]);

  /**
   * Animaciones de entrada + hover de letras del logo.
   * Se usa gsap.context() para que al desmontar se revierta todo de una.
   */
  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return undefined;

    const ctx = gsap.context(() => {
      // 1) El header entero escala desde 0 (rebote) — delay 0.75s.
      gsap.from(header, {
        scale: 0,
        ease: 'back.out(2)',
        delay: 0.75,
        duration: 0.5,
      });

      // 2) Logo: se divide en letras. Cada letra entra desde la izquierda
      //    con un pequeño stagger (0.02s) y delay 1s.
      const logoChars = new SplitType(logoRef.current, { types: 'chars' }).chars;
      gsap.from(logoChars, { x: -100, stagger: 0.02, delay: 1 });

      // Hover por letra: sube y se pinta de verde (el "." siempre verde).
      logoChars.forEach((char) => {
        char.addEventListener('mouseenter', () => {
          gsap.to(char, { y: -10, color: 'var(--clr-primary)', duration: 0.2 });
        });
        char.addEventListener('mouseleave', () => {
          gsap.to(char, {
            y: 0,
            color: char.textContent === '.' ? 'var(--clr-primary)' : 'var(--clr-text)',
            duration: 0.2,
          });
        });
      });

      // 3) Ítems del menú entran deslizándose desde arriba — delay 1.25s.
      gsap.from(navItemsRef.current, { y: -100, stagger: 0.02, delay: 1.25 });
    }, header);

    return () => ctx.revert();
  }, []);

  /**
   * Publica la altura real del header como --header-height.
   * Así .hero puede hacer min-height: calc(100vh - var(--header-height)).
   */
  useLayoutEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        document.documentElement.style.setProperty(
          '--header-height',
          `${headerRef.current.offsetHeight}px`
        );
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Cerrar menús al navegar
  const closeMenus = () => setMenuActive(false);

  return (
    <header
      className={`header${menuActive ? ' menu-active' : ''}`}
      ref={headerRef}
    >
      {/* Logo: el glifo U+F8FF (@ con logo de Apple) + "lacvHacks" */}
      <NavLink to="/" className="header-logo" onClick={closeMenus} ref={logoRef}>
        <span className="arroba">{'\uF8FF'}</span>
        lacv
        <span className="dot">H</span>
        acks
      </NavLink>

      {/* Menú de navegación */}
      <nav className="nav" aria-label="Menú principal">
        <ul className="nav-list">
          {NAV_ITEMS.map((item, index) => (
            <li
              className="nav-item"
              key={item.to}
              ref={(node) => {
                navItemsRef.current[index] = node;
              }}
            >
              <NavLink
                to={item.to}
                className="nav-link"
                data-tooltip={item.tooltipKey ? t(item.tooltipKey) : undefined}
                onClick={closeMenus}
              >
                {t(item.labelKey)}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Botones del lado derecho: idiomas + modo claro/oscuro */}
      <div className="header-buttons">
        <LanguageMenu menuActive={menuActive} />
        <ColorMode />
      </div>

      {/* Botones de menú móvil */}
      <button
        type="button"
        className="open-menu"
        aria-label="Abrir menú"
        onClick={() => setMenuActive(true)}
      >
        <IconHamburger />
      </button>
      <button
        type="button"
        className="close-menu"
        aria-label="Cerrar menú"
        onClick={() => setMenuActive(false)}
      >
        <IconClose />
      </button>
    </header>
  );
}