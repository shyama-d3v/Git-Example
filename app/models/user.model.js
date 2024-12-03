const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    password: { type: String },
  },
  { timestamps: true }
);
module.exports = mongoose.model('user', userSchema);
