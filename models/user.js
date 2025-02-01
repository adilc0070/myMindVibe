const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    profileStatus: { type: String, default: 'Active' },
    profileCreatedAt: { type: Date, default: Date.now },
    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    lastBookingDate: { type: Date, default: Date.now },
})

module.exports = mongoose.model('user', userSchema); 