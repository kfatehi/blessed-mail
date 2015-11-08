var Promise = require('bluebird');
var _ = require('lodash');
var google = require('googleapis');
var gmail = google.gmail('v1');

module.exports = function(auth, id) {
  return new Promise(function(resolve, reject) {
    gmail.users.messages.get({
      auth: auth,
      id: id,
      userId: 'me'
    }, function(err, response) {
      if (err) return reject(err);
      resolve(response);
    })
  })
}
