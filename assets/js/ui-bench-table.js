// export function initBenchTables({
//   tableSelector = "[data-bench-table]",
// } = {}) {
//   document.querySelectorAll(tableSelector).forEach((table) => {
//     applyHeatmap(table);
//     const section = table.closest("#benchmarks");
// if (section && section.dataset.benchEnhance === "false") return;

//     enableSort(table);
//   });
// }

// /* ---------- Heatmap ---------- */
// /**
//  * 让每列按该列 min/max 自动上色（淡色块，接近截图风格）
//  * 列配色：avg->灰，base/long->米色，common->绿，complex->蓝，visual->粉
//  */
// function applyHeatmap(table) {
//     const section = table.closest("#benchmarks");
//     if (section && section.dataset.benchEnhance === "false") {
//     table.querySelectorAll("td.hm").forEach(td => {
//         td.style.backgroundColor = "";
//         td.style.color = "";
//     });
//     return;
//     }

//     const enabled = !section || section.dataset.benchEnhance !== "false";

//     const cellsAll = Array.from(table.querySelectorAll("td.hm"));

//   if (!enabled) {
//     // 关闭：清空热力图样式
//     cellsAll.forEach(td => {
//       td.style.backgroundColor = "";
//       td.style.color = "";
//     });
//     return;
//   }  
//   const hueByCol = {
//     avg: 215,      // gray-blue
//     base: 32,      // beige
//     common: 140,   // green
//     complex: 215,  // blue
//     visual: 330,   // pink
//     long: 32,      // beige
//   };

//   const cols = Object.keys(hueByCol);

//   cols.forEach((col) => {
//     const cells = Array.from(table.querySelectorAll(`td.hm[data-col="${col}"]`));
//     if (!cells.length) return;

//     const values = cells
//       .map((td) => Number(td.dataset.val))
//       .filter((v) => Number.isFinite(v));

//     if (!values.length) return;

//     const min = Math.min(...values);
//     const max = Math.max(...values);
//     const range = Math.max(1e-9, max - min);

//     cells.forEach((td) => {
//       const v = Number(td.dataset.val);
//       if (!Number.isFinite(v)) return;

//       const t = (v - min) / range; // 0..1
//       const hue = hueByCol[col];

//       // pastel block: lightness 从 92 -> 72（值越大颜色越实）
//       const light = 92 - t * 18;
//       const sat = 55;

//       td.style.backgroundColor = `hsl(${hue} ${sat}% ${light}%)`;
//       td.style.color = "rgba(0,0,0,0.78)";
//     });
//   });
// }

// /* ---------- Sorting ---------- */
// function enableSort(table) {
//     if (table.dataset.sortBound === "true") return;
//   table.dataset.sortBound = "true";  
//   const thead = table.querySelector("thead");
//   const tbody = table.querySelector("tbody");
//   if (!thead || !tbody) return;

//   const headers = Array.from(thead.querySelectorAll("th[data-sort]"));
//   if (!headers.length) return;

//   const clearSortState = () => {
//     headers.forEach((h) => h.removeAttribute("aria-sort"));
//   };

//   const getCellValue = (row, colIndex, type) => {
//     const cell = row.children[colIndex];
//     if (!cell) return type === "num" ? -Infinity : "";
//     if (type === "num") {
//       // 优先用 data-val，其次用文本
//       const dv = cell.dataset?.val;
//       const v = dv != null ? Number(dv) : Number(cell.textContent.trim());
//       return Number.isFinite(v) ? v : -Infinity;
//     }
//     return cell.textContent.trim().toLowerCase();
//   };

//   headers.forEach((th, colIndex) => {
//     th.addEventListener("click", () => {
//       const section = table.closest("#benchmarks");
//       if (section && section.dataset.benchEnhance === "false") return;
//       const type = th.dataset.sort; // "num" | "text"
//       const current = th.getAttribute("aria-sort");
//       const next = current === "ascending" ? "descending" : "ascending";

//       clearSortState();
//       th.setAttribute("aria-sort", next);

//       const rows = Array.from(tbody.querySelectorAll("tr"));
//       rows.sort((a, b) => {
//         const va = getCellValue(a, colIndex, type);
//         const vb = getCellValue(b, colIndex, type);

//         if (va < vb) return next === "ascending" ? -1 : 1;
//         if (va > vb) return next === "ascending" ? 1 : -1;
//         return 0;
//       });

//       rows.forEach((r) => tbody.appendChild(r));

