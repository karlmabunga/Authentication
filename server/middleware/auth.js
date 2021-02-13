const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  Promise.resolve(req.cookies.shortlyid)
    .then(hash => {
      if (!hash) {
        // if no cookie -> line 22
        throw Error('No cookie found');
      }
      // get the session
      return model.Sessions.get({ hash });
    })
    .then(session => {
      if (!session) {
        // if no session -> line 22
        throw Error('No session found');
      }
      return session;
    })
    .catch(err => {
      // create a session
      return models.Sessions.create()
        .then(results => {
          // get it to pass on the session
          return models.Sessions.get({ id: results.insertId });
        })
        .then(session => {
          // send it back and set it as a cookie
          res.cookie('shortlyid', session.hash);
          return session;
        });
    })
    .then(session => {
      // attach the session to the req.session
      req.session = session;
      next();
    });
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

module.exports.verifySession = (req, res, next) => {
  // if the user is not logged in
  if (models.Sessions.isLoggedIn(req.session)) {
    // have then log in
    res.redirect('/login');
  } else {
    // move on to the next thing
    next();
  }
};