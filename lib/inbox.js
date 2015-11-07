var _ = require('lodash');

module.exports = Inbox
function Inbox(){
  this.emails = []
}

Inbox.prototype.getSubjects = function() {
  return _.pluck(this.emails, 'subject')
}

Inbox.prototype.getEmailAt = function(index) {
  return this.emails[index];
}

Inbox.prototype.refresh = function(done) {
  this.emails = [{
    subject: "stuff",
    body: "hieyehae"
  },{
    subject: "mo stuff",
    body: "walla"
  }]
  setTimeout(function() {
    done();
  }, 1000);
}
