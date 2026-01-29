const pool = require('../config/db');

const createTask = async (req, res) => {
    const { title, description, assignedTo, customerId, status } = req.body;

    try {
        // Check if assignedTo user exists and is an EMPLOYEE
        const userRes = await pool.query('SELECT role FROM users WHERE id = $1', [assignedTo]);
        if (userRes.rows.length === 0 || userRes.rows[0].role !== 'EMPLOYEE') {
            return res.status(404).json({ message: 'Assigned user not found or is not an employee' });
        }

        // Check if customer exists
        const customerRes = await pool.query('SELECT id FROM customers WHERE id = $1', [customerId]);
        if (customerRes.rows.length === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const { rows } = await pool.query(
            'INSERT INTO tasks (title, description, "assignedTo", "customerId", status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, description, assignedTo, customerId, status || 'PENDING']
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getTasks = async (req, res) => {
    try {
        let query;
        const params = [];
        if (req.user.role === 'ADMIN') {
            query = `
                SELECT t.*, u.id as "userId", u.name as "userName", u.email as "userEmail", c.id as "customerId", c.name as "customerName", c.email as "customerEmail", c.phone as "customerPhone"
                FROM tasks t
                JOIN users u ON t."assignedTo" = u.id
                JOIN customers c ON t."customerId" = c.id
            `;
        } else {
            query = `
                SELECT t.*, u.id as "userId", u.name as "userName", u.email as "userEmail", c.id as "customerId", c.name as "customerName", c.email as "customerEmail", c.phone as "customerPhone"
                FROM tasks t
                JOIN users u ON t."assignedTo" = u.id
                JOIN customers c ON t."customerId" = c.id
                WHERE t."assignedTo" = $1
            `;
            params.push(req.user.id);
        }
        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateTaskStatus = async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    if (!status) {
        return res.status(400).json({ message: 'Status is required' });
    }

    try {
        const taskRes = await pool.query('SELECT "assignedTo" FROM tasks WHERE id = $1', [id]);
        if (taskRes.rows.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (req.user.role === 'EMPLOYEE' && taskRes.rows[0].assignedTo !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const { rows } = await pool.query(
            'UPDATE tasks SET status = $1, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [status, id]
        );
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createTask, getTasks, updateTaskStatus };
