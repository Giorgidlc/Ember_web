import type { ServiceCardProps } from "@libs/lib-types/apiLibTypes.ts";
import { endpoints } from "./apiConfing";


export async function getAllServices({ perPage = 4 }: { perPage?: number } = {}) {
  try {
    const response = await fetch(`${endpoints.services}?per_page=${perPage}&_embed`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error("No services found.");

    const servicesInfo: ServiceCardProps[] = data.map(service => { 
      const { 
        id: serviceId,
        slug: serviceSlug,
        title: { rendered: serviceTitle },
        excerpt: { rendered: serviceExcerpt },
        acf: { 
          title_service: serviceName,
          description_service: serviceDescription,
          button_service: serviceButton = [],
        }
      } = service;

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
    
    return servicesInfo;

  } catch (error) {
    console.error("Error fetching services page:", error);
    throw error;
  }

}