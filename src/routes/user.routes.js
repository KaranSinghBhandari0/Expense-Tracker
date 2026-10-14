const express = require('express');
const asyncHandler = require('../utils/async-handler');
const { requireAdminToken } = require('../middleware/auth.middleware');
const { validateBody } = require('../middleware/validate.middleware');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.post('/', requireAdminToken, validateBody(['name']), asyncHandler(userController.createUser));
router.get('/', requireAdminToken, asyncHandler(userController.getUsers));
router.get('/:id', asyncHandler(userController.getUser));

module.exports = router;
