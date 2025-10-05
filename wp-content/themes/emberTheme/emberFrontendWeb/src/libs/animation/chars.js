import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const services = gsap.utils.toArray(".service");
  const panel = document.querySelector(".part-side-block");
  const image = panel.querySelector(".chars");

  const chars = [
  "/src/assets/chars/char1.svg",
  "/src/assets/chars/char2.svg",
  "/src/assets/chars/char3.svg",
  "/src/assets/chars/char4.svg",
  "/src/assets/chars/char5.svg",
  "/src/assets/chars/char6.svg"
];

  // Fijamos el aside al scroll del wrapper
  ScrollTrigger.create({
    trigger: services ,
    start: "top top",
    end: "bottom bottom",
      scrub: true,
    pin: panel,
    pinSpacing: false,
  });

  // Animación al cambiar de sección
  services.forEach((section, i) => {
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom center",
      onEnter: () => changeImage(i),
      onEnterBack: () => changeImage(i),
      markers: true,
    });
  });

  function changeImage(index) {
    const next = chars[index % chars.length];
    // animación del cambio de imagen (derecha a izquierda)
    gsap.fromTo(
      image,
      { x: 100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        onStart: () => {
          image.src = next;
        },
      }
    );
  }

  // Inicial
  changeImage(0);
});
