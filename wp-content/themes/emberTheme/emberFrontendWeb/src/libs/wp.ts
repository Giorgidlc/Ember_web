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
  section_title: string;
  section_button: {
    title: string;
    url: string;
    target: string;
  };
  section_counter_titlte: string;
  project_counter: number;

}

interface PropsServices {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  slug: string;
  acf: {
    title_service: string;
    description_service: string;
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
          section_button: {
            title: sectionButtonTitle,
            url: sectionButtonUrl,
            target: sectionButtonTarget,
          } = {}, // 👈 evita error si section_button es null
        } = {}, // 👈 evita error si acf es null
        excerpt: { rendered: excerpt } = { rendered: "" },
        _embedded,
      } = page;

      return {
        pageSlug,
        titlePage,
        acfTitle,
        acfDescription,
        btnUrl,
        introTitle,
        introDescription,
        sectionTitle,
        sectionButtonTitle,
        sectionButtonUrl,
        sectionButtonTarget,
        excerpt,
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
    const res = await fetch(`${apiUrl}/pages?slug=${slug}&_embed&_fields=slug,title.rendered,acf.title,acf.description,acf.btn_url,acf.intro_title,acf.section_title,acf.section_button,acf.section_counter_titlte,acf.project_counter,excerpt.rendered`);

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data: PropsPages[] = await res.json();
    if (data.length === 0) throw new Error("No page found with the given slug.");

    const [infoPageIndex] = data.map((page: PropsPages) => {
      const {
        slug: pageSlug,
        title: { rendered: titlePage },
        acf: {
          title: acfTitle,
          description: acfDescription,
          btn_url: btnUrl,
          intro_title: introTitle,
          section_title: sectionTitle,
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

      return { pageSlug, titlePage, title: acfTitle, acfDescription, btnUrl, introTitle, excerpt, _embedded, sectionTitle, sectionButtonTitle, sectionButtonUrl, sectionButtonTarget, sectionCounterTitle, projectCounter };
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
          button_service: {
            title: buttonText,
            url: urlService,
            target: targetService
          } = { title: "Ver más", url: "", target: "" }
        } = { titleService:"", description_service: "", button_service: {} },
        /*  _embedded */
      } = service;

      /*  // Manejo seguro de imagen destacada
       const srcLink = _embedded?.["wp:featuredmedia"]?.[0]?.source_url || ""; */

      return {
        id: serviceId,
        title: titleService,
        titleShortService,
        descriptionService,
        slug,
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
    //console.log(services)
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
    //console.log(posts)
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
    //console.log(infoPost)
    return infoPost;

  } catch (error) {
    throw error;
  }
}