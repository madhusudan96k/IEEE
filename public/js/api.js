/* api.js – Centralised API client v3 */
const API = {
  base: '/api',

  _headers(auth = false, isForm = false) {
    const h = {};
    if (!isForm) h['Content-Type'] = 'application/json';
    if (auth) {
      const token = sessionStorage.getItem('ieee-admin-token');
      if (token) h['Authorization'] = `Bearer ${token}`;
    }
    return h;
  },

  async _req(method, path, body, auth = false, isForm = false) {
    const opts = { method, headers: this._headers(auth, isForm) };
    if (body) opts.body = isForm ? body : JSON.stringify(body);
    const res  = await fetch(this.base + path, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },

  /* Auth */
  login:  (u, p) => API._req('POST', '/auth/login', { username: u, password: p }),
  verify: ()     => API._req('GET',  '/auth/verify', null, true),
  logout: ()     => API._req('POST', '/auth/logout', {}, true),

  /* Events */
  getEvents:   (type)  => API._req('GET', `/events${type ? '?type='+type : ''}`),
  addEvent:    (d)     => API._req('POST',   '/events',       d, true),
  updateEvent: (id, d) => API._req('PUT',    `/events/${id}`, d, true),
  deleteEvent: (id)    => API._req('DELETE', `/events/${id}`, null, true),

  /* Committee */
  getCommittee:    ()       => API._req('GET', '/committee'),
  addCommittee:    (fd)     => API._req('POST',   '/committee',       fd, true, true),
  updateCommittee: (id, fd) => API._req('PUT',    `/committee/${id}`, fd, true, true),
  deleteCommittee: (id)     => API._req('DELETE', `/committee/${id}`, null, true),

  /* Members */
  registerMember: (fd)     => API._req('POST',  '/members',              fd, false, true),
  getMembers:     ()       => API._req('GET',   '/members',              null, true),
  updateStatus:   (id, s)  => API._req('PATCH', `/members/${id}/status`, { status: s }, true),
  deleteMember:   (id)     => API._req('DELETE',`/members/${id}`,        null, true),

  /* Contact */
  sendContact: (d) => API._req('POST', '/contact', d),

  /* Messages */
  getMessages:   ()   => API._req('GET',    '/messages',           null, true),
  markRead:      (id) => API._req('PATCH',  `/messages/${id}/read`, {}, true),
  deleteMessage: (id) => API._req('DELETE', `/messages/${id}`,     null, true),

  /* Gallery */
  getGallery:    ()       => API._req('GET',    '/gallery',       null),
  addGallery:    (fd)     => API._req('POST',   '/gallery',       fd, true, true),
  deleteGallery: (id)     => API._req('DELETE', `/gallery/${id}`, null, true),

  /* Subscribers */
  subscribe:         (email) => API._req('POST',   '/subscribers',      { email }),
  getSubscribers:    ()      => API._req('GET',    '/subscribers',      null, true),
  deleteSubscriber:  (id)    => API._req('DELETE', `/subscribers/${id}`,null, true),

  /* Notify */
  getNotifyPreview: ()      => API._req('GET',  '/notify/preview', null, true),
  sendNotify:       (d)     => API._req('POST', '/notify',          d, true),

  /* Stats */
  getStats: () => API._req('GET', '/stats', null, true),

  /* Participants */
  registerParticipant: (d)     => API._req('POST',   '/participants',       d),
  getParticipants:     (evId)  => API._req('GET',    `/participants${evId ? '?eventId='+evId : ''}`, null, true),
  deleteParticipant:   (id)    => API._req('DELETE', `/participants/${id}`, null, true),
};
