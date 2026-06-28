document.addEventListener("DOMContentLoaded", () => {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (finePointer) {
    initFleurCursor();
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
