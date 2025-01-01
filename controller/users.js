const user = require("../models/users");
const slots = require("../models/slots");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new user({
            name,
            email,
            password: hashedPassword,
        });

        const user = await newUser.save();

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const bookaslot=async(req,res)=>{
    try {
        const { email, password } = req.body;
        const user = await user.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        const { date, time,plan } = req.body;
        if(!date || !time){
            return res.status(400).json({ message: "Date and time are required" });
        }
        const checkSlot = await slots.findOne({ date, time });
        if (checkSlot) {
            return res.status(400).json({ message: "Slot already booked" });
        }
        
        const newSlot = new slots({
            date,
            time,
            plan,
            user: user._id,
        });
        const slot = await newSlot.save();

        res.status(201).json({ message: "Slot booked successfully", slot });
    } catch (error) {    
        res.status(500).json({ message: error.message });
    }
}

const availableslots=async(req,res)=>{
    try {
        const slots = await slots.find();
        res.status(200).json(slots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { register, login, logout,bookaslot };