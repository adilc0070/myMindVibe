const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    about:{ type: [String], default: [] },
    profileImage: { type: String, required: true },
    proffession: { type: String, required: true },
    profileStatus: { type: String, default: 'Active' },
    profileCreatedAt: { type: Date, default: Date.now },
    
});