//       // 排序后重新上色（min/max 可能变化，但更一致）
//       applyHeatmap(table);
//     });
//   });
// }
// assets/js/ui-bench-table.js

export function initBenchTables({
  tableSelector = "[data-bench-table]",
  sectionSelector = "#benchmarks",
} = {}) {
  document.querySelectorAll(tableSelector).forEach((table) => {
    const section = table.closest(sectionSelector);
    const enhanceOn = !section || section.dataset.benchEnhance !== "false";

    // Heatmap: on/off
    applyHeatmap(table, enhanceOn);

    // Sorting: on/off
    if (!enhanceOn) {
      // 关掉增强时，顺手清掉排序箭头状态（避免残留 ▲▼）
      table.querySelectorAll('thead th[aria-sort]').forEach((th) => th.removeAttribute("aria-sort"));
      return; // 不绑定排序
    }

    enableSort(table, sectionSelector);
  });
}
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/* ---------- Heatmap ---------- */
/**
 * 每列按该列 min/max 自动上色（淡色块）
 * 列配色：avg->灰蓝，base/long->米色，common->绿，complex->蓝，visual->粉
 */
function applyHeatmap(table, enhanceOn = true) {
  const cellsAll = Array.from(table.querySelectorAll("td.hm"));

  if (!enhanceOn) {
    // 关闭：清空热力图样式
    cellsAll.forEach((td) => {
      td.style.backgroundColor = "";
      td.style.color = "";
    });
    return;
  }

  const hueByCol = {
    avg: 215,      // gray-blue
    base: 32,      // beige
    common: 140,   // green
    complex: 215,  // blue
    visual: 330,   // pink
    long: 32,      // beige
  };

  const cols = Object.keys(hueByCol);

  cols.forEach((col) => {
    const cells = Array.from(table.querySelectorAll(`td.hm[data-col="${col}"]`));
    if (!cells.length) return;

    const values = cells
      .map((td) => Number(td.dataset.val))
      .filter((v) => Number.isFinite(v));

    if (!values.length) return;

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(1e-9, max - min);

    cells.forEach((td) => {
      const v = Number(td.dataset.val);
      if (!Number.isFinite(v)) return;

      const t = (v - min) / range; // 0..1
      const hue = hueByCol[col];

      // pastel block: 值越大颜色越实
      const light = 92 - t * 18; // 92 -> 74
      const sat = 55;

      td.style.backgroundColor = `hsl(${hue} ${sat}% ${light}%)`;
      td.style.color = "rgba(0,0,0,0.78)";
    });
  });
}

/* ---------- Sorting ---------- */
function enableSort(table, sectionSelector = "#benchmarks") {
  // 防止重复绑定（你点开关会重复 init）
  if (table.dataset.sortBound === "true") return;
  table.dataset.sortBound = "true";

  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");
  if (!thead || !tbody) return;

  const headers = Array.from(thead.querySelectorAll("th[data-sort]"));
  if (!headers.length) return;

  const clearSortState = () => {
    headers.forEach((h) => h.removeAttribute("aria-sort"));
  };

  const getCellValue = (row, colIndex, type) => {
    const cell = row.children[colIndex];
    if (!cell) return type === "num" ? -Infinity : "";

    if (type === "num") {
      // 优先用 data-val，其次用文本
      const dv = cell.dataset?.val;
      const v = dv != null ? Number(dv) : Number(cell.textContent.trim());
      return Number.isFinite(v) ? v : -Infinity;
    }
    return cell.textContent.trim().toLowerCase();
  };

  headers.forEach((th, colIndex) => {
    th.addEventListener("click", () => {
      // 运行时再读一次开关状态（确保 off 时点击无效）
      const section = table.closest(sectionSelector);
      if (section && section.dataset.benchEnhance === "false") return;

      const type = th.dataset.sort; // "num" | "text"
      const current = th.getAttribute("aria-sort");
      const next = current === "ascending" ? "descending" : "ascending";

      clearSortState();
      th.setAttribute("aria-sort", next);

      const rows = Array.from(tbody.querySelectorAll("tr"));
      rows.sort((a, b) => {
        const va = getCellValue(a, colIndex, type);
        const vb = getCellValue(b, colIndex, type);

        if (va < vb) return next === "ascending" ? -1 : 1;
        if (va > vb) return next === "ascending" ? 1 : -1;
        return 0;
      });

      rows.forEach((r) => tbody.appendChild(r));

      // 排序后重新上色（min/max 可能变化）
      applyHeatmap(table, true);
    });
  });
}
//==========================================================================

