const mongoose = require('mongoose');
const GallerySchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  filename:    { type: String, required: true },
  category:    { type: String, default: 'General' },
}, { timestamps: true });
module.exports = mongoose.model('Gallery', GallerySchema);
