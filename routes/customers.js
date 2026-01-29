const express = require('express');
const {
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
} = require('../controllers/customerController');
const protect = require('../middleware/auth');

const router = express.Router();

router.route('/').get(protect(['ADMIN', 'EMPLOYEE']), getCustomers).post(protect(['ADMIN']), createCustomer);
router.route('/:id').get(protect(['ADMIN', 'EMPLOYEE']), getCustomer).put(protect(['ADMIN']), updateCustomer).delete(protect(['ADMIN']), deleteCustomer);

module.exports = router;
