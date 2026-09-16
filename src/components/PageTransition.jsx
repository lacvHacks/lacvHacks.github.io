/**
 * PageTransition.jsx — Overlays de transición al cambiar de página.
 *
 * El sitio original usaba framer-motion con dos overlays fijos
 * (.transition-slide-in / .transition-slide-out). Reproducimos la misma
 * idea con GSAP sin depender de framer-motion:
 *
 *  1. slider-in : escala de 0 a 1 en Y (cubre la pantalla) desde abajo.
 *  2. slider-out: escala de 1 a 0 en X (destapa la pantalla) hacia la izquierda.
 *
 * En App se usa con `key={pathname}`: al cambiar de ruta React remonta este
 * componente y la transición se reproduce de nuevo.
 */

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

export default function PageTransition({ children }) {
  const slideInRef = useRef(null);
  const slideOutRef = useRef(null);

  // Al montar (o sea, al navegar a otra ruta) corre la transición.
  useLayoutEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      slideInRef.current,
      { scaleY: 0 },
      { scaleY: 1, duration: 0.4, ease: 'power2.inOut' }
    );
    tl.fromTo(
      slideOutRef.current,
      { scaleX: 1 },
      { scaleX: 0, duration: 0.5, ease: 'power2.inOut' },
      '+=0.1'
    );

    return () => tl.kill();
  }, []);

  return (
    <>
      {/* Overlays (siempre presentes, se animan con GSAP) */}
      <div className="transition-slide-in" ref={slideInRef} />
      <div className="transition-slide-out" ref={slideOutRef} />
      {children}
    </>
  );
}