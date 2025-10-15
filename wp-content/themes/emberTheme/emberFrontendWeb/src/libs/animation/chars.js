import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const services = gsap.utils.toArray(".service");
  const panel = document.querySelector(".part-side-block");
  const images = gsap.utils.toArray(".chars-container");

  // Invertir el orden de las imágenes (última = primera)
  const reversedImages = [...images].reverse();

  // Asegura que las imágenes se superpongan y estén ocultas al inicio
  gsap.set(reversedImages, {
    gridArea: "1/1",
    opacity: 0,
  });

  // Pin del panel lateral
  ScrollTrigger.create({
    trigger: panel,
    start: "top 30%",
    endTrigger: panel, 
    end: "bottom 60%",
    pin: true,
    toggleActions: "play none none play",
   // markers: true, // quítalo en producción
  });

  // Crear un trigger por cada servicio
  services.forEach((service, i) => {
    ScrollTrigger.create({
      trigger: service,
      start: "top center",
      end: "bottom center",
      onEnter: () => showImage(i),
      onEnterBack: () => showImage(i),
      markers: 0,
    });
  });

  function showImage(index) {
    // Apagar todas las imágenes
    gsap.to(reversedImages, {
      opacity: 0,
    });

    // Mostrar la correspondiente
    gsap.fromTo(
      reversedImages[index],
      { opacity: 0, rotate: 90 },
      {
        opacity: 1,
        rotate: 0,
        duration: 0.6,
        ease: "power.out",
      }
    );
  }
});
