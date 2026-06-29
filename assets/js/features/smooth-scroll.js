export function initLenisScroll() {
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
