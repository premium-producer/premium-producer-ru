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

function initWorkDetailView() {
  const cards = Array.from(document.querySelectorAll(".work-card"));

  if (!cards.length) {
    return;
  }

  const detail = document.createElement("section");
  detail.className = "work-detail";
  detail.setAttribute("aria-modal", "true");
  detail.setAttribute("role", "dialog");
  detail.setAttribute("aria-label", "Просмотр работы");
  detail.hidden = true;
  detail.innerHTML = `
    <button class="detail-back" type="button" aria-label="Назад">‹</button>
    <div class="detail-count" aria-hidden="true">
      <span>1</span>
      <span class="bag-icon"></span>
    </div>
    <button class="detail-arrow detail-arrow-prev" type="button" aria-label="Предыдущая работа">‹</button>
    <div class="detail-stage" aria-live="polite"></div>
    <button class="detail-arrow detail-arrow-next" type="button" aria-label="Следующая работа">›</button>
    <div class="detail-meta">
      <div class="detail-dots" aria-hidden="true"></div>
      <h2 class="detail-code"></h2>
      <p class="detail-title"></p>
      <p class="detail-price">$60</p>
      <a class="detail-add" href="mailto:hello@premium-producer.ru" aria-label="Написать по этой работе">+</a>
    </div>
  `;
  document.body.append(detail);

  const stage = detail.querySelector(".detail-stage");
  const code = detail.querySelector(".detail-code");
  const title = detail.querySelector(".detail-title");
  const dots = detail.querySelector(".detail-dots");
  const backButton = detail.querySelector(".detail-back");
  const prevButton = detail.querySelector(".detail-arrow-prev");
  const nextButton = detail.querySelector(".detail-arrow-next");
  let activeIndex = 0;
  let lastFocusedElement = null;

  const renderDots = () => {
    dots.replaceChildren();

    cards.slice(0, 4).forEach((_, index) => {
      const dot = document.createElement("span");
      dot.className = "detail-dot";
      dot.classList.toggle("active", index === activeIndex % 4);
      dots.append(dot);
    });
  };

  const render = () => {
    const card = cards[activeIndex];
    const visual = card.querySelector(".work-visual");
    const clonedVisual = visual.cloneNode(true);

    clonedVisual.removeAttribute("href");
    clonedVisual.removeAttribute("aria-label");
    clonedVisual.setAttribute("aria-hidden", "true");
    clonedVisual.classList.add("detail-visual");
    stage.replaceChildren(clonedVisual);
    code.textContent = card.querySelector(".work-code")?.textContent?.trim() || "";
    title.textContent = card.querySelector("h2")?.textContent?.trim() || "";
    renderDots();
  };

  const open = (index) => {
    activeIndex = index;
    lastFocusedElement = document.activeElement;
    render();
    detail.hidden = false;
    document.documentElement.classList.add("detail-open");
    document.body.classList.add("detail-open");
    window.premiumProducerLenis?.stop?.();
    window.requestAnimationFrame(() => {
      detail.classList.add("is-open");
      backButton.focus({ preventScroll: true });
    });
  };

  const close = () => {
    detail.classList.remove("is-open");
    document.documentElement.classList.remove("detail-open");
    document.body.classList.remove("detail-open");
    window.premiumProducerLenis?.start?.();
    window.setTimeout(() => {
      detail.hidden = true;
      stage.replaceChildren();
      lastFocusedElement?.focus?.({ preventScroll: true });
    }, 180);
  };

  const move = (direction) => {
    activeIndex = (activeIndex + direction + cards.length) % cards.length;
    detail.classList.remove("is-switching");
    render();
    window.requestAnimationFrame(() => {
      detail.classList.add("is-switching");
    });
  };

  cards.forEach((card, index) => {
    const visual = card.querySelector(".work-visual");

    visual?.addEventListener("click", (event) => {
      event.preventDefault();
      open(index);
    });
  });

  backButton.addEventListener("click", close);
  prevButton.addEventListener("click", () => move(-1));
  nextButton.addEventListener("click", () => move(1));

  document.addEventListener("keydown", (event) => {
    if (detail.hidden) {
      return;
    }

    if (event.key === "Escape") {
      close();
    }

    if (event.key === "ArrowLeft") {
      move(-1);
    }

    if (event.key === "ArrowRight") {
      move(1);
    }
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
  let currentSpeedScale = 1;
  let targetSpeedScale = 1;
  let lastPointerX = currentX;
  let lastPointerY = currentY;
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
    targetSpeedScale += (1 - targetSpeedScale) * 0.12;

    if (Math.abs(targetRotation) < 0.05) {
      targetRotation = 0;
    }

    currentRotation = rotateToward(currentRotation, targetRotation);
    currentSpeedScale += (targetSpeedScale - currentSpeedScale) * 0.22;
    cursor.style.left = `${currentX}px`;
    cursor.style.top = `${currentY}px`;
    cursor.style.setProperty("--cursor-rotation", `${currentRotation}deg`);
    cursor.style.setProperty("--cursor-speed-scale", currentSpeedScale.toFixed(3));
    window.requestAnimationFrame(tick);
  };

  document.addEventListener("mousemove", (event) => {
    const time = event.timeStamp || performance.now();
    const deltaTime = lastPointerTime ? Math.max(16, time - lastPointerTime) : 16;
    const deltaX = event.movementX || event.clientX - lastPointerX;
    const deltaY = event.movementY || event.clientY - lastPointerY;
    const velocityX = deltaX / deltaTime;
    const velocity = Math.hypot(deltaX, deltaY) / deltaTime;
    const distance = Math.hypot(deltaX, deltaY);

    targetX = event.clientX;
    targetY = event.clientY;
    targetRotation = clamp(velocityX * 30, -45, 45);
    targetSpeedScale = 1 + clamp(Math.max(velocity * 0.28, distance / 1200), 0, 0.1);
    currentSpeedScale = Math.max(currentSpeedScale, targetSpeedScale);
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
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
