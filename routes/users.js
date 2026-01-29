const express = require('express');
const { getUsers, getUser, updateUserRole } = require('../controllers/userController');
const protect = require('../middleware/auth');
const router = express.Router();

router.get('/', protect(['ADMIN']), getUsers);
router.get('/:id', protect(['ADMIN']), getUser);
router.patch('/:id', protect(['ADMIN']), updateUserRole);

module.exports = router;
