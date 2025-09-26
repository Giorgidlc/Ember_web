import type { PageData, ServiceCard, RawButton, Section, ButtonData } from "./lib-types/LibTypes";
import { endpoints } from "./apiConfig";

const createButton = (section: Section, rawBtn?: RawButton | null): ButtonData => ({
  buttonText: rawBtn?.title ?? "",
  buttonHref: rawBtn?.url ?? "#",
  buttonTarget: rawBtn?.target ?? "_self",
  source: section,
});

export async function getPageBySlug(pageSlug: string): Promise<PageData | null> {
  try {
    const response = await fetch(`${endpoints.pages}?slug=${pageSlug}&_embed`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (Array.isArray(data) && data.length === 0) throw new Error("No page found with the given slug.");

    const [pageInfo]: PageData[] = data.map((page: any) => {
      const {
        id: pageId,
        slug: pageSlug,
        title: { rendered: pageTitle },
        excerpt: { rendered: PageExcerpt },
        acf: {
          hero_title: heroTitle,
          hero_description: heroDescription,
          hero_button,
          section_counter_title: counterTitle,
          number_project_counter: numberProjects,
          section_title: sectionTitle,
          section_description: setionDescription,
          section_button,
          intro_title: introTitle,
          intro_description: introDescription,
          service_cards: serviceCards = [],
          content_block_1,
          content_block_2,
          content_block_3,
        } = {},

        _embedded,
      } = page;


      const heroButton = createButton("hero", hero_button);
      const sectionButton = createButton("section", section_button);

      // servicios embebidos
      const embeddedServices = _embedded?.["acf:post"] || [];

      const orderedServices: ServiceCard[] = serviceCards
        .map((id: number) => {
          const service = embeddedServices.find((s: any) => s.id === id);
          if (!service) return null;

          const button = createButton("service", service.acf?.service_button);

          return {
            serviceId: service.id,
            serviceSlug: service.slug,
            serviceName: service.acf?.service_title || service.title?.rendered || "",
            serviceDescription: service.acf?.service_description || "",
            serviceExcerpt: service.excerpt?.rendered || "",
            serviceButton: button || null,
          };
        })
        .filter(Boolean) as ServiceCard[];

      const contentBlocks = [content_block_1, content_block_2, content_block_3]
        .filter(Boolean);


      return {
        pageId,
        pageSlug,
        pageTitle,
        PageExcerpt,
        heroTitle,
        heroDescription,
        heroButton,
        counterTitle,
        numberProjects,
        sectionTitle,
        setionDescription,
        sectionButton,
        introTitle,
        introDescription,
        serviceCards: orderedServices.length > 0 ? orderedServices : null,
        contentBlocks,

      };
    });

    return pageInfo;

  } catch (error) {
    console.error("Error fetching page data:", error);
    return null;
  }

}

export async function getAllSlugPages({ perPage = 100 }: { perPage?: number } = {}) {
  try {
    const response = await fetch(`${endpoints.pages}?per_page=${perPage}&_fields=slug`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const slugPages = await response.json();
    if (!Array.isArray(slugPages)) throw new Error("Unexpected response format.");
    //console.log("Fetched slugs:", slugPages);
    return slugPages.map((slugPage: any) => slugPage.slug);

  } catch (error) {
    console.error("Error fetching slugs:", error);
    return [];
  }
}

export async function getPostBySlug(postSlug: string) {
  try {
    const response = await fetch(`${endpoints.posts}?slug=${postSlug}&_embed`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (Array.isArray(data) && data.length === 0) throw new Error("No post found with the given slug.");

    const [postInfo] = data.map((post: any) => {
      const {
        id: postId,
        slug: postSlug,
        title: { rendered: postTitle },
        excerpt: { rendered: postExcerpt },
        content: { rendered: postContent },
        acf: {
          hero_title: heroTitle,
          hero_description: heroDescription,
        } = {},
        date: postDate,
        _embedded,
      } = post;

      const featuredImage = _embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;

      return {
        postId,
        postSlug,
        postTitle,
        heroTitle,
        heroDescription,
        postExcerpt,
        postContent,
        postDate,
        featuredImage,
      }
    });
    // console.log("Fetched post data:",postInfo);
    return postInfo;
  } catch (error) {
    console.error("Error fetching post data:", error);
    return null;
  }
}

export async function getAllSlugPosts({ perPage = 100 }: { perPage?: number } = {}) {
  try {
    const response = await fetch(`${endpoints.posts}?per_page=${perPage}&_fields=slug`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const slugPosts = await response.json();
    if (!Array.isArray(slugPosts)) throw new Error("Unexpected response format.");
    //console.log("Fetched slugs:", slugPosts);
    return slugPosts.map((slugPost: any) => slugPost.slug);
  } catch (error) {
    console.error("Error fetching slugs:", error);
    return [];
  }
}

export async function getServiceBySlug(serviceSlug: string) {
  try {
    const response = await fetch(`${endpoints.services}?slug=${serviceSlug}&_embed`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (Array.isArray(data) && data.length === 0) throw new Error("No service found with the given slug.");

    const [serviceInfo] = data.map((service: any) => {

      const {
        id: serviceId,
        slug: serviceSlug,
        title: { rendered: serviceTitle },
        excerpt: { rendered: serviceExcerpt },
        acf: {
          service_title: serviceName,
          service_description: serviceDescription,
          service_button,
        } = {},

      } = service

      const serviceButton = createButton("service", service_button);

      return {
        serviceId,
        serviceSlug,
        serviceTitle,
        serviceExcerpt,
        serviceName,
        serviceDescription,
        serviceButton,
      }
    })
    return serviceInfo;
  } catch (error) {
    console.error("Error fetching service data:", error);
    return null;
  }
}

export async function getAllSlugSevices({ perPage = 100 }: { perPage?: number } = {}) {
  try {
    const response = await fetch(`${endpoints.services}?per_page=${perPage}&_fields=slug`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const slugServices = await response.json();
    if (!Array.isArray(slugServices)) throw new Error("Unexpected response format.");
    console.log("Fetched slugs:", slugServices);
    return slugServices.map((slugService: any) => slugService.slug);
  } catch (error) {
    console.error("Error fetching slugs:", error);
    return [];
  }
}

export async function getEUProgramsBySlug(programSlug: string) {
  try {
    const response = await fetch(`${endpoints.programs}?slug=${programSlug}&_embed`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (Array.isArray(data) && data.length === 0) throw new Error("No EU program found with the given slug.");
    const [programInfo] = data.map((program: any) => {
      const {
        id: serviceId,
        slug: serviceSlug,
        title: { rendered: serviceTitle },
        excerpt: { rendered: serviceExcerpt },
        acf: {
          service_title: serviceName,
          service_description: serviceDescription,
          service_button,
        } = {},

      } = program

      const serviceButton = createButton("service", service_button);

      return {
        serviceId,
        serviceSlug,
        serviceTitle,
        serviceExcerpt,
        serviceName,
        serviceDescription,
        serviceButton,
      }
    })
    return programInfo;
  } catch (error) {
    console.error("Error fetching service data:", error);
    return null;
  }
}

export async function getAllSlugEUPrograms({ perPage = 100 }: { perPage?: number } = {}) {
  try {
    const response = await fetch(`${endpoints.services}?per_page=${perPage}&_fields=slug`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const slugServices = await response.json();
    if (!Array.isArray(slugServices)) throw new Error("Unexpected response format.");
    console.log("Fetched slugs:", slugServices);
    return slugServices.map((slugService: any) => slugService.slug);
  } catch (error) {
    console.error("Error fetching slugs:", error);
    return [];
  }
}


export const getNavMenu = async () => {

  const user = import.meta.env.PUBLIC_WP_USER as string;
  const pass = import.meta.env.PUBLIC_WP_PASS as string;

  if (!user || !pass) {
    throw new Error('WP_USERNAME y WP_PASSWORD deben estar configurados');
  }
   const token = btoa(`${user}:${pass}`);
  
  const res = await fetch(`${endpoints.menu}?_fields=title,url`, {
    headers: {
       Authorization: `Basic ${token}`,
    },
  });
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

  const menu = await res.json();
  if (!menu.length) throw new Error("No menu items found");

  console.log("Datos crudos del menú:", menu );

  const menuItems = menu.map((item: any) => {
    const { title: { rendered: title }, url } = item;
    return { title, url };
  });
  
  console.log("Estos son los items del menú:", menuItems);
  return menuItems;
}



/* export const getNavMenu = async () => {
  const res = await fetch(`${endpoints.menu}?_fields=title,url`);
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

  const menu = await res.json();
  if (!menu.length) throw new Error("No menu items found");

  console.log("Datos crudos del menú:", menu);

  const menuItems = menu.map((item: any) => {
    const { title: { rendered: title }, url } = item;
    return { title, url };
  });

  console.log("Estos son los items del menú:", menuItems);
  return menuItems;
}; */