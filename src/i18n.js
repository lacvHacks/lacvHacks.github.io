/**
 * i18n.js — Configuración de idiomas con i18next + react-i18next.
 *
 * Idiomas soportados (12): español, inglés, chino, italiano, árabe, francés,
 * portugués, ruso, japonés, coreano, alemán y catalán.
 *   - Español (es)  → idioma por defecto
 *   - Inglés (en)   → idioma de respaldo si falta algún texto
 *   - Árabe (ar)    → único idioma con dirección RTL (de derecha a izquierda)
 *
 * Los textos es/en/pt se reutilizan del sitio original (bundle minificado).
 * El resto son traducciones equivalentes. Todos se organizan en UN namespace
 * llamado "global", que es el namespace por defecto, así React usa
 * t('hero.title1') sin escribir t('global:hero.title1').
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

/**
 * Lista de idiomas disponibles.
 *  - code  → código ISO que usa i18next
 *  - label → texto que se muestra en el menú (2 letras, como el original)
 *  - dir   → dirección del texto ("rtl" solo para árabe, el resto "ltr")
 * El orden define el orden dentro del menú desplegable.
 */
export const LANGUAGES = [
  { code: 'es', label: 'ES', dir: 'ltr' },
  { code: 'en', label: 'EN', dir: 'ltr' },
  { code: 'zh', label: 'ZH', dir: 'ltr' },
  { code: 'it', label: 'IT', dir: 'ltr' },
  { code: 'ar', label: 'AR', dir: 'rtl' },
  { code: 'fr', label: 'FR', dir: 'ltr' },
  { code: 'pt', label: 'PT', dir: 'ltr' },
  { code: 'ru', label: 'RU', dir: 'ltr' },
  { code: 'ja', label: 'JA', dir: 'ltr' },
  { code: 'ko', label: 'KO', dir: 'ltr' },
  { code: 'de', label: 'DE', dir: 'ltr' },
  { code: 'ca', label: 'CA', dir: 'ltr' },
];

