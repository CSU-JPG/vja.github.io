export function initTabs() {
  const tabGroups = document.querySelectorAll("[data-tabs]");
  if (!tabGroups.length) return;

  tabGroups.forEach((group) => {
    const tabs = group.querySelectorAll(".tabs__tab[data-tab]");
    const panels = group.querySelectorAll(".tabs__panel[data-panel]");
    if (!tabs.length || !panels.length) return;

    function activate(name) {
      tabs.forEach((t) => {
        const active = t.dataset.tab === name;
        t.setAttribute("aria-selected", String(active));
        t.classList.toggle("is-active", active);
      });

      panels.forEach((p) => {
        const active = p.dataset.panel === name;
        p.hidden = !active;
      });
    }

    // 初始选中：aria-selected="true" 的 tab，或第一个
    const initial =
      Array.from(tabs).find((t) => t.getAttribute("aria-selected") === "true")?.dataset.tab ||
      tabs[0].dataset.tab;

    activate(initial);

    tabs.forEach((t) => {
      t.addEventListener("click", () => activate(t.dataset.tab));
    });
  });
}
