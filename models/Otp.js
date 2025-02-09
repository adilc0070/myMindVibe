const mongoose = require("mongoose");
const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    //AFTER 20 MINUTES
    expiresAt: { type: Date, default: Date.now() + 20 * 60 * 1000 }, // 20 minutes
})

module.exports = mongoose.model('otp', otpSchema);