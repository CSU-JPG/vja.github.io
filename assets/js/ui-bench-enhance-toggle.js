import { initBenchTables } from "./ui-bench-table.js";

export function initBenchEnhanceToggle({
  sectionSelector = "#benchmarks",
} = {}) {
  const section = document.querySelector(sectionSelector);
  if (!section) return;

  const btn = section.querySelector("[data-bench-enhance-toggle]");
  if (!btn) return;

  // 默认开启
  if (!section.dataset.benchEnhance) section.dataset.benchEnhance = "true";

  const render = () => {
    const on = section.dataset.benchEnhance !== "false";
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.textContent = on ? "Enhancements: On" : "Enhancements: Off";
  };

  btn.addEventListener("click", () => {
    const on = section.dataset.benchEnhance !== "false";
    section.dataset.benchEnhance = on ? "false" : "true";
    render();

    // 关键：切换后刷新热力图（排序点击本身已被 gate 掉）
    initBenchTables(); // 由于 sortBound 保护，不会重复绑定事件
  });

  render();
}

// import { initBenchTables } from "./ui-bench-table.js";

// export function initBenchEnhanceToggle({
//   sectionSelector = "#benchmarks",
// } = {}) {
//   const section = document.querySelector(sectionSelector);
//   if (!section) return;

//   const btn = section.querySelector("[data-bench-enhance-toggle]");
//   if (!btn) return;

//   // 默认开启
//   if (!section.dataset.benchEnhance) section.dataset.benchEnhance = "true";

//   const render = () => {
//     const on = section.dataset.benchEnhance !== "false";
//     btn.setAttribute("aria-pressed", on ? "true" : "false");
//     btn.textContent = on ? "Enhancements: On" : "Enhancements: Off";
//   };

//   btn.addEventListener("click", () => {
//     const on = section.dataset.benchEnhance !== "false";
//     section.dataset.benchEnhance = on ? "false" : "true";
//     render();
//     initBenchTables(); // 刷新热力图/排序 gate（sortBound 会避免重复绑定）
//   });

//   render();
// }

