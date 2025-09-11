export interface Endpoints { 
  posts: string;
  pages: string;
  services: string;
}

export type Section =
  | "hero"
  | "section"

export type RawButton = {
  title?: string;
  url?: string;
  target?: string;
};

export type ButtonProps = {
  buttonText: string;
  href: string;
  target: string;
  source: Section;
};


export interface PageProps { 
  pageSlug: string;
  pageTitle: string;
  pageExcerpt: string;
  pageAcf?: PageAcf;
}

export interface PageAcf {
  heroTitle: string | "";
  heroSubtitle?: string | "";
  heroButton: Array<string>;
  sectionTitle: string;
  sectionDescription?: string | "";
  sectionButton: Array<string>;
  introTitle: string;
  introDescription?: string | "";
  counterTitle?: string | "";
  projectsCounter?: number | null;
  serviceCards: Array<ServiceCardProps>;
}


export interface PropsPost {
  postId: number;
  postSlug: string;
  postTitle: string;
  postExcerpt: string;
  srcLink: string;
  
}

export interface ServiceCardProps {
  serviceId: number;
  serviceSlug: string;
  serviceTitle: string;
  serviceExcerpt: string;
  serviceName: string;
  serviceDescription: string;
  serviceButton: Array<string>;
}