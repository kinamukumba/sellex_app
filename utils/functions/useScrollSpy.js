/*
 * Scroll spy: destaca o link do header conforme o usuário rola pela página.
 *
 * - Monitora sections com id e mantém o menu sincronizado.
 * - Usa IntersectionObserver para desempenho.
 */

(function () {
  const navLinks = Array.from(document.querySelectorAll('nav .list-nav a[href^="#"]'));
  if (!navLinks.length) return;

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!sections.length) return;

  const getNavItem = (link) => link.closest('li') || link;

  const clearActive = () => {
    navLinks.forEach((link) => {
      const item = getNavItem(link);
      item.classList.remove('active');
    });
  };

  const setActive = (link) => {
    const item = getNavItem(link);
    if (!item) return;
    item.classList.add('active');
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (!visible.length) return;

      const entry = visible[0];
      const id = entry.target.getAttribute('id');
      const targetLink = navLinks.find((link) => link.getAttribute('href') === `#${id}`);

      if (!targetLink) return;

      clearActive();
      setActive(targetLink);
    },
    {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    }
  );

  sections.forEach((section) => observer.observe(section));

  // Set initial active state based on initial scroll position
  const initial = sections.find((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.4;
  });

  if (initial) {
    const initialLink = navLinks.find((link) => link.getAttribute('href') === `#${initial.id}`);
    if (initialLink) setActive(initialLink);
  }
})();
