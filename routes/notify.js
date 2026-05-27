const express    = require('express');
const router     = express.Router();
const nodemailer = require('nodemailer');
const authMW     = require('../middleware/auth');
const Subscriber = require('../models/Subscriber');
const Member     = require('../models/Member');
const Committee  = require('../models/Committee');

function createTransporter() {
  return nodemailer.createTransporter({
    host:   process.env.SMTP_HOST || 'smtp.gmail.com',
    port:   parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/* POST /api/notify – admin: send email blast */
router.post('/', authMW, async (req, res) => {
  const { subject, message, sendTo } = req.body;
  if (!subject || !message) return res.status(400).json({ error: 'Subject and message required' });
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS)
    return res.status(503).json({ error: 'SMTP not configured. Add SMTP_USER and SMTP_PASS to .env' });

  try {
    /* Collect recipients based on sendTo flags */
    const recipientEmails = new Set();

    if (!sendTo || sendTo.subscribers !== false) {
      const subs = await Subscriber.find({ active: true });
      subs.forEach(s => recipientEmails.add(s.email));
    }
    if (!sendTo || sendTo.members !== false) {
      const members = await Member.find({ status: 'approved' });
      members.forEach(m => recipientEmails.add(m.email));
    }
    if (!sendTo || sendTo.committee !== false) {
      const committee = await Committee.find();
      committee.forEach(c => { if (c.email && c.email !== '#') recipientEmails.add(c.email); });
    }

    if (recipientEmails.size === 0)
      return res.status(400).json({ error: 'No recipients found' });

    const transporter = createTransporter();
    const htmlBody = `
      <div style="font-family:'Source Sans 3',Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(135deg,#003f6b,#006699);padding:32px;text-align:center;border-radius:12px 12px 0 0">
          <h1 style="color:#fff;margin:0;font-size:1.6rem">IEEE Student Chapter – DBATU</h1>
          <p style="color:rgba(255,255,255,.8);margin:8px 0 0">Lonere, Raigad · Maharashtra</p>
        </div>
        <div style="background:#fff;padding:32px;border:1px solid #e0e0e0">
          <h2 style="color:#003f6b;margin-bottom:16px">${subject}</h2>
          <div style="color:#4a5568;line-height:1.8;font-size:1rem">${message.replace(/\n/g,'<br/>')}</div>
        </div>
        <div style="background:#f4f8fc;padding:20px;text-align:center;border-radius:0 0 12px 12px;border:1px solid #e0e0e0;border-top:none">
          <p style="color:#888;font-size:.85rem;margin:0">IEEE Student Chapter DBATU · ieee@dbatu.ac.in</p>
          <p style="color:#aaa;font-size:.75rem;margin:6px 0 0">You received this because you are a member or subscriber.</p>
        </div>
      </div>`;

    await transporter.sendMail({
      from:    process.env.EMAIL_FROM || `IEEE SC DBATU <${process.env.SMTP_USER}>`,
      bcc:     Array.from(recipientEmails).join(','),
      subject: `[IEEE Chapter DBATU] ${subject}`,
      html:    htmlBody,
    });

    res.json({
      message: `Email sent to ${recipientEmails.size} recipient(s)`,
      count:   recipientEmails.size,
    });
  } catch(e) {
    console.error('Email error:', e.message);
    res.status(500).json({ error: `Email failed: ${e.message}` });
  }
});

/* GET /api/notify/preview – return recipient count without sending */
router.get('/preview', authMW, async (req, res) => {
  try {
    const [subs, members, committee] = await Promise.all([
      Subscriber.countDocuments({ active: true }),
      Member.countDocuments({ status: 'approved' }),
      Committee.countDocuments(),
    ]);
    res.json({ subscribers: subs, members, committee, total: subs + members + committee });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
