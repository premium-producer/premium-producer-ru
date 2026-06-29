import { initFleurCursor } from "./features/fleur-cursor.js?v=gallery-wheel-lock3-20260629";
import { initLenisScroll } from "./features/smooth-scroll.js?v=gallery-wheel-lock3-20260629";
import { initWorkDetailView } from "./features/work-detail.js?v=gallery-wheel-lock3-20260629";

document.addEventListener("DOMContentLoaded", () => {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (finePointer) {
    initFleurCursor();
  }

  initWorkDetailView();

  if (!reduceMotion) {
    initLenisScroll();
  }
});
