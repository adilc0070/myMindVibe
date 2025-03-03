const adminSchema = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Booking = require("../models/Booking");
const user = require("../models/user");
const { listUsers } = require("./users");

const emailValidation = (email) => {
    const emailRegex =/^[^\s@]+@(gmail\.com|icloud\.com|mindvibes\.com)$/
    return emailRegex.test(email);
};

const passwordValidation = (password) => {
    const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/ 
    return passwordRegex.test(password);
};

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await adminSchema.findOne({ adminEmail:email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        const isMatch = await bcrypt.compare(password, admin.adminPassword);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Password" });
        }
        const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie('adminToken', token, { httpOnly: true, maxAge: 3600000 });
        res.status(200).json({message: "Admin logged in successfully"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const adminRegister = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        if (!emailValidation(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const existingAdmin = await adminSchema.findOne({ adminEmail:email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }
        if (!passwordValidation(password)) {
            return res.status(400).json({ message: "Invalid password format" });
        }
        if(name.length < 3){
            return res.status(400).json({ message: "Name must be at least 3 characters long" });
        }
        if(phone.length < 10){
            return res.status(400).json({ message: "Phone number must be at least 10 digits long" });
        }
        const newAdmin = new adminSchema({
            adminEmail:email,
            adminPassword:password,
            adminName:name,
            adminPhone:phone,
        });
        const admin = await newAdmin.save();
        const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie('adminToken', token, { httpOnly: true, maxAge: 3600000 });
        res.status(201).json({message: "Admin registered successfully"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLogin = async (req, res) => {
    try {
        res.render("login");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const dashboard = async (req, res) => {
    try {
        const today = new Date();
        const todayBookings = await Booking.find({ bookingDate: today });
        const usersCount=await user.countDocuments();
        const bookingsCount=await Booking.countDocuments();
        const departmentsCount=await Department.countDocuments();
        res.render("dashboard", { todayBookings, usersCount, bookingsCount, departmentsCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    adminLogin,
    getLogin,
    adminRegister,
};
