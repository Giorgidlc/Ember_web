import type { PageData, PostData, paramsGetAllSlug, MenuItem, PatternData, } from "./types/apiTypes";
import { endpoints } from "./apiConfig";



export async function getPageBySlug(pageSlug: string, lang: string): Promise<PageData | null> {
  try {
    // MEJORA 1: Usar URLSearchParams para que la URL sea legible y fácil de mantener
    const params = new URLSearchParams({
      slug: pageSlug,
      lang: lang,
      _fields: [
        'id', 'slug', 'title', 'header_title', 'header_description',
        'path_dotlottie', 'intro_title', 'intro_description',
        'programme_cards', 'service_cards', 'highlight_title',
        'highlight_description', 'highlight_button', 'button_text',
        'section_counter_title', 'number_project_counter', 'blocks_container', 'legal_content'
      ].join(',')
    });

    const response = await fetch(`${endpoints.pages}?${params.toString()}`);

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error(`No page found with slug "${pageSlug}" and lang "${lang}".`);
    }
    const [
      {
        id: pageId,
        // Renombramos 'slug' a 'fetchedSlug' para no chocar con el argumento de la función
        slug: fetchedSlug,
        // Desestructuración anidada con valor por defecto
        title: { rendered: pageTitle = "" } = {},

        // Mapeo directo: API_NAME: NEW_NAME = DEFAULT_VALUE
        header_title: heroTitle = "",
        header_description: heroDescription = "",
        path_dotlottie: heroImage = "",

        intro_title: introTitle = "",
        intro_description: introDescription = "",

        // Manejamos el caso de que sean 'false' en el JSON y los convertimos en arrays vacíos
        programme_cards: rawProgrammeCards = [],
        service_cards: rawServiceCards = [],
        blocks_container: contentBlocks = [],

        highlight_title: highlightTitle = "",
        highlight_description: highlightDescription = "",
        button_text: buttonText = "",
        highlight_button: linkHighlightButton = "",

        section_counter_title: counterTitle = "",
        number_project_counter: numberProjects = "0",

        legal_content: legalContent = ""
      }
    ] = data;

    const serviceCards = Array.isArray(rawServiceCards)
      ? rawServiceCards.map((card: any) => ({
        postTitle: card.post_title || "",
        serviceTitle: card.service_title || "",
        shortDescriptionService: card.short_description_service || "",
        serviceDescription: card.service_description || "",
        idName: card.post_name || "",
        linkService: card.service_button || ""
      }))
      : [];

    const programmeCards = Array.isArray(rawProgrammeCards)
      ? rawProgrammeCards.map((card: any) => ({
        postTitle: card.post_title || "",
        programmeTitle: card.programme_title || "",
        shortDescriptionProgramme: card.short_description_programme || "",
        programmeDescription: card.programme_description || "",
        idName: card.post_name || "",
        linkProgramme: card.programme_button || ""
      }))
      : [];


    // MEJORA 3: Return limpio usando "Object Property Shorthand"
    // Como ya renombramos arriba, aquí solo listamos las variables.
    return {
      pageId,
      pageSlug: fetchedSlug,
      pageTitle,
      heroTitle,
      heroDescription,
      heroImage,
      introTitle,
      introDescription,
      programmeCards,
      serviceCards,
      highlightTitle,
      highlightDescription,
      buttonText,
      linkHighlightButton,
      counterTitle,
      numberProjects,
      contentBlocks,
      legalContent,
    } as PageData;

  } catch (error) {
    console.error("Error fetching page data:", error);
    return null;
  }
}

export async function getAllSlugPages({ perPage = 100, lang }: paramsGetAllSlug): Promise<string[]> {
  try {
    // 1. Construcción limpia de la URL
    const params = new URLSearchParams({
      lang: lang,
      per_page: perPage.toString(),
      _fields: 'slug'
    });

    const response = await fetch(`${endpoints.pages}?${params.toString()}`);

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    if (!Array.isArray(data)) throw new Error("Unexpected response format.");

    // 2. Desestructuración directa dentro del .map()
    // En lugar de (post) => post.slug, usamos ({ slug }) => slug
    return data.map(({ slug }: { slug: string }) => slug);

  } catch (error) {
    console.error("Error fetching slugs:", error);
    return [];
  }
}

