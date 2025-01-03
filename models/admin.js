const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    adminName: { type: String, required: true },
    adminEmail: { type: String, required: true },
    adminPassword: { type: String, required: true },
    adminPhone: { type: String, required: true },
    adminStatus: { type: String, default: 'Active' },
    adminCreatedAt: { type: Date, default: Date.now },
    isBlocked: { type: Boolean, default: false },
});

module.exports = mongoose.model('admin', adminSchema);