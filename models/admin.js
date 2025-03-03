const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const adminSchema = new mongoose.Schema({
    adminName: { type: String, required: true },
    adminEmail: { type: String, required: true },
    adminPassword: { type: String, required: true },
    adminPhone: { type: String, required: true },
    adminStatus: { type: String, default: 'Active' },
    adminCreatedAt: { type: Date, default: Date.now },
    isBlocked: { type: Boolean, default: true },
});

adminSchema.pre('save', async function(next){
    if(this.isModified('adminPassword')){
        this.adminPassword = await bcrypt.hash(this.adminPassword, 10);
    }
    next();
})
 
module.exports = mongoose.model('admin', adminSchema);