#!/usr/bin/env bash
# Publica el build de producción en la rama gh-pages (GitHub Pages).
# Uso: npm run deploy
#
# Por qué rama y no GitHub Actions: el token OAuth de la máquina no tiene el
# scope "workflow", y GitHub rechaza subir .github/workflows/* sin él. Con la
# rama gh-pages el deploy funciona con el scope "repo" normal.
# El force-push es intencional: gh-pages es solo un artefacto de build.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

npm run build

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
cp -R dist/. "$TMP/"
touch "$TMP/.nojekyll"          # evita el procesado de Jekyll
cp "$TMP/index.html" "$TMP/404.html"  # SPA: rutas profundas (/cursos, etc.)

cd "$TMP"
git init -q -b gh-pages
git add -A
git -c user.name="lacvHacks" -c user.email="lacvhacks@duck.com" \
  commit -q -m "Deploy: build de produccion"
git remote add origin "$(git -C "$ROOT" remote get-url origin)"
git push -f origin gh-pages
