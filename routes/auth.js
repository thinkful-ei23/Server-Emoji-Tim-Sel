const jwt = require('jsonwebtoken');
const express = require('express');
const passport = require('passport');

const { JWT_SECRET, JWT_EXPIRY } = require('../config');

const router = express.Router();
const localAuth = passport.authenticate('local', { session: false });
const jwtAuth = passport.authenticate('jwt', { session: false });

function createAuthToken(user) {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  });
}

// sanity check
// router.get('/login', (req, res) => {
//   res.send({msg: "Auth is up and running!"})
// })

router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

module.exports = router;
