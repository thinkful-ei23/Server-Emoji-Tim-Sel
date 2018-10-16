'use strict';

const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const User = require('../models/users');
const Question = require('../models/question');

router.get('/', (req, res, next) => {
  Question.find().then(results => {
    res.json(results);
  });
});

module.exports = router;
