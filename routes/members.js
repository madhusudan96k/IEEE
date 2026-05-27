const express  = require('express');
const router   = express.Router();
const authMW   = require('../middleware/auth');
const { memberFields } = require('../middleware/upload');
const Member   = require('../models/Member');

/* GET /api/members – admin */
router.get('/', authMW, async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    res.json(await Member.find(filter).sort({ createdAt: -1 }));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

/* POST /api/members – public (self-registration with optional photo + certificate) */
router.post('/', (req, res) => {
  memberFields(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });
    const { name, email, ieeeId, department, year } = req.body;
    if (!name || !email || !department || !year)
      return res.status(400).json({ error: 'name, email, department and year are required' });

    const exists = await Member.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email already registered' });

    const data = { name, email, ieeeId: ieeeId || 'N/A', department, year };
    if (req.files?.photo)       data.photo       = req.files.photo[0].filename;
    if (req.files?.certificate) data.certificate = req.files.certificate[0].filename;

    try {
      const m = await Member.create(data);
      res.status(201).json({ message: 'Registration submitted! We will verify within 48 hours.', id: m._id });
    } catch(e) { res.status(400).json({ error: e.message }); }
  });
});

/* PATCH /api/members/:id/status – admin */
router.patch('/:id/status', authMW, async (req, res) => {
  const { status } = req.body;
  if (!['approved','rejected','pending'].includes(status))
    return res.status(400).json({ error: 'Invalid status' });
  try {
    const m = await Member.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!m) return res.status(404).json({ error: 'Member not found' });
    res.json(m);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

/* DELETE /api/members/:id – admin */
router.delete('/:id', authMW, async (req, res) => {
  try {
    const m = await Member.findByIdAndDelete(req.params.id);
    if (!m) return res.status(404).json({ error: 'Member not found' });
    res.json({ message: 'Deleted' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
