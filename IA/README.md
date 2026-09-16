# ✨ Sistema de Letras Animadas — LACV

Documentación del sistema que **crea las letras animadas en JavaScript** del sitio
**lacvHacks.github.io** (LACV).

---

## 📌 Índice

1. [Qué es esto](#qué-es-esto)
2. [Las librerías usadas](#las-librerías-usadas)
3. [Cómo se crean las letras (el flujo completo)](#cómo-se-crean-las-letras-el-flujo-completo)
4. [Los 4 componentes que generan letras](#los-4-componentes-que-generan-letras)
5. [Mapa: bundle minificado original → este código fuente](#mapa-bundle-minificado-original--este-código-fuente)
6. [Variables CSS y estilos relevantes](#variables-css-y-estilos-relevantes)
7. [Cómo leer este proyecto](#cómo-leer-este-proyecto)

---

## Qué es esto

El sitio es una **Single Page Application (SPA)** hecha con:

| Tecnología | Uso |
|---|---|
| **React 18** | Estructura de la interfaz (componentes, rutas, estado) |
| **GSAP 3.12** | Animaciones de las letras (entradas, hover, stagger) |
| **SplitType (librería `split-type`)** | Divide el texto en letras individuales (`<div class="char">`) |
| **react-i18next** | Traducciones (EN, ES, PT, AR, FR, RU, JA, KO, NL, CA, IT, CN) |
| **Vite** | Build del bundle |

> ⚠️ **Por qué había que desminificar:** el código original de producción está
> comprimido en un solo archivo (`assets/index-fd00c780.js`, ~29.600 líneas) con
> nombres de variables de una letra (`t`, `e`, `f`, `g`…). Eso es imposible de
> leer para un humano. Esta carpeta contiene **el mismo código pero reescrito
> como fuente limpia**: con nombres descriptivos, funciones, clases, JSDoc y
> comentarios explicativos.

---

## Las librerías usadas

### SplitType (https://split-type.com)

Librería que **convierte una cadena de texto en elementos DOM individuales**:

```
Antes                                   Después
<p>Hola</p>         ──────────►         <p>
                                           <div class="char">H</div>
                                           <div class="char">o</div>
                                           <div class="char">l</div>
                                           <div class="char">a</div>
                                        </p>
```

Puede dividir en tres niveles:

| Nivel | Clase por defecto | Ejemplo |
|---|---|---|
| Líneas | `.line` | cada línea visual del texto |
| Palabras | `.word` | cada palabra |
| Caracteres | `.char` | cada letra |

Se usa con: `new SplitType(element, { types: "words, chars" })`.

La instancia devuelve las propiedades `lines`, `words` y `chars` (arrays de
elementos DOM) sobre las que se pueden lanzar animaciones GSAP.

### GSAP (https://gsap.com)

Librería de animación. En este proyecto se usan dos métodos sobre letras:

| Método | Significado | Uso aquí |
|---|---|---|
| `gsap.from(el, conf)` | Anima el elemento **desde** el estado dado hasta su estado natural | Entradas |
| `gsap.to(el, conf)` | Anima el elemento **hasta** el estado dado | Hover / salidas |

**Parámetros clave de GSAP usados:**

| Parámetro | Qué hace |
|---|---|
| `delay` | Segundos de espera antes de comenzar |
| `duration` | Duración de la animación en segundos |
| `ease: "back.out(n)"` | Curva con rebote; `n` = intensidad del rebote |
| `stagger` | Retraso entre elementos de un array (efecto cascada) |
| `translateX/Y`, `rotateZ`, `scale` | Transformaciones (GSAP las aplica como `transform:` inline) |
| `opacity` | Transparencia |
| `clearProps` | Elimina una propiedad aplicada al terminar (restaura el estado base) |

---

## Cómo se crean las letras (el flujo completo)

```
 1. Llega el texto
        │
        ▼
 2. React renderiza el <h1>/<a> con la cadena de texto   (ej: "lacvHacks.")
        │
        ▼
 3. useLayoutEffect se ejecuta después de pintar el DOM
        │
        ▼
 4. new SplitType(elemento, { types: "words, chars" })
        │
        ▼
 5. SplitType recorre el DOM:
    - Busca nodos de texto
    - Divide el texto en "grafemas" (una regex especial
      tolera emojis y caracteres unicode compuestos)
    - Crea un <div class="char"> por cada letra
    - Reemplaza el texto original por los <div> generados
        │
        ▼
 6. GSAP anima cada letra:
    - Animación de entrada (cascada con stagger + delay)
    - Animación de hover (mouseenter / mouseleave)
        │
        ▼
 7. Si cambia el idioma (i18n), el effect se re-ejecuta:
    SplitType hace revert() (restaura el HTML original) y
    vuelve a dividir con el texto nuevo.
```

---

## Los 4 componentes que generan letras

Existen **3 componentes** que consumen el motor y **1 motor** que hace la división.

| # | Archivo en esta carpeta | Componente | Dónde aparece en el sitio |
|---|---|---|---|
| 01 | `01-header-logo.jsx` | `HeaderLogo` | Logo "lacvHacks." en el header de todas las páginas |
| 02 | `02-hero-title.jsx` | `HeroTitle` | El título gigante de la página de inicio (explosión de letras) |
| 03 | `03-section-title.jsx` | `SectionTitle` | Títulos de las secciones internas: Reviews, Cursos y Donaciones |
| 04 | `04-split-type-engine.js` | `TextSplitter` (motor) | No es visible; es la librería que hace la magia |

### 01 — HeaderLogo (`lacvHacks.`)

- Divide el logo en letras individuales.
- **Entrada:** el contenedor entero aparece con un "pop" (escala desde 0 con
  rebote), y luego cada letra se desliza desde la izquierda (`x: -100`) con
  cascada de 20ms.
- **Hover:** cada letra salta hacia arriba (`translateY: -10`) y se tiñe con el
  color primario del sitio (`--clr-primary`). El punto final `.` usa un color
  especial.
- **Extras:** los items del menú de navegación también tienen animación de
  entrada (se deslizan desde arriba).

### 02 — HeroTitle (explosión de letras)

- Divide el título en palabras **y** letras.
- **Entrada:** cada letra parte desde una **posición y rotación aleatoria**
  (±300px, ±300°) con escala 0, y "explota" hacia su lugar final con un rebote.
  Además, cada letra hace un **flash de color aleatorio** (color hex generado al
  azar) que vuelve al texto normal.
- **Hover:** la letra se "lanza" de nuevo a una posición aleatoria + escala
  aleatoria + color aleatorio. Al salir el mouse, vuelve a su sitio con un
  rebote fuerte.
- Las palabras del subtítulo (`.hero-description`) se deslizan hacia arriba.

### 03 — SectionTitle (títulos de páginas internas)

- Componente reutilizable. Mismo patrón que el Hero pero con **rangos más
  discretos** (caída ±110px, rotación ±50°, desplazamiento ±30px).
- **Entrada:** cada letra parte invisible, transformada y rota, y aterriza con
  rebote.
- **Hover:** las letras "tiemblan" a una posición aleatoria y vuelven a su
  lugar.

### 04 — TextSplitter (motor / la creación literal de las letras)

El corazón del sistema. Contiene:

- **`splitGraphemes()`** — Divide un string en caracteres visuales. Usa una
  regex muy compleja que respeta:
  - Emojis compuestos (familia 👨‍👩‍👧‍👦, banderas 🇦🇷)
  - Caracteres con marcas diacríticas combinables (e + ´ = é)
  - Variantes de emoji (☀️)
- **`createCharElement()`** — Crea el `<div class="char">` con
  `display: inline-block` (esto permite transformar cada letra
  individualmente sin romper el flujo).
- **`splitElement()`** — Reemplaza un nodo de texto por los elementos
  generados usando un `DocumentFragment` (eficiente, una sola operación DOM).
- **`walk()`** — Recorre de forma recursiva todos los nodos hijos.
- **Clase `TextSplitter`** — API pública: `split()`, `revert()`, `revertAll()`.

---

## Mapa: bundle minificado original → este código fuente

El sitio corre con el bundle `assets/index-fd00c780.js`. Cada sección de código
reescrita en esta carpeta corresponde a un rango de líneas de ese bundle:

| Código fuente (esta carpeta) | Bundle original (líneas) |
|---|---|
| `01-header-logo.jsx` | 16445–16593 |
| `02-hero-title.jsx` | 16807–16908 |
| `03-section-title.jsx` | 25390–25430 |
| `04-split-type-engine.js` | 14824–15121 |

El `.char` ya dividido que ves dentro de `index.html` (los `<div class="char">`
del header) es simplemente el **snapshot pre-renderizado** del logo: cuando el
sitio se abrió en la fase de prerender, SplitType ya había dividido el texto y
GSAP ya había aplicado los `transform` finales. En tiempo real, React vuelve a
montar todo y SplitType lo re-divide en cada cambio de idioma.

---

## Variables CSS y estilos relevantes

Definidas en `assets/index-322fc492.css` (declaradas en `:root`):

| Variable | Valor | Rol |
|---|---|---|
| `--clr-primary` | `#015D52` (verde) | Color de acento: logo, letras en hover, links activos |
| `--clr-text` | `#1c1c1c` / `#f2ebd9` (dark) | Color base del texto |
| `--clr-arroba` | `#5e773e` (verde oliva) | El símbolo `⌁` del logo |
| `--ff-title` | *Bricolage Grotesque* | Fuente de los títulos |
| `--ff-text` | *Rubik* | Fuente del cuerpo |

Estilos relevantes para entender las letras:

```css
/* El logo entero */
.header-logo {
  font-family: var(--ff-title);
  font-size: 2rem;
  font-weight: 800;
}

/* Letras especiales del logo: solo el .dot (la "H" y el ".") se pintan en verde */
.header-logo .dot   { color: var(--clr-primary); }
.header-logo .arroba{ color: var(--clr-arroba); }
```

> 💡 Mientras cada `.char` se cree con `display: inline-block;` inline, `GSAP`
> puede ponerle transformaciones individuales sin romper el flujo horizontal.

---

## Cómo leer este proyecto

Orden de lectura sugerido:

1. **`04-split-type-engine.js`** — el motor. Entiende cómo un texto se convierte
   en letras individuales. (Es el nivel más profundo y el más interesante.)
2. **`02-hero-title.jsx`** — el ejemplo más llamativo: la explosión de letras.
3. **`03-section-title.jsx`** — la versión reutilizable del mismo concepto.
4. **`01-header-logo.jsx`** — el más acotado, ideal para no perderte.

Todos los archivos son **independientes entre sí** para que se puedan leer como
referencia sin necesidad de un entorno que ejecute el proyecto.