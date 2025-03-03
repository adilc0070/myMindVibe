const bcrypt=require('bcrypt')
const userSchema=require('../models/user');
const adminSchema=require('../models/Admin');

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await userSchema.findOne({ email });
    if (!user) {
        return res.status(400).json({ success: false, message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid password' });
    }
    req.session.user = user;
    req.session.isAdmin = false;
    res.redirect('/');
}

const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    const admin = await adminSchema.findOne({ email });
    if (!admin) {
        return res.status(400).json({ success: false, message: 'Admin not found' });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid password' });
    }
    req.session.user = admin;
    req.session.isAdmin = true;
    res.redirect('/admin');
}

module.exports = { login };

