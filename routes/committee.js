const express = require('express');
const path    = require('path');
const fs      = require('fs');
const router  = express.Router();
const authMW  = require('../middleware/auth');
const { committeeUpload } = require('../middleware/upload');
const Committee = require('../models/Committee');

/* GET /api/committee – public */
router.get('/', async (req, res) => {
  try { res.json(await Committee.find().sort({ createdAt: 1 })); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

/* GET /api/committee/:id */
router.get('/:id', async (req, res) => {
  try {
    const m = await Committee.findById(req.params.id);
    if (!m) return res.status(404).json({ error: 'Not found' });
    res.json(m);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

/* POST /api/committee – admin */
router.post('/', authMW, (req, res) => {
  committeeUpload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });
    const data = { ...req.body };
    if (req.file) data.photo = req.file.filename;
    if (!data.initials && data.name)
      data.initials = data.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
    try {
      res.status(201).json(await Committee.create(data));
    } catch(e) { res.status(400).json({ error: e.message }); }
  });
});

/* PUT /api/committee/:id – admin */
router.put('/:id', authMW, (req, res) => {
  committeeUpload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });
    const data = { ...req.body };
    if (req.file) data.photo = req.file.filename;
    try {
      const m = await Committee.findByIdAndUpdate(req.params.id, data, { new: true });
      if (!m) return res.status(404).json({ error: 'Not found' });
      res.json(m);
    } catch(e) { res.status(400).json({ error: e.message }); }
  });
});

/* DELETE /api/committee/:id – admin */
router.delete('/:id', authMW, async (req, res) => {
  try {
    const m = await Committee.findByIdAndDelete(req.params.id);
    if (!m) return res.status(404).json({ error: 'Not found' });
    if (m.photo) {
      const fp = path.join(__dirname, '..', 'public', 'uploads', 'committee', m.photo);
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    }
    res.json({ message: 'Deleted' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
