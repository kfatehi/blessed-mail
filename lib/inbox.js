var gmail = require('./gmail');
var Promise = require('bluebird')
var _ = require('lodash');
var bodyParser = require('./body-parser');

var util = require('util');
var fs = require('fs');
var logStream = fs.createWriteStream('/tmp/log.txt', {'flags': 'a'});
log = function() {
  for (key in arguments) {
    logStream.write(util.inspect(arguments[key]));
    logStream.write(' ');
  }
  logStream.write('\n');
}

log('test');

module.exports = Inbox
function Inbox(){
  this.levels = []
  this.data = [];
  this.type = null;
  this.pos = 0;
}

Inbox.prototype.getSubjects = function() {
  var type = this.type;
  return _.map(this.data, function(t) {
    if (type === 'threads') {
      return getThreadSubject(t);
    } else if (type === 'messages') {
      return getMessageHeader(t, 'Subject');
    }
  });
}

Inbox.prototype.statusLine = function() {
  var type = this.type;
  if (type === 'threads' || type === 'messages') {
    return 'Viewing '+this.type;
  }
  if (type === 'in') {
    var m = this.data;
    var from = getMessageHeader(m, 'From');
    return 'From '+from
  }
  if (type === 'out') {
    return 'Writing response'
  }
}

Inbox.prototype.down = function(type, data) {
  this.levels.push({
    type: type,
    data: data,
    pos: type === 'threads' ? 0 : data.length-1
  });
  this.loadLevel();
}

Inbox.prototype.loadLevel = function() {
  var level = _.last(this.levels);
  this.data = level.data;
  this.type = level.type;
  this.pos = level.pos;
  log('LOAD LEVEL. POS=', level.pos);
}

Inbox.prototype.up = function() {
  if (this.levels.length > 1) {
    this.levels.pop();
    this.loadLevel();
    return true;
  }
}

Inbox.prototype.saveCursorPosition = function(pos) {
  _.last(this.levels).pos = pos
}

Inbox.prototype.openThread = function(index) {
  this.saveCursorPosition(index);
  var thread = this.data[index];
  return new Promise(function(resolve, reject) {
    resolve(thread.messages);
  });
}

Inbox.prototype.openMessage = function(index) {
  this.saveCursorPosition(index);
  var item = this.data[index];
  return new Promise(function(resolve, reject) {
    var cachedMessage = item._cachedMessage;
    if (cachedMessage) return resolve(cachedMessage);
    else {
      resolve(gmail.getMessage(item.id).then(function(msg) {
        item._cachedMessage = msg;
        return msg;
      }))
    }
  });
}

Inbox.prototype.renderMessageContent = function() {
  return bodyParser.parse(this.data).then(function(content) {
    return content
  });
}

function getThreadSubject(t) {
  return getMessageHeader(_.last(t.messages), 'Subject')
}

function getMessageHeader(m, name) {
  return _.findWhere(m.payload.headers, {
    name: name
  }).value
}
