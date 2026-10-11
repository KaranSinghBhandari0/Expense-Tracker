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


async function getSummaryForUser(userId) {
  const result = await Transaction.aggregate([
    {
      $match: { userId }
    },
    {
      $group: {
        _id: null,

        totalExpense: {
          $sum: {
            $cond: [
              { $eq: ['$type', 'expense'] },
              '$amount',
              0
            ]
          }
        },

        totalIncome: {
          $sum: {
            $cond: [
              { $eq: ['$type', 'income'] },
              '$amount',
              0
            ]
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalExpense: 1,
        totalIncome: 1
      }
    }
  ]);

  return result[0] || {
    totalExpense: 0,
    totalIncome: 0
  };
}

module.exports = { create, findById, findAllForUser, updateById, deleteById, getSummaryForUser };
