/* events.js */
let allEvents  = [];
let evtFilter  = 'all';
let currentRegEventId = null;

document.addEventListener('DOMContentLoaded', async () => {
  await loadEvents();
  document.getElementById('evtSearch')?.addEventListener('input', renderEvents);

  // Close modal on backdrop click
  document.getElementById('regModal')?.addEventListener('click', function(e) {
    if (e.target === this) closeRegModal();
  });

  // Enter key submits registration
  ['regName','regEmail'].forEach(id => {
    document.getElementById(id)?.addEventListener('keydown', e => {
      if (e.key === 'Enter') submitRegistration();
    });
  });
});

async function loadEvents() {
  const grid = document.getElementById('eventsGrid');
  if (!grid) return;
  grid.innerHTML = '<p style="color:var(--text2)">Loading events…</p>';
  try {
    allEvents = await API.getEvents();
    renderEvents();
  } catch {
    grid.innerHTML = '<p style="color:var(--text2)">Failed to load events. Please try again.</p>';
  }
}

function setFilter(type, btn) {
  evtFilter = type;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderEvents();
}

function renderEvents() {
  const grid = document.getElementById('eventsGrid');
  if (!grid) return;
  const q = (document.getElementById('evtSearch')?.value || '').toLowerCase();

  const filtered = allEvents.filter(e => {
    const matchF = evtFilter === 'all' || e.type === evtFilter;
    const matchQ = !q || e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q);
    return matchF && matchQ;
  });

  if (!filtered.length) {
    grid.innerHTML = '<p style="color:var(--text2);grid-column:1/-1">No events found.</p>';
    return;
  }

  grid.innerHTML = filtered.map(e => `
    <div class="ev-card">
      <div class="ev-img">
        <span>${e.icon || '📅'}</span>
        <span class="ev-tag ${e.type === 'past' ? 'past' : ''}">${e.type === 'upcoming' ? 'Upcoming' : 'Past'}</span>
      </div>
      <div class="ev-body">
        <div class="ev-date">📅 ${e.date}</div>
        <div class="ev-title">${e.title}</div>
        <p class="ev-desc">${e.description}</p>
        ${e.type === 'upcoming'
          ? `<button class="btn btn-primary btn-sm" onclick="openRegModal('${e._id}','${escHtml(e.title)}','${e.icon||'📅'}')">Register Now →</button>`
          : `<button class="btn btn-outline btn-sm" disabled style="opacity:.6;cursor:default">Event Completed</button>`}
      </div>
    </div>
  `).join('');
}

/* ── Registration Modal ─────────────────────────── */
function openRegModal(eventId, eventTitle, icon) {
  currentRegEventId = eventId;
  document.getElementById('regEventTitle').textContent = eventTitle;
  document.getElementById('regIcon').textContent = icon || '📅';
  document.getElementById('regName').value  = '';
  document.getElementById('regEmail').value = '';
  document.getElementById('regError').style.display = 'none';
  document.getElementById('regSubmitBtn').disabled = false;
  document.getElementById('regSubmitBtn').textContent = 'Register Now →';
  document.getElementById('regModal').style.display = 'flex';
  setTimeout(() => document.getElementById('regName').focus(), 100);
}

function closeRegModal() {
  document.getElementById('regModal').style.display = 'none';
  currentRegEventId = null;
}

async function submitRegistration() {
  const name  = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const errEl = document.getElementById('regError');
  const btn   = document.getElementById('regSubmitBtn');

  errEl.style.display = 'none';

  if (!name)  { showRegError('Please enter your full name.'); return; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showRegError('Please enter a valid email address.');
    return;
  }
  if (!currentRegEventId) return;

  btn.disabled = true;
  btn.innerHTML = '<span style="opacity:.7">Registering…</span>';

  try {
    await API.registerParticipant({ eventId: currentRegEventId, name, email });
    closeRegModal();
    showToast('🎉 Registered successfully! Check your email for details.', 'success');
    // Refresh events to update registration count
    await loadEvents();
  } catch (e) {
    showRegError(e.message || 'Registration failed. Please try again.');
    btn.disabled = false;
    btn.textContent = 'Register Now →';
  }
}

function showRegError(msg) {
  const el = document.getElementById('regError');
  el.textContent = msg;
  el.style.display = 'block';
}

/* ── Helpers ──────────────────────────────────── */
function escHtml(s) {
  return (s || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

function showToast(msg, type = 'info') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.style.background = type === 'success' ? '#276749' : type === 'error' ? '#c53030' : '#1a202c';
  t.style.opacity = '1';
  clearTimeout(window._toastT);
  window._toastT = setTimeout(() => { t.style.opacity = '0'; }, 4000);
}
