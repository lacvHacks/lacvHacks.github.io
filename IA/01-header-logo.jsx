/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  HeaderLogo — el logo "lacvHacks." dividido en letras animadas
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  ¿Qué es?
 *    El componente del header que aparece en TODAS las páginas. Su texto
 *    "lacvHacks." se parte en letras individuales (SplitType) y cada letra:
 *      - entra deslizándose desde la izquierda en cascada, y
 *      - rebota + cambia de color al pasarle el mouse por encima.
 *
 *  ¿De dónde sale este código?
 *    Reescritura legible del componente original que estaba comprimido en:
 *        assets/index-fd00c780.js  (líneas 16445 – 16593)
 *
 *  Estructura DOM del logo (tal como lo ve SplitType):
 *      <a class="header-logo">
 *        <span class="arroba">⌁</span>
 *        lacv
 *        <span class="dot">H</span>
 *        acks
 *        <span class="dot">.</span>      ← el "." se pinta como el .dot (verde)
 *      </a>
 *
 *  ⚙️ Motor usado: TextSplitter (ver 04-split-type-engine.js). Este archivo es
 *  solo la capa de React + GSAP alrededor del motor.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
import { TextSplitter } from "./04-split-type-engine";

/* ─────────────────────────────────────────────────────────────────────────────
 * CONSTANTES DE ANIMACIÓN (los "números mágicos" del original, con nombre)
 * ──────────────────────────────────────────────────────────────────────────── */

/** Duración (seg) del "pop" con que aparece el header completo. */
const HEADER_POP_DELAY = 0.75;

/** Desplazamiento inicial (px) de cada letra: viene de la izquierda. */
const CHAR_ENTRANCE_OFFSET = -100;

/** Cascada entre letras (ms): cada letra entra 20ms después de la anterior. */
const CHAR_STAGGER = 0.02;

/** Retraso (seg) con que empiezan a entrar las letras tras el pop del header. */
const CHAR_ENTRANCE_DELAY = 1.0;

/** Desplazamiento inicial (px) de los items del menú: vienen de arriba. */
const NAV_ENTRANCE_OFFSET = -100;

/** Cascada entre items del menú (ms). */
const NAV_STAGGER = 0.02;

/** Retraso del menú respecto a las letras del logo. */
const NAV_ENTRANCE_DELAY = 1.25;

/** Altura del salto (px) de una letra cuando el mouse pasa por encima. */
const CHAR_HOVER_JUMP = -10;

/** Tiempo (seg) que tarda la letra en volver a su sitio tras salir el mouse. */
const CHAR_RETURN_DELAY = 0.3;

/* ─────────────────────────────────────────────────────────────────────────────
 * COMPONENTE HeaderLogo
 * ────────────────────────────────────────────────────────────────────────────
 * Props:
 *   location — objeto de la ruta actual (para cerrar el menú al navegar).
 *   translate — función i18n del header (t("header.home"), etc.).
 * ──────────────────────────────────────────────────────────────────────────── */

