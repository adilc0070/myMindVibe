const adminSchema = require("../models/admin");
const bcrypt = require("bcrypt");


const emailValidation = (email) => {
    const emailRegex =/^[^\s@]+@(gmail\.com|icloud\.com|yahoo\.com)$/
    return emailRegex.test(email);
};

const passwordValidation = (password) => {
    const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
    return passwordRegex.test(password);
};

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await adminSchema.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        res.status(200).json(admin);
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

const getRegister = async (req, res) => {
    try {
        res.render("register");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const newAdmin = async (req, res) => {
    try {
        const { email, password , name , phone } = req.body;
        if (!emailValidation(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        if (!passwordValidation(password)) {
            return res.status(400).json({ message: "Invalid password format" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newAdmin = new adminSchema({
            email,
            password: hashedPassword,
            name,
            phone,
        });
        const admin = await newAdmin.save();
        res.status(201).json(admin);
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    adminLogin,
    getLogin,
    getRegister,
    newAdmin,
};
