/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  HeroTitle — el título gigante del home con letras que "explotan"
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  ¿Qué es?
 *    El <h1> de la página de inicio (dos líneas separadas por <br>). Cada
 *    letra:
 *      - ENTRA desde una posición/rotación ALEATORIA y "explota" a su sitio
 *        con un rebote (efecto confeti).
 *      - Hace un FLASH de color aleatorio justo después de aterrizar.
 *      - Si pasás el mouse: la letra se LANZA a otra posición aleatoria con
 *        otro color. Al salir, vuelve con un rebote fuerte.
 *
 *  ¿De dónde sale este código?
 *    Reescritura legible del componente original comprimido en:
 *        assets/index-fd00c780.js  (líneas 16807 – 16908)
 *
 *  ¿Qué dependencias usa?
 *    - gsap           → todas las animaciones.
 *    - TextSplitter   → ver 04-split-type-engine.js (divide el texto en letras).
 *    - react-i18next  → textos traducidos (t("home.hero.title1") ...).
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { TextSplitter } from "./04-split-type-engine";

/* ─────────────────────────────────────────────────────────────────────────────
 * UTILIDADES PUROS (funciones auxiliares sin efectos)
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Número aleatorio dentro de [min, max) — inclusive en min, exclusivo en max.
 * @param {number} min
 * @param {number} max
 * @returns {number} Entero aleatorio en el rango pedido.
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Desplazamiento o ángulo aleatorio dentro de un rango SIMÉTRICO (±range).
 *   randomOffset(300) → -300 .. 300
 * @param {number} range Mitad del rango.
 * @returns {number}
 */
function randomOffset(range) {
  return randomInt(-range, range + 1);
}

/**
 * Color hexadecimal aleatorio (#000000 .. #ffffff).
 * @returns {string}
 */
function randomHexColor() {
  return "#" + randomInt(0, 0xffffff).toString(16).padStart(6, "0");
}

/* ─────────────────────────────────────────────────────────────────────────────
 * CONSTANTES DE ANIMACIÓN (los "números mágicos" del original, con nombre)
 * ──────────────────────────────────────────────────────────────────────────── */

/** Rango (px) del desplazamiento aleatorio de entrada: X e Y. */
const ENTRANCE_OFFSET_RANGE = 300;

/** Rango (grados) de la rotación aleatoria de entrada. */
const ENTRANCE_ROTATION_RANGE = 300;

/** Retraso base (seg) antes de empezar la cascada de letras. */
const ENTRANCE_BASE_DELAY = 0.5;

/** Cascada entre letras (seg): 15ms por letra → efecto ola. */
const ENTRANCE_STAGGER = 0.015;

/** Duración (seg) de la explosión de cada letra. */
const ENTRANCE_DURATION = 0.75;

/** Rango del scalado aleatorio en el hover de la letra (0.25 .. 2.0). */
const HOVER_SCALE_RANGE = [1, 8];

/** Rango (px) del desplazamiento aleatorio del hover. */
const HOVER_OFFSET_RANGE = 30;

/** Rango (grados) de la rotación aleatoria del hover. */
const HOVER_ROTATION_RANGE = 50;

/** Retraso (seg) con que la letra vuelve a su sitio al salir el mouse. */
const EXIT_RETURN_DELAY = 0.75;

/** Duración (seg) del regreso. */
const EXIT_RETURN_DURATION = 0.7;

/** Rango (seg) del retraso del cambio de color tras volver al texto. */
const EXIT_COLOR_DELAY_RANGE = [1.5, 3];

/* ─────────────────────────────────────────────────────────────────────────────
 * COMPONENTE HeroTitle
 * ────────────────────────────────────────────────────────────────────────────
 * Sin props: lee los textos traducidos del hook useTranslation("global").
 * ──────────────────────────────────────────────────────────────────────────── */

