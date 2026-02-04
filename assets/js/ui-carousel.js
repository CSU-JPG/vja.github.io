export function initCarousels({
  rootSelector = "[data-carousel]",
} = {}) {
  const carousels = document.querySelectorAll(rootSelector);
  if (!carousels.length) return;

  carousels.forEach((root) => {
    const track = root.querySelector(".carousel__track");
    const slides = Array.from(root.querySelectorAll(".carousel__slide"));
    const prevBtn = root.querySelector(".carousel__nav--prev");
    const nextBtn = root.querySelector(".carousel__nav--next");
    const dotsWrap = root.querySelector(".carousel__dots");

    if (!track || slides.length === 0 || !dotsWrap) return;

    let index = 0;
    let timer = null;

    const autoplay = root.getAttribute("data-autoplay") !== "false";
    const interval = Number(root.getAttribute("data-interval") || 4500);

    // build dots
    dotsWrap.innerHTML = "";
    const dots = slides.map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "carousel__dot";
      b.setAttribute("aria-label", `Go to slide ${i + 1}`);
      b.addEventListener("click", () => goTo(i, true));
      dotsWrap.appendChild(b);
      return b;
    });

    const clamp = (n) => (n + slides.length) % slides.length;

    const render = () => {
      track.style.transform = `translateX(${-index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
    };

    const goTo = (i, user = false) => {
      index = clamp(i);
      render();
      if (user) restart();
    };

    const next = () => goTo(index + 1, true);
    const prev = () => goTo(index - 1, true);

    prevBtn?.addEventListener("click", prev);
    nextBtn?.addEventListener("click", next);

    // optional: keyboard support when focused
    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    });

    const start = () => {
      if (!autoplay) return;
      stop();
      timer = window.setInterval(() => goTo(index + 1, false), interval);
    };

    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = null;
    };

    const restart = () => {
      stop();
      start();
    };

    // pause on hover/focus
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);

    // init
    root.setAttribute("tabindex", "0"); // allow keyboard events
    render();
    start();
  });
}
