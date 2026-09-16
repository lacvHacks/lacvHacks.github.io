/**
 * Hero.jsx — Hero de la home: avatar + título animado + estadísticas.
 *
 * Recreación del bundle original: sección .hero con 3 hijos en la que el
 * avatar entra girando, el título "explota" letra por letra y las
 * estadísticas suben con giro 3D.
 */

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import HeroAvatar from './HeroAvatar';
import HeroTitle from './HeroTitle';
import HeroStats from './HeroStats';

export default function Hero() {
  const heroRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {}, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <HeroAvatar />
      <HeroTitle />
      <HeroStats />
    </section>
  );
}