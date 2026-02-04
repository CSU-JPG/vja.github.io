export function initDropdowns() {
  const dropdowns = document.querySelectorAll("[data-dropdown]");
  if (!dropdowns.length) return;

  function closeAll(except = null) {
    dropdowns.forEach((dd) => {
      if (dd === except) return;
      const toggle = dd.querySelector(".dropdown__toggle");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    });
  }

  dropdowns.forEach((dd) => {
    const toggle = dd.querySelector(".dropdown__toggle");
    const menu = dd.querySelector(".dropdown__menu");
    if (!toggle || !menu) return;

    // Toggle open/close
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      closeAll(dd);
      toggle.setAttribute("aria-expanded", String(!isOpen));
    });

    // Prevent clicking inside menu from closing immediately
    menu.addEventListener("click", (e) => e.stopPropagation());
  });

  // Click outside closes
  document.addEventListener("click", () => closeAll(null));

  // ESC closes
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll(null);
  });
}
