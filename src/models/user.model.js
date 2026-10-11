const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
    trim: true,
    minlength: [1, 'Name cannot be empty.'],
    maxlength: [100, 'Name cannot exceed 100 characters.']
  }
}, {
  timestamps: false,
  versionKey: false,
  toJSON: {
    transform(_doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    }
  }
});

module.exports = mongoose.model('User', userSchema);
