const typewriterTimeouts = new Set();

function clearTypewriterTimeouts() {
  for (const timeout of typewriterTimeouts) {
    clearTimeout(timeout);
  }
  typewriterTimeouts.clear();
}

function initTypewriter() {
  clearTypewriterTimeouts();

  const typewriterEls = document.querySelectorAll(".typewriter");

  if (typewriterEls.length === 0) {
    return;
  }

  typewriterEls.forEach((typewriterEl) => {
    const words = (typewriterEl.dataset.words || "").split(",").map((w) => w.trim()).filter(Boolean);
    if (words.length === 0) return;

    let wordIndex = 0;
    let letterIndex = 0;
    let isDeleting = false;

    const type = () => {
      const current = words[wordIndex];
      const shouldPauseAfterWord = !isDeleting && letterIndex === current.length;
      const shouldPauseAfterDelete = isDeleting && letterIndex === 0;

      if (shouldPauseAfterWord) {
        isDeleting = true;
      } else if (shouldPauseAfterDelete) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }

      const nextWord = words[wordIndex];
      const nextText = isDeleting ? nextWord.slice(0, letterIndex - 1) : nextWord.slice(0, letterIndex + 1);
      typewriterEl.textContent = nextText;

      if (isDeleting) {
        letterIndex = Math.max(0, letterIndex - 1);
      } else {
        letterIndex = Math.min(nextWord.length, letterIndex + 1);
      }

      let delay = isDeleting ? 40 : 100;
      if (shouldPauseAfterWord) delay = 1400;
      if (shouldPauseAfterDelete) delay = 500;

      const timeout = setTimeout(type, delay);
      typewriterTimeouts.add(timeout);
    };

    // Start typing a little after page load
    const timeout = setTimeout(type, 1000);
    typewriterTimeouts.add(timeout);
  });
}

window.initTypewriter = initTypewriter;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTypewriter);
} else {
  initTypewriter();
}
