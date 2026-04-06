// Dark mode toggle
(function () {
  const saved = localStorage.getItem('theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);

  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;

    function updateIcon() {
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      btn.textContent = dark ? '\u2600' : '\u263E';
      btn.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
    }

    updateIcon();

    btn.addEventListener('click', function () {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const next = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateIcon();
    });
  });
})();

// Lightbox for profile image
document.addEventListener('DOMContentLoaded', function () {
  var img = document.querySelector('.profile-img');
  var lightbox = document.querySelector('.lightbox');
  if (!img || !lightbox) return;

  img.addEventListener('click', function () {
    lightbox.classList.add('active');
  });

  lightbox.addEventListener('click', function () {
    lightbox.classList.remove('active');
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') lightbox.classList.remove('active');
  });
});
