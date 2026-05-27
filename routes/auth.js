const express      = require('express');
const jwt          = require('jsonwebtoken');
const rateLimit    = require('express-rate-limit');
const LoginAttempt = require('../models/LoginAttempt');
const authMW       = require('../middleware/auth');
const router       = express.Router();

const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'ieee@DBATU#2024!';
const MAX_ATT    = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5;
const LOCK_MIN   = parseInt(process.env.LOCKOUT_MINUTES)   || 15;

/* Hard rate limit – 20 requests per 15 min per IP */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many login attempts from this IP. Try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/* POST /api/auth/login */
router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;
  const ip = req.ip || req.connection.remoteAddress || 'unknown';

  if (!username || !password)
    return res.status(400).json({ error: 'Username and password required' });

  /* Check for existing lockout */
  let record = await LoginAttempt.findOne({ ip });
  if (record && record.lockedUntil && record.lockedUntil > new Date()) {
    const remaining = Math.ceil((record.lockedUntil - new Date()) / 60000);
    return res.status(429).json({
      error: `Account locked. Try again in ${remaining} minute(s).`,
      lockedUntil: record.lockedUntil,
    });
  }

  /* Validate credentials */
  const valid = username === ADMIN_USER && password === ADMIN_PASS;

  if (!valid) {
    /* Track failed attempt */
    if (!record) {
      record = await LoginAttempt.create({ ip, username, success: false, attempts: 1 });
    } else {
      record.attempts  += 1;
      record.username   = username;
      if (record.attempts >= MAX_ATT) {
        record.lockedUntil = new Date(Date.now() + LOCK_MIN * 60 * 1000);
      }
      await record.save();
    }
    const left = Math.max(0, MAX_ATT - (record?.attempts || 1));
    return res.status(401).json({
      error: `Invalid credentials. ${left} attempt(s) remaining before lockout.`,
    });
  }

  /* Success – clear attempt record */
  if (record) await LoginAttempt.deleteOne({ ip });

  const token = jwt.sign(
    { username, role: 'admin', iat: Date.now() },
    process.env.JWT_SECRET || 'ieee_secret',
    { expiresIn: '30m' }
  );

  res.json({ token, username, expiresIn: '30m' });
});

/* GET /api/auth/verify */
router.get('/verify', authMW, (req, res) => {
  res.json({ valid: true, admin: req.admin });
});

/* POST /api/auth/logout (client clears token, server logs) */
router.post('/logout', authMW, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
