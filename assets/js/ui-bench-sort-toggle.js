export function initBenchSortToggle({
  sectionSelector = "#benchmarks",
} = {}) {
  const section = document.querySelector(sectionSelector);
  if (!section) return;

  const btn = section.querySelector("[data-bench-sort-toggle]");
  if (!btn) return;

  // 默认开启
  if (!section.dataset.sortEnabled) section.dataset.sortEnabled = "true";

  const render = () => {
    const enabled = section.dataset.sortEnabled !== "false";
    btn.setAttribute("aria-pressed", enabled ? "true" : "false");
    btn.textContent = enabled ? "Sort: On" : "Sort: Off";

    // 关闭时清理表头 aria-sort 状态，避免残留箭头
    if (!enabled) {
      section.querySelectorAll('.bench-table thead th[aria-sort]').forEach(th => {
        th.removeAttribute("aria-sort");
      });
    }
  };

  btn.addEventListener("click", () => {
    const enabled = section.dataset.sortEnabled !== "false";
    section.dataset.sortEnabled = enabled ? "false" : "true";
    render();
  });

  render();
}

