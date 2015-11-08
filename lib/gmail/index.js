var authorize = require('./authorize');
var search = require('./search');
var getMessage = require('./get-message');

var auth = null;

module.exports = {
  authorize: function(cb) {
    authorize(function(err, _auth) {
      if (err) return cb(err);
      auth = _auth;
      cb(null);
    });
  },
  getThreads: function() {
    return search(auth, '"--BEGIN PGP MESSAGE--"')
  },
  getMessage: function(id) {
    return getMessage(auth, id);
  }
}
