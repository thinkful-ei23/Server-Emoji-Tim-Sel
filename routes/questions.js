'use strict';

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const router = express.Router();

const User = require('../models/users');
const Question = require('../models/question');

router.use(
  '/',
  passport.authenticate('jwt', { session: false, failWithError: true })
);

router.get('/', (req, res, next) => {
  console.log('We are expecting a userId? router.get, req is: ', req.user);
  const userId = req.user.id;

  User.findById(userId)
    .populate('questions.question')
    .then(user => {
      res.json(user.questions[user.head]);
    });
});

router.post('/', (req, res, next) => {
  let { answer } = req.body;

  answer = answer.toLowerCase();

  User.findById(req.user.id)
    .populate('questions.question')
    .then(user => {
      let current = user.head,
        tail = user.tail,
        next = null,
        nextNext = null,
        response = {};

      if (user.questions[current].question.description === answer) {
        user.questions[current].numberTimesCorrect++;
        response.numberTimesCorrect = user.questions[current].numberTimesCorrect;
        response.numberTimesInCorrect = user.questions[current].numberTimesInCorrect;
        user.questions[tail].next = current;
        user.tail = current;
        user.head = user.questions[current].next;
        user.questions[current].next = null;      
        response.outcome = 'Correct';
      } else {
        user.questions[current].numberTimesInCorrect++;
        response.numberTimesInCorrect = user.questions[current].numberTimesInCorrect;
        response.numberTimesCorrect = user.questions[current].numberTimesCorrect;



        next = user.questions[current].next;
        user.head = next;
        nextNext = user.questions[next].next;
        user.questions[next].next = current;
        user.questions[current].next = nextNext;
        response.outcome = 'Incorrect';
      }

      user.save();
      return response;
    })
    .then(response => res.send({ msg: response }))
    .catch(err => next(err));
});

module.exports = router;