// export function initBenchTables({
//   tableSelector = "[data-bench-table]",
//   sectionSelector = "#benchmarks",
// } = {}) {
//   const section = document.querySelector(sectionSelector);
//   const enhanceOn = !section || section.dataset.benchEnhance !== "false";

//   document.querySelectorAll(tableSelector).forEach((table) => {
//     // 热力图：开则上色，关则清空
//     applyHeatmap(table, enhanceOn);

//     // 排序：只绑定一次；点击时再按 enhanceOn gate
//     enableSort(table, () => {
//       const sec = table.closest(sectionSelector);
//       return !sec || sec.dataset.benchEnhance !== "false";
//     });

//     // 如果关了增强，把表头 aria-sort 清掉（避免残留箭头状态）
//     if (!enhanceOn) clearAriaSort(table);
//   });
// }

// /* ---------- Helpers ---------- */
// function clearAriaSort(table) {
//   const headers = table.querySelectorAll("thead th[data-sort]");
//   headers.forEach((h) => h.removeAttribute("aria-sort"));
// }

// /* ---------- Heatmap ---------- */
// function applyHeatmap(table, enabled) {
//   const cellsAll = Array.from(table.querySelectorAll("td.hm"));

//   if (!enabled) {
//     cellsAll.forEach((td) => {
//       td.style.backgroundColor = "";
//       td.style.color = "";
//     });
//     return;
//   }

//   // 每列 min/max 自动上色（pastel）
//   // 你可以把 col 名字换成你真实的列：I1..I15 / ALL 等
//   const hueByCol = {
//     i1: 215,
//     i2: 32,
//     i3: 140,
//     i4: 215,
//     i5: 330,
//     all: 32,
//   };

//   Object.keys(hueByCol).forEach((col) => {
//     const cells = Array.from(table.querySelectorAll(`td.hm[data-col="${col}"]`));
//     if (!cells.length) return;

//     const values = cells
//       .map((td) => Number(td.dataset.val))
//       .filter((v) => Number.isFinite(v));

//     if (!values.length) return;

//     const min = Math.min(...values);
//     const max = Math.max(...values);
//     const range = Math.max(1e-9, max - min);

//     const hue = hueByCol[col];
//     const sat = 55;

//     cells.forEach((td) => {
//       const v = Number(td.dataset.val);
//       if (!Number.isFinite(v)) return;

//       const t = (v - min) / range; // 0..1
//       const light = 92 - t * 18;

//       td.style.backgroundColor = `hsl(${hue} ${sat}% ${light}%)`;
//       td.style.color = "rgba(0,0,0,0.78)";
//     });
//   });
// }

// /* ---------- Sorting ---------- */
// function enableSort(table, canSort) {
//   if (table.dataset.sortBound === "true") return;
//   table.dataset.sortBound = "true";

//   const thead = table.querySelector("thead");
//   const tbody = table.querySelector("tbody");
//   if (!thead || !tbody) return;

//   const headers = Array.from(thead.querySelectorAll("th[data-sort]"));
//   if (!headers.length) return;

//   const clearSortState = () => {
//     headers.forEach((h) => h.removeAttribute("aria-sort"));
//   };

//   const getCellValue = (row, colIndex, type) => {
//     const cell = row.children[colIndex];
//     if (!cell) return type === "num" ? -Infinity : "";
//     if (type === "num") {
//       const dv = cell.dataset?.val;
//       const v = dv != null ? Number(dv) : Number(cell.textContent.trim());
//       return Number.isFinite(v) ? v : -Infinity;
//     }
//     return cell.textContent.trim().toLowerCase();
//   };

//   headers.forEach((th, colIndex) => {
//     th.addEventListener("click", () => {
//       if (!canSort()) return;

//       const type = th.dataset.sort; // "num" | "text"
//       const current = th.getAttribute("aria-sort");
//       const next = current === "ascending" ? "descending" : "ascending";

//       clearSortState();
//       th.setAttribute("aria-sort", next);

//       const rows = Array.from(tbody.querySelectorAll("tr"));
//       rows.sort((a, b) => {
//         const va = getCellValue(a, colIndex, type);
//         const vb = getCellValue(b, colIndex, type);

//         if (va < vb) return next === "ascending" ? -1 : 1;
//         if (va > vb) return next === "ascending" ? 1 : -1;
//         return 0;
//       });

//       rows.forEach((r) => tbody.appendChild(r));

//       // 排序后重新上色（min/max 随排序无关，但保持一致）
//       applyHeatmap(table, true);
//     });
//   });
// }
