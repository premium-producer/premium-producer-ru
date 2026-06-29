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
