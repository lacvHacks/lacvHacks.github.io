Sitio LACV de Luis Caicedo
=============================

Comandos
--------
- npm run dev      → servidor de desarrollo (Vite)
- npm run build    → compilar producción (salida en /dist)
- npm run preview  → previsualizar el build

Estructura
----------
- index.html          → entrada de Vite (favicons + SEO)
- src/                → código fuente React
- src/main.jsx        → montaje (registra GSAP, i18n ya inicializado)
- src/App.jsx         → layout raíz + rutas + transición
- src/i18n.js         → textos ES/EN/PT (namespace "global")
- src/styles/global.css → estilos (base portada del build original + reconstruidos)
- src/components/layout/    → Header, Footer, LanguageMenu, ColorMode
- src/components/home/      → Hero, HeroTitle, HeroAvatar, HeroStats, Shortcuts
- src/components/PageTransition.jsx → overlays de transición de ruta
- src/pages/          → Home, InfoPlaceholder, NotFound
- public/             → favicons (migrados de /meta) y assets/a.png, b.png
- IA/CONTEXT.md       → contexto técnico para agentes IA (arqueología del bundle)

Convenciones
------------
- TODOS los archivos en español, con comentarios explicando qué hace cada
  bloque de código. Es un requisito del dueño del proyecto.
- Animas con GSAP + SplitType (nunca framer-motion). GitHub: se usa
  gsap.context() + ctx.revert() en los efectos.
- Enlazar entre páginas con react-router (NavLink/Link).
- Los textos SIEMPRE van en src/i18n.js (nunca hardcodeados), como el original.
- Idioma por defecto: es. Persistencia en localStorage clave "i18nextLng".
- Dark mode: clase .dark-mode en <html>; persistencia clave "isDark".

Despliegue (GitHub Pages)
-------------------------
- .github/workflows/deploy.yml compila con Vite y publica /dist con Actions.
- En el repositorio hay que activar: Settings → Pages → Source: GitHub Actions.
- El build usa base './' (rutas relativas) para que sirva desde la raíz.

Páginas
-------
- /                         → Home (reconstruida completa)
- /cursos, /repasos-coderhouse, /donaciones → placeholders "Próximamente"
- *                         → 404