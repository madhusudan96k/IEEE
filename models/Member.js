const mongoose = require('mongoose');
const MemberSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true, unique: true },
  ieeeId:      { type: String, default: 'N/A' },
  department:  { type: String, required: true },
  year:        { type: String, required: true },
  status:      { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  photo:       { type: String, default: '' },        // member selfie
  certificate: { type: String, default: '' },        // IEEE certificate PDF/image
}, { timestamps: true });
module.exports = mongoose.model('Member', MemberSchema);
