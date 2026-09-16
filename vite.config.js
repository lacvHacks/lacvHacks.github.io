import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración de Vite:
// - plugin-react: transpilación de JSX/JSX-runtime (necesario para React 18).
// - base "./": rutas relativas en el build, así el sitio funciona en GitHub
//   Pages sin importar si se sirve desde la raíz del dominio o un subdirectorio.
export default defineConfig({
  plugins: [react()],
  base: './',
});