export async function getPostBySlug(postSlug: string, lang: string): Promise<PostData | null> {
  try {
    // 1. Configuración de parámetros limpia
    const params = new URLSearchParams({
      slug: postSlug,
      lang: lang,
      _embed: 'true', // Necesario para obtener la imagen destacada
      // Pedimos solo los campos que usamos para ahorrar ancho de banda
      _fields: 'id,slug,title,excerpt,content,date,_embedded'
    });

    const response = await fetch(`${endpoints.posts}?${params.toString()}`);

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error(`No post found with slug "${postSlug}".`);
    }

    // 2. Desestructuración Directa del primer elemento (Adiós al .map)
    const [
      {
        id: postId,
        slug: fetchedSlug,
        title: { rendered: postTitle = "" } = {},
        excerpt: { rendered: postExcerpt = "" } = {},
        content: { rendered: postContent = "" } = {},
        date: postDate,

        header_title: heroTitle = "",
        header_description: heroDescription = "",

        // Extraemos _embedded para sacar la imagen abajo
        _embedded
      }
    ] = data;

    // 3. Lógica segura para la Imagen Destacada
    // El encadenamiento opcional (?.) evita errores si no hay imagen
    const featuredImage = _embedded?.["wp:featuredmedia"]?.[0]?.source_url || "";

    // 4. Return limpio con los nombres que tu frontend espera
    return {
      postId,
      postSlug: fetchedSlug,
      postTitle,
      heroTitle,
      heroDescription,
      postExcerpt,
      postContent,
      postDate,
      featuredImage,
    };

  } catch (error) {
    console.error("Error fetching post data:", error);
    return null;
  }
}



export async function getAllSlugPosts({ perPage = 100, lang }: paramsGetAllSlug): Promise<string[]> {
  try {
    // 1. Construcción limpia de la URL
    const params = new URLSearchParams({
      lang: lang,
      per_page: perPage.toString(),
      _fields: 'slug' // Clave para la performance: solo traemos el slug
    });

    const response = await fetch(`${endpoints.posts}?${params.toString()}`);

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    if (!Array.isArray(data)) throw new Error("Unexpected response format.");

    // 2. Desestructuración directa dentro del .map()
    // En lugar de (post) => post.slug, usamos ({ slug }) => slug
    return data.map(({ slug }: { slug: string }) => slug);

  } catch (error) {
    console.error("Error fetching slugs:", error);
    return [];
  }
}

export async function getMenuBySlug(menuSlug: string, lang: string): Promise<MenuItem[]> {
  try {
    // ERROR ANTERIOR: 
    // 1. La ruta PHP que creamos es: /menu-public/(?P<slug>...)
    //    Por tanto, el slug debe ir en la barra, no en los parámetros (?).
    // 2. _fields: 'slug' estaba impidiendo que llegaran los datos reales.

    // SOLUCIÓN:
    const response = await fetch(
      `${endpoints.menus}/${menuSlug}?lang=${lang}`
    );

    if (!response.ok) throw new Error("Menu not found");

    const data = await response.json();

    // Tu PHP ya devuelve el array limpio y estructurado, no necesitas mapear nada aquí
    return Array.isArray(data) ? data : [];

  } catch (error) {
    console.error(`Error fetching menu ${menuSlug}:`, error);
    return [];
  }
}


export async function getPatterns(patternSlug: string, lang: string): Promise<PatternData | null> {
  try {
    const params = new URLSearchParams({
      slug: patternSlug,
      lang: lang,
      _fields: 'slug, title, pattern_title, pattern_description'
    });

    const response = await fetch(`${endpoints.patterns}?${params.toString()}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error(`No patterns found with slug "${patternSlug}" and lang "${lang}".`);
    }

    const [
      {
        slug: fetchedSlug,
        title: { rendered: pageTitle = "" } = {},
        pattern_title: patternTitle = "",
        pattern_description: patternDescription = "",
      }
    ] = data;

    return {
      patternSlug: fetchedSlug,
      pageTitle,
      patternTitle,
      patternDescription
    } as PatternData;

  } catch (error) {
    console.error("Error fetching patterns:", error);
    return null;
  }
}