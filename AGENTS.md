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
- `npm run deploy` compila con Vite y publica /dist en la rama `gh-pages`
  (script: scripts/deploy-gh-pages.sh). Pages sirve desde `gh-pages` /(root).
- Se usa rama y no GitHub Actions porque el token OAuth local no tiene el
  scope `workflow` (GitHub rechaza subir .github/workflows/* sin él).
  Si algún día se agrega ese scope, se puede migrar a Actions.
- El script copia dist/index.html a 404.html para que las rutas profundas
  (/cursos, etc.) funcionen como SPA en Pages.
- El build usa base './' (rutas relativas) para que sirva desde la raíz.

Páginas
-------
- /                         → Home (reconstruida completa)
- /cursos, /repasos-coderhouse, /donaciones → placeholders "Próximamente"
- *                         → 404