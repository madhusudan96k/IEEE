const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title:         { type: String, required: true },
  date:          { type: String, required: true },
  type:          { type: String, enum: ['upcoming','past'], default: 'upcoming' },
  icon:          { type: String, default: '📅' },
  description:   { type: String, required: true },
  registrations: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
