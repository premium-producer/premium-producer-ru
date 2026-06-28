(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    return;
  }

  let targetY = window.scrollY;
  let currentY = window.scrollY;
  let frame = 0;

  const clamp = (value) => {
    const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    return Math.min(Math.max(value, 0), maxY);
  };

  const tick = () => {
    currentY += (targetY - currentY) * 0.18;

    if (Math.abs(targetY - currentY) < 0.5) {
      currentY = targetY;
      frame = 0;
    } else {
      frame = window.requestAnimationFrame(tick);
    }

    window.scrollTo(0, currentY);
  };

  window.addEventListener(
    "wheel",
    (event) => {
      if (event.ctrlKey) {
        return;
      }

      const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

      if (maxY <= 0) {
        return;
      }

      event.preventDefault();
      targetY = clamp(targetY + event.deltaY * 0.82);

      if (!frame) {
        currentY = window.scrollY;
        frame = window.requestAnimationFrame(tick);
      }
    },
    { passive: false },
  );

  window.addEventListener("keydown", () => {
    targetY = window.scrollY;
    currentY = window.scrollY;
  });
})();
