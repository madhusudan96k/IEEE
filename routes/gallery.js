const express = require('express');
const path    = require('path');
const fs      = require('fs');
const router  = express.Router();
const authMW  = require('../middleware/auth');
const { galleryUpload } = require('../middleware/upload');
const Gallery = require('../models/Gallery');

/* GET /api/gallery – public */
router.get('/', async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json(items);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

/* POST /api/gallery – admin only (multipart) */
router.post('/', authMW, (req, res) => {
  galleryUpload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'Photo file is required' });
    const { title, description, category } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    try {
      const item = await Gallery.create({
        title, description, category: category || 'General',
        filename: req.file.filename,
      });
      res.status(201).json(item);
    } catch(e) { res.status(400).json({ error: e.message }); }
  });
});

/* DELETE /api/gallery/:id – admin */
router.delete('/:id', authMW, async (req, res) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    /* Delete physical file */
    const filePath = path.join(__dirname, '..', 'public', 'uploads', 'gallery', item.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.json({ message: 'Deleted' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
