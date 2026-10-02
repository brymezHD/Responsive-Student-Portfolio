// Shared on every page: mobile menu toggle and footer year.
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');
function setMenu(open) {
  nav.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
}
toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); toggle.focus(); }
});
document.getElementById('year').textContent = new Date().getFullYear();
