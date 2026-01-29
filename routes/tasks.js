const express = require('express');
const { createTask, getTasks, updateTaskStatus } = require('../controllers/taskController');
const protect = require('../middleware/auth');
const router = express.Router();

router.post('/', protect(['ADMIN']), createTask);
router.get('/', protect(['ADMIN', 'EMPLOYEE']), getTasks);
router.patch('/:id/status', protect(['ADMIN', 'EMPLOYEE']), updateTaskStatus);

module.exports = router;
