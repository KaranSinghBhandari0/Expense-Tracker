const Transaction = require('../models/transaction.model');

function create(data) {
  return Transaction.create(data);
}

function findById(id) {
  return Transaction.findById(id);
}

function findAllForUser(userId, limit) {
  const query = Transaction.find({ userId }).sort({ createdAt: -1 });
  if (Number.isInteger(limit)) query.limit(limit);
  return query;
}

function updateById(id, userId, changes) {
  return Transaction.findOneAndUpdate(
    { _id: id, userId },
    { $set: changes },
    { new: true, runValidators: true }
  );
}

function deleteById(id, userId) {
  return Transaction.findOneAndDelete({ _id: id, userId });
}

module.exports = { create, findById, findAllForUser, updateById, deleteById };
