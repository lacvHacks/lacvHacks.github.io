/**
 * i18n.js — Configuración de idiomas con i18next + react-i18next.
 *
 * El sitio original (bundle minificado) tenía 3 idiomas completos:
 *   - Español (es)  → idioma por defecto
 *   - Inglés (en)   → idioma de respaldo si falta algún texto
 *   - Portugués (pt)
 *
 * Todos los textos se reutilizan textualmente de lo que tenía el sitio
 * original, extraídos del bundle. Se organizan en UN namespace llamado
 * "global", que es el namespace por defecto, así React usa t('hero.title1')
 * sin necesidad de escribir t('global:hero.title1').
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// --- Textos portados del bundle original (así estaban publicados) ---
const resources = {
  es: {
    global: {
      // Traducciones del encabezado
      header: {
        home: 'Inicio',
        courses: 'Cursos',
        reviews: 'Repasos',
        donations: 'Donaciones',
        soon: 'Próximamente',
        coderhouse: 'Coderhouse',
      },
      // Nombres de página (se usan en el <title> del navegador)
      pages: {
        home: 'Inicio',
        courses: 'Cursos',
        reviews: 'Videítos de repaso',
        donations: 'Donaciones',
      },
      // Textos del Hero (título animado + descripción)
      hero: {
        title1: '➴Soy Luis Caicedo.',
        title2: 'Hago contenido sobre Ciberseguridad.',
        text: '¡Descubrí el mundo de la ciberseguridad por mi cuenta y estoy emocionado de compartir contigo todo lo que he aprendido! Sé que puede ser un camino desafiante, pero quiero motivarte a superar esos obstáculos. Mi objetivo es guiarte hacia una comprensión más profunda del emocionante mundo del Hacking, Cracking, Criptografía y Esteganografía. ¡Juntos, podemos hacer que el conocimiento sea libre y accesible!.',
      },
      // Etiquetas de las estadísticas de YouTube
      stats: {
        subscribers: 'Suscriptores',
        videos: 'Videos',
        views: 'Visualizaciones',
      },
      // Tarjetas de acceso rápido (debajo del Hero)
      shortcuts: {
        youtube: {
          title: 'YouTube',
          text: 'Videos sobre desarrollo web, principalmente de HTML, CSS, JavaScript y React. Vas a encontrar tips, trucos, tutoriales y varios cursos totalmente gratuitos.',
        },
        discord: {
          title: 'Discord',
          text: 'Unete a mi Comunidad de Discord, un espacio ideal para charlar con personas que están comenzando o tienen ganas de compartir información sobre el mundo del desarrollo web.',
        },
        donations: {
          title: 'Donaciones',
          text: 'Si quieres, puedes apoyar mi contenido haciendo una donación mensual o única. Esto me ayuda a seguir creando más y mejores videos. ❤️',
        },
      },
      // Mensajes generales (footer, 404, botones)
      soon: 'Próximamente',
      goBack: 'Volver',
      notFound: 'Página no encontrada.',
      changedRoutes: 'Cambié algunas rutas, así que capaz querés buscar en el menú!',
      lookingForCH: 'Si estás buscando los repasitos del curso de Coderhouse, podés hacer',
      clickHere: 'clic acá',
      courseNotFound: 'Curso no encontrado.',
      courseWriteToMe: 'Escribime a lacvhacks@duck.com si querés que suba los videítos de otro curso.',
    },
  },

  en: {
    global: {
      header: {
        home: 'Home',
        courses: 'Courses',
        reviews: 'Reviews',
        donations: 'Donations',
        soon: 'Soon',
        coderhouse: 'Coderhouse',
      },
      pages: {
        home: 'Home',
        courses: 'Courses',
        reviews: 'Review videos',
        donations: 'Donations',
      },
      hero: {
        title1: "➴I'm Luis Caicedo.",
        title2: 'I create content about cibersecurity.',
        text: "I learned cybersecurity on my own and now want to share the knowledge I gained over the years. I know it can be frustrating and difficult to move forward at times. My goal is to help you better understand the main methods of Hacking, Cracking, Cryptography, Stenography and keep knowledge free and accessible.",
      },
      stats: {
        subscribers: 'Subscribers',
        videos: 'Videos',
        views: 'Views',
      },
      shortcuts: {
        youtube: {
          title: 'YouTube',
          text: "Videos about web development, primarily covering HTML, CSS, JavaScript, and React. You'll discover tips, tricks, tutorials, and several completely free courses.",
        },
        discord: {
          title: 'Discord',
          text: 'Join my Discord Community, an ideal space to chat with people who are starting out or want to share information about the world of web development.',
        },
        donations: {
          title: 'Donations',
          text: "If you'd like, you can support my content by making a monthly or one-time donation. This helps me continue creating more and better videos. ❤️",
        },
      },
      soon: 'Soon',
      goBack: 'Go back',
      notFound: 'Page not found.',
      changedRoutes: "I've changed some routes, so you might want to look around the menu!",
      lookingForCH: "If you're looking for the reviews of the Coderhouse courses, you can",
      clickHere: 'click here',
      courseNotFound: 'Course not found.',
      courseWriteToMe: 'Write to me at lacvhacks@duck.com if you want me to upload videos of another course.',
    },
  },

  pt: {
    global: {
      header: {
        home: 'Início',
        courses: 'Cursos',
        reviews: 'Avaliações',
        donations: 'Doações',
        soon: 'Em breve',
        coderhouse: 'Coderhouse',
      },
      pages: {
        home: 'Início',
        courses: 'Cursos',
        reviews: 'Vídeos de avaliação',
        donations: 'Doações',
      },
      hero: {
        title1: '➴Sou Luis Caicedo.',
        title2: 'Crio conteúdo sobre cibersecurity.',
        text: 'Aprendi cibersegurança por conta própria e agora quero compartilhar o conhecimento que adquiri ao longo dos anos. Sei que pode ser frustrante e difícil avançar às vezes. Meu objetivo é ajudá-lo a entender melhor os principais métodos de Hacking, Cracking, Criptografia, Estenografia e manter o conhecimento livre e acessível.',
      },
      stats: {
        subscribers: 'Inscritos',
        videos: 'Vídeos',
        views: 'Visualizações',
      },
      shortcuts: {
        youtube: {
          title: 'YouTube',
          text: 'Vídeos sobre desenvolvimento web, principalmente cobrindo HTML, CSS, JavaScript e React. Você descobrirá dicas, truques, tutoriais e vários cursos totalmente gratuitos.',
        },
        discord: {
          title: 'Discord',
          text: 'Junte-se à minha Comunidade no Discord, um espaço ideal para conversar com pessoas que estão começando ou querem compartilhar informações sobre o mundo do desenvolvimento web.',
        },
        donations: {
          title: 'Doações',
          text: 'Se quiser, você pode apoiar meu conteúdo fazendo uma doação mensal ou única. Isso me ajuda a continuar criando vídeos melhores e em maior quantidade. ❤️',
        },
      },
      soon: 'Em breve',
      goBack: 'Voltar',
      notFound: 'Página não encontrada.',
      changedRoutes: 'Mudei algumas rotas, talvez você queira verificar o menu!',
      lookingForCH: 'Se você está procurando as avaliações dos cursos de Coderhouse,',
      clickHere: 'clique aqui',
      courseNotFound: 'Curso não encontrado.',
      courseWriteToMe: 'Escreva para mim em lacvhacks@duck.com se quiser que eu carregue vídeos de outro curso.',
    },
  },
};

// --- Idioma inicial ---
// Como el detector del bundle original guardaba en el localStorage la clave
// "i18nextLng", respetamos ese mismo comportamiento para no perder la
// preferencia del usuario. Si no hay nada guardado, usamos español.
let lng = 'es';
try {
  lng = localStorage.getItem('i18nextLng') || 'es';
} catch {
  // localStorage puede no estar disponible (navegadores con privacidad).
}

i18n.use(initReactI18next).init({
  resources,
  lng,
  fallbackLng: 'en', // Si falta un texto en el idioma actual, se muestra en inglés
  ns: ['global'],
  defaultNS: 'global',
  interpolation: { escapeValue: false }, // React ya escapa el HTML, no hace falta doble escape
});

// Sincroniza el atributo lang del <html> (útil para accesibilidad/SEO).
document.documentElement.lang = i18n.language;

export default i18n;