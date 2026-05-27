const express    = require('express');
const router     = express.Router();
const authMW     = require('../middleware/auth');
const Subscriber = require('../models/Subscriber');

/* POST /api/subscribers – public (newsletter signup) */
router.post('/', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  try {
    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (!existing.active) {
        existing.active = true;
        await existing.save();
        return res.json({ message: 'Re-subscribed successfully!' });
      }
      return res.status(409).json({ error: 'This email is already subscribed.' });
    }
    await Subscriber.create({ email: email.toLowerCase() });
    res.status(201).json({ message: 'Subscribed successfully!' });
  } catch(e) { res.status(400).json({ error: e.message }); }
});

/* GET /api/subscribers – admin */
router.get('/', authMW, async (req, res) => {
  try {
    const subs = await Subscriber.find({ active: true }).sort({ createdAt: -1 });
    res.json(subs);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

/* DELETE /api/subscribers/:id – admin */
router.delete('/:id', authMW, async (req, res) => {
  try {
    const s = await Subscriber.findByIdAndDelete(req.params.id);
    if (!s) return res.status(404).json({ error: 'Subscriber not found' });
    res.json({ message: 'Removed' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
