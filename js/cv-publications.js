(function () {
  document.addEventListener('DOMContentLoaded', async function () {
    const container = document.getElementById('cv-publications');
    if (!container) return;

    try {
      const res = await fetch('publications.html', { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const text = await res.text();
      const doc = new DOMParser().parseFromString(text, 'text/html');
      const items = doc.querySelectorAll('.container .item');

      items.forEach(function (item) {
        const clone = item.cloneNode(true);
        const meta = clone.querySelector('.meta');
        if (meta) meta.textContent = meta.textContent.replace(/\s*·\s*/g, ', ');
        container.appendChild(clone);
      });

      container.setAttribute('data-loaded', 'true');
    } catch (e) {
      container.setAttribute('data-loaded', 'error');
      console.warn('cv-publications: failed to load publications.html', e);
    }
  });
})();
