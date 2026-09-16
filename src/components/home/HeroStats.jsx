/**
 * HeroStats.jsx — Estadísticas del canal de YouTube.
 *
 * Reconstruido del bundle original:
 *  - Al cargar, se muestran valores "placeholders" (3K / 102 / 380K).
 *  - Se consulta la API pública de YouTube (sin autenticación) con la clave
 *    del proyecto para obtener: suscriptores, videos y visualizaciones.
 *  - Si la llamada falla o no devuelve estadísticas, se muestran los valores
 *    de respaldo con "+" (mismo fallback que el original).
 *  - Las tres cifras entran girando hacia arriba (rotateX 360) en escalera.
 *
 * Nota de seguridad: la API key es una clave pública de navegador limitada a
 * la API de datos de YouTube (como en el sitio original, que la exponía igual).
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';

// Credenciales del canal (iguales a las del bundle original)
const CHANNEL_ID = 'UC53KeIgcYPozO6SqlN6edbw';
const API_KEY = 'AIzaSyBY8flILT2zht5OXNNhfhdgzlCIg8w2ywU';

/**
 * Formatea números grandes a notación compacta:
 * 1234 -> "1.2K", 2_500_000 -> "2.5M".
 */
function compactFormatter(value) {
  const units = ['', 'K', 'M', 'G', 'T', 'P', 'E'];
  let index = 0;
  let number = value;
  while (number >= 1000 && index < units.length - 1) {
    number /= 1000;
    index += 1;
  }
  const decimals = number >= 10 || index === 0 ? 0 : 1;
  return `${number.toFixed(decimals)}${units[index]}`;
}

export default function HeroStats() {
  const { t } = useTranslation();
  const statsRef = useRef(null);

  // null = todavía cargando; {subCount, videoCount, viewCount} cuando llegó.
  const [stats, setStats] = useState(null);

  // Consulta única a la API de YouTube al montar.
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        const statistics = data.items?.[0]?.statistics;
        if (!statistics) throw new Error('sin estadísticas');

        if (!cancelled) {
          setStats({
            subCount: `+${compactFormatter(Number(statistics.subscriberCount))}`,
            videoCount: `+${compactFormatter(Number(statistics.videoCount))}`,
            viewCount: compactFormatter(Number(statistics.viewCount)),
          });
        }
      } catch {
        // Fallback: mismos valores que el sitio original usaba offline.
        if (!cancelled) {
          setStats({ subCount: '+3K', videoCount: '+102', viewCount: '+380K' });
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Animación de entrada: cada estadística sube con giro 3D (escalera).
  useLayoutEffect(() => {
    const container = statsRef.current;
    if (!container) return undefined;

    const ctx = gsap.context(() => {
      gsap.from(container.querySelectorAll('.hero-stat'), {
        y: 200,
        rotateX: 360,
        opacity: 0,
        stagger: 0.5,
        delay: 1,
        ease: 'back.out(2)',
      });
    }, container);

    return () => ctx.revert();
  }, []);

  // Mientras carga, se muestran los placeholders sin "+"
  const subCount = stats?.subCount ?? '3K';
  const videoCount = stats?.videoCount ?? '102';
  const viewCount = stats?.viewCount ?? '380K';

  const items = [
    { number: subCount, textKey: 'stats.subscribers' },
    { number: videoCount, textKey: 'stats.videos' },
    { number: viewCount, textKey: 'stats.views' },
  ];

  return (
    <div className="hero-stats" ref={statsRef}>
      {items.map(({ number, textKey }) => (
        <div className="hero-stat" key={textKey}>
          <span className="hero-stat-number">{number}</span>
          <span className="hero-stat-text">{t(textKey)}</span>
        </div>
      ))}
    </div>
  );
}