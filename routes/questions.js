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
  const userId = req.user.id;

  User.findById(userId).then(user => {
    res.json(user.questions[user.head]);
  });
});

router.post('/', (req, res, next) => {
  let { answer } = req.body;

  answer = answer.toLowerCase();
  // console.log(req.user.questions[0]);

  User.findById(req.user.id)
    .then(user => {
      const head = user.head,
        current = user.questions[head],
        end = user.questions[user.tail];
      let position = 0,
        response = '';

      console.log(head, current);

      if (current.question.description === answer) {
        position = user.tail;
        end.next = current;
        // current.next = null;
        user.tail = head;
        response = 'Correct';
      } else {
        position = 1;
        response = 'Incorrect';
      }

      user.head = current.next;

      let temp = current;
      for (let i = 0; i < position; i++) {
        let index = temp.next;

        temp = user.questions[index];
      }

      current.next = temp.next;
      temp.next = head;

      return user.save();

      //THIRD ATTEMPT
      // current.prev = end;
      // end.next = current;
      //
      // user.head = current.next;
      // user.tail = end.next;
      //
      // user.questions[user.head].prev = null;
      // user.questions[user.tail].next = null;

      //SECOND ATTEMPT
      // current.prev = end;
      // end.next = current;
      //
      // user.head = current.next;
      // user.tail = end.next;
      //
      // current.prev = null;
      // end.next = null;

      //FIRST ATTEMPT
      //reseting tail to be current question that was answer (putting question at back of the list)
      // current.prev = end;
      // end.next = current;
      // user.tail = user.head;

      //reseting head to next question
      // user.head = current.next; // same as:  user.head = user.head + 1
      // current.prev = null;
      // end.next = null;

      // return res.send({msg: "Correct"});

      // const firstItem = user.questions.shift();
      // user.questions.push(firstItem);
      // return user.save();
    })
    .then(user => res.json(user))
    .catch(err => next(err));
});

module.exports = router;
