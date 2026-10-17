const transactionService = require('../services/transaction.service');

async function listTransactions(req, res) {
  const { transactions, count } = await transactionService.listForUser(
    req.authUser._id,
    req.query.limit
  );
  return res.status(200).json({
    success: true,
    message: 'Transactions retrieved successfully.',
    data: transactions,
    meta: { count }
  });
}

async function getTransaction(req, res) {
  const transaction = await transactionService.getById(req.params.id);
  return res.status(200).json({
    success: true,
    message: 'Transaction retrieved successfully.',
    data: transaction
  });
}

async function createTransaction(req, res) {
  const transaction = await transactionService.createForUser(req.authUser._id, req.body);
  return res.status(201).json({
    success: true,
    message: 'Transaction created successfully.',
    data: transaction
  });
}

async function updateTransaction(req, res) {
  const transaction = await transactionService.updateForUser(
    req.params.id,
    req.authUser._id,
    req.body
  );
  return res.status(200).json({
    success: true,
    message: 'Transaction updated successfully.',
    data: transaction
  });
}

async function deleteTransaction(req, res) {
  const transaction = await transactionService.deleteForUser(req.params.id, req.authUser._id);
  return res.status(200).json({
    success: true,
    message: 'Transaction deleted successfully.',
    data: transaction
  });
}


async function getTransactionSummary(req, res) {
  const summary =
    await transactionService.getSummaryForUser(
      req.authUser._id
    );

  return res.status(200).json({
    success: true,
    message: 'Transaction summary retrieved successfully.',
    data: summary
  });
}


module.exports = {
  listTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary
};
