(() => {
  'use strict';

  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const lowPower = Number.isFinite(navigator.hardwareConcurrency) && navigator.hardwareConcurrency <= 4;
  const liteMode = reducedMotion || coarsePointer || lowPower;

  if (liteMode) root.classList.add('perf-lite');
  root.classList.add('motion-ready');

  const revealElements = [...document.querySelectorAll('[data-reveal]')];
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.style.willChange = 'transform, opacity, clip-path';
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12, rootMargin: '48px 0px -6% 0px' });

    revealElements.forEach((element) => {
      element.addEventListener('transitionend', () => {
        element.style.willChange = 'auto';
      }, { once: true });
      revealObserver.observe(element);
    });
  }

  document.querySelectorAll('[data-product-selector]').forEach((selector) => {
    const tabs = [...selector.querySelectorAll('[role="tab"]')];
    const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls'))).filter(Boolean);

    function selectTab(nextTab, moveFocus = false) {
      tabs.forEach((tab) => {
        const selected = tab === nextTab;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
      });
      panels.forEach((panel) => {
        panel.hidden = panel.id !== nextTab.getAttribute('aria-controls');
      });
      if (moveFocus) nextTab.focus();
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectTab(tab));
      tab.addEventListener('keydown', (event) => {
        let nextIndex = null;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = tabs.length - 1;
        if (nextIndex === null) return;
        event.preventDefault();
        selectTab(tabs[nextIndex], true);
      });
    });

    selectTab(tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') || tabs[0]);
  });

  const momentLinks = [...document.querySelectorAll('.play-moments a[href^="#"]')];
  const momentTargets = momentLinks
    .map((link) => ({ link, target: document.querySelector(link.getAttribute('href')) }))
    .filter(({ target }) => target);

  function markCurrentMoment(activeLink) {
    momentLinks.forEach((link) => {
      if (link === activeLink) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  momentLinks.forEach((link) => {
    link.addEventListener('click', () => markCurrentMoment(link));
  });

  if (momentTargets.length) {
    let momentFrame = 0;

    function syncCurrentMoment() {
      const navigation = document.querySelector('.play-moments');
      const navigationBottom = navigation ? navigation.getBoundingClientRect().bottom : 0;
      const marker = navigationBottom + Math.min(160, window.innerHeight * .18);
      const current = momentTargets.find(({ target }) => {
        const bounds = target.getBoundingClientRect();
        return bounds.top <= marker && bounds.bottom > marker;
      });

      if (current) markCurrentMoment(current.link);
      else momentLinks.forEach((link) => link.removeAttribute('aria-current'));
      momentFrame = 0;
    }

    function requestMomentSync() {
      if (momentFrame) return;
      momentFrame = window.requestAnimationFrame(syncCurrentMoment);
    }

    window.addEventListener('scroll', requestMomentSync, { passive: true });
    window.addEventListener('resize', requestMomentSync, { passive: true });
    requestMomentSync();
  }

  if (liteMode) return;

  const layers = [...document.querySelectorAll('[data-parallax]')];
  if (!layers.length) return;

  let frame = 0;
  let cleanupTimer = 0;

  function renderParallax() {
    const viewportCenter = window.innerHeight / 2;
    for (const layer of layers) {
      const bounds = layer.parentElement.getBoundingClientRect();
      if (bounds.bottom < -120 || bounds.top > window.innerHeight + 120) continue;
      const speed = Number(layer.dataset.parallax || 0.04);
      const center = bounds.top + bounds.height / 2;
      const offset = Math.max(-32, Math.min(32, (viewportCenter - center) * speed));
      layer.style.willChange = 'transform';
      layer.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    }
    frame = 0;
    window.clearTimeout(cleanupTimer);
    cleanupTimer = window.setTimeout(() => {
      layers.forEach((layer) => { layer.style.willChange = 'auto'; });
    }, 140);
  }

  function requestRender() {
    if (frame) return;
    frame = window.requestAnimationFrame(renderParallax);
  }

  window.addEventListener('scroll', requestRender, { passive: true });
  window.addEventListener('resize', requestRender, { passive: true });
  requestRender();
})();
