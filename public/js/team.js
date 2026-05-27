/* team.js – renders committee with profile photos */
document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('teamGrid');
  if (!grid) return;
  grid.innerHTML = '<p style="color:var(--text2)">Loading committee…</p>';

  try {
    const committee = await API.getCommittee();
    if (!committee.length) {
      grid.innerHTML = '<p style="color:var(--text2)">No committee members found.</p>';
      return;
    }

    grid.innerHTML = committee.map(m => {
      const photoHTML = m.photo
        ? `<img src="/uploads/committee/${m.photo}" alt="${m.name}" style="width:86px;height:86px;border-radius:50%;object-fit:cover;border:4px solid var(--ieee-blue);margin:0 auto 14px;display:block"/>`
        : `<div class="avatar">${m.initials || m.name.slice(0,2).toUpperCase()}</div>`;

      return `
        <div class="team-card reveal">
          <div class="team-card-top">
            ${photoHTML}
            <div class="team-name">${m.name}</div>
            <span class="team-role ${m.roleClass || ''}">${m.role}</span>
            <div class="team-dept">${m.department}</div>
          </div>
          <div class="team-card-body">
            <p class="team-bio">${m.bio || ''}</p>
            <div class="team-socials">
              <a href="${m.linkedin || '#'}" target="_blank" title="LinkedIn"><i class="fab fa-linkedin"></i></a>
              <a href="mailto:${m.email || '#'}" title="Email"><i class="fa fa-envelope"></i></a>
            </div>
          </div>
        </div>`;
    }).join('');

    initReveal();
  } catch (err) {
    grid.innerHTML = '<p style="color:var(--text2)">Failed to load committee. Please try again.</p>';
  }
});
