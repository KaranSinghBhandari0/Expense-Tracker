const transactionRepository = require('../repositories/transaction.repository');
const { isValidObjectId } = require('../utils/object-id');

function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function validateId(id) {
  if (!isValidObjectId(id)) throw httpError(400, 'Invalid transaction ID.');
}

function validateLimit(rawLimit) {
  if (rawLimit === undefined) return undefined;
  if (!/^\d+$/.test(rawLimit)) throw httpError(400, 'limit must be a positive integer.');
  const limit = Number(rawLimit);
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 1000) {
    throw httpError(400, 'limit must be between 1 and 1000.');
  }
  return limit;
}

async function listForUser(userId, rawLimit) {
  const limit = validateLimit(rawLimit);
  const [transactions, count] = await Promise.all([
    transactionRepository.findAllForUser(userId, limit),
    transactionRepository.countForUser(userId)
  ]);
  return { transactions, count };
}

async function getById(id) {
  validateId(id);
  const transaction = await transactionRepository.findById(id);
  if (!transaction) throw httpError(404, 'Transaction not found.');
  return transaction;
}

async function createForUser(userId, data) {
  return transactionRepository.create({ ...data, userId });
}

async function updateForUser(id, userId, changes) {
  validateId(id);
  if (Object.keys(changes).length === 0) {
    throw httpError(400, 'Provide at least one field to update.');
  }
  const transaction = await transactionRepository.updateById(id, userId, changes);
  if (!transaction) throw httpError(404, 'Transaction not found for this user.');
  return transaction;
}

async function deleteForUser(id, userId) {
  validateId(id);
  const transaction = await transactionRepository.deleteById(id, userId);
  if (!transaction) throw httpError(404, 'Transaction not found for this user.');
  return transaction;
}


async function getSummaryForUser(userId) {
  const summary =
    await transactionRepository.getSummaryForUser(userId);

  return {
    totalExpense: summary.totalExpense,
    totalIncome: summary.totalIncome,
    totalSavings:
      summary.totalIncome - summary.totalExpense
  };
}


module.exports = { listForUser, getById, createForUser, updateForUser, deleteForUser, getSummaryForUser };
