// Comprobación temporal: verifica que los 12 idiomas tengan TODAS las claves.
// Uso: node scripts/check-i18n.mjs
// i18n.js usa document/localStorage al cargar; los simulamos mínimamente.
globalThis.document = { documentElement: { lang: '', dir: '' } };
globalThis.localStorage = { getItem: () => null, setItem: () => {} };

const { default: i18n, LANGUAGES } = await import('../src/i18n.js');

// Extrae todas las claves hoja (a.b.c) del bundle de un idioma.
const flatten = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' ? flatten(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );

const esKeys = flatten(i18n.getResourceBundle('es', 'global'));
let fails = 0;

for (const { code } of LANGUAGES) {
  const keys = flatten(i18n.getResourceBundle(code, 'global'));
  const missing = esKeys.filter((k) => !keys.includes(k));
  const extra = keys.filter((k) => !esKeys.includes(k));
  if (missing.length || extra.length) {
    fails += 1;
    console.log(`✗ ${code}: faltan [${missing}] extra [${extra}]`);
  } else {
    console.log(`✓ ${code}: ${keys.length} claves`);
  }
}

console.log(fails ? `\n${fails} idioma(s) con problemas` : '\nTodos los idiomas OK');
