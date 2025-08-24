// src/data/homePage.ts

export interface HomePageContent {
  hero: {
    title: string;
    description?: string;
    buttonText?: string;
  };

  intro: {
    title?: string;
    description?: string;
  };

  counter: {
    title: string;
    description?: string;
  };

  services: ServiceCard[];
  features: FeatureItem[];
  posts: PostCard[];
  footer: Footer;
  cta: {
    title: string;
    description: string;
    buttonText: string;
  };
}

export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  
}

export interface FeatureItem {
  id: string;
  title: string;
  description?: string;
  buttonText: string;
}

export interface PostCard {
  srcLink: string;
  title: string;
  description: string;
  buttonText: string;
  
}

export interface Footer {
  title: string;
  description: string;
  contactFooter?: string[];
  buttonText: string;
  
}

// Contenido temporal en español
export const homePageContent: HomePageContent = {
  hero: {
    title: "Mejoramos el impacto de tu organización",
    description: "",
    buttonText: ""
  },

  intro: {
    title: "No traemos fuego de fuera. Lo cultivamos desde dentro.",
    description: ""
  },
  services: [
    {
      id: "formacion",
      title: "Formación",
      description: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores.",
      buttonText: "Ver más",
    },
    {
      id: "gestion",
      title: "Gestión",
      description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam.",
      buttonText: "Ver más",
    },
    {
      id: "comunicacion",
      title: "Comunicación",
      description: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni.",
      buttonText: "Ver más",
    },
    {
      id: "programasEuropeos",
      title: "Programas Europeos",
      description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam.",
      buttonText: "Ver más",
      
    },
  ],
  features: [
    {
      id: "Erasmus",
      title: "Somos especialistas en Erasmus+ y Cuerpo Europeo de Solidaridad",
      buttonText: "Oportunidades",
    },
  ],

  counter: {
    title: "Proyectos Erasmus+ implementados con éxito",
    description: "",
  },

   posts: [
    {
      srcLink: "https://brisaintercultural.org/wp-content/uploads/2025/04/report-mobilidadad.png",
      title: "Nuotta Coaching | TC en Finlandia",
      description: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores.",
      buttonText: "Leer más",
    },
    {
      srcLink: "https://brisaintercultural.org/wp-content/uploads/2024/12/report-mobilidadad-1.png",
      title: "Emancipatory Simulations for Inclusive Societies | TC en Lituania",
      description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam.",
      buttonText: "Leer más",
    },
    {
      srcLink: "https://brisaintercultural.org/wp-content/uploads/2024/07/report-mobilidadad.png",
      title: "Tech-ing Up Non-Formal Youth Work | TC en Grecia",
      description: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni.",
      buttonText: "Leer más",
    },
  
  ],
   
  footer: {
    title: "Contacta con nosotros",
    description: "Explora nuestro blog para descubrir las últimas noticias, consejos y recursos sobre formación, gestión y comunicación en el ámbito de las organizaciones.",
    contactFooter: [
      "+34 601 253 603", "hablamos@ember.com"
    ],
    buttonText: "Visitar blog"
  },
  cta: {
    title: "¿Listo para transformar tu organización?",
    description: "Contacta con nosotros y descubre cómo podemos ayudarte a alcanzar tus objetivos.",
    buttonText: "Empezar conversación"
  }
};

// Función auxiliar para obtener contenido por sección
export const getSectionContent = (section: keyof HomePageContent) => {
  return homePageContent[section];
};

// Función para obtener un servicio específico
export const getServiceById = (id: string) => {
  return homePageContent.services.find(service => service.id === id);
};