/* home.js */
document.addEventListener('DOMContentLoaded', async () => {
  /* ── Animated counters ── */
  function animCount(el, target, suffix) {
    let cur = 0;
    const step  = target / 60;
    const timer = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = Math.floor(cur) + suffix;
      if (cur >= target) clearInterval(timer);
    }, 20);
  }

  /* Load real stats from API */
  try {
    const stats = await API.getStats();
    document.querySelectorAll('[data-count]').forEach(el => {
      const key    = el.dataset.count;
      const suffix = el.dataset.suffix || '';
      const val    = stats[key] ?? parseInt(el.dataset.target || 0);
      animCount(el, val, suffix);
    });
  } catch {
    /* Fallback to static data-target */
    document.querySelectorAll('[data-count]').forEach(el => {
      const suffix = el.dataset.suffix || '';
      animCount(el, parseInt(el.dataset.target || 0), suffix);
    });
  }
});
