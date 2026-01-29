const pool = require('../config/db');

const getUsers = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT id, name, email, role, "createdAt" FROM users');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getUser = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT id, name, email, role, "createdAt" FROM users WHERE id = $1', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateUserRole = async (req, res) => {
    const { role } = req.body;
    if (!role) {
        return res.status(400).json({ message: 'Role is required' });
    }

    try {
        const { rows } = await pool.query('UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role', [role, req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getUsers, getUser, updateUserRole };
