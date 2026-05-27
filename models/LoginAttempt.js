const mongoose = require('mongoose');
const LoginAttemptSchema = new mongoose.Schema({
  ip:         { type: String, required: true },
  username:   { type: String, default: '' },
  success:    { type: Boolean, default: false },
  attempts:   { type: Number, default: 1 },
  lockedUntil:{ type: Date, default: null },
}, { timestamps: true });
module.exports = mongoose.model('LoginAttempt', LoginAttemptSchema);
