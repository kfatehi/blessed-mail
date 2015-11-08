var Promise = require('bluebird');
var _ = require('lodash');
var google = require('googleapis');
var gmail = google.gmail('v1');

// need offset, limit, etc
module.exports = function(auth, query, callback) {
  return new Promise(function(resolve, reject) {
    gmail.users.threads.list({
      auth: auth,
      userId: 'me',
      q: query
    }, function(err, response) {
      if (err) return reject(err);
      resolve(response.threads);
    })
  }).then(function(threads) {
    return Promise.map(threads, function(thread) {
      return getThreadMetadata(auth, thread.id);
    })
  })
}

function getThreadMetadata(auth, id) {
  return new Promise(function(resolve, reject) {
    gmail.users.threads.get({
      auth: auth,
      id: id,
      userId: 'me',
      format: 'metadata'
    }, function(err, response) {
      if (err) return reject(err);
      resolve(response);
    })
  })
}
