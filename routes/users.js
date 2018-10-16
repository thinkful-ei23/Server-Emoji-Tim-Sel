'use strict';

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const User = require('../models/users');
const Question = require('../models/question');

router.get('/', (req, res, next) => {
  User.find()
    // .populate('questions')
    .then(users => res.json(users))
    .catch(err => next(err));
});

router.post('/', (req, res, next) => {
  // console.log(req.body);
  let { username, password } = req.body;
  // const questions = [];

  // Question.find().then(results => {
  //     results.forEach(question => {
  //         // console.log(question);
  //         questions.push(question);
  //     });
  //     console.log(questions);
  // });

  // console.log(questions);

  if (!username || !password) {
    return res.status(422).json({
      code: 422,
      reason: 'Validation Error',
      message: 'Missing field'
    });
  }

  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(422).json({
      code: 422,
      reason: 'Validation Error',
      message: 'Incorrect field type: expected string'
    });
  }

  if (username !== username.trim() || password !== password.trim()) {
    return res.status(422).json({
      code: 422,
      reason: 'Validation Error',
      message: 'Cannot start or end with whitespace'
    });
  }

  if (username.length < 1) {
    return res.status(422).json({
      code: 422,
      reason: 'Validation Error',
      message: '`username` is too short'
    });
  }

  if (password.length < 6 || password.length > 72) {
    return res.status(422).json({
      code: 422,
      reason: 'Validation Error',
      message: '`password` needs to be more than 6 characters and less than 72'
    });
  }

  return (
    User.hashPassword(password)
      .then(digest => {
        return User.create({
          username,
          password: digest
        });
      })
      // do a find
      // go to the question collection, grab each item and
      // put it in the questions specific to user
      .then(user => {
        Question.find()
          .then(results => {
            results.forEach(question => {
              user.questions.push(question);
            });
            return user.save();
          })
          .then(result => {
            console.log(result);
            res
              .status(201)
              .location(`/users/${user.id}`)
              .json(user);
          });
        // res.status(201)
        //     .location(`/users/${user.id}`)
        //     .json(user);
      })
      .catch(err => {
        if (err.code === 11000) {
          return res.status(400).json({
            reason: 'Validation Error',
            message: 'The username already exists',
            location: 'username'
          });
        }
        next(err);
      })
  );
});

module.exports = router;
