const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const protect = (roles = []) => async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { rows } = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [decoded.userId]);
        
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        req.user = rows[0];

        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

module.exports = protect;
