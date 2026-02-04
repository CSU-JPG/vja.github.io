export function initAccordions({
  rootSelector = ".accordion",
  singleOpen = false,   // 你要独立开关 => 保持 false
  defaultOpen = !false,  // 初始都收起更符合“点开”
} = {}) {
  const accordions = document.querySelectorAll(rootSelector);
  if (!accordions.length) return;

  accordions.forEach((accordion) => {
    const items = Array.from(accordion.querySelectorAll("[data-accordion-item]"));
    if (!items.length) return;

    const setOpen = (item, open) => {
      const btn = item.querySelector(".accordion__btn");
      const panel = item.querySelector(".accordion__panel");
      if (!btn || !panel) return;
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      panel.hidden = !open;
    };

    // 初始化：强制对齐 aria-expanded 与 hidden
    items.forEach((item) => {
      const btn = item.querySelector(".accordion__btn");
      const panel = item.querySelector(".accordion__panel");
      if (!btn || !panel) return;

      const attr = btn.getAttribute("aria-expanded");
      const open = attr === "true" ? true : attr === "false" ? false : defaultOpen;
      setOpen(item, open);

      // 绑定点击（每个 item 都绑定一次）
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isOpen = btn.getAttribute("aria-expanded") === "true";

        if (singleOpen) {
          items.forEach((it) => setOpen(it, false));
          if (!isOpen) setOpen(item, true);
        } else {
          setOpen(item, !isOpen);  // ✅ 独立切换
        }
      });
    });
  });
}
