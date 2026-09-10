// Colour scheme toggle — warm black (default) / cream
(function () {
  const saved = localStorage.getItem('theme');
  document.documentElement.setAttribute('data-theme', saved === 'light' ? 'light' : 'dark');

  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;

    function updateLabel() {
      const light = document.documentElement.getAttribute('data-theme') === 'light';
      btn.textContent = light ? 'Dark' : 'Cream';
      btn.title = light ? 'Switch to warm black' : 'Switch to cream';
    }

    updateLabel();

    btn.addEventListener('click', function () {
      const light = document.documentElement.getAttribute('data-theme') === 'light';
      const next = light ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateLabel();
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
