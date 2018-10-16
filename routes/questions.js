'use strict';

const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const User = require('../models/users');
const Question = require('../models/question');
router.use(
  '/',
  passport.authenticate('jwt', { session: false, failWithError: true })
);

router.get('/', (req, res, next) => {
  Question.find().then(results => {
    // grabs the first "question" in the list
    const emoji = results[0];

    //sends it back
    res.json(emoji);
  });
});

module.exports = router;
