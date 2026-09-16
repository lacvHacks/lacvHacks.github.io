/**
 * HeroTitle.jsx — Título del hero con animación "explosión" de letras.
 *
 * Este es el corazón visual del sitio (portado de IA/02 + bundle original):
 *  - El título se divide en palabras y letras con SplitType.
 *  - Entrada: cada letra "explota" desde el centro (scale 0) con un
 *    desplazamiento X/Y y una rotación Z aleatorios (entre -300 y 300),
 *    con delay progresivo (c * 0.015 + 0.5s).
 *  - Cada letra hace un "flash" de color aleatorio (delay aleatorio 0.75–2.25s)
 *    y luego vuelve a su color normal.
 *  - Hover: la letra sube 10px, rota y se desplaza al azar, cambia de escala
 *    y de color. Al salir vuelve a la normalidad.
 *  - La descripción entra palabra por palabra con opacidad.
 */

import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import SplitType from 'split-type';

// Genera un color hexadecimal aleatorio (como el original)
const randomColor = () =>
  `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`;

export default function HeroTitle() {
  const { t, i18n } = useTranslation();

  const titleRef = useRef(null); // <h1> (texto animado)
  const descRef = useRef(null); // <p> descripción

  // La animación se repite al cambiar de idioma (los textos cambian)
  const language = i18n.language;
  useLayoutEffect(() => {
    const title = titleRef.current;
    const desc = descRef.current;
    if (!title || !desc) return undefined;

    // Divide el título en palabras + letras, y la descripción en palabras
    const titleSplit = new SplitType(title, {
      types: 'words, chars',
      charClass: 'title-letter',
    });
    const descSplit = new SplitType(desc, { types: 'words' });

    const ctx = gsap.context(() => {
      // ---- Animación de entrada de cada letra ----
      titleSplit.chars.forEach((char, index) => {
        gsap.from(char, {
          scale: 0,
          y: gsap.utils.random(-300, 300),
          rotateZ: gsap.utils.random(-300, 300),
          x: gsap.utils.random(-300, 300),
          delay: index * 0.015 + 0.5, // stagger entre letras
          duration: 0.75,
          ease: 'back.out(3)',
        });

        // "Flash" de color aleatorio: en un momento al azar la letra se
        // pinta de un color random y vuelve a su color (clearProps).
        gsap.to(char, {
          color: randomColor(),
          delay: gsap.utils.random(5, 21, 1) / 10 + 0.25,
          duration: 0.1,
          clearProps: 'color',
          immediateRender: false,
        });

        // ---- Hover por letra ----
        char.addEventListener('mouseenter', () => {
          gsap.to(char, {
            y: -10,
            rotateZ: gsap.utils.random(-50, 50),
            x: gsap.utils.random(-30, 30),
            scale: gsap.utils.random(1, 8) * 0.25,
            color: randomColor(),
            duration: 0.1,
          });
        });
        char.addEventListener('mouseleave', () => {
          gsap.to(char, {
            y: 0,
            rotateZ: 0,
            x: 0,
            scale: 1,
            color: 'var(--clr-text)',
            duration: 0.1,
          });
        });
      });

      // ---- La descripción entra palabra por palabra ----
      gsap.from(descSplit.words, {
        y: 20,
        opacity: 0,
        stagger: 0.05,
        delay: 0.5,
      });
    }, title);

    return () => ctx.revert();
  }, [language]);

  return (
    // key={language} fuerza a React a remontar el bloque al cambiar de idioma:
    // SplitType reemplaza el DOM con spans, así que los nodos de texto que
    // React conoce quedan obsoletos y el texto no se actualizaría solo.
    <div key={language}>
      {/* Título: se divide en letras (charClass title-letter) para animar */}
      <h1 className="hero-title" ref={titleRef}>
        {t('hero.title1')}
        <br />
        {t('hero.title2')}
      </h1>

      {/* Descripción: entra palabra por palabra */}
      <p className="hero-description" ref={descRef}>
        {t('hero.text')}
      </p>
    </div>
  );
}