import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const services = gsap.utils.toArray(".item-block");
  const images = gsap.utils.toArray(".chars-container");
  const dotlooties = gsap.utils.toArray(".dotlootie-container");

  gsap.set(images, { opacity: 0 });

  services.forEach((service, index) => {
    const image = images[index];
    const isEven = index % 2 === 0;

    const xFrom = isEven ? 200 : -200;
    const rotateFrom = isEven ? 90 : -90;

    const animateIn = () => {
      gsap.fromTo(
        image,
        { opacity: 0, xPercent: xFrom, rotate: rotateFrom, filter: "blur(10px)", scale: 0.3 },
        {
          opacity: 1,
          xPercent: 0,
          rotate: 0,
          filter: "blur(0px)",
          scale: 1,
          duration: 0.5,
          ease: "expo.out",
        }
      );
    };

    const animateOut = () => {
      gsap.to(image, {
        opacity: 0,
        xPercent: xFrom,
        rotate: rotateFrom,
        filter: "blur(10px)",
        scale: 0.3,
        duration: 0.5,
        ease: "expo.out",
      });
    };

    ScrollTrigger.create({
      trigger: service,
      start: "top center",
      end: "bottom center",
      onEnter: animateIn,
      onEnterBack: animateIn,
      onLeave: animateOut,
      onLeaveBack: animateOut,
      markers: true,
    });
  });
});

/* 
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const services = gsap.utils.toArray(".item-block");
  const images = gsap.utils.toArray(".chars-container");

  const isMobile = window.innerWidth <= 768;

  // Ocultar todas las imágenes
  gsap.set(images, { opacity: 0, scale: 0.10, filter: "blur(10px)", zIndex: 0 });

  services.forEach((service, index) => {
    const image = images[index];
    const isEven = index % 2 === 0;

    // Ejes de animación distintos en mobile (horizontal scroll)
    const fromValue = isMobile
      ? (isEven ? 100 : -100) // yPercent para mobile
      : (isEven ? 200 : -200); // xPercent para desktop

    const rotateFrom = isEven ? 90 : -90;

    const animateIn = () => {
      gsap.fromTo(
        image,
        isMobile
          ? { opacity: 0, yPercent: fromValue, rotate: rotateFrom, scale: 0.95, filter: "blur(10px)", zIndex: 0 }
          : { opacity: 0, xPercent: fromValue, rotate: rotateFrom, scale: 0.95, filter: "blur(10px)", zIndex: 0 },
        {
          opacity: 1,
          xPercent: 0,
          yPercent: 0,
          rotate: 0,
          scale: 1,
          filter: "blur(0px)",
          zIndex: 5,
          duration: 0.6,
          ease: "expo.out",
        }
      );
    };

    const animateOut = () => {
      gsap.to(image, {
        opacity: 0,
        xPercent: isMobile ? 0 : fromValue,
        yPercent: isMobile ? fromValue : 0,
        rotate: rotateFrom,
        scale: 0.95,
        filter: "blur(10px)",
        zIndex: 0,
        duration: 0.5,
        ease: "expo.out",
      });
    };

    ScrollTrigger.create({
      trigger: service,
      start: "top center",
      end: "bottom center",
      onEnter: animateIn,
      onEnterBack: animateIn,
      onLeave: animateOut,
      onLeaveBack: animateOut,
      markers: false, // Desactiva esto si ya no lo necesitás
    });
  });
});
 */