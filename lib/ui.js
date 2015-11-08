var blessed = require('blessed')

module.exports = UI;

function UI() {
  this.screen = blessed.screen();

  this.screen.title = 'blessed mail';

  this.list = blessed.list({
    parent: this.screen,
    keys: true,
    vi: true,
    mouse: true,
    style: {
      selected: {
        bg: "magenta"
      }
    }
  });

  this.status = blessed.box({
    parent: this.screen,
    bottom: 0,
    right: 0,
    height: 1,
    width: 'shrink',
    style: {
      bg: 'blue'
    }
  });

  this.list.on('select', this.select.bind(this));

  this.list.focus();

  // Quit on Control-C.
  this.screen.key(['C-c'], function(ch, key) {
    return process.exit(0);
  });

  // Go back on escape
  this.screen.key(['escape'], this.back.bind(this));
}

UI.prototype.setStatus = function(str) {
  this.status.setContent(str)
  this.screen.render();
}

UI.prototype.setInbox = function(inbox) {
  this.inbox = inbox;
};

UI.prototype.render = function() {
  var self = this;
  var inbox = self.inbox;
  var type = inbox.type;
  if (type === 'threads' || type === 'messages') {
    self.list.setItems(self.inbox.getSubjects());
    self.list.select(self.inbox.pos);
  }
  self.setStatus("Viewing "+inbox.type);
}

UI.prototype.select = function(el, index) {
  var self = this;
  var type = self.inbox.type;
  if (type === 'threads') {
    var thread = self.inbox.items[index];
    var messages = thread.messages;
    self.inbox.setItems('messages', messages);
    self.render();
  } else if (type === 'messages') {

  }
}

UI.prototype.back = function() {
  if (this.inbox.up()) this.render();
}
