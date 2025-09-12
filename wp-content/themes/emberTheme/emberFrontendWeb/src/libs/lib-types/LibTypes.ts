export interface Endpoints {
  posts: string;
  pages: string;
  services: string;
  programs: string;
}
export type Section = "hero" | "section" | "service";

export interface RawButton {
  title: string;
  url: string;
  target: string;
}

export interface ButtonData {
  buttonText: string | "";
  buttonHref: string | "#";
  buttonTarget: string | "_self";
  source: Section;
}

export interface ServiceCard {
  serviceId?: number;
  serviceName?: string;
  serviceExcerpt?: string;
  serviceButton?: ButtonData | null;
}

export interface PageData {
  pageId: number;
  pageSlug: string;
  pageTitle: string;
  PageExcerpt: string;
  heroTitle: string;
  heroDescription: string;
  heroButton?: ButtonData | null;
  counterTitle?: string;
  numberProjects?: number;
  sectionTitle?: string;
  setionDescription?: string;
  sectionButton?: ButtonData | null;
  introTitle?: string;
  introDescription?: string;
  serviceCards?: Array<ServiceCard> | null;
  contentBlocks?: string[];
  
}
