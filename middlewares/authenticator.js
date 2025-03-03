const jwt = require('jsonwebtoken');

const authenticateUserToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Forbidden' });
        req.user = user;
        next();
    });
};

const authenticateAdminToken = (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) return res.redirect('/admin/');
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.redirect('/admin/dashboard');
        req.user = user;
        next();
    });
};

const protectorAdmin = (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) {
        next();
        return;
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            next();
            return;
        }
        return res.redirect('/admin/dashboard');
    });
};

module.exports = { authenticateUserToken, authenticateAdminToken, protectorAdmin };
