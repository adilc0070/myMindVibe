const mongoose = require("mongoose");

const carouselSchema = new mongoose.Schema({
    carouselImage: { type: String, required: true },
    carouselTitle: { type: String, required: true },
    carouselDescription: { type: String, required: true },
    carouselLink: { type: String, required: true },
    carouselStatus: { type: String, default: 'Active' },
    carouselCreatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('carousel', carouselSchema);