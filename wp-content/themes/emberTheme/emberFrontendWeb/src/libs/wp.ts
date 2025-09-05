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
  title: string;
  description: string;
  btn_url: string;
  intro_title: string;
  intro_description: string;

}

interface PropsServices {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  slug: string;
  acf: {
    description_service: string;
    button_service: {
      title: string;
      url: string;
      target: string;
    };
  };
  _embedded: any;
}

export const pagesInfo = async (slug: string) => {
  
  try {
  const res = await fetch(`${apiUrl}/pages?slug=${slug}&_embed`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
  const data: PropsPages[] = await res.json();
  if (data.length === 0) throw new Error("No page found with the given slug.");
  
    const [infoPage] = data.map((page: PropsPages) => {
      const {
      slug: pageSlug,
      title: { rendered: titlePage },
      acf: {
        title: acfTitle,
        description: acfDescription,
        btn_url: btnUrl,
        intro_title: introTitle,
      },
      excerpt: { rendered: excerpt },
      _embedded,
      } = page;

      return { pageSlug, titlePage, title: acfTitle, acfDescription, btnUrl, introTitle, excerpt, _embedded }
    })
    console.log(infoPage)
    return infoPage;
    
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

    const services = results.map((service:PropsServices) => {
      const {
        id: serviceId,
        title: { rendered: titleService },
        excerpt: { rendered: excerpt },
        slug: slug,
        acf: { 
          description_service: descriptionService,
          button_service: { 
            title: buttonText,
            url: urlService,
            target: targetService
          } = { title: "Ver más", url: "", target: "" }
        } = { description_service: "", button_service:{} },
       /*  _embedded */
      } = service;
    
     /*  // Manejo seguro de imagen destacada
      const srcLink = _embedded?.["wp:featuredmedia"]?.[0]?.source_url || ""; */
      
      return { 
        id: serviceId, 
        title: titleService, 
        description: descriptionService,
        excerpt, 
        buttonText,
        urlService,
        targetService
        /*  srcLink,
        slug, 
        buttonText, 
        urlService, 
        targetService */
      };
    }
    )
    console.log(services)
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

    const posts =  results.map((post: any) => {
      const {
        id: postId,
        title: { rendered: titlePost },
        excerpt: { rendered: excerpt },
        _embedded,
        slug: slug } = post;
      const srcLink = _embedded?.["wp:featuredmedia"]?.[0]?.source_url || "";
      return { postId, titlePost, excerpt, srcLink, slug };
    })
    return posts;
} catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  } 
}