var _ = require('lodash');

module.exports = Inbox
function Inbox(){
  this.levels = []
  this.items = [];
  this.type = null;
  this.pos = 0;
  this.level = -1;
}

Inbox.prototype.getSubjects = function() {
  var type = this.type;
  return _.map(this.items, function(t) {
    if (type === 'threads') {
      return getThreadSubject(t);
    } else if (type === 'messages') {
      return getMessageSubject(t);
    }
  });
}

Inbox.prototype.setThreads = function(threads) {
  this.setItems('threads', threads);
}

Inbox.prototype.setItems = function(type, items) {
  this.levels.push({
    type: type,
    items: items,
    pos: type === 'threads' ? 0 : items.length-1
  });
  this.down();
}

Inbox.prototype.loadLevel = function() {
  var level = this.levels[this.level];
  this.items = level.items;
  this.type = level.type;
  this.pos = level.pos;
}

Inbox.prototype.down = function() {
  ++this.level;
  this.loadLevel(this.level);
}

Inbox.prototype.up = function() {
  if (this.levels.length > 1) {
    this.levels.splice(this.level, 1);
    this.loadLevel(--this.level);
    return true;
  }
}

function getThreadSubject(t) {
  return getMessageSubject(_.last(t.messages))
}

function getMessageSubject(m) {
  return _.findWhere(m.payload.headers, {
    name: 'Subject'
  }).value
}
