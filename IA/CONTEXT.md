# IA/CONTEXT.md — Contexto técnico para agentes IA

Este sitio nació como GitHub Pages con **solo el bundle minificado** de una
SPA. El equipo de IA reconstruyó el proyecto fuente (Vite + React) haciendo
ingeniería inversa sobre el bundle. Este archivo documenta el "mapa"
extraído, las recetas de animación y las reglas para no romper nada.

## Stack original descubierto

- **Vite** (assets con hash: `index-fd00c780.js`, `index-322fc492.css`).
- **React 18.2.0** + react-dom 18.2.0.
- **react-router-dom 6.15.0** (rutas de historial del navegador, sin `#`).
- **GSAP 3.12.2** + `ScrollTrigger` + `Observer`, y **npm `split-type`**
  para dividir textos en letras/palabras.
- **react-i18next / i18next**: idiomas `es` (por defecto), `en`, `pt`.
  Persistencia: localStorage `i18nextLng`.
- **framer-motion**: solo para la transición de ruta (reimplementada con
  GSAP en `src/components/PageTransition.jsx`).
- **bootstrap-icons** (react-icons/bs): todos los iconos SVG quedaron
  reimplementados a mano en `src/components/icons.jsx`.
- Dark mode: clase `.dark-mode` en `<html>`; persistencia `isDark`.
- Deploy: GitHub Pages sirviendo la rama `gh-pages` (build subido por
  `npm run deploy` / `scripts/deploy-gh-pages.sh`).

## Nota crítica: el CSS original estaba truncado

El CSS del build (`index-322fc492.css`, 420 líneas) terminaba con el texto
literal `... (file continues unchanged)`: fue recortado a mano y **no
contenía** ningún estilo de `.hero`, `.hero-avatar*`, `.hero-title`,
`.hero-stats` ni `.footer`. Por eso el avatar se veía gigante. Esos estilos
se reconstruyeron en `src/styles/global.css` (sección "ESTILOS
RECONSTRUIDOS"). No borrar esa sección: es la identidad visual de la home.

## Cómo cambiar textos

Nunca editar el código: usar `src/i18n.js`.
- Los textos de la home están en `resources.es.global` → claves `hero.*`,
  `stats.*`, `shortcuts.*`.
- `<title>` de cada página: `document.title = "LACV | " + t('pages.home')`.
- El glifo del logo `@lacvHacks` es el carácter **U+F8FF** (logo de Apple)
  dentro de `span.arroba`; el `H` verde es `span.dot`.
- El título `hero.title1` empieza con el carácter `➴` (intencional).

## Mapa componente → código actual

| Bundle (min)  | Componente fuente               | Reproduce                  |
|---------------|---------------------------------|----------------------------|
| T3 (header)   | —                               | `components/layout/Header.jsx` |
| P3 (idiomas)  | —                               | `components/layout/LanguageMenu.jsx` |
| k3 (dark)     | —                               | `components/layout/ColorMode.jsx` |
| E3 (footer)   | —                               | `components/layout/Footer.jsx` |
| N3/R3/D3/A3   | Hero, avatar, título, stats     | `components/home/*`        |
| Z3 (shortcuts) | —                              | `components/home/Shortcuts.jsx` |
| mM (home)     | —                               | `pages/Home.jsx`            |
| na (transición) | —                            | `components/PageTransition.jsx` |

## Recetas de animación (GSAP + SplitType)

- **Logo del header**: `split({types:'chars'})`; chars entran `x:-100`,
  stagger 0.02, delay 1. Hover por char: `y:-10` + color primario (el `.`
  siempre primario). Nav items: `y:-100`, stagger 0.02, delay 1.25. Header:
  `scale:0, back.out(2), delay 0.75`.
- **Título del hero** (`HeroTitle.jsx`): `split({types:'words, chars',
  charClass:'title-letter'})`. Entrada por char: `scale:0`, `y/rotateZ/x:
  gsap.utils.random(-300,300)`, delay `c*0.015+0.5`, dur 0.75,
  `back.out(3)`. "Flash" de color aleatorio: delay `random(5,21,1)/10+0.25`,
  `clearProps:'color'`. Hover: `y:-10`, `rotateZ:random(-50,50)`,
  `x:random(-30,30)`, `scale:random(1,8)*0.25`, color random.
- **Avatar** (`HeroAvatar.jsx`): fondo `scale:0 rotate:-360 delay 1.3`;
  foto `scale:0 rotateZ:150 delay 1`. Hover: foto `scale:.7`,
  `rotate:(l+180)*-1` con `l=random(-10,10)`, `borderRadius:3rem`; fondo
  `scale:1.1 rotate:l`. Leave: foto `scale:.85 borderRadius:1rem`, fondo `1`.
- **Stats** (`HeroStats.jsx`): `y:200 rotateX:360 opacity:0` stagger 0.5,
  delay 1, `back.out(2)`. Datos: API YouTube v3 (`part=statistics`, channel
  `UC53KeIgcYPozO6SqlN6edbw`, key `AIzaSyBY8flILT2zht5OXNNhfhdgzlCIg8w2ywU`).
  Fallback offline: `+3K / +102 / +380K`. Formateo compacto de unidades
  `['','K','M','G','T','P','E']`.
- **Shortcuts** (`Shortcuts.jsx`): `gsap.from` con `scrollTrigger:{
  trigger: card, start:'top bottom', end:"top "+index*"-15+80"+"%",
  scrub:true }`. Hover: `scale:1.15` (zIndex 1), leave `scale:1`.
- **Transición de página** (`PageTransition.jsx`): timeline GSAP con dos
  overlays fijos (.transition-slide-in scaleY 0→1 y .transition-slide-out
  scaleX 1→0), duración 0.4/0.5s, `power2.inOut`. Se dispara remontando el
  componente con `key={location.pathname}`.

## Datos fijos (redes / contactos)

- YouTube: `https://youtube.com/lacvartes`
- Instagram: `https://instagram.com/lacvhacks`
- Twitter: `https://twitter.com/lacvhacks`
- Discord: `https://discord.gg/BHe5Qmr`
- GitHub: `https://github.com/lacvhacks`
- Email: `mailto:lacvhacks@duck.com`

## Reglas para agentes IA

1. Los archivos JSX/CSS van **en español, comentados** (requisito del dueño).
2. Textos (incluidos tooltips del nav) SIEMPRE vía `src/i18n.js`.
3. No re-introducir framer-motion ni react-icons: hay reemplazos locales.
4. No borrar la sección "ESTILOS RECONSTRUIDOS" de `global.css`.
5. Verificar tras cambios: `npm run build` y revisar la home con `npm run dev`.