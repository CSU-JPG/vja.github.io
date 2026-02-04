import { initGithubStats } from "./github-stats.js";
import { initDropdowns } from "./ui-dropdown.js";
import { initAccordions } from "./ui-accordion.js";
import { initTabs } from "./ui-tabs.js";
import { initCopyButtons } from "./ui-copy.js";
import { initCarousels } from "./ui-carousel.js";
import { initBenchTables } from "./ui-bench-table.js";
import { initBenchToggle } from "./ui-bench-toggle.js";
import { initBenchSortToggle } from "./ui-bench-sort-toggle.js";
import { initBenchEnhanceToggle } from "./ui-bench-enhance-toggle.js";




document.addEventListener("DOMContentLoaded", () => {
  initDropdowns();
  initAccordions();
  initTabs();
  initCopyButtons();
  initCarousels();
  initBenchTables();
  initBenchToggle();
  initBenchSortToggle();
  initBenchEnhanceToggle();
  initGithubStats({
    owner: "RAGEN-AI",
    repo: "RAGEN",
    starsEl: "#hero-stars-count",
    forksEl: "#hero-forks-count",
  });
});

(function () {
  const root = document.querySelector("#benchmarks");
  if (!root) return;

  const toggle = root.querySelector("[data-bench-enhance-toggle]");
  const tables = Array.from(root.querySelectorAll("[data-bench-table]"));

  // ---------- heatmap helpers ----------
  const HM_CLASSES = [
    "hm-g0","hm-g1","hm-g2","hm-g3",
    "hm-y1","hm-y2","hm-y3",
    "hm-b1","hm-b2","hm-b3",
    "hm-p1","hm-p2","hm-p3",
  ];

  function clearHeatmap(table){
    table.querySelectorAll("td.hm").forEach(td=>{
      HM_CLASSES.forEach(c=>td.classList.remove(c));
    });
  }

  // 简单的按列 min/max 分桶（0~3档），再映射到一组颜色（蓝系）
  function applyHeatmap(table){
    clearHeatmap(table);

    // 取所有 data-col（排除 Model）
    const cols = Array.from(table.querySelectorAll("thead th[data-col]"))
      .map(th => th.getAttribute("data-col"))
      .filter(Boolean);

    cols.forEach(col => {
      const cells = Array.from(table.querySelectorAll(`tbody tr td.hm[data-col="${col}"]`))
        .filter(td => td.closest("tr") && !td.closest("tr").hasAttribute("data-ignore-sort")); // 防止未来你加特殊行

      const vals = cells.map(td => parseFloat(td.dataset.val)).filter(v => Number.isFinite(v));
      if (vals.length === 0) return;

      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const span = (max - min) || 1e-9;

      cells.forEach(td=>{
        const v = parseFloat(td.dataset.val);
        if (!Number.isFinite(v)) return;

        const t = (v - min) / span; // 0~1
        // 0~3 档
        const bin = t < 0.25 ? 1 : t < 0.5 ? 2 : t < 0.75 ? 3 : 4;

        // 映射到蓝色 3 档（你也可以换成 y/p 等）
        // 1->b1, 2->b2, 3/4->b3
        td.classList.add(bin === 1 ? "hm-b1" : bin === 2 ? "hm-b2" : "hm-b3");
      });
    });
  }

  // ---------- sorting helpers ----------
  function setSortingEnabled(enabled){
    // 你原来是通过 data-bench-enhance 控制箭头/鼠标形态，这里也同步一下
    root.dataset.benchEnhance = enabled ? "true" : "false";

    // 如果你已有排序监听，这里不强行解绑（不同项目实现不一样）
    // 但至少可以“阻止点击”：
    tables.forEach(t=>{
      t.querySelectorAll("thead th[data-sort]").forEach(th=>{
        th.style.pointerEvents = enabled ? "auto" : "none";
      });
    });
  }

  // ---------- init ----------
  function refreshAll(){
    const on = root.dataset.benchEnhance !== "false";
    if (on){
      tables.forEach(applyHeatmap);
      setSortingEnabled(true);
      if (toggle) {
        toggle.setAttribute("aria-pressed","true");
        toggle.textContent = "Enhancements: On";
      }
    }else{
      tables.forEach(clearHeatmap);
      setSortingEnabled(false);
      if (toggle) {
        toggle.setAttribute("aria-pressed","false");
        toggle.textContent = "Enhancements: Off";
      }
    }
  }

  // 默认开
  if (!root.dataset.benchEnhance) root.dataset.benchEnhance = "true";

  if (toggle){
    toggle.addEventListener("click", () => {
      const cur = root.dataset.benchEnhance !== "false";
      root.dataset.benchEnhance = cur ? "false" : "true";
      refreshAll();
    });
  }

  refreshAll();
})();

