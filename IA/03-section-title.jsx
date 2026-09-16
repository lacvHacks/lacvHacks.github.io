/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  SectionTitle — título reutilizable de las páginas internas
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  ¿Qué es?
 *    Un <h1> genérico que divide su propio texto en letras con SplitType y
 *    las anima. Se usa como título en las páginas:
 *      - Repasos / Reviews      → <SectionTitle text={t("reviews.title")} />
 *      - Detalle de curso       → <SectionTitle text={curso.titleFull} />
 *      - Donaciones             → <SectionTitle text={t("donations.title")} />
 *
 *  Comportamiento de las letras:
 *    - ENTRA: cada letra cae desde una posición/rotación aleatoria (más
 *      discreta que el Hero: ±110px, ±50°, ±30px) con rebote.
 *    - HOVER: la letra "tiembla" hacia otra posición aleatoria y vuelve.
 *
 *  ¿De dónde sale este código?
 *    Reescritura legible del componente original comprimido en:
 *        assets/index-fd00c780.js  (líneas 25390 – 25430)
 *
 *  💡 Es el MISMO patrón que HeroTitle pero con rangos más chicos: es el
 *  mismo "look" de letras animadas en todo el sitio, con intensidad
 *  distinta según la jerarquía visual.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { TextSplitter } from "./04-split-type-engine";

/* ─────────────────────────────────────────────────────────────────────────────
 * UTILIDADES PUROS (mismas del HeroTitle; se duplican aquí para que cada
 * archivo sea independiente / de lectura standalone)
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Entero aleatorio dentro de [min, max) — inclusive en min, exclusivo en max.
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Desplazamiento aleatorio dentro de un rango SIMÉTRICO (±range).
 * @param {number} range Mitad del rango.
 * @returns {number}
 */
function randomOffset(range) {
  return randomInt(-range, range + 1);
}

/**
 * "Caída" vertical aleatoria hacia ARRIBA, como la del bundle original:
 *   Math.floor(Math.random() * 101) − 110  →  siempre entre -110 y -10 px.
 * Genera el efecto "la letra venía de arriba" sin valores positivos.
 * @returns {number} Valor de translateY en píxeles (negativo siempre).
 */
function randomDrop() {
  return randomInt(0, 101) - 110;
}

/* ─────────────────────────────────────────────────────────────────────────────
 * CONSTANTES DE ANIMACIÓN (los "números mágicos" del original, con nombre)
 * ──────────────────────────────────────────────────────────────────────────── */

/** Rango (grados) de la rotación de entrada. */
const ENTRANCE_ROTATION_RANGE = 50;

/** Rango (px) del desplazamiento horizontal de entrada. */
const ENTRANCE_X_RANGE = 30;

/** Retraso base (seg) antes de empezar la cascada. */
const ENTRANCE_BASE_DELAY = 0.5;

/** Cascada entre letras (seg). */
const ENTRANCE_STAGGER = 0.015;

/** Rango (grados) del "temblor" rotatorio en hover. */
const HOVER_ROTATION_RANGE = 50;

/** Rango (px) del "temblor" horizontal en hover. */
const HOVER_X_RANGE = 30;

/** Retraso (seg) antes de que la letra vuelva a su sitio al salir el mouse. */
const EXIT_RETURN_DELAY = 0.5;

/** Duración (seg) del regreso. */
const EXIT_RETURN_DURATION = 0.7;

/* ─────────────────────────────────────────────────────────────────────────────
 * COMPONENTE SectionTitle
 * ────────────────────────────────────────────────────────────────────────────
 * Props:
 *   text: string — el texto a mostrar y animar. Cambia → re-anima.
 * ──────────────────────────────────────────────────────────────────────────── */

export default function SectionTitle({ text }) {
  /** Ref al <h1> → SplitType lo divide y GSAP lo anima. */
  const titleRef = useRef(null);

  useLayoutEffect(() => {
    const titleElement = titleRef.current;

    /* 1) Divide el texto en palabras + letras con clase "title-letter". */
    const splitter = new TextSplitter(titleElement, {
      types: "words, chars",
      charClass: "title-letter",
    });

    /* 2) Entrada: cada letra parte:
         - invisible (opacity 0)
         - desplazada hacia arriba (caída soft): -110 .. -10px en Y
         - rotada: ±50°
         - corrida: ±30px en X
       Y aterriza con un rebote (back.out(3)) en cascada de 15ms por letra. */
    splitter.chars.forEach((char, index) => {
      gsap.from(char, {
        opacity: 0,
        translateY: randomDrop(), // -110 .. -10 px → la letra cae desde arriba
        rotateZ: randomOffset(ENTRANCE_ROTATION_RANGE),
        translateX: randomOffset(ENTRANCE_X_RANGE),
        ease: "back.out(3)",
        delay: index * ENTRANCE_STAGGER + ENTRANCE_BASE_DELAY,
      });

      /* 3) HOVER: temblor. La letra se desplaza/rota hacia un punto
         aleatorio y al salir el mouse vuelve exactamente a (0, 0, 0°). */
      char.addEventListener("mouseenter", () => {
        gsap.to(char, {
          translateY: randomDrop(),
          rotateZ: randomOffset(HOVER_ROTATION_RANGE),
          translateX: randomOffset(HOVER_X_RANGE),
          duration: 0.5,
          ease: "back.out",
        });
      });

      char.addEventListener("mouseleave", () => {
        gsap.to(char, {
          translateY: 0,
          rotateZ: 0,
          translateX: 0,
          delay: EXIT_RETURN_DELAY,
          duration: EXIT_RETURN_DURATION,
          ease: "back.out(4)",
        });
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <h1 className="inner-section-title" ref={titleRef}>
      {text}
    </h1>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * EXTRAS DEL BUNDLE ORIGINAL (para referencia)
 * ─────────────────────────────────────────────────────────────────────────────
 *  Al lado de SectionTitle ($g) vivía el componente "SectionSubtitle" (X2),
 *  que animaba el <p> que acompaña a estos títulos:
 *
 *    const SectionSubtitle = ({ text }) => {
 *      const ref = useRef();
 *      useLayoutEffect(() => {
 *        gsap.from(ref.current, { opacity: 0, y: -200, ease: "back.out(1)", delay: 0.75 });
 *      }, [text]);
 *      return <p ref={ref}>{text}</p>;
 *    };
 *
 *  Es una animación del párrafo completo (NO letra por letra), por lo que
 *  no pertenece al sistema de "letras creadas en JS".
 * ─────────────────────────────────────────────────────────────────────────────
 */