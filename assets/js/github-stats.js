function formatCount(n) {
  if (typeof n !== "number") return "—";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}

export async function initGithubStats({
  owner,
  repo,
  starsEl = "#hero-stars-count",
  forksEl = "#hero-forks-count",
} = {}) {
  if (!owner || !repo) return;

  const starsNode = document.querySelector(starsEl);
  const forksNode = document.querySelector(forksEl);
  if (!starsNode && !forksNode) return;

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        // 有些环境会需要 UA，尽量兼容
        Accept: "application/vnd.github+json",
      },
    });

    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const data = await res.json();

    if (starsNode) starsNode.textContent = formatCount(data.stargazers_count);
    if (forksNode) forksNode.textContent = formatCount(data.forks_count);
  } catch (err) {
    // 失败就保持默认 “—”
    console.warn("Failed to fetch GitHub stats:", err);
  }
}
