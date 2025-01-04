const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    serviceName: { type: String, required: true },
    servicePrice: { type: Number, required: true },
    serviceDescription: { type: String, required: true },
    serviceImage: { type: String, required: true },
    serviceStatus: { type: String, default: 'Active' },
    serviceCreatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('service', serviceSchema);