export interface Endpoints {
  posts: string;
  pages: string;
  services_update: string;
  programmes: string;
  patterns: string;
  menus: string;
}

export interface ServiceCard {
  postTitle?: string;
  serviceTitle?: string;
  shortDescriptionService?: string;
  serviceDescription?: string;
  idName?: string;
  linkService?: string; 
}

/**
 * Definición de los tipos para las tarjetas de programa.
 */
export interface ProgrammeCard {
  [key: string]: any; // Placeholder
}

/**
 * Definición para los bloques de contenido (Gutenberg o ACF Flexible Content)
 */
export interface ContentBlock {
  blockName?: string;
  attrs?: Record<string, any>;
  innerHTML?: string;
  [key: string]: any;
}

/**
 * Interfaz principal de los datos de la página
 * procesados y listos para usar en React/Next.js.
 */
export interface PageData {
  // Identificadores
  pageId: number;
  pageSlug: string;
  pageTitle: string;

  // Sección Hero (Header)
  heroTitle: string;
  heroDescription: string;
  heroImage: string; // Viene de 'path_dotlottie'

  // Sección Intro
  introTitle: string;
  introDescription: string;

  // Secciones de Cards (Arrays)
  // Importante: En tu API raw pueden venir como 'false', 
  // pero en esta interfaz aseguramos que siempre sean arrays.
  programmeCards: ProgrammeCard[];
  serviceCards: ServiceCard[]; 

  // Sección Highlight
  highlightTitle: string;
  highlightDescription: string;
  buttonText: string;
  linkHighlightButton: string; // Viene de 'highlight_button'

  // Sección Contador
  counterTitle: string;
  numberProjects: string; // Viene como string "30" desde la API

  // Bloques de contenido
  contentBlocks: ContentBlock[];

  // Contenido legal 
  legalContent?: string;
}

export interface PostData {
  postId: number;
  postSlug: string;
  postTitle: string;

  heroTitle: string;
  heroDescription: string;
  
  postExcerpt: string;  
  postContent: string; 
  postDate: string;    
  
  // Media
  featuredImage: string; // URL
}

export interface paramsGetAllSlug {
  perPage?: number;
  lang: string;
}

export interface MenuItem {
  id: number;
  parent: number;
  title: string;
  url: string;
  target: string;
  classes: string;
  // Aquí está la recursividad para los submenús
  children: MenuItem[]; 
}

export interface PatternData {
  patternSlug: string;
  pageTitle: string;
  patternTitle: string;
  patternDescription: string;
}