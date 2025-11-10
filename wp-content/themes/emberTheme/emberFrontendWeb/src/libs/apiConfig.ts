import type { Endpoints } from "@/libs/lib-types/LibTypes";

const domain = import.meta.env.PUBLIC_WP_DOMAIN as string;
const apiUrl : string = `${domain}/wp-json/wp/v2`;

const endpoints : Endpoints = {
  posts: `${apiUrl}/posts`,
  pages: `${apiUrl}/pages`,
  services: `${apiUrl}/servicio`,
  programs: `${apiUrl}/programa`,
  menus: `${apiUrl}/menu-public`,
};

export { domain, apiUrl, endpoints };