export default function HeaderLogo({ location, translate }) {
  /** Ref al <header> completo → animación de entrada (pop). */
  const headerRef = useRef(null);

  /** Ref al <a className="header-logo"> → se divide en letras ahí. */
  const logoRef = useRef(null);

  /** Refs de los <li> del menú → animación de entrada en cascada. */
  const navItemRefs = useRef([]);

  /** ¿El menú móvil está abierto? (toggle hamburguesa). */
  const [isMenuOpen, setMenuOpen] = useState(false);

  /* ─────────────────────────────────────────────────────────────────────────
   * ANIMACIONES DE ENTRADA
   * Se ejecutan tras pintar el DOM (useLayoutEffect evita flicker) y SOLO de
   * nuevo cuando cambia el idioma (dependencia = translate.language):
   *   - Pop de entrada del header entero.
   *   - Split del logo en letras + entrada deslizante en cascada.
   *   - Entrada del menú desde arriba en cascada.
   *   - Hover individual por letra (mouseenter / mouseleave).
   * ───────────────────────────────────────────────────────────────────────── */
  useLayoutEffect(() => {
    /* 1) Pop de entrada: el header escala de 0 con un rebote elástico.
       back.out(2) = intensidad de rebote 2. */
    gsap.from(headerRef.current, {
      scale: 0,
      ease: "back.out(2)",
      delay: HEADER_POP_DELAY,
    });

    /* 2) La paleta de colores se lee de las variables CSS :root. Se hace una
       sola vez (getComputedStyle) y se reutiliza en cada hover. */
    const rootStyles = getComputedStyle(document.documentElement);

    /* 3) Dividimos el texto del logo en letras individuales. objects.chars
       queda con un <div class="char"> por carácter. */
    const logoElement = logoRef.current;
    const splitter = new TextSplitter(logoElement, { types: "chars" });

    /* 4) Entrada de las letras: vienen desde la izquierda (-100px) y con
       opacidad 0, luego se deslizan a su sitio en cascada (stagger) con un
       rebote suave. delay = 1s: espera a que termine el pop del header. */
    gsap.from(splitter.chars, {
      x: CHAR_ENTRANCE_OFFSET,
      opacity: 0,
      ease: "back.out(2)",
      stagger: CHAR_STAGGER,
      delay: CHAR_ENTRANCE_DELAY,
    });

    /* 5) Entrada del menú: cada item baja desde arriba con el mismo patrón. */
    gsap.from(navItemRefs.current, {
      y: NAV_ENTRANCE_OFFSET,
      opacity: 0,
      stagger: NAV_STAGGER,
      ease: "back.out(2)",
      delay: NAV_ENTRANCE_DELAY,
    });

    /* 6) Efecto hover POR LETRA. Se adjunta un evento a cada <div class="char">.
       Al entrar el mouse:
         - La letra salta 10px hacia arriba.
         - Cambia de color al verde primario del sitio.
       Al salir el mouse:
         - Vuelve a su sitio (translateY 0) con rebote.
         - Recupera su color natural: texto normal, PERO el "." sigue verde
           (es el punto final del logo, lleva la clase .dot).
         - clearProps elimina el color inline que dejó GSAP para que mande el CSS. */
    splitter.chars.forEach((char) => {
      char.addEventListener("mouseenter", () => {
        gsap.to(char, {
          translateY: CHAR_HOVER_JUMP,
          color: rootStyles.getPropertyValue("--clr-primary"),
          duration: 0.5,
          ease: "back.out",
        });
      });

      char.addEventListener("mouseleave", () => {
        // 1) Baja a su sitio.
        gsap.to(char, {
          translateY: 0,
          delay: CHAR_RETURN_DELAY,
          ease: "back.out(5)",
        });
        // 2) Recupera el color según quién es: el "." es primario, lo demás texto.
        gsap.to(char, {
          delay: 0.4,
          ease: "back.out(1)",
          color:
            char.textContent !== "."
              ? rootStyles.getPropertyValue("--clr-text")
              : rootStyles.getPropertyValue("--clr-primary"),
        });
        // 3) Limpia el color inline para volver al CSS puro.
        gsap.to(char, { clearProps: "color", delay: 0.45 });
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translate.language]);

  /* ─────────────────────────────────────────────────────────────────────────
   * NUEVA ANIMACIÓN AL ABRIR/CERRAR EL MENÚ MÓVIL
   * Cuando isMenuOpen cambia, los items del menú vuelven a bailar a su sitio
   * (efecto secundario del toggle hamburguesa).
   * ───────────────────────────────────────────────────────────────────────── */
  useLayoutEffect(() => {
    gsap.from(navItemRefs.current, {
      y: NAV_ENTRANCE_OFFSET,
      opacity: 0,
      stagger: NAV_STAGGER,
      ease: "back.out(2)",
      delay: 0,
    });
  }, [isMenuOpen]);

  /** Alterna el menú móvil. */
  const toggleMenu = () => setMenuOpen((open) => !open);

  /* ─────────────────────────────────────────────────────────────────────────
   * FORZAR CIERRE DEL MENÚ AL CAMBIAR DE PÁGINA
   * Al navegar (location cambia) el menú móvil se cierra solo, 500ms después.
   * ───────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    setTimeout(() => setMenuOpen(false), 500);
  }, [location]);

  return (
    <header className={isMenuOpen ? "header menu-active" : "header"} ref={headerRef}>
      {/* El logo. SplitType lo divide en <div class="char"> (lacvHacks.) */}
      <Link to="/" className="header-logo" ref={logoRef}>
        <span className="arroba">⌁</span>
        lacv
        <span className="dot">H</span>
        acks
      </Link>

      {/* Navegación principal */}
      <nav className="nav">
        <ul className="nav-list">
          <li
            className="nav-item"
            ref={(item) => {
              navItemRefs.current[0] = item;
            }}
          >
            <Link
              to="/"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {translate("header.home")}
            </Link>
          </li>
          <li
            className="nav-item"
            ref={(item) => {
              navItemRefs.current[1] = item;
            }}
          >
            <Link to="/cursos" className="nav-link" data-tooltip={translate("header.soon")}>
              {translate("header.courses")}
            </Link>
          </li>
          <li
            className="nav-item"
            ref={(item) => {
              navItemRefs.current[2] = item;
            }}
          >
            <Link
              to="/repasos-coderhouse"
              className="nav-link"
              data-tooltip={translate("header.coderhouse")}
            >
              {translate("header.reviews")}
            </Link>
          </li>
          <li
            className="nav-item"
            ref={(item) => {
              navItemRefs.current[3] = item;
            }}
          >
            <Link to="/donaciones" className="nav-link">
              {translate("header.donations")}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Iconos de abrir/cerrar menú móvil (SVG Bootstrap) */}
      <svg className="open-menu" viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
          onClick={toggleMenu}
        />
      </svg>
      <svg className="close-menu" viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor" aria-hidden="true">
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" onClick={toggleMenu} />
      </svg>

      {/* Botones de idioma + modo oscuro (otros componentes) */}
      <div className="header-buttons">{/* LanguagesMenu y ColorMode viven aparte */}</div>
    </header>
  );
}