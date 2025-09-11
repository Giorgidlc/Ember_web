

import { endpoints } from "./apiConfing";
export const getAllPosts = async ({ perPage = 3 }: { perPage?: number } = {}) => {
  try {
    const res = await fetch(`${endpoints.posts}?per_page=${perPage}&_embed`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const results = await res.json();
    if (Array.isArray(results)  || results.length === 0) throw new Error("No posts found.");

    const posts = results.map((post: any) => {
      const {
        id: postId,
        title: { rendered: postTitle },
        excerpt: { rendered: postExcerpt },
        slug: postSlug } = post;
      
  
      const srcLink = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "";
      
      
      return { postId, postSlug, postTitle, postExcerpt, srcLink, };
    })

    return posts;
  } catch (error) {
    throw error;
  }
}
