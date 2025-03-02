const jwt = require('jsonwebtoken');

const authenticateUserToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' }).redirect('/');
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Forbidden' }).redirect('/');
        req.user = user;
        next();
    });
};

const authenticateAdminToken = (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) return res.status(401).json({ error: 'Unauthorized' }).redirect('/admin');
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Forbidden' }).redirect('/admin');
        if (user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' }).redirect('/admin');
        req.user = user;
        next();
    });
};


module.exports = { authenticateUserToken, authenticateAdminToken };
