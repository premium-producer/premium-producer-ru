document.addEventListener("DOMContentLoaded", () => {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (finePointer) {
    initFleurCursor();
  }

  if (finePointer && !reduceMotion && window.innerWidth >= 1025) {
    initLenisScroll();
  }
});

function initFleurCursor() {
  const cursor = document.createElement("div");
  cursor.className = "fleur-cursor";
  document.body.prepend(cursor);

  let currentX = window.innerWidth / 2;
  let currentY = window.innerHeight / 2;
  let targetX = currentX;
  let targetY = currentY;
  let currentRotation = 0;
  let targetRotation = 0;
  let hovering = false;
  let pressed = false;
  let visualTargets = Array.from(document.querySelectorAll(".work-visual"));

  const isInteractive = (element) => Boolean(
    element?.closest("a[href], button, [role='button'], [data-href], [data-url]"),
  );

  const syncState = () => {
    cursor.classList.toggle("is-hovering", hovering);
    cursor.classList.toggle("is-pressed", pressed);
  };

  const getNearestVisualAngle = () => {
    let nearestDistance = Infinity;
    let nearestAngle = targetRotation;

    visualTargets.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = centerX - currentX;
      const deltaY = centerY - currentY;
      const distance = deltaX * deltaX + deltaY * deltaY;

      if (distance < nearestDistance) {
        nearestDistance = distance;
        const horizontalBias = Math.atan2(deltaX, Math.max(120, Math.abs(deltaY))) * 180 / Math.PI;
        nearestAngle = Math.max(-45, Math.min(45, horizontalBias));
      }
    });

    return nearestAngle;
  };

  const rotateToward = (current, target) => {
    const delta = ((target - current + 540) % 360) - 180;
    return current + delta * 0.06;
  };

  const tick = () => {
    currentX += (targetX - currentX) / 4;
    currentY += (targetY - currentY) / 4;
    targetRotation = getNearestVisualAngle();
    currentRotation = rotateToward(currentRotation, targetRotation);
    cursor.style.left = `${currentX}px`;
    cursor.style.top = `${currentY}px`;
    cursor.style.setProperty("--cursor-rotation", `${currentRotation}deg`);
    window.requestAnimationFrame(tick);
  };

  document.addEventListener("mousemove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    cursor.classList.add("is-visible");
    hovering = isInteractive(event.target);
    syncState();
  });

  document.addEventListener("mouseover", (event) => {
    hovering = isInteractive(event.target);
    syncState();
  });

  document.addEventListener("mouseout", (event) => {
    if (isInteractive(event.target)) {
      hovering = false;
      syncState();
    }
  });

  document.addEventListener("mousedown", () => {
    pressed = true;
    syncState();
  });

  document.addEventListener("mouseup", () => {
    pressed = false;
    syncState();
  });

  document.addEventListener("mouseleave", () => {
    cursor.classList.remove("is-visible");
  });

  document.addEventListener("mouseenter", () => {
    cursor.classList.add("is-visible");
  });

  window.addEventListener("resize", () => {
    visualTargets = Array.from(document.querySelectorAll(".work-visual"));
  });

  tick();
}

function initLenisScroll() {
  if (!window.Lenis) {
    return;
  }

  const lenis = new window.Lenis({
    autoRaf: true,
    autoResize: true,
    smoothWheel: true,
    syncTouch: false,
    lerp: 0.08,
    wheelMultiplier: 0.9375,
    touchMultiplier: 1,
    anchors: {
      offset: -60,
    },
  });

  window.premiumProducerLenis = lenis;
}
