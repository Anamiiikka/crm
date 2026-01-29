const pool = require('../config/db');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Public
exports.getCustomers = async (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    try {
        const countResult = await pool.query('SELECT COUNT(*) FROM customers');
        const totalRecords = parseInt(countResult.rows[0].count, 10);
        const totalPages = Math.ceil(totalRecords / limit);

        const { rows } = await pool.query('SELECT * FROM customers LIMIT $1 OFFSET $2', [limit, offset]);
        
        res.status(200).json({
            page,
            limit,
            totalRecords,
            totalPages,
            data: rows,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Public
exports.getCustomer = async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM customers WHERE id = $1', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }
        res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Create new customer
// @route   POST /api/customers
// @access  Public
exports.createCustomer = async (req, res, next) => {
    const { name, email, phone, company } = req.body;
    try {
        const { rows } = await pool.query(
            'INSERT INTO customers (name, email, phone, company) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, phone, company]
        );
        res.status(201).json({ success: true, data: rows[0] });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ success: false, message: 'Customer with that email or phone already exists' });
        }
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Public
exports.updateCustomer = async (req, res, next) => {
    const { name, email, phone, company } = req.body;
    try {
        const { rows } = await pool.query(
            'UPDATE customers SET name = $1, email = $2, phone = $3, company = $4, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
            [name, email, phone, company, req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }
        res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ success: false, message: 'Customer with that email or phone already exists' });
        }
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Public
exports.deleteCustomer = async (req, res, next) => {
    try {
        const result = await pool.query('DELETE FROM customers WHERE id = $1', [req.params.id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
