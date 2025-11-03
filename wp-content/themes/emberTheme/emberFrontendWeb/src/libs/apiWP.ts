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
    // 1. Petición ligera: solo campos que usamos
    const response = await fetch(
      `${endpoints.pages}?slug=${pageSlug}&_fields=id,slug,title,excerpt,acf,_links`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (Array.isArray(data) && data.length === 0)
      throw new Error("No page found with the given slug.");

    const [page] = data;

    // 2. Extraemos los IDs de los service_cards
    const serviceIds: number[] = page.acf?.service_cards || [];

    let relatedEndpoint = endpoints.services; // Valor por defecto

    const acfPostLink = page._links?.["acf:post"]?.[0]?.href;

    if (acfPostLink) {
      relatedEndpoint = acfPostLink.replace(/\/\d+$/, '');
    }

    // 3. Una sola petición para traer todos los servicios necesarios
    let services: any[] = [];
    if (serviceIds.length) {
      const svcRes = await fetch(
        // USAMOS LA VARIABLE DETERMINADA
        `${relatedEndpoint}?include=${serviceIds.join(",")}&_fields=id,slug,title,excerpt,acf`
      );
      if (svcRes.ok) services = await svcRes.json();
    }
 
    // 4. Ordenamos los servicios según el orden de ACF
    const orderedServices: ServiceCard[] = serviceIds
      .map((id) => services.find((s) => s.id === id))
      .filter(Boolean)
      .map((s) => ({
        serviceId: s.id,
        serviceSlug: s.slug,
        serviceTitle: s.title?.rendered || "",
        serviceName: s.acf?.service_title || "",
        serviceDescription: s.acf?.service_description || "",
        serviceExcerpt: s.excerpt?.rendered || "",
        serviceButton: createButton("service", s.acf?.service_button),
      }));
   

    // 5. Armamos el objeto final
  
    return {  
      pageId: page.id,
      pageSlug: page.slug,
      pageTitle: page.title.rendered,
      PageExcerpt: page.excerpt.rendered,
      heroTitle: page.acf?.hero_title || "",
      heroDescription: page.acf?.hero_description || "",
      heroButton: createButton("hero", page.acf?.hero_button),
      heroImage: page.acf?.test_dothero || "",
      counterTitle: page.acf?.section_counter_title || "",
      numberProjects: page.acf?.number_project_counter || 0,
      sectionTitle: page.acf?.section_title || "",
      setionDescription: page.acf?.section_description || "",
      sectionButton: createButton("section", page.acf?.section_button),
      introTitle: page.acf?.intro_title || "",
      introDescription: page.acf?.intro_description || "",
      serviceCards: orderedServices.length ? orderedServices : null,
      contentBlocks: [
        page.acf?.content_block_1,
        page.acf?.content_block_2,
        page.acf?.content_block_3,
      ].filter(Boolean),
    };

   
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

  const menuItems = menu.map((item: any) => {
    const { title, url } = item;
    return { title, url };
  });

  return menuItems;
}
