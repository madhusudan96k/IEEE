const mongoose = require('mongoose');

const CommitteeSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  role:       { type: String, required: true },
  roleClass:  { type: String, default: '' },
  department: { type: String, required: true },
  bio:        { type: String, default: '' },
  initials:   { type: String, default: '' },
  linkedin:   { type: String, default: '#' },
  email:      { type: String, default: '#' },
  photo:      { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Committee', CommitteeSchema);
