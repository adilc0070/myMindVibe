const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
    newsTitle: { type: String, required: true },
    newsDescription: { type: String, required: true },
    newsImage: { type: String, required: true },
    newsStatus: { type: String, default: 'Active' },
    newsCreatedAt: { type: Date, default: Date.now },
    newsAuthor: { type: String, required: true },
    newsCategory: { type: String, required: true },
    newsTags: { type: String, required: true },
    newsViews: { type: Number, default: 0 },
    newsLikes: { type: Number, default: 0 },
    newsDislikes: { type: Number, default: 0 },
    newsComments: { type: Number, default: 0 },
    newsShares: { type: Number, default: 0 },

});

module.exports = mongoose.model('news', newsSchema);