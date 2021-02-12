const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  Promise.resolve(req.cookies.shortlyid)
  .then(hash => {
    if (!hash) {
      throw Error('No cookie found')
    }
    return model.Sessions.get({hash})
  })
  .then(session => {
    if (!session) {
      throw Error('No session found')
    }
    return session;
  })
  .catch(err => {
    return models.Sessions.create()
    .then(results => {
      return models.Sessions.get({id: results.insertId})
    })
    .then(session => {
      res.cookie('shortlyid', session.hash)
      return session
    })
  })
  .then(session => {
    req.session = session
    next()
  })
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

module.exports.verifySession = (req, res, next) => {

};