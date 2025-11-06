import type { PageData, ServiceCard, RawButton, Section, ButtonData } from "./lib-types/LibTypes";
import { endpoints } from "./apiConfig";

const createButton = (section: Section, rawBtn?: RawButton | null): ButtonData => ({
  buttonText: rawBtn?.title ?? "",
  buttonHref: rawBtn?.url ?? "#",
  buttonTarget: rawBtn?.target ?? "_self",
  source: section,
});

/**
 * Obtiene los datos de una PÁGINA específica por slug e idioma.
 */
export async function getPageBySlug(pageSlug: string, lang: string): Promise<PageData | null> {
  try {
    // 1. Petición ligera, ahora con el idioma
    const response = await fetch(
      `${endpoints.pages}?slug=${pageSlug}&_fields=id,slug,title,content,excerpt,acf,_links`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (Array.isArray(data) && data.length === 0)
      throw new Error(`No page found with slug "${pageSlug}" and lang "${lang}".`);

    const [page] = data;

    // 2. Extraemos los IDs de los service_cards
    const serviceIds: number[] = page.acf?.service_cards || [];

    let relatedEndpoint = endpoints.services; // Valor por defecto
    const acfPostLink = page._links?.["acf:post"]?.[0]?.href;
    if (acfPostLink) {
      relatedEndpoint = acfPostLink.replace(/\/\d+$/, '');
    }

    // 3. Petición para traer los servicios, AHORA TAMBIÉN CON IDIOMA
    let services: any[] = [];
    if (serviceIds.length) {
      const svcRes = await fetch(
        `${relatedEndpoint}?include=${serviceIds.join(",")}&lang=${lang}&_fields=id,slug,title,excerpt,acf`
      );
      if (svcRes.ok) services = await svcRes.json();
    }
 
    // 4. Ordenamos los servicios (esta lógica no cambia)
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
      
    // 5. Armamos el objeto final (esta lógica no cambia)
    return {  
      pageId: page.id,
      pageSlug: page.slug,
      pageTitle: page.title.rendered,
      PageContent: page.content?.rendered || "", // Usamos ?. por seguridad
      PageExcerpt: page.excerpt?.rendered || "",
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

/**
 * Obtiene todos los slugs de PÁGINAS para un idioma específico.
 * (Necesario para getStaticPaths)
 */
export async function getAllSlugPages({ perPage = 100, lang = 'es' }: { perPage?: number, lang: string }) {
  try {
    // Añadido 'lang'
    const response = await fetch(`${endpoints.pages}?per_page=${perPage}&lang=${lang}&_fields=slug`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const slugPages = await response.json();
    if (!Array.isArray(slugPages)) throw new Error("Unexpected response format.");

    return slugPages.map((slugPage: any) => slugPage.slug);

  } catch (error) {
    console.error("Error fetching slugs:", error);
    return [];
  }
}

/**
 * Obtiene los datos de un POST específico por slug e idioma.
 */
export async function getPostBySlug(postSlug: string, lang: string) {
  try {
    // Añadido 'lang'
    const response = await fetch(`${endpoints.posts}?slug=${postSlug}&lang=${lang}&_embed`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (Array.isArray(data) && data.length === 0) throw new Error(`No post found with slug "${postSlug}" and lang "${lang}".`);

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

/**
 * Obtiene todos los slugs de POSTS para un idioma específico.
 * (Necesario para getStaticPaths)
 */
export async function getAllSlugPosts({ perPage = 100, lang = 'es' }: { perPage?: number, lang: string }) {
  try {
    // Añadido 'lang'
    const response = await fetch(`${endpoints.posts}?per_page=${perPage}&lang=${lang}&_fields=slug`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const slugPosts = await response.json();
    if (!Array.isArray(slugPosts)) throw new Error("Unexpected response format.");

    return slugPosts.map((slugPost: any) => slugPost.slug);
  } catch (error) {
    console.error("Error fetching slugs:", error);
    return [];
  }
}

/**
 * Obtiene un menú por su SLUG.
 * IMPORTANTE: Esta función no necesita 'lang' porque tú en WP
 * deberías tener slugs de menú diferentes.
 * Ej: 'main-menu-es', 'main-menu-en'
 *
 * El componente de Astro será el que decida qué slug pasarle a esta función.
 */
export const getNavMenu = async (menuSlug: string ) => {
  // Esta URL parece apuntar a tu endpoint personalizado, lo cual es perfecto.
  const res = await fetch(`${endpoints.menus}/${menuSlug}?_fields=title,url`);
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

  const menu = await res.json();
  if (!menu.length) throw new Error("No menu items found");

  return menu; 
}