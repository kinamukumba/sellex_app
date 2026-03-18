/*
  Minimal i18n implementation for Sellex landing page.
  - Toggles between pt (default) and en.
  - Persists preference in localStorage.
  - Updates textContent, placeholders, titles and typewriter words.
*/

;(function () {
  const STORAGE_KEY = "sellex_lang";
  const DEFAULT_LANG = "pt";
  const AVAILABLE_LANGS = ["pt", "en"];

  const translations = {
    pt: {
      nav: {
        recursos: "Recursos",
        como_funciona: "Como funciona",
        beneficios: "Benefícios",
        contatos: "Contatos",
      },
      buttons: {
        bookDemo: "Agendar Demo",
      },
      hero: {
        title: "Venda no digital sem precisar de",
        typewriter: "website....,uma equipa de venda ou atendimento....,sair de casa....",
        subtitle:
          "Crie sua loja online, organize pedidos e automatize o atendimento com IA — tudo em um só lugar.",
        emailPlaceholder: "Email ou nº de telefona",
      },
      problem: {
        title: "O problema que a Sellex resolve",
        subtitle: "Gerir um pequeno negócio no digital ainda é mais difícil do que deveria",
        cards: {
          1: {
            title: "Pedidos e reservas perdidos nas conversas",
            text: "Quando pedidos e reservas são feitos através de mensagens, é fácil perder informações no meio de várias conversas. Isso pode causar atrasos, erros ou até perda de clientes.",
          },
          2: {
            title: "Atendimento repetitivo e demorado",
            text: "Responder constantemente às mesmas perguntas dos clientes consome tempo e torna o atendimento mais lento, reduzindo a eficiência do negócio.",
          },
          3: {
            title: "Dificuldade em organizar produtos, serviços ou cardápios",
            text: "Sem um catálogo organizado, muitos negócios precisam enviar manualmente fotos, preços ou listas sempre que um cliente pergunta, tornando o atendimento mais lento e desorganizado.",
          },
          4: {
            title: "Falta de um sistema simples para gerir clientes e vendas",
            text: "Muitos pequenos negócios ainda controlam pedidos e clientes de forma manual, o que dificulta acompanhar vendas, histórico de clientes e crescimento do negócio.",
          },
          5: {
            title: "Falta de visão clara sobre o desempenho do negócio",
            text: "Sem dados organizados, torna-se difícil saber quais produtos vendem mais, quantos pedidos foram realizados ou como o negócio está a evoluir.",
          },
          6: {
            title: "Dependência de várias ferramentas desconectadas",
            text: "Usar várias ferramentas separadas para atender clientes, registrar pedidos e controlar vendas torna a gestão mais complexa e menos eficiente.",
          },
        },
      },
      resources: {
        badge: "#1 em Angola",
        title: "RECURSOS",
        subtitle:
          "A Sellex foi criada para ajudar vendedores e empresas a organizar, automatizar e escalar suas vendas online.",
        cards: {
          1: {
            title: "Catálogo digital de produtos",
            text: "Crie e organize todos os seus produtos num catálogo digital moderno e fácil de partilhar. Adicione imagens, descrições, preços e categorias para apresentar seus produtos de forma profissional.",
          },
          2: {
            title: "Gestão inteligente de pedidos",
            text: "Receba e acompanhe todos os pedidos dos seus clientes num painel organizado. Evite perder pedidos nas mensagens e tenha total controle sobre o status das vendas.",
          },
          3: {
            title: "Painel de gestão e relatórios",
            text: "Tenha acesso a relatórios simples e claros sobre as suas vendas, produtos mais vendidos e desempenho do seu negócio.",
          },
          4: {
            title: "Link e QR Code da sua loja",
            text: "Cada vendedor terá um link exclusivo da sua loja para compartilhar facilmente no WhatsApp, Instagram, Facebook ou qualquer outra rede social.",
          },
        },
        ai: {
          title: "Atendimento automático com IA",
          text: "A Sellex utiliza inteligência artificial para responder automaticamente às perguntas mais comuns dos clientes, como preços, disponibilidade e informações dos produtos.",
        },
        context: {
          title: "Poderosa Compreensão Contextual",
          text: "A Sellex utiliza inteligência avançada para compreender o contexto das interações entre o negócio e seus clientes. Isso significa que a plataforma consegue interpretar perguntas, identificar intenções e fornecer respostas relevantes de forma automática. Ao entender o que o cliente procura — seja um produto, um serviço ou informações sobre o negócio — a Sellex ajuda a tornar o atendimento mais rápido, inteligente e eficiente, melhorando a experiência do cliente e reduzindo o esforço do empreendedor.",
        },
      },
      how: {
        title: "COMO FUNCIONA",
        subtitle: "A Sellex foi projetada para ser fácil de usar, mesmo para quem não tem experiência com tecnologia.",
        steps: {
          1: {
            title: "Crie sua conta",
            text: "Registe-se na plataforma em poucos minutos e configure o perfil da sua loja.",
          },
          2: {
            title: "Adicione seus produtos",
            text: "Cadastre os produtos que deseja vender, incluindo fotos, preços e descrições.",
          },
          3: {
            title: "Compartilhe sua loja",
            text: "Receba um link ou QR Code da sua loja e compartilhe com seus clientes nas redes sociais ou no WhatsApp.",
          },
          4: {
            title: "Receba e gerencie pedidos",
            text: "Todos os pedidos feitos pelos clientes serão organizados automaticamente no seu painel de gestão.",
          },
        },
        context: {
          title: "Tudo que você precisa em um dashboard",
          text: "A Sellex reúne em um só lugar todas as ferramentas necessárias para gerir o seu negócio no digital. Através de um dashboard simples e intuitivo, você pode acompanhar pedidos, gerir produtos ou serviços, responder clientes e monitorar o desempenho das suas vendas. Com tudo centralizado numa única plataforma, fica mais fácil tomar decisões, organizar operações e focar no crescimento do seu negócio.",
        },
      },
      benefits: {
        title: "Benefícios",
        typewriter: "Mais profissionalismo., Simples de usar., Economia de tempo.",
        subtitle: "A Sellex foi criada para resolver problemas reais enfrentados por vendedores e pequenas empresas que vendem online.",
        cards: {
          1: {
            title: "Organização total das vendas",
            text: "Apresente seus produtos de forma organizada e profissional, aumentando a confiança dos clientes.",
          },
          2: {
            title: "Mais profissionalismo",
            text: "Pare de perder pedidos nas mensagens e tenha todas as vendas organizadas num único sistema.",
          },
          3: {
            title: "Economia de tempo",
            text: "Automatize respostas e processos repetitivos, permitindo que você foque no crescimento do seu negócio.",
          },
          4: {
            title: "Crescimento do seu negócio",
            text: "Com mais organização e eficiência, fica mais fácil vender mais e expandir sua base de clientes.",
          },
        },
      },
      contact: {
        title: "Pronto para Transformar as suas Vendas",
        features: {
          1: "Implementação Dedicada",
          2: "Segurança de Nível Empresarial",
          3: "Suporte Personalizado",
        },
        steps: {
          1: "Informações Pessoais",
          2: "Detalhes da Empresa",
          3: "Sua Mensagem",
        },
        form: {
          name: "Nome completo",
          phone: "Telefone",
          email: "Email",
          company: "Empresa (opcional)",
          jobTitle: "Cargo (opcional)",
          companySize: "Tamanho da empresa (opcional)",
          message: "Conte-nos sobre a suas necessidades específicas ou dúvidas",
          back: "Voltar",
          next: "Avançar",
          submit: "Entrar em contacto",
        },
      },
      footer: {
        description:
          "A Sellex é uma plataforma tecnológica desenvolvida para auxiliar negócios na organização e gestão das suas vendas e atendimentos no ambiente digital. A plataforma não participa diretamente nas transações comerciais realizadas entre os usuários e seus clientes, sendo estes os únicos responsáveis pelos produtos, serviços, preços, entregas e demais condições das suas operações comerciais.",
        title: "Comece a usar a plataforma hoje",
        links: {
          about: "Sobre nós",
          terms: "Termos de Uso",
          privacy: "Política de Privacidade",
          address: "Endereço",
          linkedin: "Linkedin",
          instagram: "Instagram",
        },
        copyright: "© 2026 Sellex. Todos os direitos reservados.",
      },
    },
    en: {
      nav: {
        recursos: "Features",
        como_funciona: "How it works",
        beneficios: "Benefits",
        contatos: "Contact",
      },
      buttons: {
        bookDemo: "Book Demo",
      },
      hero: {
        title: "Sell online without needing",
        typewriter: "a website....,a sales or support team....,to leave home....",
        subtitle: "Create your online store, organize orders and automate support with AI — all in one place.",
        emailPlaceholder: "Email or phone number",
      },
      problem: {
        title: "The problem Sellex solves",
        subtitle: "Managing a small business online is harder than it should be",
        cards: {
          1: {
            title: "Orders and bookings lost in chats",
            text: "When orders and bookings are made through messages, it's easy to lose information in the middle of multiple conversations. This can cause delays, mistakes, or even lost customers.",
          },
          2: {
            title: "Repetitive, slow customer support",
            text: "Constantly answering the same questions from customers takes time and makes support slower, reducing business efficiency.",
          },
          3: {
            title: "Hard to organize products, services or menus",
            text: "Without an organized catalog, many businesses must manually send photos, prices or lists whenever a customer asks, making support slower and disorganized.",
          },
          4: {
            title: "No simple system to manage customers and sales",
            text: "Many small businesses still track orders and customers manually, making it hard to follow sales, customer history and business growth.",
          },
          5: {
            title: "No clear view of business performance",
            text: "Without organized data, it's difficult to know which products sell more, how many orders were placed, or how the business is progressing.",
          },
          6: {
            title: "Dependence on disconnected tools",
            text: "Using multiple separate tools to support customers, record orders, and track sales makes management more complex and less efficient.",
          },
        },
      },
      resources: {
        badge: "#1 in Angola",
        title: "FEATURES",
        subtitle:
          "Sellex was built to help sellers and businesses organize, automate and scale their online sales.",
        cards: {
          1: {
            title: "Digital product catalog",
            text: "Create and organize all your products in a modern, easy-to-share digital catalog. Add images, descriptions, prices and categories to showcase your products professionally.",
          },
          2: {
            title: "Smart order management",
            text: "Receive and track all customer orders in an organized dashboard. Avoid losing orders in messages and have full control over sales status.",
          },
          3: {
            title: "Dashboard and reporting",
            text: "Get access to simple, clear reports about your sales, top products and business performance.",
          },
          4: {
            title: "Store link and QR code",
            text: "Each seller gets a unique store link to share easily on WhatsApp, Instagram, Facebook or any other social network.",
          },
        },
        ai: {
          title: "Automated AI customer support",
          text: "Sellex uses artificial intelligence to automatically answer customers' most common questions, such as prices, availability, and product information.",
        },
        context: {
          title: "Powerful contextual understanding",
          text: "Sellex uses advanced intelligence to understand the context of interactions between the business and its customers. That means the platform can interpret questions, identify intentions, and provide relevant answers automatically. By understanding what the customer is looking for — whether it's a product, a service or information about the business — Sellex helps make support faster, smarter and more efficient, improving the customer experience and reducing the entrepreneur's effort.",
        },
      },
      how: {
        title: "HOW IT WORKS",
        subtitle: "Sellex is designed to be easy to use, even for those without tech experience.",
        steps: {
          1: {
            title: "Create your account",
            text: "Sign up on the platform in minutes and set up your store profile.",
          },
          2: {
            title: "Add your products",
            text: "Register the products you want to sell, including photos, prices and descriptions.",
          },
          3: {
            title: "Share your store",
            text: "Get a link or QR code for your store and share it with customers on social media or WhatsApp.",
          },
          4: {
            title: "Receive and manage orders",
            text: "All orders placed by customers are automatically organized in your management dashboard.",
          },
        },
        context: {
          title: "Everything you need in one dashboard",
          text: "Sellex brings all the tools you need to manage your business online into one place. With a simple, intuitive dashboard, you can track orders, manage products or services, respond to customers, and monitor sales performance. With everything centralized on a single platform, it's easier to make decisions, organize operations and focus on growing your business.",
        },
      },
      benefits: {
        title: "Benefits",
        typewriter: "More professionalism., Easy to use., Time savings.",
        subtitle: "Sellex was created to solve real problems faced by sellers and small businesses that sell online.",
        cards: {
          1: {
            title: "Full sales organization",
            text: "Showcase your products in an organized, professional way, increasing customer trust.",
          },
          2: {
            title: "More professionalism",
            text: "Stop losing orders in messages and keep all sales organized in a single system.",
          },
          3: {
            title: "Time savings",
            text: "Automate responses and repetitive processes so you can focus on growing your business.",
          },
          4: {
            title: "Business growth",
            text: "With more organization and efficiency, it's easier to sell more and expand your customer base.",
          },
        },
      },
      contact: {
        title: "Ready to transform your sales",
        features: {
          1: "Dedicated implementation",
          2: "Enterprise-level security",
          3: "Personalized support",
        },
        steps: {
          1: "Personal information",
          2: "Company details",
          3: "Your message",
        },
        form: {
          name: "Full name",
          phone: "Phone",
          email: "Email",
          company: "Company (optional)",
          jobTitle: "Job title (optional)",
          companySize: "Company size (optional)",
          message: "Tell us about your specific needs or questions",
          back: "Back",
          next: "Next",
          submit: "Send message",
        },
      },
      footer: {
        description:
          "Sellex is a technology platform built to help businesses organize and manage their sales and customer support online. The platform does not participate directly in commercial transactions between users and their customers, who are solely responsible for products, services, prices, deliveries, and other terms of their business operations.",
        title: "Start using the platform today",
        links: {
          about: "About us",
          terms: "Terms of Use",
          privacy: "Privacy Policy",
          address: "Address",
          linkedin: "LinkedIn",
          instagram: "Instagram",
        },
        copyright: "© 2026 Sellex. All rights reserved.",
      },
    },
  };

  function getLangFromStorage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return AVAILABLE_LANGS.includes(stored) ? stored : null;
  }

  function setHtmlLang(lang) {
    const html = document.documentElement;
    html.lang = lang === "en" ? "en-US" : "pt-AO";
  }

  function getValueByKey(obj, key) {
    return key.split(".").reduce((acc, segment) => (acc && acc[segment] ? acc[segment] : null), obj);
  }

  function updateTranslations(lang) {
    const dict = translations[lang] || translations[DEFAULT_LANG];

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      const value = getValueByKey(dict, key);
      if (value != null) el.textContent = value;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      const value = getValueByKey(dict, key);
      if (value != null) el.placeholder = value;
    });

    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.dataset.i18nTitle;
      const value = getValueByKey(dict, key);
      if (value != null) el.title = value;
    });

    // Update typewriter words when language changes
    document.querySelectorAll("[data-words-key]").forEach((el) => {
      const key = el.dataset.wordsKey;
      const value = getValueByKey(dict, key);
      if (value != null) el.dataset.words = value;
    });

    if (typeof window.initTypewriter === "function") {
      window.initTypewriter();
    }
  }

  function updateToggleButton(lang) {
    const button = document.getElementById("langToggle");
    if (!button) return;

    const labels = {
      pt: "Português",
      en: "English",
    };

    button.title = labels[lang] ? `Idioma: ${labels[lang]}` : "Mudar idioma";
    button.setAttribute("aria-label", button.title);
  }

  function setLang(lang) {
    const normalized = AVAILABLE_LANGS.includes(lang) ? lang : DEFAULT_LANG;
    localStorage.setItem(STORAGE_KEY, normalized);
    setHtmlLang(normalized);
    updateTranslations(normalized);
    updateToggleButton(normalized);
  }

  function toggleLang() {
    const current = getLangFromStorage() || DEFAULT_LANG;
    const next = current === "pt" ? "en" : "pt";
    setLang(next);
  }

  function init() {
    const nav = document.getElementById("langToggle");
    if (nav) {
      nav.addEventListener("click", toggleLang);
    }

    const initial = getLangFromStorage() || DEFAULT_LANG;
    setLang(initial);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
