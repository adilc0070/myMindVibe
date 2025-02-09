const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    lastBookingDate: { type: Date, default: Date.now },
    otp: { type: String, default: null },
})

module.exports = mongoose.model('user', userSchema); 