export function initWorkDetailView() {
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
    <div class="detail-stage" aria-live="polite">
      <div class="detail-gallery-shell">
        <button class="detail-media-arrow detail-media-arrow-up" type="button" aria-label="Предыдущее фото"></button>
        <div class="detail-gallery-mount"></div>
        <button class="detail-media-arrow detail-media-arrow-down" type="button" aria-label="Следующее фото"></button>
      </div>
    </div>
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
  const galleryShell = detail.querySelector(".detail-gallery-shell");
  const galleryMount = detail.querySelector(".detail-gallery-mount");
  const code = detail.querySelector(".detail-code");
  const title = detail.querySelector(".detail-title");
  const dots = detail.querySelector(".detail-dots");
  const backButton = detail.querySelector(".detail-back");
  const prevButton = detail.querySelector(".detail-arrow-prev");
  const nextButton = detail.querySelector(".detail-arrow-next");
  const mediaPrevButton = detail.querySelector(".detail-media-arrow-up");
  const mediaNextButton = detail.querySelector(".detail-media-arrow-down");
  let activeIndex = 0;
  let activeMediaIndex = 0;
  let lastFocusedElement = null;
  let swipeStartX = 0;
  let swipeStartY = 0;
  let swipePointerId = null;
  let wheelLocked = false;
  let wheelUnlockTimer = null;
  let activeMediaAssets = [];
  let activeVisualClass = "";

  const renderDots = () => {
    dots.replaceChildren();

    cards.slice(0, 4).forEach((_, index) => {
      const dot = document.createElement("span");
      dot.className = "detail-dot";
      dot.classList.toggle("active", index === activeIndex % 4);
      dots.append(dot);
    });
  };

  const getCardAssets = (card) => {
    try {
      const assets = JSON.parse(card.dataset.detailAssets || "[]");
      return Array.isArray(assets) ? assets.filter(Boolean) : [];
    } catch {
      return [];
    }
  };

  const getAssetUrl = (card, asset) => {
    const slug = card.dataset.productSlug;
    const routeDepth = window.location.pathname.split("/").filter(Boolean).length;
    const prefix = routeDepth > 0 ? ".." : ".";

    if (!slug || !asset) {
      return "";
    }

    return `${prefix}/products/${slug}/${asset}`;
  };

  const getNormalizedIndex = (index, total) => (index + total) % total;

  const updateMediaControls = () => {
    const gallery = galleryMount.querySelector(".detail-gallery");
    const hasMultipleMedia = Number(gallery?.dataset.realCount || gallery?.children.length || 0) > 1;

    mediaPrevButton.hidden = !hasMultipleMedia;
    mediaNextButton.hidden = !hasMultipleMedia;
  };

  const createMediaSlide = (card, asset, index) => {
    const slide = document.createElement("figure");
    const visual = document.createElement("div");
    const img = document.createElement("img");

    slide.className = "detail-slide";
    slide.setAttribute("aria-hidden", "false");
    visual.className = `detail-visual work-visual ${activeVisualClass}`.trim();
    img.src = getAssetUrl(card, asset);
    img.alt = "";
    img.loading = index === 0 ? "eager" : "lazy";
    visual.append(img);
    slide.append(visual);
    return slide;
  };

  const renderMediaFrame = () => {
    const card = cards[activeIndex];
    const gallery = document.createElement("div");

    gallery.className = "detail-gallery";
    gallery.dataset.realCount = String(activeMediaAssets.length);

    if (activeMediaAssets.length) {
      gallery.append(createMediaSlide(card, activeMediaAssets[activeMediaIndex], activeMediaIndex));
    }

    galleryMount.replaceChildren(gallery);
    updateMediaControls();
  };

  const switchDetailVisual = (renderFrame) => {
    detail.classList.remove("is-switching");
    renderFrame();
    detail.offsetWidth;
    window.requestAnimationFrame(() => {
      detail.classList.add("is-switching");
    });
  };

  const moveMedia = (direction) => {
    const total = activeMediaAssets.length;

    if (total < 2) {
      return;
    }

    activeMediaIndex = getNormalizedIndex(activeMediaIndex + direction, total);
    switchDetailVisual(renderMediaFrame);
  };

  const render = () => {
    const card = cards[activeIndex];
    const visualClass = card.dataset.detailVisualClass || "";
    const galleryAssets = getCardAssets(card);
    const fallbackVisual = card.querySelector(".work-visual");

    activeVisualClass = visualClass;
    activeMediaAssets = galleryAssets;
    activeMediaIndex = 0;

    if (activeMediaAssets.length) {
      renderMediaFrame();
    } else if (fallbackVisual) {
      const gallery = document.createElement("div");
      const clonedVisual = fallbackVisual.cloneNode(true);

      gallery.className = "detail-gallery";
      gallery.dataset.realCount = "1";
      clonedVisual.removeAttribute("href");
      clonedVisual.removeAttribute("aria-label");
      clonedVisual.setAttribute("aria-hidden", "true");
      clonedVisual.classList.add("detail-visual");
      gallery.append(clonedVisual);
      galleryMount.replaceChildren(gallery);
      updateMediaControls();
    }

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
      galleryMount.replaceChildren();
      lastFocusedElement?.focus?.({ preventScroll: true });
    }, 180);
  };

  const move = (direction) => {
    activeIndex = (activeIndex + direction + cards.length) % cards.length;
    switchDetailVisual(render);
  };

  const handleSwipeStart = (event) => {
    swipePointerId = event.pointerId;
    swipeStartX = event.clientX;
    swipeStartY = event.clientY;
  };

  const handleSwipeEnd = (event) => {
    if (swipePointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - swipeStartX;
    const deltaY = event.clientY - swipeStartY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const swipeThreshold = 34;

    swipePointerId = null;

    if (Math.max(absX, absY) < swipeThreshold) {
      return;
    }

    if (absX > absY) {
      move(deltaX > 0 ? -1 : 1);
      return;
    }

    moveMedia(deltaY > 0 ? -1 : 1);
  };

  const handleTouchStart = (event) => {
    const touch = event.changedTouches[0];

    swipeStartX = touch.clientX;
    swipeStartY = touch.clientY;
  };

  const handleTouchEnd = (event) => {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - swipeStartX;
    const deltaY = touch.clientY - swipeStartY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const swipeThreshold = 42;

    if (Math.max(absX, absY) < swipeThreshold) {
      return;
    }

    if (absX > absY) {
      move(deltaX > 0 ? -1 : 1);
      return;
    }

    moveMedia(deltaY > 0 ? -1 : 1);
  };

  const handleWheel = (event) => {
    const gallery = galleryMount.querySelector(".detail-gallery");
    const realCount = Number(gallery?.dataset.realCount || 0);
    const absX = Math.abs(event.deltaX);
    const absY = Math.abs(event.deltaY);
    const wheelThreshold = 56;
    const isHorizontalWheel = absX > absY;

    if (!gallery || Math.max(absX, absY) < wheelThreshold) {
      return;
    }

    if (!isHorizontalWheel && realCount < 2) {
      return;
    }

    event.preventDefault();

    if (wheelLocked) {
      return;
    }

    window.clearTimeout(wheelUnlockTimer);
    wheelLocked = true;

    if (isHorizontalWheel) {
      move(event.deltaX > 0 ? 1 : -1);
    } else {
      moveMedia(event.deltaY > 0 ? 1 : -1);
    }

    wheelUnlockTimer = window.setTimeout(() => {
      wheelLocked = false;
    }, 620);
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
  mediaPrevButton.addEventListener("click", () => moveMedia(-1));
  mediaNextButton.addEventListener("click", () => moveMedia(1));
  stage.addEventListener("pointerdown", handleSwipeStart);
  stage.addEventListener("pointerup", handleSwipeEnd);
  stage.addEventListener("pointercancel", () => {
    swipePointerId = null;
  });
  galleryShell.addEventListener("wheel", handleWheel, { passive: false });
  detail.addEventListener("click", (event) => {
    if (event.target === detail || event.target === stage) {
      close();
    }
  });
  detail.addEventListener("touchstart", handleTouchStart, { passive: true });
  detail.addEventListener("touchend", handleTouchEnd, { passive: true });

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

    if (event.key === "ArrowUp") {
      moveMedia(-1);
    }

    if (event.key === "ArrowDown") {
      moveMedia(1);
    }
  });
}
