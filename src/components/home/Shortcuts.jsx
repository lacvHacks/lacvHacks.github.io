/**
 * Shortcuts.jsx — Accesos rápidos: YouTube, Discord y Donaciones.
 *
 * Reconstruido del bundle original:
 *  - Tres tarjetas en grid. YouTube y Discord son enlaces externos;
 *    Donaciones navega a /donaciones.
 *  - Entrada con ScrollTrigger: cada tarjeta sube desde abajo (y:200)
 *    mientras el scroll las revela (scrub: la posición está atada al scroll).
 *  - Hover: la tarjeta escala a 1.15 por encima de las demás.
 */

import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IconYoutube, IconDiscord } from '../icons';

gsap.registerPlugin(ScrollTrigger);

// Corazón (icono de las donaciones) — bootstrap "heart-fill"
const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" width="1.5rem" height="1.5rem">
    <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
  </svg>
);

export default function Shortcuts() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  // Define las tres tarjetas (orden: youtube, discord, donaciones).
  const cards = [
    {
      key: 'youtube',
      title: t('shortcuts.youtube.title'),
      text: t('shortcuts.youtube.text'),
      icon: <IconYoutube />,
      href: 'https://youtube.com/lacvartes',
      external: true,
    },
    {
      key: 'discord',
      title: t('shortcuts.discord.title'),
      text: t('shortcuts.discord.text'),
      icon: <IconDiscord />,
      href: 'https://discord.gg/BHe5Qmr',
      external: true,
    },
    {
      key: 'donations',
      title: t('shortcuts.donations.title'),
      text: t('shortcuts.donations.text'),
      icon: <HeartIcon />,
      to: '/donaciones',
    },
  ];

  /**
   * Animaciones (se re-ejecutan al cambiar el idioma porque el contenido
   * de las tarjetas se traduce).
   */
  useLayoutEffect(() => {
    const cardsNodes = cardRefs.current.filter(Boolean);
    if (!cardsNodes.length) return undefined;

    const ctx = gsap.context(() => {
      // Entrada atada al scroll (scrub true), en escalera por tarjeta.
      cardsNodes.forEach((card, index) => {
        gsap.from(card, {
          y: 200,
          opacity: 0,
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: `top ${index * -15 + 80}%`,
            scrub: true,
          },
        });

        // Hover: la tarjeta crece por encima de sus vecinas.
        card.addEventListener('mouseenter', () => {
          gsap.to(card, { scale: 1.15, zIndex: 1, duration: 0.2, ease: 'back.out(3)' });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { scale: 1, zIndex: 0, duration: 0.2, ease: 'back.out(3)' });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [cards]);

  return (
    <div className="container">
      <section className="shortcuts" ref={sectionRef} aria-label="Accesos rápidos">
        {cards.map((card, index) => {
          // Contenido común de la tarjeta
          const content = (
            <>
              <div className="shortcut-header">
                {card.icon}
                <h2>{card.title}</h2>
              </div>
              <p>{card.text}</p>
              {card.to && (
                <Link to={card.to} className="button button-orange">
                  {card.title}
                </Link>
              )}
            </>
          );

          // Tarjeta: enlace externo (YouTube/Discord) o div con botón
          // (Donaciones) — nunca anidar <a> dentro de <a>.
          const el = card.external ? (
            <a
              key={card.key}
              className="shortcut"
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={card.title}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
            >
              {content}
            </a>
          ) : (
            <div
              key={card.key}
              className="shortcut"
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
            >
              {content}
            </div>
          );

          return el;
        })}
      </section>
    </div>
  );
}