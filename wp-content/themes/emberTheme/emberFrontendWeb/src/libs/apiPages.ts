import type { PageProps, RawButton, Section, ButtonProps } from "@/libs/lib-types/apiLibTypes";

import { endpoints } from "./apiConfing";


const normalizeButton = (
  btn: RawButton,
  source: Section
): ButtonProps => ({
  buttonText: btn?.title ?? "",
  href: btn?.url ?? "#",
  target: btn?.target ?? "_self",
  source,
});

const createButton = (section: Section, rawBtn?: RawButton | null) =>
  rawBtn ? normalizeButton(rawBtn, section) : null;

export async function getInfoPages(pageSlug: string): Promise<PageProps> {
  try {
    const response = await fetch(`${endpoints.pages}?slug=${pageSlug}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    if (Array.isArray(data) || data.length === 0) throw new Error("No page found with the given slug.");

    const [infoPage]: PageProps[] = data.map((page: any) => {
      const {
        slug: pageSlug,
        title: { rendered: pageTitle },
        excerpt: { rendered: pageExcerpt },
        acf: {
          hero_title: heroTitle,
          hero_description: heroSubtitle,
          hero_button,
          section_counter_title: counterTitle,
          project_counter: projectCounter,
          section_title: sectionTitle,
          section_description: sectionDescription,
          section_button,
          intro_title: introTitle,
          intro_description: introDescription,
          service_cards: serviceCards = [],
        } = {}
      } = page;

      const heroButton = createButton("hero", hero_button);
      const sectionButton = createButton("section", section_button);

      return {
        pageSlug,
        pageTitle,
        pageExcerpt,
        pageAcf: {
          heroTitle,
          heroSubtitle,
          heroButton,
          counterTitle,
          projectCounter,
          sectionTitle,
          sectionDescription,
          sectionButton,
          introTitle,
          introDescription,
          serviceCards
        }


      };
    })
    console.log("Información de la api Page", infoPage);
    return infoPage;
  } catch (error) {
    console.error("Error fetching page info:", error);
    throw error;
  }
}

export async function getAllSlugPages() {
  try {
    const response = await fetch(`${endpoints.pages}?per_page=100`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error("No pages found.");

    const slugsPages = data.map((page: any) => page.slug);

    return slugsPages;

  } catch (error) {
    console.error("Error fetching all slug pages:", error);
    throw error;
  }
}