document.addEventListener("DOMContentLoaded", () => {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (finePointer) {
    initFleurCursor();
  }

  initWideProjectCards();

  if (!reduceMotion) {
    initLenisScroll();
  }
});

function initWideProjectCards() {
  const syncImage = (image) => {
    const card = image.closest(".work-card");

    if (!card) {
      return;
    }

    if (image.dataset.gridSpan === "1") {
      card.classList.remove("work-card-wide");
      return;
    }

    card.classList.toggle("work-card-wide", image.naturalWidth > image.naturalHeight);
  };

  document.querySelectorAll(".work-visual img").forEach((image) => {
    if (image.complete) {
      syncImage(image);
      return;
    }

    image.addEventListener("load", () => syncImage(image), { once: true });
  });
}

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
  let lastPointerX = currentX;
  let lastPointerTime = 0;
  let hovering = false;
  let pressed = false;

  const isInteractive = (element) => Boolean(
    element?.closest("a[href], button, [role='button'], [data-href], [data-url]"),
  );

  const syncState = () => {
    cursor.classList.toggle("is-hovering", hovering);
    cursor.classList.toggle("is-pressed", pressed);
  };

  const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

  const rotateToward = (current, target) => {
    const delta = ((target - current + 540) % 360) - 180;
    const speedRatio = Math.min(Math.abs(target) / 45, 1);
    return current + delta * (0.12 + speedRatio * 0.14);
  };

  const tick = () => {
    currentX += (targetX - currentX) / 4;
    currentY += (targetY - currentY) / 4;
    targetRotation *= 0.9;

    if (Math.abs(targetRotation) < 0.05) {
      targetRotation = 0;
    }

    currentRotation = rotateToward(currentRotation, targetRotation);
    cursor.style.left = `${currentX}px`;
    cursor.style.top = `${currentY}px`;
    cursor.style.setProperty("--cursor-rotation", `${currentRotation}deg`);
    window.requestAnimationFrame(tick);
  };

  document.addEventListener("mousemove", (event) => {
    const time = event.timeStamp || performance.now();
    const deltaTime = lastPointerTime ? Math.max(16, time - lastPointerTime) : 16;
    const deltaX = event.clientX - lastPointerX;
    const velocityX = deltaX / deltaTime;

    targetX = event.clientX;
    targetY = event.clientY;
    targetRotation = clamp(velocityX * 30, -45, 45);
    lastPointerX = event.clientX;
    lastPointerTime = time;
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
    syncTouch: true,
    lerp: 0.08,
    wheelMultiplier: 0.9375,
    touchMultiplier: 1.1,
    touchInertiaMultiplier: 24,
    anchors: {
      offset: -60,
    },
  });

  window.premiumProducerLenis = lenis;
}
