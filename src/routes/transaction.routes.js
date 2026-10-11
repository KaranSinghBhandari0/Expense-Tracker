const express = require('express');
const asyncHandler = require('../utils/async-handler');
const { requireUser } = require('../middleware/auth.middleware');
const { validateBody } = require('../middleware/validate.middleware');
const transactionController = require('../controllers/transaction.controller');

const router = express.Router();

const createFields = ['title', 'amount', 'category', 'type'];
const updateFields = ['title', 'amount', 'category', 'type'];

router.get('/', requireUser, asyncHandler(transactionController.listTransactions));
router.get('/:id', asyncHandler(transactionController.getTransaction));
router.post('/', requireUser, validateBody(createFields), asyncHandler(transactionController.createTransaction));
router.patch('/:id', requireUser, validateBody(updateFields), asyncHandler(transactionController.updateTransaction));
router.put('/:id', requireUser, validateBody(updateFields), asyncHandler(transactionController.updateTransaction));
router.delete('/:id', requireUser, asyncHandler(transactionController.deleteTransaction));

module.exports = router;
