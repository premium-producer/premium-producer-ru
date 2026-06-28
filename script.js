document.addEventListener("DOMContentLoaded", () => {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (finePointer) {
    initFleurCursor();
  }

  if (finePointer && !reduceMotion && window.innerWidth >= 1025) {
    initSmoothScroll();
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
  let hovering = false;
  let pressed = false;

  const isInteractive = (element) => Boolean(
    element?.closest("a[href], button, [role='button'], [data-href], [data-url]"),
  );

  const syncState = () => {
    cursor.classList.toggle("is-hovering", hovering);
    cursor.classList.toggle("is-pressed", pressed);
  };

  const tick = () => {
    currentX += (targetX - currentX) / 4;
    currentY += (targetY - currentY) / 4;
    cursor.style.left = `${currentX}px`;
    cursor.style.top = `${currentY}px`;
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

  tick();
}

function initSmoothScroll() {
  let current = window.pageYOffset || 0;
  let target = current;
  let maxScroll = 0;
  let frame = 0;
  const ease = 0.07;

  const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

  const updateMaxScroll = () => {
    maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    target = clamp(target, 0, maxScroll);
    current = clamp(current, 0, maxScroll);
  };

  const stopIfSettled = () => {
    if (Math.abs(target - current) < 0.1) {
      window.cancelAnimationFrame(frame);
      frame = 0;
    }
  };

  const run = () => {
    current += (target - current) * ease;

    if (Math.abs(target - current) < 0.1) {
      current = target;
    }

    current = clamp(current, 0, maxScroll);
    window.scrollTo(0, current);
    stopIfSettled();

    if (frame) {
      frame = window.requestAnimationFrame(run);
    }
  };

  const start = () => {
    if (!frame) {
      frame = window.requestAnimationFrame(run);
    }
  };

  updateMaxScroll();
  window.addEventListener("resize", updateMaxScroll);
  window.addEventListener("load", updateMaxScroll);

  if ("ResizeObserver" in window) {
    new ResizeObserver(updateMaxScroll).observe(document.body);
  }

  window.addEventListener(
    "wheel",
    (event) => {
      if (event.ctrlKey || maxScroll <= 0) {
        return;
      }

      event.preventDefault();
      target = clamp(target + event.deltaY, 0, maxScroll);
      start();
    },
    { passive: false },
  );

  window.addEventListener("keydown", (event) => {
    const step = window.innerHeight * 0.85;
    const keys = {
      ArrowDown: 120,
      ArrowUp: -120,
      PageDown: step,
      PageUp: -step,
      Home: -Infinity,
      End: Infinity,
    };

    if (!(event.key in keys)) {
      return;
    }

    event.preventDefault();
    const delta = keys[event.key];
    target = delta === Infinity ? maxScroll : delta === -Infinity ? 0 : target + delta;
    target = clamp(target, 0, maxScroll);
    start();
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');

    if (!link) {
      return;
    }

    const id = link.getAttribute("href");

    if (!id || id === "#") {
      return;
    }

    const element = document.querySelector(id);

    if (!element) {
      return;
    }

    event.preventDefault();
    target = clamp(element.getBoundingClientRect().top + current - 60, 0, maxScroll);
    start();
  });

  window.addEventListener("scroll", () => {
    if (!frame) {
      current = window.pageYOffset || 0;
      target = current;
    }
  });
}
