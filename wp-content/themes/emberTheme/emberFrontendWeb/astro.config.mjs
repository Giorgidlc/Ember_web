// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false
    },

 /*    routes: {
      'que-hacemos': {
        en: 'what-we-do'
      },
      'quienes-somos': {
        en: 'who-we-are'
      },
      'oportunidades-europeas': {
        en: 'european-opportunities'
      },
      'contacto': {
        en: 'contact'
      }
    } */
  },
  image: {
    domains: ["astro.build"],
    remotePatterns: [{ protocol: "http" }],
  }
});
