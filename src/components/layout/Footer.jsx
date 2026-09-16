/**
 * Footer.jsx — Pie de página con las redes sociales / contacto.
 *
 * Mismos enlaces que el sitio original:
 *   YouTube, Instagram, Twitter, Discord, GitHub y Mail (lacvhacks@duck.com).
 */

import { IconYoutube, IconInstagram, IconTwitter, IconDiscord, IconGithub, IconMail } from '../icons';

const SOCIALS = [
  { label: 'YouTube', href: 'https://youtube.com/lacvartes', icon: IconYoutube },
  { label: 'Instagram', href: 'https://instagram.com/lacvhacks', icon: IconInstagram },
  { label: 'Twitter', href: 'https://twitter.com/lacvhacks', icon: IconTwitter },
  { label: 'Discord', href: 'https://discord.gg/BHe5Qmr', icon: IconDiscord },
  { label: 'GitHub', href: 'https://github.com/lacvhacks', icon: IconGithub },
  { label: 'Email', href: 'mailto:lacvhacks@duck.com', icon: IconMail },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <ul className="social">
          {SOCIALS.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
              >
                <Icon title={label} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}