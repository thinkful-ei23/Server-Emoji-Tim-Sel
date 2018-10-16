'use strict';

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  emoji: { type: String, required: true, unique: true },
  description: { type: String, required: true }
});

questionSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.password;
  }
});

module.exports = mongoose.model('Question', questionSchema);
