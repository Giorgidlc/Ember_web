const domain = import.meta.env.PUBLIC_WP_DOMAIN;
const apiUrl = `${domain}/wp-json/wp/v2`;


interface PropsPages {
  slug: string;
  page: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  _embedded: any;
}

export const pagesInfo = async (slug: PropsPages) => {
  
  try {
  const res = await fetch(`${apiUrl}/pages?slug=${slug}&_embed`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
  const data = await res.json();
  if (data.length === 0) throw new Error("No page found with the given slug.");
  
    const [infoPage] = data.map((page: PropsPages) => {
      const {
      slug: pageSlug,
      title: { rendered: title },
      content: { rendered: content },
      excerpt: { rendered: excerpt },
      _embedded,
      } = page;

      return { pageSlug, title , content, excerpt, _embedded }
    })
    console.log(infoPage)
    return infoPage;
    
  } catch (error) {
    console.error("Error fetching page data:", error);
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