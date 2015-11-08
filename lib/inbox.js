var gmail = require('./gmail');
var Promise = require('bluebird')
var _ = require('lodash');
var bodyParser = require('./body-parser');
var pgp = require('./pgp');

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
  else if (type === 'read-plain') {
    var m = this.data;
    var from = getMessageHeader(m, 'From');
    return 'From '+from
  }
  else if (type === 'read-decrypted') {
    var m = this.data;
    var from = getMessageHeader(m, 'From');
    return '(Decrypted) From '+from
  }
}

Inbox.prototype.down = function(type, data) {
  var data = data || this.data
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

Inbox.prototype.renderMessageContent = function(mode) {
  var data = this.data;
  return new Promise(function(resolve, reject) {
    if (mode === 'plain') {
      resolve(bodyParser.gmailToAscii(data));
    } else if (mode === 'decrypt') {
      var pgpBlocks = bodyParser.extractPGP(data)
      if (pgpBlocks.length > 0) {
        return Promise.map(pgpBlocks, function(pgpMessage) {
          return pgp.decrypt(pgpMessage).catch(function(err) {
            return 'Cannot decrypt... Either you do not have the key, or your passphrase is wrong, or the message is corrupt.'
          });
        }).then(function(plaintexts) {
          resolve(plaintexts.join('\n---\n'))
        });
      } else {
        resolve("Nothing to decrypt");
      }
    }
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
