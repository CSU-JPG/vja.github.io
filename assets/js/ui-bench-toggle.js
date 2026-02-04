export function initBenchToggle({
  sectionSelector = "#benchmarks",
} = {}) {
  const section = document.querySelector(sectionSelector);
  if (!section) return;

  const toggle = section.querySelector("[data-bench-toggle]");
  const tabsRoot = section.querySelector("[data-tabs]");
  if (!toggle || !tabsRoot) return;

  const tabs = Array.from(tabsRoot.querySelectorAll(".tabs__tab"));
  const panels = Array.from(tabsRoot.querySelectorAll(".tabs__panel"));

  const setActive = (name) => {
    // tabs 按钮状态
    tabs.forEach((t) => {
      const active = t.dataset.tab === name;
      t.setAttribute("aria-selected", active ? "true" : "false");
    });

    // panel 显隐
    panels.forEach((p) => {
      const active = p.dataset.panel === name;
      p.hidden = !active;
    });

    // toggle UI
    const isMan = name === "man";
    toggle.classList.toggle("is-man", isMan);
    toggle.querySelector(".bench-toggle__label").textContent = isMan ? "EB-Manipulation" : "EB-Navigation";
  };

  // 初始化：读当前 aria-selected
  const current = tabs.find(t => t.getAttribute("aria-selected") === "true")?.dataset.tab || "nav";
  setActive(current);

  // 点击切换
  toggle.addEventListener("click", () => {
    const now = tabs.find(t => t.getAttribute("aria-selected") === "true")?.dataset.tab || "nav";
    setActive(now === "nav" ? "man" : "nav");
  });
}
