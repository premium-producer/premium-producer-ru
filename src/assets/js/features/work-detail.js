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
  let loopCorrectionTimer = null;

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

  const jumpToGalleryIndex = (gallery, index) => {
    gallery.scrollTo({
      behavior: "auto",
      top: index * gallery.clientHeight,
    });
  };

  const scheduleLoopCorrection = (gallery, targetIndex, delay = 120) => {
    window.clearTimeout(loopCorrectionTimer);
    loopCorrectionTimer = window.setTimeout(() => {
      jumpToGalleryIndex(gallery, targetIndex);
    }, delay);
  };

  const syncActiveMediaIndex = (gallery) => {
    const realCount = Number(gallery.dataset.realCount || gallery.children.length);
    const rawIndex = Math.round(gallery.scrollTop / gallery.clientHeight);

    if (realCount < 2) {
      activeMediaIndex = rawIndex;
      return;
    }

    if (rawIndex === 0) {
      activeMediaIndex = realCount - 1;
      scheduleLoopCorrection(gallery, realCount);
      return;
    }

    if (rawIndex === realCount + 1) {
      activeMediaIndex = 0;
      scheduleLoopCorrection(gallery, 1);
      return;
    }

    activeMediaIndex = rawIndex - 1;
  };

  const scrollToMedia = (index) => {
    const gallery = galleryMount.querySelector(".detail-gallery");

    if (!gallery?.children.length) {
      return;
    }

    const realCount = Number(gallery.dataset.realCount || gallery.children.length);

    if (realCount < 2) {
      activeMediaIndex = 0;
      return;
    }

    const normalizedIndex = getNormalizedIndex(index, realCount);
    const targetIndex = index < 0
      ? 0
      : index >= realCount
        ? realCount + 1
        : normalizedIndex + 1;

    activeMediaIndex = normalizedIndex;
    gallery.scrollTo({
      behavior: "smooth",
      top: targetIndex * gallery.clientHeight,
    });

    if (targetIndex === 0 || targetIndex === realCount + 1) {
      scheduleLoopCorrection(gallery, normalizedIndex + 1, 380);
    }
  };

  const updateMediaControls = () => {
    const gallery = galleryMount.querySelector(".detail-gallery");
    const hasMultipleMedia = Number(gallery?.dataset.realCount || gallery?.children.length || 0) > 1;

    mediaPrevButton.hidden = !hasMultipleMedia;
    mediaNextButton.hidden = !hasMultipleMedia;
  };

  const moveMedia = (direction) => {
    scrollToMedia(activeMediaIndex + direction);
  };

  const render = () => {
    const card = cards[activeIndex];
    const visualClass = card.dataset.detailVisualClass || "";
    const galleryAssets = getCardAssets(card);
    const fallbackVisual = card.querySelector(".work-visual");
    const gallery = document.createElement("div");

    gallery.className = "detail-gallery";
    gallery.dataset.realCount = String(galleryAssets.length || (fallbackVisual ? 1 : 0));
    activeMediaIndex = 0;
    gallery.addEventListener("scroll", () => {
      syncActiveMediaIndex(gallery);
    }, { passive: true });

    const createSlide = (asset, index, isClone = false) => {
      const slide = document.createElement("figure");
      const visual = document.createElement("div");
      const img = document.createElement("img");

      slide.className = isClone ? "detail-slide detail-slide-clone" : "detail-slide";
      slide.setAttribute("aria-hidden", !isClone && index === 0 ? "false" : "true");
      visual.className = `detail-visual work-visual ${visualClass}`.trim();
      img.src = getAssetUrl(card, asset);
      img.alt = "";
      img.loading = index === 0 && !isClone ? "eager" : "lazy";
      visual.append(img);
      slide.append(visual);
      return slide;
    };

    if (galleryAssets.length > 1) {
      gallery.append(createSlide(galleryAssets[galleryAssets.length - 1], galleryAssets.length - 1, true));
    }

    galleryAssets.forEach((asset, index) => {
      const slide = createSlide(asset, index);

      gallery.append(slide);
    });

    if (galleryAssets.length > 1) {
      gallery.append(createSlide(galleryAssets[0], 0, true));
    }

    if (!gallery.children.length && fallbackVisual) {
      const clonedVisual = fallbackVisual.cloneNode(true);

      clonedVisual.removeAttribute("href");
      clonedVisual.removeAttribute("aria-label");
      clonedVisual.setAttribute("aria-hidden", "true");
      clonedVisual.classList.add("detail-visual");
      gallery.append(clonedVisual);
    }

    galleryMount.replaceChildren(gallery);
    window.requestAnimationFrame(() => {
      if (gallery.dataset.realCount > 1) {
        jumpToGalleryIndex(gallery, 1);
      }
    });
    updateMediaControls();
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
    detail.classList.remove("is-switching");
    render();
    window.requestAnimationFrame(() => {
      detail.classList.add("is-switching");
    });
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
    }
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
    }
  };

  const handleWheel = (event) => {
    const gallery = galleryMount.querySelector(".detail-gallery");

    if (!gallery || gallery.children.length < 2) {
      return;
    }

    event.preventDefault();

    if (wheelLocked || Math.abs(event.deltaY) < 14) {
      return;
    }

    wheelLocked = true;
    moveMedia(event.deltaY > 0 ? 1 : -1);

    window.setTimeout(() => {
      wheelLocked = false;
    }, 320);
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
