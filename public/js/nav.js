/* nav.js – Shared navbar, footer, theme, toast */
(function () {
  const page  = location.pathname.split('/').pop() || 'index.html';
  const links = [
    { href:'index.html',      label:'Home' },
    { href:'about.html',      label:'About' },
    { href:'team.html',       label:'Committee' },
    { href:'events.html',     label:'Events' },
    { href:'membership.html', label:'Membership' },
    { href:'gallery.html',    label:'Gallery' },
    { href:'contact.html',    label:'Contact' },
  ];

  const navHTML = `
<nav id="navbar">
  <div class="container nav-inner">
    <a class="nav-logo" href="index.html">
      <div class="nav-logo-icon">IEEE</div>
      <div class="nav-logo-text"><span>IEEE</span> SC DBATU</div>
    </a>
    <ul class="nav-links">
      ${links.map(l=>`<li><a href="${l.href}" class="${l.href===page?'active':''}">${l.label}</a></li>`).join('')}
    </ul>
    <div class="nav-actions">
      <button id="themeToggle" onclick="toggleTheme()">🌙 Dark</button>
      <a class="btn btn-primary" href="membership.html">Join IEEE</a>
      <button class="hamburger" id="hamburger" onclick="toggleMobileMenu()" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</nav>
<div id="mobileMenu">
  ${links.map(l=>`<a href="${l.href}">${l.label}</a>`).join('')}
  <a href="admin.html">🔐 Admin</a>
</div>`;

  const footerHTML = `
<section class="newsletter">
  <div class="container nl-inner">
    <div class="nl-text">
      <h2>Stay in the Loop 📡</h2>
      <p>Get updates on IEEE events, workshops, and opportunities.</p>
    </div>
    <div class="nl-form">
      <input type="email" id="nlEmail" placeholder="Enter your college email…"/>
      <button class="btn btn-accent" onclick="subscribeNL()">Subscribe →</button>
    </div>
  </div>
</section>
<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="nav-logo" style="filter:brightness(10)">
          <div class="nav-logo-icon">IEEE</div>
          <div class="nav-logo-text" style="color:#fff"><span style="color:#00a3e0">IEEE</span> SC DBATU</div>
        </div>
        <p>Dr. Babasaheb Ambedkar Technological University, Lonere, Raigad. Affiliated with IEEE Bombay Section.</p>
      </div>
      <div class="footer-col">
        <h4>Quick Links</h4>
        <a href="index.html">Home</a>
        <a href="about.html">About IEEE</a>
        <a href="team.html">Committee</a>
        <a href="events.html">Events</a>
      </div>
      <div class="footer-col">
        <h4>Resources</h4>
        <a href="membership.html">Membership</a>
        <a href="gallery.html">Gallery</a>
        <a href="contact.html">Contact</a>
        <a href="admin.html">Admin Panel</a>
      </div>
      <div class="footer-col">
        <h4>Contact</h4>
        <a href="mailto:ieee@dbatu.ac.in">ieee@dbatu.ac.in</a>
        <a>DBATU, Lonere, Raigad</a>
        <a>Maharashtra, India – 402 103</a>
        <a href="tel:+912145212323">+91 2145 212323</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© ${new Date().getFullYear()} IEEE Student Chapter DBATU. All rights reserved.</p>
      <div class="footer-socials">
        <a href="#" title="LinkedIn"><i class="fab fa-linkedin"></i></a>
        <a href="#" title="Instagram"><i class="fab fa-instagram"></i></a>
        <a href="#" title="Twitter/X"><i class="fab fa-twitter"></i></a>
        <a href="#" title="GitHub"><i class="fab fa-github"></i></a>
        <a href="#" title="YouTube"><i class="fab fa-youtube"></i></a>
      </div>
    </div>
  </div>
</footer>
<div id="toast"></div>`;

  const navEl  = document.getElementById('nav-container');
  const footEl = document.getElementById('footer-container');
  if (navEl)  navEl.innerHTML  = navHTML;
  if (footEl) footEl.innerHTML = footerHTML;

  const saved = localStorage.getItem('ieee-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = saved === 'dark' ? '☀️ Light' : '🌙 Dark';

  window.addEventListener('scroll', () => {
    document.getElementById('navbar')?.classList.toggle('scrolled', scrollY > 20);
  });
})();

function toggleTheme() {
  const html = document.documentElement;
  const dark = html.getAttribute('data-theme') === 'dark';
  const next = dark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('ieee-theme', next);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = next === 'dark' ? '☀️ Light' : '🌙 Dark';
}
function toggleMobileMenu() {
  document.getElementById('mobileMenu')?.classList.toggle('open');
  document.getElementById('hamburger')?.classList.toggle('open');
}
async function subscribeNL() {
  const input = document.getElementById('nlEmail');
  const email = input?.value?.trim();
  if (!email) { showToast('Please enter your email.', 'error'); return; }
  try {
    await API.subscribe(email);
    showToast('Subscribed! Welcome to IEEE SC DBATU updates. 📡', 'success');
    if (input) input.value = '';
  } catch(err) {
    showToast(err.message || 'Subscription failed.', 'error');
  }
}
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = `show ${type}`;
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => { t.className = ''; }, 3500);
}
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}
document.addEventListener('DOMContentLoaded', initReveal);
