const express = require('express');
const router  = express.Router();
const authMW  = require('../middleware/auth');
const Message = require('../models/Message');

/* GET /api/messages – admin: list all messages */
router.get('/', authMW, async (req, res) => {
  try {
    const msgs = await Message.find().sort({ createdAt: -1 });
    res.json(msgs);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

/* PATCH /api/messages/:id/read – admin: mark as read */
router.patch('/:id/read', authMW, async (req, res) => {
  try {
    const m = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!m) return res.status(404).json({ error: 'Message not found' });
    res.json(m);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

/* DELETE /api/messages/:id – admin */
router.delete('/:id', authMW, async (req, res) => {
  try {
    const m = await Message.findByIdAndDelete(req.params.id);
    if (!m) return res.status(404).json({ error: 'Message not found' });
    res.json({ message: 'Message deleted' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
