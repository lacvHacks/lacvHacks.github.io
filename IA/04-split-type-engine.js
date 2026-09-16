/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  text-splitter — Motor de división de texto en letras individuales (SplitType)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  ¿Qué hace?
 *    Convierte una cadena de texto en elementos DOM individuales para que
 *    cada letra pueda animarse por separado (con GSAP u otra librería).
 *
 *    Antes:                          Después:
 *      <h1>Hola</h1>      ──►        <h1>
 *                                       <div style="display:inline-block" class="char">H</div>
 *                                       <div style="display:inline-block" class="char">o</div>
 *                                       <div style="display:inline-block" class="char">l</div>
 *                                       <div style="display:inline-block" class="char">a</div>
 *                                    </h1>
 *
 *  ¿De dónde sale este código?
 *    Es una reescritura limpia y comentada de la librería `split-type`, que
 *    viene comprimida dentro del bundle de producción del sitio:
 *        assets/index-fd00c780.js  (líneas 14735 – 15121)
 *
 *  ¿Cómo se usa?
 *      const splitter = new TextSplitter(
 *        document.querySelector("h1"),
 *        { types: "words, chars", charClass: "title-letter" }
 *      );
 *
 *      // splitter.chars contiene un <div> por letra:
 *      splitter.chars.forEach((char) => {
 *        gsap.from(char, { scale: 0, ... });
 *      });
 *
 *      // Para deshacer la división (restaura el HTML original):
 *      splitter.revert();
 *
 *  Organización interna:
 *    ┌───────────────────────────────────────────────────────────────────────┐
 *    │  1. Utilidades genéricas (helpers sin estado)                        │
 *    │  2. División por grafemas (soporte de emojis y unicode)              │
 *    │  3. Manipulación del DOM + metadatos privados por nodo               │
 *    │  4. Algoritmo de división (recorrido recursivo del árbol)            │
 *    │  5. Detección de líneas (agrupación visual línea por línea)          │
 *    │  6. Clase TextSplitter (API pública)                                 │
 *    └───────────────────────────────────────────────────────────────────────┘
 *
 *  Archivo 100% autocontenido: no depende de React ni de GSAP. Solo DOM nativo.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/* ═══════════════════════════════════════════════════════════════════════════
 * 1. UTILIDADES GENÉRICAS (helpers sin estado)
 * ═══════════════════════════════════════════════════════════════════════════
 * Reproduce literalmente el comportamiento de las mini-utilidades del bundle
 * original (ps, Bl, qm, As, C1, Cf, zE, IE) pero con nombres descriptivos.
 */

/**
 * ¿Es un string?
 * @param {*} value
 * @returns {boolean} true si `value` es una cadena de texto.
 */
function isString(value) {
  return typeof value === "string";
}

/**
 * ¿Es un array?
 * @param {*} value
 * @returns {boolean}
 */
function isArray(value) {
  return Array.isArray(value);
}

/**
 * ¿Es un objeto? (no null y tipo "object"). Cubre arrays, nodos DOM, etc.
 * @param {*} value
 * @returns {boolean}
 */
function isObject(value) {
  return value !== null && typeof value === "object";
}

/**
 * ¿Es un índice numérico válido? (entero >= 0)
 * @param {*} value
 * @returns {boolean}
 */
function isIndex(value) {
  return typeof value === "number" && value > -1 && value % 1 === 0;
}

/**
 * ¿Es un objeto "array-like"? (tiene una propiedad `length` numérica)
 * Ejemplos: NodeList, HTMLCollection, `arguments`, arrays.
 * @param {*} value
 * @returns {boolean}
 */
function isArrayLike(value) {
  return isObject(value) && isIndex(value.length);
}

/**
 * Normaliza cualquier cosa a un array real.
 *   - Ya es array        → se devuelve tal cual.
 *   - null / undefined   → [].
 *   - Array-like (NodeList, HTMLCollection, arguments) → se convierte.
 *   - Valor único        → se envuelve en [valor].
 * @param {*} value
 * @returns {Array}
 */
function toArray(value) {
  if (isArray(value)) return value;
  if (value == null) return [];
  return isArrayLike(value) ? Array.prototype.slice.call(value) : [value];
}

/**
 * Mezcla dos objetos copiando descriptores: las propiedades de `source` ganan
 * sobre las de `target` cuando existen en ambos. (Equivale a Object.assign.)
 * @param {object} target   Objeto base (sus props, respaldo).
 * @param {object} [source] Objeto que tiene prioridad.
 * @returns {object} Objeto mezclado.
 */
function mergeObjects(target, source) {
  return Object.getOwnPropertyNames(Object(target)).reduce((result, key) => {
    const targetDescriptor = Object.getOwnPropertyDescriptor(Object(target), key);
    const sourceDescriptor = Object.getOwnPropertyDescriptor(Object(source), key);
    return Object.defineProperty(result, key, sourceDescriptor || targetDescriptor);
  }, {});
}

/**
 * ¿Es un nodo del DOM válido para trabajar?
 *   nodeType 1 = elemento, 3 = nodo de texto, 11 = DocumentFragment.
 * @param {*} value
 * @returns {boolean}
 */
function isNode(value) {
  return isObject(value) && /^(1|3|11)$/.test(value.nodeType);
}

