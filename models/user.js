const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    lastBookingDate: { type: Date, default: Date.now },
})

userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})


module.exports = mongoose.model('user', userSchema); 