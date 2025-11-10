// Mapeo bidireccional de rutas entre español e inglés
export const routeMap: Record<string, { es: string; en: string }> = {
  home: { es: '/', en: '/en/' },
  'que-hacemos': { es: '/que-hacemos/', en: '/en/what-we-do/' },
  'what-we-do': { es: '/que-hacemos/', en: '/en/what-we-do/' },
  'quienes-somos': { es: '/quienes-somos/', en: '/en/who-we-are/' },
  'who-we-are': { es: '/quienes-somos/', en: '/en/who-we-are/' },
  'oportunidades-europeas': { es: '/oportunidades-europeas/', en: '/en/european-opportunities/' },
  'european-opportunities': { es: '/oportunidades-europeas/', en: '/en/european-opportunities/' },
  contacto: { es: '/contacto/', en: '/en/contact/' },
  contact: { es: '/contacto/', en: '/en/contact/' },
  'aviso-legal': { es: '/aviso-legal/', en: '/en/legal-notice/' },
  'legal-notice': { es: '/aviso-legal/', en: '/en/legal-notice/' },
  'politica-de-cookies': { es: '/politica-de-cookies/', en: '/en/cookie-policy/' },
  'cookie-policy': { es: '/politica-de-cookies/', en: '/en/cookie-policy/' },
  'politica-de-privacidad': { es: '/politica-de-privacidad/', en: '/en/privacy-policy/' },
  'privacy-policy': { es: '/politica-de-privacidad/', en: '/en/privacy-policy/' },
};

/**
 * Obtiene la URL alternativa para el idioma opuesto
 * @param currentPath - Path actual (e.g., "/que-hacemos/" o "/en/what-we-do/")
 * @param currentLang - Idioma actual ('es' o 'en')
 * @returns La ruta traducida al idioma opuesto, o la raíz correspondiente si no se encuentra
 */
export function getAlternateRoute(currentPath: string, currentLang: 'es' | 'en'): string {
  const targetLang = currentLang === 'es' ? 'en' : 'es';
  
  // Normalizar el path: remover trailing slash y leading slash
  let normalizedPath = currentPath.replace(/^\/+|\/+$/g, '');
  
  // Si estamos en inglés, remover el prefijo /en
  if (normalizedPath.startsWith('en/')) {
    normalizedPath = normalizedPath.replace(/^en\//, '');
  }
  
  // Si el path está vacío, es la home
  if (!normalizedPath) {
    return targetLang === 'es' ? '/' : '/en/';
  }
  
  // Manejar rutas de 404 - siempre ir a la home del idioma objetivo
  if (normalizedPath === '404' || normalizedPath.includes('404')) {
    return targetLang === 'es' ? '/' : '/en/';
  }
  
  // Manejar rutas de blog - si es una ruta de blog, mantener la estructura
  if (normalizedPath.startsWith('blog/')) {
    const blogSlug = normalizedPath.replace('blog/', '');
    // Para blog posts, mantener el mismo slug pero cambiar el prefijo de idioma
    return targetLang === 'es' ? `/blog/${blogSlug}` : `/en/blog/${blogSlug}`;
  }
  
  // Buscar el mapeo correspondiente
  const mapping = routeMap[normalizedPath];
  
  if (mapping) {
    return mapping[targetLang];
  }
  
  // Si no se encuentra el mapeo, retornar la raíz del idioma objetivo
  // Esto previene que se acumulen prefijos /en/ múltiples
  console.warn(`No route mapping found for: ${normalizedPath}`);
  return targetLang === 'es' ? '/' : '/en/';
}
