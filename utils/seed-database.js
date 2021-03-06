'use strict';
const mongoose = require('mongoose');

const { MONGODB_URI } = require('../config');

// const User = require('../models/user');
const Question = require('../models/question');

// const seedUsers = require('../db/seed/users');
const seedQuestions = require('../db/seed/questions');

console.log(`Connecting to mongodb at ${MONGODB_URI}`);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.info('Dropping Database');
    return mongoose.connection.db.dropDatabase();
  })
  .then(() => {
    console.info('Seeding Database');
    return Promise.all([
      Question.insertMany(seedQuestions),
      Question.createIndexes()
    ]);
  })
  .then(() => {
    console.info('Disconnecting');
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    return mongoose.disconnect();
  });
