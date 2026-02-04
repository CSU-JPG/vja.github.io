export function initCopyButtons() {
  const btns = document.querySelectorAll("[data-copy-target]");
  if (!btns.length) return;

  btns.forEach((btn) => {
    const targetSel = btn.getAttribute("data-copy-target");
    const target = targetSel ? document.querySelector(targetSel) : null;
    if (!target) return;

    btn.addEventListener("click", async () => {
      const text = target.textContent || "";
      if (!text.trim()) return;

      const oldText = btn.textContent;
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = "Copied ✓";
      } catch (err) {
        console.warn("Clipboard copy failed:", err);
        btn.textContent = "Copy failed";
      }

      setTimeout(() => {
        btn.textContent = oldText;
      }, 1600);
    });
  });
}
