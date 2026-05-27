const express = require('express');
const router  = express.Router();
const authMW  = require('../middleware/auth');
const Event   = require('../models/Event');

/* GET /api/events */
router.get('/', async (req, res) => {
  try {
    const filter = req.query.type && req.query.type !== 'all' ? { type: req.query.type } : {};
    const events = await Event.find(filter).sort({ createdAt: -1 });
    res.json(events);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

/* GET /api/events/:id */
router.get('/:id', async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ error: 'Event not found' });
    res.json(ev);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

/* POST /api/events – admin */
router.post('/', authMW, async (req, res) => {
  try {
    const ev = await Event.create(req.body);
    res.status(201).json(ev);
  } catch(e) { res.status(400).json({ error: e.message }); }
});

/* PUT /api/events/:id – admin */
router.put('/:id', authMW, async (req, res) => {
  try {
    const ev = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!ev) return res.status(404).json({ error: 'Event not found' });
    res.json(ev);
  } catch(e) { res.status(400).json({ error: e.message }); }
});

/* DELETE /api/events/:id – admin */
router.delete('/:id', authMW, async (req, res) => {
  try {
    const ev = await Event.findByIdAndDelete(req.params.id);
    if (!ev) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
