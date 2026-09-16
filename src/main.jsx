/**
 * main.jsx — Punto de entrada de la aplicación.
 *
 * 1. Importa la configuración de idiomas (i18n.js) para que esté lista
 *    antes del primer render.
 * 2. Registra los plugins de GSAP que usan el ScrollTrigger de las tarjetas.
 * 3. Monta <App /> dentro de BrowserRouter (enrutado del lado del cliente,
 *    igual que el sitio original con react-router-dom).
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import App from './App';
import './i18n';
import './styles/global.css';

// Registro global de plugins de GSAP.
gsap.registerPlugin(ScrollTrigger);

// Sin React.StrictMode: el sitio original no lo usaba y en desarrollo el
// doble montaje duplicaría las animaciones de entrada de GSAP.
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);