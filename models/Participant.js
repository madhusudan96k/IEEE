const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({
  eventId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  eventTitle:{ type: String, required: true },
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, lowercase: true, trim: true },
}, { timestamps: true });

// One person can register only once per event
ParticipantSchema.index({ eventId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('Participant', ParticipantSchema);
