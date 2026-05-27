require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const path      = require('path');
const mongoose  = require('mongoose');

const app = express();

/* ── Security headers ── */
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || "http://localhost:3000",  // set ALLOWED_ORIGIN in .env for live site
  credentials: true                  // allow cookies
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));
// Note: /uploads is already served by express.static('public') above — no duplicate route needed

/* ── Routes ── */
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/events',      require('./routes/events'));
app.use('/api/committee',   require('./routes/committee'));
app.use('/api/members',     require('./routes/members'));
app.use('/api/contact',     require('./routes/contact'));
app.use('/api/messages',    require('./routes/messages'));
app.use('/api/gallery',     require('./routes/gallery'));
app.use('/api/subscribers',   require('./routes/subscribers'));
app.use('/api/participants',  require('./routes/participants'));
app.use('/api/notify',      require('./routes/notify'));

/* ── Stats ── */
app.get('/api/stats', require('./middleware/auth'), async (req, res) => {
  try {
    const Event      = require('./models/Event');
    const Committee  = require('./models/Committee');
    const Member     = require('./models/Member');
    const Message    = require('./models/Message');
    const Subscriber = require('./models/Subscriber');
    const Gallery    = require('./models/Gallery');

    const [totalMembers, approvedMembers, pendingMembers,
           totalEvents, upcomingEvents, committee,
           unreadMessages, subscribers, galleryCount] = await Promise.all([
      Member.countDocuments(),
      Member.countDocuments({ status: 'approved' }),
      Member.countDocuments({ status: 'pending' }),
      Event.countDocuments(),
      Event.countDocuments({ type: 'upcoming' }),
      Committee.countDocuments(),
      Message.countDocuments({ read: false }),
      Subscriber.countDocuments({ active: true }),
      Gallery.countDocuments(),
    ]);
    res.json({ totalMembers, approvedMembers, pendingMembers,
               totalEvents, upcomingEvents, committee,
               unreadMessages, subscribers, galleryCount });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

/* ── Catch-all ── */
app.get('*', (req, res) => {
  const fs   = require('fs');
  const page = req.path.replace('/', '') || 'index';
  const file = path.join(__dirname, 'public', `${page}.html`);
  if (fs.existsSync(file)) res.sendFile(file);
  else res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* ── MongoDB ── */
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ieee_dbatu';
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('\n✅  MongoDB connected:', MONGO_URI);
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀  Running at   http://localhost:${PORT}`);
      console.log(`🔐  Admin panel  http://localhost:${PORT}/admin.html`);
      console.log(`👤  Login: ${process.env.ADMIN_USERNAME||'admin'} / ${process.env.ADMIN_PASSWORD||'ieee@DBATU#2024!'}\n`);
    });
  })
  .catch(err => { console.error('❌  MongoDB error:', err.message); process.exit(1); });
