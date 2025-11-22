//import type { Endpoints } from "@/libs/lib-types/LibTypes";

import type { Endpoints } from "./types/apiTypes";

// const domain = import.meta.env.PUBLIC_WP_DOMAIN as string;

const domain = 'http://localhost:8881'
const apiUrl : string = `${domain}/wp-json/wp/v2`;

const endpoints : Endpoints = {
  posts: `${apiUrl}/posts`,
  pages: `${apiUrl}/pages`,
  services_update: `${apiUrl}/service`,
  programmes: `${apiUrl}/programme`,
  patterns: `${apiUrl}/patterns`,
  menus: `${apiUrl}/menu-public`,
};

export { domain, apiUrl, endpoints };

