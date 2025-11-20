import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

document.fonts.ready.then(() => {
  // Selecciona todos los .split
  document.querySelectorAll(".split").forEach((el) => {
    // Crea un SplitText por cada elemento (no hacerlo en bloque)
    const split = new SplitText(el, {
      type: "lines,words",
      linesClass: "line",
      aria: "hidden",
      mask: "lines" // si quieres máscara por línea
    });

    // Asegúrate de que el estado inicial sea oculto (antes del trigger)
    gsap.set(split.words, { y: 100, opacity: 0 });

    // Crea una timeline con su propio ScrollTrigger ligado al elemento
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,                 // el contenedor (.split)
        start: "top 90%",            // cuando la parte superior toque el 80% de la ventana
        toggleActions: "play none none none", // enter, leave, enterBack, leaveBack
        onLeaveBack: () => split.revert(), // opcional: revertir al salir hacia arriba
        //markers: true,           // descomenta para debug
      }
    });

    // Animación (to en lugar de from para control robusto al reiniciar)
    tl.to(split.words, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "expo.out",
      stagger: 0.06
    });

    // Nota: NO usamos split.revert() aquí, así los wrappers permanecen y la animación puede reiniciarse.
  });

  // Refresca los triggers (importante después de que las fuentes carguen y SplitText haya medido)
  ScrollTrigger.refresh();
});



