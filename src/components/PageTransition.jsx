/**
 * PageTransition.jsx — Overlays de transición al cambiar de página.
 *
 * El sitio original usaba framer-motion con dos overlays fijos
 * (.transition-slide-in / .transition-slide-out). Reproducimos la misma
 * idea con GSAP sin depender de framer-motion:
 *
 *  1. slider-in : queda OCULTO (scaleY 0). En el original solo se usaba en
 *     el "exit" (cubrir la página al salir); si se dejara visible taparía
 *     todo con un panel verde.
 *  2. slider-out: arranca cubriendo (scaleX 1) y se retira a 0, revelando
 *     la página con un barrido.
 *
 * En App se usa con `key={pathname}`: al cambiar de ruta React remonta este
 * componente y el barrido se reproduce de nuevo.
 */

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

// El original randomizaba el origen del transform del panel de salida.
const ORIGENES_SALIDA = ['left', 'right', 'center'];

// Devuelve uno de los orígenes al azar (como hacía el bundle original).
function origenAleatorio(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

export default function PageTransition({ children }) {
  // OJO: el panel de entrada NO se toca con GSAP. Como nunca se muestra
  // (queda oculto por CSS con scaleY 0), si GSAP le escribiera el transform
  // inline pisaría ese scaleY 0 y volvería a tapar toda la página.
  const slideOutRef = useRef(null);

  // Al montar (o sea, al navegar a otra ruta) corre la transición.
  useLayoutEffect(() => {
    // El panel de salida arranca cubriendo y se retira para revelar.
    const tl = gsap.timeline();
    tl.fromTo(
      slideOutRef.current,
      { scaleX: 1, transformOrigin: origenAleatorio(ORIGENES_SALIDA) },
      { scaleX: 0, duration: 0.5, ease: 'power2.inOut' }
    );

    return () => tl.kill();
  }, []);

  return (
    <>
      {/* Overlay de entrada: oculto por CSS (solo se usaría al salir). */}
      <div className="transition-slide-in" />
      {/* Overlay de salida: GSAP lo retira para revelar la página. */}
      <div className="transition-slide-out" ref={slideOutRef} />
      {children}
    </>
  );
}