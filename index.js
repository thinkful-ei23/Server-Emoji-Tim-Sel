'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const questions = require('./routes/questions');
const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');
const { PORT, MONGODB_URI, CLIENT_ORIGIN } = require('./config');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');
const name = require('emoji-name-map');
// const { dbConnect } = require('./db-mongoose');
passport.use(localStrategy);
passport.use(jwtStrategy);
const jwtAuth = passport.authenticate('jwt', {
  session: false,
  failWithError: true
});
const app = express();
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});
app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.use(cors());
app.use(express.json());
// sanity check
userRouter.get('/', (req, res, next) => {
  res.send({ msg: 'Server is up and running!' });
});

app.use('/api/users', userRouter);
app.use('/api', authRouter);
app.use('/api/questions', questions);
function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  // Connect to DB and Listen for incoming connections
  mongoose
    .connect(MONGODB_URI)
    .then(instance => {
      const conn = instance.connections[0];
      console.info(
        `Connected to: mongodb://${conn.host}:${conn.port}/${conn.name}`
      );
    })
    .catch(err => {
      console.error(err);
    })
    .then(() => {
      app
        .listen(PORT, function() {
          console.info(`Server listening on ${this.address().port}`);
        })
        .on('error', err => {
          console.error(err);
        });
    });
}

module.exports = { app };
