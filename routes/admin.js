const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');


const upload = require('../middlewares/multerConfig');

const bookingRoute = require('./booking');
const adminController = require('../controller/admin');
const { authenticateAdminToken, protectorAdmin } = require('../middlewares/authenticator');
const adminRoute = express();

// Middleware
adminRoute.use(bodyParser.json());
adminRoute.use(bodyParser.urlencoded({ extended: true }));
adminRoute.use(express.static(path.join(__dirname, 'public')));
adminRoute.use('/booking', authenticateAdminToken, bookingRoute)

// Set View Engine
adminRoute.set('view engine', 'ejs');
adminRoute.set('views', './views/admin');



// Admin Login
adminRoute.get('/', protectorAdmin,adminController.getLogin);
adminRoute.post('/login', adminController.adminLogin);
adminRoute.post('/register', adminController.adminRegister);

adminRoute.get('/dashboard', authenticateAdminToken, (req, res) => {
    res.render('dashboard');
});
adminRoute.get('/users', authenticateAdminToken, (req, res) => {
    res.render('users');
});

adminRoute.get('/bookings', authenticateAdminToken, (req, res) => {
    res.render('booking');
});
adminRoute.get('/programs', authenticateAdminToken, (req, res) => {
    res.render('programs');
});
adminRoute.get('/settings', authenticateAdminToken, (req, res) => {
    res.render('404');
});
adminRoute.get('/logout', (req, res) => {
    res.clearCookie('adminToken');
    res.redirect('/admin/');
});


// Multiple File Upload
adminRoute.post('/upload', upload.fields([
    { name: 'carouselImage', maxCount: 10 },
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'newsTitleImage', maxCount: 1 },
    { name: 'newsImages', maxCount: 10 },
    { name: 'invoice', maxCount: 1 },
    { name: 'servicesTitleImage', maxCount: 1 },
    { name: 'doctorImage', maxCount: 1 },
]), (req, res) => {
    try {
        res.status(200).json({
            message: 'Files uploaded successfully',
            files: req.files,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Single File Upload
adminRoute.post('/uploadsingle', upload.single('adminFile'), (req, res) => {
    try {
        res.status(200).json({
            message: 'Admin file uploaded successfully',
            file: req.file,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




// Centralized Error Handling
adminRoute.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message,
    });
});

module.exports = adminRoute;
