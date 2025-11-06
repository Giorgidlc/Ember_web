const domain = import.meta.env.PUBLIC_WP_DOMAIN;
const apiUrl = `${domain}/wp-json/wp/v2`;


interface PropsPages {
  slug: string;
  page: string;
  title: { rendered: string };
  acf: PropsAcf;
  excerpt: { rendered: string };
  _embedded: any;
}

interface PropsAcf {
  hero_title: string;
  description: string;
  btn_url: string;
  intro_title: string;
  intro_description: string;
  section_title: string;
  section_button: {
    title: string;
    url: string;
    target: string;
  };
  service_cards: Array<number>;
  section_counter_titlte: string;
  project_counter: number;
  content_block_1?: string;
  content_block_2?: string;
  content_block_3?: string;
  
}

interface PropsServices {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  slug: string;
  acf: {
    title_service: string;
    description_service: string;
    service_cards: Array<number>;
    button_service: {
      title: string;
      url: string;
      target: string;
    };
    
  };
  _embedded: any;
}

export const getAllSlugPages = async () => {
  try {
    const res = await fetch(`${apiUrl}/pages?per_page=100&_fields=slug`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const results = await res.json();
    if (results.length === 0) throw new Error("No pages found.");

    const slugPages = results.map((page: { slug: string }) => page.slug);

    return slugPages;

  } catch (error) {
    throw error;
  }
} 


export const getInfoPage = async (slug: string) => {
  try {
    const res = await fetch(
      `${apiUrl}/pages?slug=${slug}&_embed&_fields=slug,title.rendered,acf,excerpt.rendered`
    );

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data: any[] = await res.json();
    if (data.length === 0) throw new Error("No page found with the given slug.");

    const [infoPage] = data.map((page: any) => {
      const {
        slug: pageSlug,
        title: { rendered: titlePage },
        acf: {
          title: acfTitle,
          description: acfDescription,
          btn_url: btnUrl,
          intro_title: introTitle,
          intro_description: introDescription,
          section_title: sectionTitle,
          section_description: sectionDescription,
          content_block_1,
          content_block_2,
          content_block_3,
          service_cards: serviceCardsOrder,
          section_button: {
            title: sectionButtonTitle,
            url: sectionButtonUrl,
            target: sectionButtonTarget,
          } = {}, 
        } = {}, 
        excerpt: { rendered: excerpt } = { rendered: "" },
        _embedded,
      } = page;

      const contentBlocks = [content_block_1, content_block_2, content_block_3]
        .filter(Boolean);

      return {
        pageSlug,
        titlePage,
        acfTitle,
        acfDescription,
        btnUrl,
        introTitle,
        introDescription,
        sectionTitle,
        sectionDescription,
        sectionButtonTitle,
        sectionButtonUrl,
        sectionButtonTarget,
        excerpt,
        contentBlocks,
        serviceCardsOrder,
        _embedded,
      };
    });
    return infoPage;
  } catch (error) {
    console.error("Error fetching page data in getInfoPage:", error);
    return null;
  }
};


export const pagesIndexInfo = async (slug: string) => {
  try {
    const res = await fetch(`${apiUrl}/pages?slug=${slug}&_embed&_fields=slug,title.rendered,acf,excerpt.rendered`);

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data: PropsPages[] = await res.json();
    if (data.length === 0) throw new Error("No page found with the given slug.");

    const [infoPageIndex] = data.map((page: PropsPages) => {
      const {
        slug: pageSlug,
        title: { rendered: titlePage },
        acf: {
          hero_title: acfTitle,
          description: acfDescription,
          btn_url: btnUrl,
          intro_title: introTitle,
          section_title: sectionTitle,
          service_cards: serviceCardsOrder,
          section_button: {
            title: sectionButtonTitle,
            url: sectionButtonUrl,
            target: sectionButtonTarget
          },
          section_counter_titlte: sectionCounterTitle,
          project_counter: projectCounter,
        },
        excerpt: { rendered: excerpt },
        _embedded,
      } = page;


      return { pageSlug, titlePage, title: acfTitle, acfDescription, btnUrl, introTitle, excerpt, _embedded, sectionTitle, sectionButtonTitle, sectionButtonUrl, sectionButtonTarget, sectionCounterTitle, projectCounter, serviceCardsOrder };
    })

    return infoPageIndex;

  } catch (error) {
    console.error("Error fetching page data:", error);
    throw error;
  }
}


export const getAllServices = async ({ perPage = 4 }: { perPage?: number } = {}) => {
  try {
    const res = await fetch(`${apiUrl}/servicio?per_page=${perPage}&_embed`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const results = await res.json();
    if (results.length === 0) throw new Error("No services found.");

    const services = results.map((service: PropsServices) => {
      const {
        id: serviceId,
        title: { rendered: titleService },
        excerpt: { rendered: excerpt },
        slug: slug,
        acf: {
          title_service: titleShortService,
          description_service: descriptionService,
          service_cards: serviceCardsOrder,
          button_service: {
            title: buttonText,
            url: urlService,
            target: targetService
          } = { title: "Ver más", url: "", target: "" },
        } = { titleService: "", description_service: "", button_service: {}, serviceCardsOrder: [] },
        //  _embedded
      } = service;

      // Manejo seguro de imagen destacada
      // const srcLink = _embedded?.["wp:featuredmedia"]?.[0]?.source_url || ""; 

      return {
        id: serviceId,
        title: titleService,
        titleShortService,
        descriptionService,
        slug,
        excerpt,
        buttonText,
        urlService,
        targetService,
        service_cards: serviceCardsOrder,
        /*  srcLink,
        _embedded, 
         */
      };
    }
    );
    return services;

  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
}


export const getAllEUServices = async ({ perPage = 4 }: { perPage?: number } = {}) => {
  try {
    const res = await fetch(`${apiUrl}/programa?per_page=${perPage}&_embed`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const results = await res.json();
    if (results.length === 0) throw new Error("No services found.");

    const services = results.map((service: PropsServices) => {
      const {
        id: serviceId,
        title: { rendered: titleService },
        excerpt: { rendered: excerpt },
        slug: slug,
        acf: {
          title_service: titleShortService,
          description_service: descriptionService,
          service_cards: serviceCardsOrder,
          button_service: {
            title: buttonText,
            url: urlService,
            target: targetService
          } = { title: "Ver más", url: "", target: "" },
        } = { titleService: "", description_service: "", button_service: {}, serviceCardsOrder: [] },
        //  _embedded
      } = service;

      // Manejo seguro de imagen destacada
      // const srcLink = _embedded?.["wp:featuredmedia"]?.[0]?.source_url || ""; 

      return {
        id: serviceId,
        title: titleService,
        titleShortService,
        descriptionService,
        slug,
        excerpt,
        buttonText,
        urlService,
        targetService,
        service_cards: serviceCardsOrder,
        /*  srcLink,
        _embedded, 
         */
      };
    }
    );
    return services;

  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
}

export const getAllPosts = async ({ perPage = 3 }: { perPage?: number } = {}) => {
  try {
    const res = await fetch(`${apiUrl}/posts?per_page=${perPage}&_embed`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const results = await res.json();
    if (results.length === 0) throw new Error("No posts found.");

    const posts = results.map((post: any) => {
      const {
        id: postId,
        title: { rendered: titlePost },
        excerpt: { rendered: excerpt },
        _embedded,
        slug: slug } = post;
      
      // Manejo seguro de imagen destacada
      const srcLink = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "";
      
      
      return { postId, titlePost, excerpt, srcLink, slug };
    })

    return posts;
  } catch (error) {
    throw error;
  }
}


export const getAllSlugPosts = async () => {
  try {
    const res = await fetch(`${apiUrl}/posts?per_page=100&_embed`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const results = await res.json();
    if (results.length === 0) throw new Error("No posts found.");

    const slugPosts = results.map((post: any) => post.slug);
    
    return slugPosts;

  } catch (error) {
    throw error;
  }
}

export const getInfoPost = async (slug: string) => {
  try {
    const res = await fetch(`${apiUrl}/posts?slug=${slug}&_embed`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    if (!data) throw new Error("No post found with the given slug.");

    const [infoPost] = data.map((post: any) => {
      const {
        id: postId,
        title: { rendered: titlePost },
        content: { rendered: contentPost },
        excerpt: { rendered: excerpt },
        _embedded,
        slug: slug } = post;
      
      return { postId, titlePost, contentPost, excerpt, _embedded, slug };      
    })
    
    return infoPost;

  } catch (error) {
    throw error;
  }
}

/* 
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
} */

/* export async function getAllSlugEUPrograms({ perPage = 100 }: { perPage?: number } = {}) {
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
} */