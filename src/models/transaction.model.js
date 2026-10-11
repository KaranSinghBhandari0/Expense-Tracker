const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'userId is required.'],
    index: true
  },
  title: {
    type: String,
    required: [true, 'Title is required.'],
    trim: true,
    minlength: [1, 'Title cannot be empty.'],
    maxlength: [200, 'Title cannot exceed 200 characters.']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required.'],
    min: [0.01, 'Amount must be greater than zero.'],
    validate: {
      validator: Number.isFinite,
      message: 'Amount must be a finite number.'
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required.'],
    trim: true,
    minlength: [1, 'Category cannot be empty.'],
    maxlength: [100, 'Category cannot exceed 100 characters.']
  },
  type: {
    type: String,
    required: [true, 'Type is required.'],
    enum: {
      values: ['income', 'expense'],
      message: 'Type must be either "income" or "expense".'
    },
    lowercase: true,
    trim: true
  }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'modifiedAt' },
  versionKey: false,
  toJSON: {
    transform(_doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.userId;
      return ret;
    }
  }
});

transactionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
