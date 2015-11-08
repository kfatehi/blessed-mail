var _ = require('lodash');

module.exports = Inbox
function Inbox(){
  this.threads = []
}

Inbox.prototype.getSubjects = function() {
  return _.map(this.threads, function(t) {
    var lastMsg = _.last(t.messages)
    var subject = _.findWhere(lastMsg.payload.headers, {
      name: 'Subject'
    }).value
    return subject
  });
}

Inbox.prototype.getThreadAt = function(index) {
  return this.threads[index];
}

Inbox.prototype.setThreads = function(threads) {
  this.threads = threads;
}
