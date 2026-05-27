const express = require('express');
const router  = express.Router();
const Message = require('../models/Message');

/* POST /api/contact – public (website contact form) */
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ error: 'name, email and message are required' });

    const msg = await Message.create({ name, email, subject: subject || 'No Subject', message });
    res.status(201).json({ message: 'Message sent successfully', id: msg._id });
  } catch(e) { res.status(400).json({ error: e.message }); }
});

module.exports = router;
