import type { Endpoints } from "@/libs/lib-types/apiLibTypes";

const domain: string = import.meta.env.PUBLIC_WP_DOMAIN as string;
const apiUrl : string = `${domain}/wp-json/wp/v2`;

const endpoints : Endpoints = {
  posts: `${apiUrl}/posts`,
  pages: `${apiUrl}/pages`,
  services: `${apiUrl}/servicio`,
};

export { endpoints };