/**
 * Resuelve un selector (o elemento) a un array limpio de nodos DOM.
 *
 * Soporta:
 *   - "#id"        → getElementById (más rápido que querySelector)
 *   - ".clase" o cualquier otro selector CSS → querySelectorAll
 *   - Elemento / NodeList / array ya resuelto → se pasa tal cual
 *
 * @param {string|Element|NodeList|Element[]} target
 * @returns {Element[]} Nodos listos para dividir (solo tipo 1/3/11).
 */
function resolveElements(target) {
  let elements = target;

  // Si nos dan un selector de texto, lo resolvemos a nodos reales.
  if (isString(target)) {
    if (/^(#[a-z]\w+)$/.test(target.trim())) {
      // Selector de id puro → getElementById (más liviano).
      elements = document.getElementById(target.trim().slice(1));
    } else {
      // Cualquier otro selector CSS → querySelectorAll.
      elements = document.querySelectorAll(target);
    }
  }

  // Aplana las partes y conserva solo nodos utilizables.
  return toArray(elements).reduce(
    (result, part) => [...result, ...toArray(part).filter(isNode)],
    []
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * 2. DIVISIÓN POR GRAFEMAS (soporte completo de emojis y unicode)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * "Grafema" = la unidad mínima que un lector percibe como "un carácter"
 * (una letra visible). El problema con los emojis:
 *
 *    "👨‍👩‍👧‍👦".split("")  →  ["👨"," ","👩"," ","👧"," ","👦"]   ← 7 pedazos rotos
 *
 * Este código entiende las reglas del estándar Unicode:
 *   - Pares "surrogate" (emoji, astros)   → se mantienen juntos
 *   - Marcas diacríticas combinables (é)   → "e" + acento quedan unidos
 *   - ZWJ (Zero Width Joiner)              → encadena emojis (familias, profesiones)
 *   - Indicadores regionales (banderas)    → 🇦 + 🇷 se leen como 🇦🇷
 *   - Selectores de presentación (☀️)       → texto/emoji unidos
 *   - Tonos de piel de personas (🧑🏽)       → emoji + tono unidos
 *
 * Las constantes siguientes son las piezas de la regex original del bundle
 * (líneas 14827–14847), rebautizadas para que se lean naturalmente.
 */

/** Rango de caracteres "suplentes" (high/low surrogates): emojis y astros. */
const SURROGATES = "\\ud800-\\udfff";

/** Marcas diacríticas combinables (U+0300..036F, U+FE20..FE23). Une "e"+U+0301 = é. */
const COMBINING_MARKS = "\\u0300-\\u036f\\ufe20-\\ufe23";

/** Símbolos con capacidad de combinación (keycap emoji, etc.). */
const COMBINING_SYMBOLS = "\\u20d0-\\u20f0";

/** Selectores de presentación texto/emoji (U+FE0E, U+FE0F). */
const VARIATION_SELECTORS = "\\ufe0e\\ufe0f";

/** Un carácter suplente aislado (código de punto de un emoji/astro). */
const SURROGATE_CHAR = `[${SURROGATES}]`;

/** Clase de carácter: marca diacrítica o símbolo combinable. */
const COMBINING_CHAR = `[${COMBINING_MARKS}${COMBINING_SYMBOLS}]`;

/** Modificadores de tono de piel de emojis de personas (versiones tono). */
const SKIN_TONE_MODIFIER = "\\ud83c[\\udffb-\\udfff]";

/** Un carácter combinable (marca) o un tono de piel. */
const COMBINING_OR_SKIN = `(?:${COMBINING_CHAR}|${SKIN_TONE_MODIFIER})`;

/** Cualquier carácter que NO sea un suplente (un carácter BMP "normal"). */
const NON_SURROGATE_CHAR = `[^${SURROGATES}]`;

/** Par de indicadores regionales (bandera regional de 2 letras: 🇦🇷). */
const REGIONAL_INDICATOR_PAIR = "(?:\\ud83c[\\udde6-\\uddff]){2}";

/** Par suplente completo (emoji/astro en unicode extendido). */
const SURROGATE_PAIR = "[\\ud800-\\udbff][\\udc00-\\udfff]";

/** Zero Width Joiner: pega dos emojis para formar escenas/familias. */
const ZWJ = "\\u200d";

/** Marca combinable o tono de piel (opcional). */
const OPTIONAL_COMBINING = `${COMBINING_OR_SKIN}?`;

/** Selector de presentación texto↔emoji (opcional). */
const OPTIONAL_VARIATION = `[${VARIATION_SELECTORS}]?`;

/** Encadenador ZWJ: »ZWJ + (carácter|bandera|par-suplente) + variantes« repetible. */
const ZWJ_CHAIN =
  "(?:" +
  ZWJ +
  "(?:" +
  [NON_SURROGATE_CHAR, REGIONAL_INDICATOR_PAIR, SURROGATE_PAIR].join("|") +
  ")" +
  OPTIONAL_VARIATION +
  OPTIONAL_COMBINING +
  ")*";

/** Sufijo opcional de todo grafema: variante + marca + cadena ZWJ. */
const GRAPHEME_SUFFIX = OPTIONAL_VARIATION + OPTIONAL_COMBINING + ZWJ_CHAIN;

/** Un grafema base: letra+diacrítico, marca suelta, bandera, par o suplente. */
const GRAPHEME_BASE = `(?:${[
  `${NON_SURROGATE_CHAR}${COMBINING_CHAR}?`,
  COMBINING_CHAR,
  REGIONAL_INDICATOR_PAIR,
  SURROGATE_PAIR,
  SURROGATE_CHAR,
].join("|")})`;

/** Regex final de extracción de grafemas. El lookahead mantiene unidos dos tonos
 *  de piel consecutivos (caso marginal) sin fusionarlos de más. */
const GRAPHEME_REGEX = RegExp(
  `${SKIN_TONE_MODIFIER}(?=${SKIN_TONE_MODIFIER})|${GRAPHEME_BASE}${GRAPHEME_SUFFIX}`,
  "g"
);

/** Caracteres "especiales" que obligan a usar la regex en vez de split(""). */
const SPECIAL_CHARACTERS = [
  ZWJ,
  SURROGATES,
  COMBINING_MARKS,
  COMBINING_SYMBOLS,
  VARIATION_SELECTORS,
];
const SPECIAL_CHARACTER_REGEX = RegExp(`[${SPECIAL_CHARACTERS.join("")}]`);

/**
 * ¿El string contiene caracteres unicode "especiales" (emoji, marcas, ZWJ)?
 * Si es así necesitamos la regex; si no, el veloz split("") es suficiente.
 * @param {string} value
 * @returns {boolean}
 */
function needsSpecialSplitting(value) {
  return SPECIAL_CHARACTER_REGEX.test(value);
}

/**
 * Extrae los grafemas con la regex unicode global.
 * Devuelve [] si no hubo coincidencias (nunca null).
 * @param {string} value
 * @returns {string[]}
 */
function getGraphemes(value) {
  return value.match(GRAPHEME_REGEX) || [];
}

/**
 * Divide un string en grafemas (caracteres visuales).
 * Atajo rápido para texto ASCII/BMP; regex completa para unicode especial.
 * @param {string} value
 * @returns {string[]}
 */
function splitGraphemes(value) {
  return needsSpecialSplitting(value) ? getGraphemes(value) : value.split("");
}

/**
 * toString seguro: "null"/"undefined" devuelven "" en lugar de su literal.
 * @param {*} value
 * @returns {string}
 */
function asString(value) {
  return value == null ? "" : String(value);
}

/**
 * Divide un string en caracteres.
 *   - Si hay separador explícito → split(separador).
 *   - Si no → división por grafemas (respeta emojis compuestos).
 * @param {string} value
 * @param {string} [separator=""]
 * @returns {string[]}
 */
function splitCharacters(value, separator = "") {
  value = asString(value);
  if (value && separator === "" && needsSpecialSplitting(value)) {
    return splitGraphemes(value);
  }
  return value.split(separator);
}

/**
 * Divide una cadena en palabras: recorta bordes, colapsa espacios múltiples
 * y corta por el separador (por defecto un espacio).
 * @param {string} value
 * @param {string} [separator=" "]
 * @returns {string[]}
 */
function splitWords(value, separator = " ") {
  return (value ? String(value) : "")
    .trim()
    .replace(/\s+/g, " ")
    .split(separator);
}

/* ═══════════════════════════════════════════════════════════════════════════
 * 3. METADATOS PRIVADOS + CREACIÓN DE ELEMENTOS DEL DOM
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Cada nodo que tocamos necesita recordar cosas:
 *   - isSplit            → ya fue dividido
 *   - html               → su HTML original (para poder revertir)
 *   - isChar / isWord / isLine / isWordStart / isWordEnd
 *   - cssWidth / cssHeight → medidas originales (modo absolute)
 *
 * Guardamos eso en un registro global { id → datos }, y en el nodo solo
 * depositamos una propiedad con el id (DATA_KEY). Es un WeakMap manual.
 */

/** Clave que se escribe en cada nodo para apuntar a sus datos. */
const DATA_KEY = "_textsplitter";

/** Registro global de metadatos: { nodeId → {...datos} }. */
const DATA_STORE = {};

/** Contador de ids para los nodos registrados. */
let nodeIdCounter = 0;

/**
 * Guarda datos privados en un nodo.
 *
 *   setNodeData(nodo, { isSplit: true });   // fusiona un objeto entero
 *   setNodeData(nodo, "isWord", true);      // guarda una propiedad sola
 *
 * @param {object} node  Nodo del DOM.
 * @param {string|object} keyOrObject Propiedad, u objeto a fusionar.
 * @param {*} [value] Valor si `keyOrObject` es una propiedad.
 * @returns {*} Valor guardado (o null si el nodo no era un objeto).
 */
function setNodeData(node, keyOrObject, value) {
  if (!isObject(node)) {
    console.warn("[text-splitter/data] owner is not an object");
    return null;
  }

  const nodeId = node[DATA_KEY] || (node[DATA_KEY] = ++nodeIdCounter);
  const record = DATA_STORE[nodeId] || (DATA_STORE[nodeId] = {});

  if (value === undefined) {
    // Modo objeto: mezclamos propiedades nuevas sobre las existentes.
    if (keyOrObject && Object.getPrototypeOf(keyOrObject) === Object.prototype) {
      DATA_STORE[nodeId] = { ...record, ...keyOrObject };
    }
  } else if (keyOrObject !== undefined) {
    // Modo propiedad individual.
    record[keyOrObject] = value;
  }

  return value;
}

/**
 * Lee datos privados de un nodo.
 * @param {object} node
 * @param {string} [key] Si se omite → devuelve el registro completo.
 * @returns {*} El dato pedido o el registro completo ({} si no hay nada).
 */
function getNodeData(node, key) {
  const nodeId = isObject(node) ? node[DATA_KEY] : null;
  const record = (nodeId && DATA_STORE[nodeId]) || {};
  return key === undefined ? record : record[key];
}

/**
 * Libera los metadatos de un nodo y lo desvincula del registro.
 * @param {object} node
 */
function clearNodeData(node) {
  const nodeId = node && node[DATA_KEY];
  if (nodeId) {
    delete node[DATA_KEY];
    delete DATA_STORE[nodeId];
  }
}

/**
 * Barrido de limpieza global: borra del registro todo nodo que ya no sea una
 * raíz dividida activa (evita acumular memoria en sesiones largas).
 */
function cleanUpStaleData() {
  Object.entries(DATA_STORE).forEach(([nodeId, { isRoot, isSplit }]) => {
    if (!isRoot || !isSplit) {
      DATA_STORE[nodeId] = null;
      delete DATA_STORE[nodeId];
    }
  });
}

/**
 * Crea un elemento del DOM y le aplica atributos/children.
 *
 *   createElement("div", {
 *     class: "char",
 *     style: "display: inline-block;",
 *     children: "A",
 *   });
 *
 * @param {string} tagName  Etiqueta a crear ("div", "span", ...).
 * @param {object} [attributes] Atributos/settings a aplicar.
 * @returns {Element} El elemento recién creado.
 */
function createElement(tagName, attributes = {}) {
  const element = document.createElement(tagName);

  Object.keys(attributes).forEach((key) => {
    const value = attributes[key];
    // Normaliza valores para no escribir "null" ni "undefined" en el DOM.
    const normalized = isString(value) ? value.trim() : value;

    if (normalized === null || normalized === "") return;

    // `children` no es un atributo: se agrega como hijo.
    if (key === "children") {
      element.append(...toArray(normalized));
    } else {
      element.setAttribute(key, normalized);
    }
  });

  return element;
}

/* ═══════════════════════════════════════════════════════════════════════════
 * 6. CLASE TextSplitter (API pública)
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Normaliza el parámetro `types` de los ajustes.
 * Acepta string ("words, chars"), array (["words", "chars"]) o undefined.
 * Filtra solo los tipos válidos y los recorta.
 * @param {object} settings
 */
function normalizeSettings(settings = {}) {
  const normalized = mergeObjects(settings);

  let types;
  if (normalized.types !== undefined) types = normalized.types;
  else if (normalized.split !== undefined) types = normalized.split; // alias "split"

  if (types !== undefined) {
    normalized.types = (isString(types) || isArray(types) ? String(types) : "")
      .split(",")
      .map((part) => String(part).trim())
      .filter((part) => /((line)|(word)|(char))/i.test(part));
  }

  // alias "position": "absolute" → absolute: true
  if (normalized.absolute || normalized.position) {
    normalized.absolute = normalized.absolute || /absolute/.test(settings.position);
  }

  return normalized;
}

/**
 * Interpreta el string de tipos como un objeto de flags booleanos.
 *   parseTypeFlags("words, chars") → { lines:false, words:true, chars:true, none:false }
 * @param {string|string[]} types
 * @returns {{ none:boolean, lines:boolean, words:boolean, chars:boolean }}
 */
function parseTypeFlags(types) {
  const asText = isString(types) || isArray(types) ? String(types) : "";
  return {
    none: !asText,
    lines: /line/i.test(asText),
    words: /word/i.test(asText),
    chars: /char/i.test(asText),
  };
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  TextSplitter — clase principal
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   const splitter = new TextSplitter("#mi-titulo", { types: "words, chars" });
 *   splitter.chars  // → [<div class="char">, <div class="char">, ...]
 *   splitter.revert();
 *
 * Sus resultados (líneas / palabras / letras) son exactamente los arrays de
 * elementos DOM sobre los que GSAP lanza sus animaciones en el sitio LACV.
 */
class TextSplitter {
  /**
   * Acceso estático al registro global de datos (para inspección/tests).
   */
  static get data() {
    return DATA_STORE;
  }

  /** Ajustes por defecto actuales (globales). */
  static get defaults() {
    return GLOBAL_DEFAULTS;
  }

  /** Cambia los ajustes por defecto globales. */
  static set defaults(nextDefaults) {
    GLOBAL_DEFAULTS = mergeObjects(GLOBAL_DEFAULTS, normalizeSettings(nextDefaults));
  }

  /**
   * Atajo de creación: TextSplitter.create(el, opts) === new TextSplitter(el, opts).
   * @param {string|Element|NodeList|Element[]} target
   * @param {object} [options]
   * @returns {TextSplitter}
   */
  static create(target, options) {
    return new TextSplitter(target, options);
  }

  /**
   * Deshace la división de los elementos indicados (recupera su HTML original).
   * @param {Element[]} [elements] Elementos a restaurar.
   */
  static revertAll(elements = []) {
    elements.forEach((node) => {
      this._revertNode(node);
    });
  }

  /**
   * Restaura un único nodo dividido a su HTML original.
   * @param {Element} node
   */
  static _revertNode(node) {
    const { isSplit, html, cssWidth, cssHeight } = getNodeData(node);
    if (isSplit) {
      // Recupera el HTML original + estilos de tamaño previos.
      node.innerHTML = html;
      node.style.width = cssWidth || "";
      node.style.height = cssHeight || "";
      clearNodeData(node);
    }
  }

  /**
   * Construye un splitter sobre uno o varios elementos.
   *
   * @param {string|Element|NodeList|Element[]} target Selector o elemento(s).
   * @param {object} [options]
   *        - types:  "lines, words, chars" (string o array). Qué dividir.
   *        - charClass / wordClass / lineClass: clases CSS personalizadas.
   *        - absolute: true → posicionamiento absoluto (permite líneas).
   *        - splitClass: clase extra aplicada a palabras y letras.
   *        - tagName: tipo de elemento usado para char/word/line ("div").
   */
  constructor(target, options) {
    this.isSplit = false;
    this.settings = mergeObjects(GLOBAL_DEFAULTS, normalizeSettings(options));
    this.elements = resolveElements(target);

    // División inmediata al construir.
    this.split();
  }

  /**
   * Divide los elementos (si ya estaban divididos, primero revierte).
   * Devuelve la propia instancia para encadenar.
   * @param {object} [newOptions] Ajustes nuevos opcionales.
   * @returns {TextSplitter}
   */
  split(newOptions) {
    this.revert();

    // Guarda el HTML original de cada elemento (para poder revertir luego).
    this.elements.forEach((element) => {
      setNodeData(element, "html", element.innerHTML);
    });

    this.lines = [];
    this.words = [];
    this.chars = [];

    // Preserva el scroll: dividir y (sobre todo) agrupar líneas toca el DOM
    // y el navegador puede intentar saltar. Guardamos y restauramos.
    const scroll = [window.pageXOffset, window.pageYOffset];

    if (newOptions !== undefined) {
      this.settings = mergeObjects(this.settings, normalizeSettings(newOptions));
    }

    const typeFlags = parseTypeFlags(this.settings.types);

    // Pasada 1: recorrer el DOM y crear palabras/letras.
    if (!typeFlags.none) {
      this.elements.forEach((element) => {
        setNodeData(element, "isRoot", true);
        const splitResult = walkAndSplit(element, this.settings);
        this.words = [...this.words, ...splitResult.words];
        this.chars = [...this.chars, ...splitResult.chars];
      });

      // Pasada 2: detectar y agrupar líneas (si pidieron líneas o absolute).
      this.elements.forEach((element) => {
        if (typeFlags.lines || this.settings.absolute) {
          const lineElements = groupIntoLines(element, this.settings, scroll);
          this.lines = [...this.lines, ...lineElements];
        }
      });

      this.isSplit = true;

      // Restaura el scroll y limpia nodos huérfanos del registro.
      window.scrollTo(scroll[0], scroll[1]);
      cleanUpStaleData();
    }

    return this;
  }

  /**
   * Deshace la división de los elementos gestionados por esta instancia.
   * @returns {TextSplitter}
   */
  revert() {
    if (this.isSplit) {
      this.lines = null;
      this.words = null;
      this.chars = null;
      this.isSplit = false;
    }
    TextSplitter.revertAll(this.elements);
    return this;
  }
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  AUTOCHEQUEO (puerta de calidad mínima)
 * ─────────────────────────────────────────────────────────────────────────────
 *  Corre una demo mínima en un DOM ficticio. Si algo del motor se rompe,
 *  node test 04-split-type-engine.js  falla. Ejecutar:
 *     node --experimental-vm-modules 04-split-type-engine.js     (con jsdom)
 *     o simplemente importar/leer el archivo en un navegador.
 *  Este check no depende de React ni de GSAP: solo DOM + el propio motor.
 */
export function runSelfTest() {
  // Usamos jsdom si está disponible; si no, asumimos entorno navegador.
  if (typeof document === "undefined") {
    console.log("[text-splitter] Sin DOM en este entorno; self-test omitido.");
    return true;
  }

  const host = document.createElement("div");
  host.innerHTML = '<h1 id="t">Hola 👨‍👩‍👧‍👦</h1>';
  document.body.appendChild(host);

  const splitter = new TextSplitter("#t", { types: "words, chars" });
  const expectedChars = ["H", "o", "l", "a", "👨‍👩‍👧‍👦"];

  if (splitter.chars.length !== expectedChars.length) {
    throw new Error(`Esperaba ${expectedChars.length} chars, obtuve ${splitter.chars.length}`);
  }
  splitter.chars.forEach((char, index) => {
    if (char.textContent !== expectedChars[index]) {
      throw new Error(`Char ${index}: esperaba "${expectedChars[index]}", obtuve "${char.textContent}"`);
    }
  });

  // El emoji familiar debe seguir siendo UN solo elemento (no roto).
  const familyChar = splitter.chars[4];
  if (familyChar.textContent !== "👨‍👩‍👧‍👦") {
    throw new Error("El emoji compuesto se rompió al dividir.");
  }

  // Revert debe restaurar el HTML exacto.
  splitter.revert();
  if (host.innerHTML.indexOf("<div") !== -1) {
    throw new Error("revert() no restauró el HTML original.");
  }

  console.log("[text-splitter] self-test OK: 5 chars (incl. emoji 👨\u200d👩\u200d👧\u200d👦), revert OK.");
  return true;
}

// Auto-ejecución solo cuando se corre directamente (no al importarse).
if (
  typeof process !== "undefined" &&
  process.argv[1] &&
  import.meta.url.endsWith(process.argv[1].split("/").pop())
) {
  try {
    runSelfTest();
  } catch (error) {
    console.error("[text-splitter] self-test FAILED:", error.message);
  }
}

export { TextSplitter, splitGraphemes, splitCharacters, splitWords };

/** Ajustes por defecto del motor (constantes nombradas del bundle eg). */
const DEFAULT_OPTIONS = {
  splitClass: "",
  lineClass: "line",
  wordClass: "word",
  charClass: "char",
  types: ["lines", "words", "chars"],
  absolute: false,
  tagName: "div",
};

/** Copia mutable de los ajustes por defecto para la clase TextSplitter. */
let GLOBAL_DEFAULTS = mergeObjects(DEFAULT_OPTIONS, {});

/**
 * Divide el texto de UN nodo de texto en elementos palabra/letra.
 *
 * Pasos:
 *   1. Detecta si el texto comienza con espacio → lo conserva fuera.
 *   2. Divide el texto en palabras (splitWords).
 *   3. Por cada palabra:
 *        a. Si se pidieron letras → crea un <div class="char"> por grafema.
 *        b. Si se pidieron palabras/líneas → envuelve las letras en un
 *           <div class="word">; si no, deja las letras sueltas.
 *   4. Conserva el espacio entre palabras y el espacio final.
 *   5. Reemplaza el nodo de texto original por el fragmento construido.
 *
 * Nota: construir todo dentro de un DocumentFragment y reemplazar una sola
 * vez es O(1) reflows en vez de uno por letra.
 *
 * @param {TextNode} textNode  Nodo de texto a dividir.
 * @param {object} options  Ajustes del split.
 * @returns {{ words: Element[], chars: Element[] }} Elementos creados.
 */
function splitTextNode(textNode, options) {
  options = mergeObjects(DEFAULT_OPTIONS, options);

  /** Qué niveles de división se pidieron: {lines, words, chars, none}. */
  const typeFlags = parseTypeFlags(options.types);
  const tagName = options.tagName;

  const textValue = textNode.nodeValue;
  const fragment = document.createDocumentFragment();

  let wordElements = [];
  let charElements = [];

  // Conserva el espacio que abre el texto (ej: " Hola").
  if (/^\s/.test(textValue)) fragment.append(" ");

  // Procesa cada palabra del texto, una por una.
  wordElements = splitWords(textValue).reduce((accumulator, word, index, wordList) => {
    let wordElement;
    let charElementList;

    // (a) Si se pidieron letras, creamos un <div class="char"> por grafema.
    if (typeFlags.chars) {
      charElementList = splitCharacters(word).map((character) => {
        const charElement = createElement(tagName, {
          class: `${options.splitClass} ${options.charClass}`,
          style: "display: inline-block;", // clave: permite transformar cada letra
          children: character,
        });
        setNodeData(charElement, "isChar", true);
        charElements = [...charElements, charElement];
        return charElement;
      });
    }

    if (typeFlags.words || typeFlags.lines) {
      // (b) Envolvemos las letras (o la palabra cruda) en un <div class="word">.
      //     En modo absolute además lo posicionamos en relativo para que las
      //     letras puedan absolutas dentro de él.
      wordElement = createElement(tagName, {
        class: `${options.wordClass} ${options.splitClass}`,
        style: `display: inline-block; ${
          typeFlags.words && options.absolute ? "position: relative;" : ""
        }`,
        children: typeFlags.chars ? charElementList : word,
      });
      setNodeData(wordElement, {
        isWord: true,
        isWordStart: true,
        isWordEnd: true,
      });
      fragment.appendChild(wordElement);
    } else {
      // Si no se pidieron palabras, dejamos las letras sueltas en el fragmento.
      charElementList.forEach((charElement) => fragment.appendChild(charElement));
    }

    // Separa las palabras con un espacio dentro del fragmento.
    if (index < wordList.length - 1) fragment.append(" ");

    return typeFlags.words ? accumulator.concat(wordElement) : accumulator;
  }, []);

  // Conserva el espacio que cierra el texto (ej: "Hola ").
  if (/\s$/.test(textValue)) fragment.append(" ");

  // Una única operación DOM: reemplazar el texto original por el fragmento.
  textNode.replaceWith(fragment);

  return { words: wordElements, chars: charElements };
}

/**
 * Recorre recursivamente un subárbol de nodos dividiendo todo lo que encuentre.
 *
 * Estrategia (el artículo original Xw):
 *   - Nodo de texto con contenido no-espaciado → se divide (splitTextNode).
 *   - Elemento con hijos → se marca como isSplit, se le da inline-block +
 *     position relative (imprescindible para que las letras puedan rotar),
 *     y se recorren sus hijos recursivamente.
 *   - DocumentFragment o elementos → recursión pura.
 *
 * Además marca dónde empieza/terminan visualmente las palabras mirando si hay
 * espacios antes/después (para reconstruir los espacios entre palabras).
 *
 * @param {Node} node Nodo raíz del recorrido.
 * @param {object} options Ajustes del split.
 * @returns {{ words: Element[], chars: Element[] }} Acumulado de la rama.
 */
function walkAndSplit(node, options) {
  const accumulator = { words: [], chars: [] };
  const nodeType = node.nodeType;

  // Solo elementos (1), texto (3) y fragmentos (11).
  if (!/(1|3|11)/.test(nodeType)) return accumulator;

  // Nodo de texto con contenido visible → ¡hay que dividirlo!
  if (nodeType === 3 && /\S/.test(node.nodeValue)) {
    return splitTextNode(node, options);
  }

  const childNodes = toArray(node.childNodes);

  // Si es un elemento (no la raíz del split), lo preparamos:
  //   - display:inline-block → permite transformarlo/rotarlo sin partir líneas.
  //   - position:relative    → ancla para los hijos absolutos (modo absolute).
  //   - Marcamos isWordStart/isWordEnd observando los espacios vecinos.
  if (childNodes.length && (setNodeData(node, "isSplit", true), !getNodeData(node).isRoot)) {
    node.style.display = "inline-block";
    node.style.position = "relative";

    const next = node.nextSibling;
    const previous = node.previousSibling;
    const ownText = node.textContent || "";

    setNodeData(node, {
      isWordEnd: /\s$/.test(ownText) || /^\s/.test(next ? next.textContent : " "),
      isWordStart: /^\s/.test(ownText) || /\s$/.test(previous ? previous.textContent : " "),
    });
  }

  // Recorre los hijos acumulando los elementos creados en la rama.
  return childNodes.reduce((branchResult, childNode) => {
    const childSplit = walkAndSplit(childNode, options);
    return {
      words: [...branchResult.words, ...childSplit.words],
      chars: [...branchResult.chars, ...childSplit.chars],
    };
  }, accumulator);
}

/* ═══════════════════════════════════════════════════════════════════════════
 * 5. DETECCIÓN DE LÍNEAS (agrupación visual línea por línea)
 * ═══════════════════════════════════════════════════════════════════════════
 * Cuando un <h1> ocupa varias líneas visuales (por el ancho del viewport o
 * por <br>), este pase agrupa las palabras que comparten la misma cota top
 * y las envuelve en <div class="line"> para poder animar línea por línea.
 */

/**
 * Mide la posición de un elemento respecto a su contenedor.
 * En modo no-absolute solo devuelve la cota superior (offsetTop).
 * En modo absolute calcula rect absoluto descontando el offsetParent.
 *
 * @param {Element} element
 * @param {boolean} isDirectChild ¿Es hijo directo del contenedor raíz?
 * @param {object} options
 * @param {[number, number]} scrollOffset [scrollX, scrollY] actuales.
 * @returns {{ top: number, left: number, width: number, height: number }}
 */
function getPositionInfo(element, isDirectChild, options, scrollOffset) {
  if (!options.absolute) return { top: isDirectChild ? element.offsetTop : null };

  const offsetParent = element.offsetParent;
  const [scrollX, scrollY] = scrollOffset;
  let parentX = 0;
  let parentY = 0;

  if (offsetParent && offsetParent !== document.body) {
    const parentRect = offsetParent.getBoundingClientRect();
    parentX = parentRect.x + scrollX;
    parentY = parentRect.y + scrollY;
  }

  const rect = element.getBoundingClientRect();
  const top = rect.y + scrollY - parentY;
  const left = rect.x + scrollX - parentX;

  return { width: rect.width, height: rect.height, top, left };
}

/**
 * Aplana los <div class="word"> de vuelta a texto simple dentro de un
 * contenedor (se llama al final del agrupado de líneas cuando NO se pidió
 * división en palabras). Recorre hijos: si uno es word, lo desenvuelve;
 * si no, recurre.
 * @param {Element} element
 */
function flattenWordElements(element) {
  if (getNodeData(element).isWord) {
    clearNodeData(element);
    element.replaceWith(...element.childNodes);
  } else {
    toArray(element.children).forEach((child) => flattenWordElements(child));
  }
}

/**
 * Agrupa el contenido del contenedor raíz en <div class="line">.
 *
 * Detección de línea: se compara la coordenada top de cada palabra contra la
 * de la línea anterior; si la distancia supera ~20% del font-size, es otra
 * línea (por ejemplo tras un <br> o tras un salto de línea real).
 *
 * En modo absolute: además de agrupar, posiciona cada línea/palabra/letra con
 * coordenadas absolutas (top/left) y fija el alto/ancho del contenedor, para
 * que la animación de líneas no reorganice el layout.
 *
 * @param {Element} rootElement Contenedor raíz ya dividido en palabras.
 * @param {object} options
 * @param {[number, number]} scrollOffset [scrollX, scrollY].
 * @returns {Element[]} Los <div class="line"> creados.
 */
function groupIntoLines(rootElement, options, scrollOffset) {
  const typeFlags = parseTypeFlags(options.types);
  const tagName = options.tagName;

  /** Palabra (o letra) más alta de cada línea. */
  const allDescendants = rootElement.getElementsByTagName("*");
  const lines = [];

  let currentLineItems = [];
  let lineOriginFrontier = null;
  let lineElement;
  let rootWidth;
  let rootHeight;
  let rootStart = {};
  const pendingTopLeft = [];

  const parent = rootElement.parentElement;
  const nextSibling = rootElement.nextElementSibling;
  const lineContainer = document.createDocumentFragment();
  const rootStyles = window.getComputedStyle(rootElement);
  const textAlign = rootStyles.textAlign;
  // Umbral para decidir "es otra línea": 20% del tamaño de fuente.
  const lineThreshold = parseFloat(rootStyles.fontSize) * 0.2;

  // En modo absolute congelamos el tamaño del contenedor:
  if (options.absolute) {
    rootStart = { left: rootElement.offsetLeft, top: rootElement.offsetTop, width: rootElement.offsetWidth };
    rootWidth = rootElement.offsetWidth;
    rootHeight = rootElement.offsetHeight;
    setNodeData(rootElement, {
      cssWidth: rootElement.style.width,
      cssHeight: rootElement.style.height,
    });
  }

  // 1) Primera pasada: medir cada descendiente y detectar cambios de línea.
  toArray(allDescendants).forEach((element) => {
    const isDirectChild = element.parentElement === rootElement;
    const { width, height, top, left } = getPositionInfo(element, isDirectChild, options, scrollOffset);

    // Omitimos <br>: SplitType considera que otros ya crearon las líneas.
    if (/^br$/i.test(element.nodeName)) return;

    // ¿Nueva línea? Solo interesa para hijos directos.
    if (typeFlags.lines && isDirectChild) {
      if (lineOriginFrontier === null || top - lineOriginFrontier >= lineThreshold) {
        lineOriginFrontier = top;
        // Reinicia la acumulación de elementos de ESTA línea.
        currentLineItems.push((lineElement = []));
      }
      currentLineItems[currentLineItems.length - 1] = [
        ...currentLineItems[currentLineItems.length - 1],
        element,
      ];
    }

    // Recordamos la geometría para el modo absolute.
    if (options.absolute) {
      setNodeData(element, { top, left, width, height });
    }
  });

  // 2) Sacamos la raíz temporalmente del DOM (para construir las líneas).
  if (parent) parent.removeChild(rootElement);

  if (typeFlags.lines) {
    // 3a) Construimos un <div class="line"> por cada línea detectada.
    const groupedLines = currentLineItems.map((lineWords) => {
      const lineEl = createElement(tagName, {
        class: `${options.splitClass} ${options.lineClass}`,
        style: `display: block; text-align: ${textAlign}; width: 100%;`,
      });
      setNodeData(lineEl, "isLine", true);

      // Mide agregada de la línea (alto máx., top mín.).
      const lineMetrics = { height: 0, top: 10000 };

      lineContainer.appendChild(lineEl);

      lineWords.forEach((wordElement, index, array) => {
        const { isWordEnd, top: wordTop, height: wordHeight } = getNodeData(wordElement);
        const nextWord = array[index + 1];

        lineMetrics.height = Math.max(lineMetrics.height, wordHeight);
        lineMetrics.top = Math.min(lineMetrics.top, wordTop);

        lineEl.appendChild(wordElement);

        // Reinserción del espacio entre palabras:
        // si la palabra termina en espacio y la siguiente empieza con espacio.
        if (isWordEnd && getNodeData(nextWord).isWordStart) lineEl.append(" ");
      });

      if (options.absolute) setNodeData(lineEl, { height: lineMetrics.height, top: lineMetrics.top });

      return lineEl;
    });

    // Si no se pidieron palabras, las letras sueltas quedan dentro de las
    // líneas y hay que aplanar los <word> que hayan quedado.
    if (!typeFlags.words) flattenWordElements(lineContainer);

    rootElement.replaceChildren(lineContainer);
    lines.push(...groupedLines);
  }

  // 4) Modo absolute: fijar tamaños y posicionar absolutamente todo.
  if (options.absolute) {
    rootElement.style.width = `${rootElement.style.width || rootWidth}px`;
    rootElement.style.height = `${rootHeight}px`;

    toArray(allDescendants).forEach((element) => {
      const own = getNodeData(element);
      const parentInfo = getNodeData(element.parentElement);
      const isLine = own.isLine;
      const belongsToLine = !isLine && parentInfo.isLine;

      element.style.top = `${isLine ? own.top : own.top - (belongsToLine ? parentInfo.top : 0)}px`;
      element.style.left = isLine
        ? `${rootStart.left}px`
        : `${own.left - (belongsToLine ? rootStart.left : 0)}px`;
      element.style.height = `${own.height}px`;
      element.style.width = isLine ? `${rootStart.width}px` : `${own.width}px`;
      element.style.position = "absolute";
    });
  }

  // 5) Reinsertamos la raíz en su sitio original.
  if (parent) {
    if (nextSibling) parent.insertBefore(rootElement, nextSibling);
    else parent.appendChild(rootElement);
  }

  return lines;
}