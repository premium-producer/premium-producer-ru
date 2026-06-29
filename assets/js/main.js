import { initFleurCursor } from "./features/fleur-cursor.js";
import { initLenisScroll } from "./features/smooth-scroll.js";
import { initWorkDetailView } from "./features/work-detail.js";

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