export default function HeroTitle({ translate }) {
  /** Ref al <h1 class="hero-title"> → se divide en palabras + letras. */
  const titleRef = useRef(null);

  /** Ref al <p class="hero-description"> → subtítulo (animación simple). */
  const descriptionRef = useRef(null);

  /* ─────────────────────────────────────────────────────────────────────────
   * ANIMACIÓN PRINCIPAL
   * useLayoutEffect: corre DESPUÉS de que React pintó el DOM y ANTES de que
   * el navegador pinte → no hay parpadeo de "letras sin animar".
   * Se re-ejecuta cuando cambia el idioma (de nuevo la explosión).
   * ───────────────────────────────────────────────────────────────────────── */
  useLayoutEffect(() => {
    /* Paleta real del sitio desde las variables CSS :root. */
    const rootStyles = getComputedStyle(document.documentElement);

    /* 1) Divide el título en palabras + letras. La clase "title-letter" va a
       cada <div class="char"> (permite darle estilo desde CSS). */
    const titleSplit = new TextSplitter(titleRef.current, {
      types: "words, chars",
      charClass: "title-letter",
    });

    /* 2) Cada letra EXPLOTA desde un lugar aleatorio:
         - scale 0 (empieza invisible)
         - desplazada ±300px en X e Y
         - rotada ±300°
       Luego vuelve a su sitio con ease "back.out(3)" (rebote muy marcado).
       El delay es progresivo (índice * 15ms) → las letras entran en ola. */
    titleSplit.chars.forEach((char, index) => {
      gsap.from(char, {
        scale: 0,
        translateY: randomOffset(ENTRANCE_OFFSET_RANGE),
        rotateZ: randomOffset(ENTRANCE_ROTATION_RANGE),
        translateX: randomOffset(ENTRANCE_OFFSET_RANGE),
        ease: "back.out(3)",
        delay: index * ENTRANCE_STAGGER + ENTRANCE_BASE_DELAY,
        duration: ENTRANCE_DURATION,
      });

      /* 3) Justo después de aterrizar la letra parpadea en un color aleatorio
         y vuelve al color de texto. El retardo original es
         (aleatorio 5..20)/10 + 0.25  →  0.75s .. 2.25s. */
      const colorFlashDelay = randomInt(5, 21) / 10 + 0.25;

      gsap.from(char, {
        color: randomHexColor(),
        delay: colorFlashDelay,
        ease: "back.out(3)",
      });
      gsap.to(char, { clearProps: "color", delay: colorFlashDelay + 0.1 });

      /* 4) HOVER: al pasar el mouse la letra se LANZA a una posición,
         rotación y escala aleatorias con otro color aleatorio.
         mouseleave: vuelve a (0,0, rot 0, scale 1) con un rebote fuerte y
         luego recupera el color base del texto. */
      char.addEventListener("mouseenter", () => {
        gsap.to(char, {
          translateY: -10,
          rotateZ: randomOffset(HOVER_ROTATION_RANGE),
          translateX: randomOffset(HOVER_OFFSET_RANGE),
          duration: 0.5,
          ease: "back.out",
          scale: (randomInt(HOVER_SCALE_RANGE[0], HOVER_SCALE_RANGE[1] + 1) * 0.25),
        });
        gsap.to(char, {
          color: randomHexColor(),
          duration: 0.1,
          ease: "back.out",
        });
      });

      char.addEventListener("mouseleave", () => {
        // Vuelve al lugar exacto (0,0 / 0° / escala 1).
        gsap.to(char, {
          translateY: 0,
          rotateZ: 0,
          translateX: 0,
          delay: EXIT_RETURN_DELAY,
          duration: EXIT_RETURN_DURATION,
          ease: "back.out(4)",
          scale: 1,
        });
        // Y recupera el color base DESPUÉS de volver (retraso aleatorio 1.5–3s).
        const [minDelay, maxDelay] = EXIT_COLOR_DELAY_RANGE;
        const colorDelay = Math.random() * (maxDelay - minDelay) + minDelay;
        gsap.to(char, {
          color: rootStyles.getPropertyValue("--clr-text"),
          delay: colorDelay,
          duration: 1.5,
          ease: "back.out",
          clearProps: "color",
        });
      });
    });

    /* 5) SUBTÍTULO: las palabras del párrafo se deslizan desde abajo (100px)
       con una cascada mucho más fina (5ms) y entrada suave. */
    const descriptionSplit = new TextSplitter(descriptionRef.current, {
      types: "words, chars",
      charClass: "title-letter",
    });

    gsap.from(descriptionSplit.words, {
      opacity: 0,
      translateY: 100,
      stagger: 0.005,
      delay: 0.75,
      ease: "back.out(1.5)",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translate.language]);

  return (
    <>
      {/* El título grande: dos líneas separadas con <br>. La key={language}
          fuerza remontaje en cada cambio de idioma (para re-animar). */}
      <div className="hero-title">
        <h1 ref={titleRef} key={translate.language}>
          {translate("home.hero.title1")}
          <br />
          {translate("home.hero.title2")}
        </h1>
      </div>

      {/* El subtítulo descriptivo. */}
      <div className="hero-description">
        <p ref={descriptionRef} key={translate.language}>
          {translate("home.hero.text")}
        </p>
      </div>
    </>
  );
}