// --- Textos por idioma ---
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

  zh: {
    global: {
      header: {
        home: '首页',
        courses: '课程',
        reviews: '复习',
        donations: '捐赠',
        soon: '即将推出',
        coderhouse: 'Coderhouse',
      },
      pages: {
        home: '首页',
        courses: '课程',
        reviews: '复习视频',
        donations: '捐赠',
      },
      hero: {
        title1: '➴我是 Luis Caicedo。',
        title2: '我制作关于网络安全的内容。',
        text: '我自学了网络安全，现在想把我多年来学到的知识分享给你。我知道有时前进会很困难、令人沮丧。我的目标是帮助你更深入地理解黑客、破解、密码学和隐写术的世界。让我们一起让知识保持自由和可及！',
      },
      stats: {
        subscribers: '订阅者',
        videos: '视频',
        views: '观看次数',
      },
      shortcuts: {
        youtube: {
          title: 'YouTube',
          text: '关于网页开发的视频，主要涵盖 HTML、CSS、JavaScript 和 React。你会找到技巧、窍门、教程以及多个完全免费的课程。',
        },
        discord: {
          title: 'Discord',
          text: '加入我的 Discord 社区，这是一个与刚刚入门或想分享网页开发信息的伙伴交流的理想空间。',
        },
        donations: {
          title: '捐赠',
          text: '如果你愿意，可以通过每月或一次性捐赠来支持我的内容。这能帮助我继续制作更多更好的视频。❤️',
        },
      },
      soon: '即将推出',
      goBack: '返回',
      notFound: '未找到页面。',
      changedRoutes: '我更改了一些路由，不如在菜单里找找看！',
      lookingForCH: '如果你在找 Coderhouse 课程的复习视频，可以',
      clickHere: '点击这里',
      courseNotFound: '未找到课程。',
      courseWriteToMe: '如果你想让我上传其他课程的视频，请写信到 lacvhacks@duck.com。',
    },
  },

  it: {
    global: {
      header: {
        home: 'Home',
        courses: 'Corsi',
        reviews: 'Ripassi',
        donations: 'Donazioni',
        soon: 'Prossimamente',
        coderhouse: 'Coderhouse',
      },
      pages: {
        home: 'Home',
        courses: 'Corsi',
        reviews: 'Video di ripasso',
        donations: 'Donazioni',
      },
      hero: {
        title1: '➴Sono Luis Caicedo.',
        title2: 'Creo contenuti sulla cybersicurezza.',
        text: "Ho scoperto il mondo della cybersicurezza da autodidatta e sono entusiasta di condividere con te tutto ciò che ho imparato! So che può essere un percorso impegnativo, ma voglio motivarti a superare quegli ostacoli. Il mio obiettivo è guidarti verso una comprensione più profonda dell'emozionante mondo di Hacking, Cracking, Crittografia e Steganografia. Insieme possiamo rendere la conoscenza libera e accessibile!",
      },
      stats: {
        subscribers: 'Iscritti',
        videos: 'Video',
        views: 'Visualizzazioni',
      },
      shortcuts: {
        youtube: {
          title: 'YouTube',
          text: 'Video sullo sviluppo web, principalmente su HTML, CSS, JavaScript e React. Troverai consigli, trucchi, tutorial e diversi corsi completamente gratuiti.',
        },
        discord: {
          title: 'Discord',
          text: 'Unisciti alla mia Community di Discord, uno spazio ideale per chattare con persone che stanno iniziando o che vogliono condividere informazioni sul mondo dello sviluppo web.',
        },
        donations: {
          title: 'Donazioni',
          text: 'Se vuoi, puoi sostenere i miei contenuti con una donazione mensile o una tantum. Questo mi aiuta a continuare a creare video sempre migliori. ❤️',
        },
      },
      soon: 'Prossimamente',
      goBack: 'Indietro',
      notFound: 'Pagina non trovata.',
      changedRoutes: "Ho cambiato alcune rotte, quindi potresti dare un'occhiata al menu!",
      lookingForCH: 'Se stai cercando i video di ripasso dei corsi di Coderhouse, puoi',
      clickHere: 'clicca qui',
      courseNotFound: 'Corso non trovato.',
      courseWriteToMe: 'Scrivimi a lacvhacks@duck.com se vuoi che carichi i video di un altro corso.',
    },
  },

  ar: {
    global: {
      header: {
        home: 'الرئيسية',
        courses: 'الدورات',
        reviews: 'المراجعات',
        donations: 'التبرعات',
        soon: 'قريبًا',
        coderhouse: 'Coderhouse',
      },
      pages: {
        home: 'الرئيسية',
        courses: 'الدورات',
        reviews: 'فيديوهات المراجعة',
        donations: 'التبرعات',
      },
      hero: {
        title1: '➴أنا لويس كايسيدو.',
        title2: 'أصنع محتوى عن الأمن السيبراني.',
        text: 'اكتشفت عالم الأمن السيبراني بنفسي، ويسعدني أن أشارك معك كل ما تعلمته! أعلم أن الطريق قد يكون صعبًا، لكنني أريد أن أحفّزك على تجاوز تلك العقبات. هدفي هو إرشادك إلى فهم أعمق لعالم الاختراق والقرصنة والتشفير وإخفاء المعلومات. معًا يمكننا أن نجعل المعرفة حرة ومتاحة!',
      },
      stats: {
        subscribers: 'المشتركون',
        videos: 'الفيديوهات',
        views: 'المشاهدات',
      },
      shortcuts: {
        youtube: {
          title: 'YouTube',
          text: 'فيديوهات عن تطوير الويب، تتناول بشكل أساسي HTML وCSS وJavaScript وReact. ستجد نصائح وحيلًا ودروسًا وعدة دورات مجانية بالكامل.',
        },
        discord: {
          title: 'Discord',
          text: 'انضم إلى مجتمعي على Discord، مساحة مثالية للدردشة مع الأشخاص الذين يبدؤون أو يرغبون في مشاركة معلومات حول عالم تطوير الويب.',
        },
        donations: {
          title: 'التبرعات',
          text: 'إذا أردت، يمكنك دعم محتواي بتبرع شهري أو لمرة واحدة. يساعدني ذلك على مواصلة إنشاء المزيد من الفيديوهات وبجودة أفضل. ❤️',
        },
      },
      soon: 'قريبًا',
      goBack: 'رجوع',
      notFound: 'الصفحة غير موجودة.',
      changedRoutes: 'لقد غيّرت بعض المسارات، لذا ربما تريد البحث في القائمة!',
      lookingForCH: 'إذا كنت تبحث عن فيديوهات المراجعة لدورات Coderhouse، يمكنك',
      clickHere: 'الضغط هنا',
      courseNotFound: 'الدورة غير موجودة.',
      courseWriteToMe: 'اكتب لي على lacvhacks@duck.com إذا أردت أن أرفع فيديوهات دورة أخرى.',
    },
  },

  fr: {
    global: {
      header: {
        home: 'Accueil',
        courses: 'Cours',
        reviews: 'Révisions',
        donations: 'Dons',
        soon: 'Bientôt',
        coderhouse: 'Coderhouse',
      },
      pages: {
        home: 'Accueil',
        courses: 'Cours',
        reviews: 'Vidéos de révision',
        donations: 'Dons',
      },
      hero: {
        title1: '➴Je suis Luis Caicedo.',
        title2: 'Je crée du contenu sur la cybersécurité.',
        text: "J'ai découvert le monde de la cybersécurité par moi-même et je suis ravi de partager avec toi tout ce que j'ai appris ! Je sais que ce chemin peut être difficile, mais je veux t'encourager à surmonter ces obstacles. Mon objectif est de te guider vers une compréhension plus profonde du monde passionnant du Hacking, du Cracking, de la Cryptographie et de la Stéganographie. Ensemble, nous pouvons rendre le savoir libre et accessible !",
      },
      stats: {
        subscribers: 'Abonnés',
        videos: 'Vidéos',
        views: 'Vues',
      },
      shortcuts: {
        youtube: {
          title: 'YouTube',
          text: 'Des vidéos sur le développement web, principalement HTML, CSS, JavaScript et React. Tu trouveras des astuces, des conseils, des tutoriels et plusieurs cours entièrement gratuits.',
        },
        discord: {
          title: 'Discord',
          text: 'Rejoins ma communauté Discord, un espace idéal pour discuter avec des personnes qui débutent ou qui souhaitent partager des informations sur le monde du développement web.',
        },
        donations: {
          title: 'Dons',
          text: "Si tu le souhaites, tu peux soutenir mon contenu par un don mensuel ou ponctuel. Cela m'aide à continuer à créer des vidéos toujours meilleures. ❤️",
        },
      },
      soon: 'Bientôt',
      goBack: 'Retour',
      notFound: 'Page introuvable.',
      changedRoutes: "J'ai changé certaines routes, tu peux peut-être regarder dans le menu !",
      lookingForCH: 'Si tu cherches les vidéos de révision des cours Coderhouse, tu peux',
      clickHere: 'cliquer ici',
      courseNotFound: 'Cours introuvable.',
      courseWriteToMe: "Écris-moi à lacvhacks@duck.com si tu veux que je publie les vidéos d'un autre cours.",
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

  ru: {
    global: {
      header: {
        home: 'Главная',
        courses: 'Курсы',
        reviews: 'Повторения',
        donations: 'Пожертвования',
        soon: 'Скоро',
        coderhouse: 'Coderhouse',
      },
      pages: {
        home: 'Главная',
        courses: 'Курсы',
        reviews: 'Видео для повторения',
        donations: 'Пожертвования',
      },
      hero: {
        title1: '➴Я Луис Кайседо.',
        title2: 'Я создаю контент о кибербезопасности.',
        text: 'Я открыл для себя мир кибербезопасности самостоятельно и рад поделиться с тобой всем, чему научился! Я знаю, что этот путь может быть непростым, но хочу вдохновить тебя преодолеть эти препятствия. Моя цель — помочь тебе глубже понять увлекательный мир хакерства, взлома, криптографии и стеганографии. Вместе мы можем сделать знания свободными и доступными!',
      },
      stats: {
        subscribers: 'Подписчики',
        videos: 'Видео',
        views: 'Просмотры',
      },
      shortcuts: {
        youtube: {
          title: 'YouTube',
          text: 'Видео о веб-разработке, в основном об HTML, CSS, JavaScript и React. Ты найдёшь советы, трюки, уроки и несколько полностью бесплатных курсов.',
        },
        discord: {
          title: 'Discord',
          text: 'Присоединяйся к моему сообществу в Discord — идеальное место, чтобы общаться с теми, кто только начинает или хочет делиться информацией о мире веб-разработки.',
        },
        donations: {
          title: 'Пожертвования',
          text: 'Если хочешь, ты можешь поддержать мой контент разовым или ежемесячным пожертвованием. Это помогает мне создавать больше и лучше видео. ❤️',
        },
      },
      soon: 'Скоро',
      goBack: 'Назад',
      notFound: 'Страница не найдена.',
      changedRoutes: 'Я изменил некоторые маршруты, так что, возможно, стоит заглянуть в меню!',
      lookingForCH: 'Если ты ищешь видео для повторения курсов Coderhouse, можно',
      clickHere: 'нажать здесь',
      courseNotFound: 'Курс не найден.',
      courseWriteToMe: 'Напиши мне на lacvhacks@duck.com, если хочешь, чтобы я загрузил видео другого курса.',
    },
  },

  ja: {
    global: {
      header: {
        home: 'ホーム',
        courses: 'コース',
        reviews: '復習',
        donations: '寄付',
        soon: '近日公開',
        coderhouse: 'Coderhouse',
      },
      pages: {
        home: 'ホーム',
        courses: 'コース',
        reviews: '復習動画',
        donations: '寄付',
      },
      hero: {
        title1: '➴私は Luis Caicedo です。',
        title2: 'サイバーセキュリティについてのコンテンツを作っています。',
        text: '私は独学でサイバーセキュリティの世界を学びました。学んだことすべてをあなたと共有できることを嬉しく思います！挑戦の多い道のりだと分かっていますが、その壁を乗り越えられるよう後押ししたいです。私の目標は、ハッキング、クラッキング、暗号学、ステガノグラフィーの世界をより深く理解できるよう導くことです。一緒に知識を自由で誰もが使えるものにしましょう！',
      },
      stats: {
        subscribers: 'チャンネル登録者',
        videos: '動画',
        views: '再生回数',
      },
      shortcuts: {
        youtube: {
          title: 'YouTube',
          text: 'Web開発の動画で、主に HTML、CSS、JavaScript、React を扱っています。ヒントやコツ、チュートリアル、そして完全に無料の講座がいくつか見つかります。',
        },
        discord: {
          title: 'Discord',
          text: '私の Discord コミュニティに参加しましょう。Web開発の世界について、始めたばかりの人や情報を共有したい人と話すのに理想的な場所です。',
        },
        donations: {
          title: '寄付',
          text: 'よければ、毎月または一度の寄付でコンテンツを支援できます。これが、より多く、より良い動画を作り続ける助けになります。❤️',
        },
      },
      soon: '近日公開',
      goBack: '戻る',
      notFound: 'ページが見つかりません。',
      changedRoutes: 'いくつかのルートを変更したので、メニューを見てみてください！',
      lookingForCH: 'Coderhouse の講座の復習動画を探しているなら、',
      clickHere: 'こちらをクリック',
      courseNotFound: 'コースが見つかりません。',
      courseWriteToMe: '他のコースの動画をアップロードしてほしい場合は、lacvhacks@duck.com までご連絡ください。',
    },
  },

  ko: {
    global: {
      header: {
        home: '홈',
        courses: '강의',
        reviews: '복습',
        donations: '후원',
        soon: '곧 공개',
        coderhouse: 'Coderhouse',
      },
      pages: {
        home: '홈',
        courses: '강의',
        reviews: '복습 영상',
        donations: '후원',
      },
      hero: {
        title1: '➴저는 Luis Caicedo입니다.',
        title2: '사이버 보안에 관한 콘텐츠를 만들고 있습니다.',
        text: '저는 사이버 보안의 세계를 독학으로 배웠고, 배운 모든 것을 여러분과 나누게 되어 기쁩니다! 도전적인 길이라는 것을 알지만, 그 장벽을 넘어설 수 있도록 응원하고 싶습니다. 제 목표는 해킹, 크래킹, 암호학, 스테가노그래피의 흥미로운 세계를 더 깊이 이해하도록 안내하는 것입니다. 함께 지식을 자유롭고 누구나 접근할 수 있게 만들어요!',
      },
      stats: {
        subscribers: '구독자',
        videos: '동영상',
        views: '조회수',
      },
      shortcuts: {
        youtube: {
          title: 'YouTube',
          text: '웹 개발에 관한 영상으로, 주로 HTML, CSS, JavaScript, React를 다룹니다. 팁과 요령, 튜토리얼, 그리고 완전히 무료인 강의를 여러 개 찾을 수 있습니다.',
        },
        discord: {
          title: 'Discord',
          text: '제 Discord 커뮤니티에 참여하세요. 웹 개발 세계에 대해 시작하는 사람이나 정보를 나누고 싶은 사람과 이야기하기에 이상적인 공간입니다.',
        },
        donations: {
          title: '후원',
          text: '원하신다면 월간 또는 일회성 후원으로 제 콘텐츠를 지원할 수 있습니다. 이는 더 많고 더 좋은 영상을 계속 만드는 데 도움이 됩니다. ❤️',
        },
      },
      soon: '곧 공개',
      goBack: '뒤로',
      notFound: '페이지를 찾을 수 없습니다.',
      changedRoutes: '일부 경로를 변경했으니 메뉴를 확인해 보세요!',
      lookingForCH: 'Coderhouse 강의의 복습 영상을 찾고 있다면,',
      clickHere: '여기를 클릭',
      courseNotFound: '강의를 찾을 수 없습니다.',
      courseWriteToMe: '다른 강의의 영상을 올려주길 원하시면 lacvhacks@duck.com 으로 연락해 주세요.',
    },
  },

  de: {
    global: {
      header: {
        home: 'Start',
        courses: 'Kurse',
        reviews: 'Wiederholungen',
        donations: 'Spenden',
        soon: 'Bald verfügbar',
        coderhouse: 'Coderhouse',
      },
      pages: {
        home: 'Start',
        courses: 'Kurse',
        reviews: 'Wiederholungsvideos',
        donations: 'Spenden',
      },
      hero: {
        title1: '➴Ich bin Luis Caicedo.',
        title2: 'Ich erstelle Inhalte über Cybersicherheit.',
        text: 'Ich habe die Welt der Cybersicherheit im Selbststudium entdeckt und freue mich, alles Gelernte mit dir zu teilen! Ich weiß, dass der Weg herausfordernd sein kann, aber ich möchte dich motivieren, diese Hürden zu überwinden. Mein Ziel ist es, dich zu einem tieferen Verständnis der spannenden Welt von Hacking, Cracking, Kryptografie und Steganografie zu führen. Gemeinsam können wir Wissen frei und zugänglich machen!',
      },
      stats: {
        subscribers: 'Abonnenten',
        videos: 'Videos',
        views: 'Aufrufe',
      },
      shortcuts: {
        youtube: {
          title: 'YouTube',
          text: 'Videos über Webentwicklung, hauptsächlich zu HTML, CSS, JavaScript und React. Du findest Tipps, Tricks, Tutorials und mehrere völlig kostenlose Kurse.',
        },
        discord: {
          title: 'Discord',
          text: 'Tritt meiner Discord-Community bei, einem idealen Ort, um mit Menschen zu chatten, die gerade anfangen oder Informationen über die Welt der Webentwicklung teilen möchten.',
        },
        donations: {
          title: 'Spenden',
          text: 'Wenn du möchtest, kannst du meine Inhalte mit einer monatlichen oder einmaligen Spende unterstützen. Das hilft mir, weiterhin mehr und bessere Videos zu erstellen. ❤️',
        },
      },
      soon: 'Bald verfügbar',
      goBack: 'Zurück',
      notFound: 'Seite nicht gefunden.',
      changedRoutes: 'Ich habe einige Routen geändert, schau doch mal im Menü!',
      lookingForCH: 'Wenn du die Wiederholungsvideos der Coderhouse-Kurse suchst, kannst du',
      clickHere: 'hier klicken',
      courseNotFound: 'Kurs nicht gefunden.',
      courseWriteToMe: 'Schreib mir an lacvhacks@duck.com, wenn ich Videos eines anderen Kurses hochladen soll.',
    },
  },

  ca: {
    global: {
      header: {
        home: 'Inici',
        courses: 'Cursos',
        reviews: 'Repassos',
        donations: 'Donacions',
        soon: 'Properament',
        coderhouse: 'Coderhouse',
      },
      pages: {
        home: 'Inici',
        courses: 'Cursos',
        reviews: 'Vídeos de repàs',
        donations: 'Donacions',
      },
      hero: {
        title1: '➴Sóc Luis Caicedo.',
        title2: 'Faig contingut sobre ciberseguretat.',
        text: "He descobert el món de la ciberseguretat pel meu compte i estic emocionat de compartir amb tu tot el que he après! Sé que pot ser un camí difícil, però vull motivar-te a superar aquests obstacles. El meu objectiu és guiar-te cap a una comprensió més profunda de l'emocionant món de l'Hacking, el Cracking, la Criptografia i l'Esteganografia. Junts podem fer que el coneixement sigui lliure i accessible!",
      },
      stats: {
        subscribers: 'Subscriptors',
        videos: 'Vídeos',
        views: 'Visualitzacions',
      },
      shortcuts: {
        youtube: {
          title: 'YouTube',
          text: "Vídeos sobre desenvolupament web, principalment d'HTML, CSS, JavaScript i React. Hi trobaràs consells, trucs, tutorials i diversos cursos totalment gratuïts.",
        },
        discord: {
          title: 'Discord',
          text: 'Uneix-te a la meva comunitat de Discord, un espai ideal per xerrar amb persones que estan començant o que volen compartir informació sobre el món del desenvolupament web.',
        },
        donations: {
          title: 'Donacions',
          text: "Si vols, pots donar suport al meu contingut fent una donació mensual o única. Això m'ajuda a continuar creant més i millors vídeos. ❤️",
        },
      },
      soon: 'Properament',
      goBack: 'Tornar',
      notFound: 'Pàgina no trobada.',
      changedRoutes: 'He canviat algunes rutes, potser vols mirar al menú!',
      lookingForCH: 'Si busques els vídeos de repàs dels cursos de Coderhouse, pots',
      clickHere: 'clicar aquí',
      courseNotFound: 'Curs no trobat.',
      courseWriteToMe: "Escriu-me a lacvhacks@duck.com si vols que pugi els vídeos d'un altre curs.",
    },
  },
};

/**
 * Aplica un idioma al documento:
 *  - document.documentElement.lang → idioma (accesibilidad/SEO)
 *  - document.documentElement.dir  → dirección del texto (ar = rtl, resto = ltr)
 *  - localStorage "i18nextLng"     → persistencia de la preferencia
 * Devuelve el código efectivamente aplicado (cae a "es" si es desconocido).
 */
export function applyLanguage(code) {
  const language = LANGUAGES.find((item) => item.code === code) || LANGUAGES[0];
  document.documentElement.lang = language.code;
  document.documentElement.dir = language.dir;
  try {
    localStorage.setItem('i18nextLng', language.code);
  } catch {
    // localStorage puede no estar disponible (navegadores con privacidad).
  }
  return language.code;
}

// --- Idioma inicial ---
// Como el detector del bundle original guardaba en el localStorage la clave
// "i18nextLng", respetamos ese mismo comportamiento para no perder la
// preferencia del usuario. Si no hay nada guardado (o el código guardado ya
// no es válido), usamos español.
let lng = 'es';
try {
  lng = localStorage.getItem('i18nextLng') || 'es';
} catch {
  // localStorage puede no estar disponible (navegadores con privacidad).
}
if (!LANGUAGES.some((item) => item.code === lng)) lng = 'es';

i18n.use(initReactI18next).init({
  resources,
  lng,
  fallbackLng: 'en', // Si falta un texto en el idioma actual, se muestra en inglés
  supportedLngs: LANGUAGES.map((item) => item.code),
  ns: ['global'],
  defaultNS: 'global',
  interpolation: { escapeValue: false }, // React ya escapa el HTML, no hace falta doble escape
});

// Sincroniza lang + dir del <html> en la carga inicial.
applyLanguage(i18n.language);

export default i18n;
