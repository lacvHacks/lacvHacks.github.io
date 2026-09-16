/**
 * HeroAvatar.jsx — Foto de perfil (a.png) con fondo animado.
 *
 * Reconstruido del bundle original:
 *  - El fondo (.hero-avatar-background) entra con scale 0 + rotación -360°
 *    (delay 1.3s, rebote).
 *  - La foto entra con scale 0 + rotación Z 150° (delay 1s).
 *  - Al pasar el mouse: la foto se achica a 0.7, rota según (l+180)*-1
 *    con l aleatorio entre -10 y 10, y sus esquinas se redondean a 3rem.
 *    El fondo se agranda a 1.1 y rota un poco. Al salir, vuelve (la foto
 *    se agranda a 0.85 y el borde vuelve a 1rem; el fondo escala a 1).
 *  - La imagen NO se reemplaza: se alterna entre a.png y b.png al hover.
 */

import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// Imágenes guardadas en /assets (carpeta pública de Vite)
const AVATAR_A = new URL('/assets/a.png', import.meta.url).href;
const AVATAR_B = new URL('/assets/b.png', import.meta.url).href;

export default function HeroAvatar() {
  const containerRef = useRef(null); // .hero-avatar (fondo + foto)
  const backgroundRef = useRef(null); // .hero-avatar-background
  const pictureRef = useRef(null); // .hero-avatar-picture (img)

  // ?hovered: true → se muestra b.png ; false → a.png (como el original)
  const [hovered, setHovered] = useState(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const background = backgroundRef.current;
    const picture = pictureRef.current;
    if (!container || !background || !picture) return undefined;

    const ctx = gsap.context(() => {
      // ---- Entrada ----
      // El fondo aparece girando (scale 0 → 1, rotación -360), luego la
      // foto aparece con scale 0 + rotación Z de 150° (delay 1s).
      gsap.from(background, {
        scale: 0,
        rotate: -360,
        duration: 0.65,
        ease: 'back.out(2)',
        delay: 1.3,
      });
      gsap.from(picture, {
        scale: 0,
        rotateZ: 150,
        duration: 0.75,
        ease: 'back.out(2)',
        delay: 1,
      });

      // ---- Hover ----
      // Genera un ángulo aleatorio entre -10 y 10 (igual que el original)
      const randomRotation = () => gsap.utils.random(-10, 10);

      container.addEventListener('mouseenter', () => {
        setHovered(true); // cambia la foto a b.png

        // La foto hace un giro de "guiño" (se pone de cabeza un instante)
        // pero TERMINA en rotate 0: al acabar la animación b.png queda
        // posicionada igual que a.png.
        const timeline = gsap.timeline();
        timeline.to(picture, {
          rotate: () => (randomRotation() + 180) * -1,
          duration: 0.25,
          ease: 'back.out(3)',
        });
        timeline.to(picture, { rotate: 0, duration: 0.35, ease: 'power2.out' });
        // La foto se achica y redondea esquinas (en paralelo al giro)
        timeline.to(
          picture,
          {
            scale: 0.7,
            borderRadius: '3rem',
            duration: 0.3,
            ease: 'back.out(3)',
          },
          0,
        );
        // El fondo se agranda y rota un poco
        gsap.to(background, {
          scale: 1.1,
          rotate: randomRotation,
          duration: 0.3,
          ease: 'back.out(3)',
        });
      });

      container.addEventListener('mouseleave', () => {
        setHovered(false); // vuelve a a.png

        // La foto se agranda a 0.85 y recupera esquinas normales
        gsap.to(picture, {
          scale: 0.85,
          rotate: 0,
          borderRadius: '1rem',
          duration: 0.3,
          ease: 'back.out(3)',
        });
        // El fondo vuelve a escala 1 sin rotación
        gsap.to(background, { scale: 1, rotate: 0, duration: 0.3, ease: 'back.out(3)' });
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div className="hero-avatar" ref={containerRef}>
      {/* Fondo verde: el "cuadro" detrás de la foto */}
      <div className="hero-avatar-background" ref={backgroundRef} />
      {/* Foto: muestra a.png o b.png según el estado de hover */}
      <img
        className="hero-avatar-picture"
        src={hovered ? AVATAR_B : AVATAR_A}
        alt="Foto de Luis Caicedo"
        ref={pictureRef}
      />
    </div>
  );
}