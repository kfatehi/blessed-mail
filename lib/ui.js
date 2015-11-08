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

  this.textarea = blessed.box({
    parent: this.screen,
    keys: true,
    vi: true,
    mouse: true,
    scrollbar: {
      bg: 'blue'
    },
    scrollable: true,
    alwaysScroll: true
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
    self.textarea.hide();
    self.list.show();
    self.list.focus();
    self.list.select(self.inbox.pos);
    self.setStatus(inbox.statusLine());
  } else if (type === 'in') {
    self.list.hide();
    self.textarea.show();
    self.textarea.focus();
    inbox.renderMessageContent().then(function(text) {
      self.textarea.setContent(text);
      self.setStatus(inbox.statusLine());
    });
  }
}

UI.prototype.select = function(el, index) {
  if (this.inbox) {
    var self = this;
    var type = self.inbox.type;
    if (type === 'threads') {
      self.inbox.openThread(index).then(function(messages) {
        self.inbox.down('messages', messages);
        self.render();
      })
    } else if (type === 'messages') {
      self.setStatus('Fetching message body ...')
      self.inbox.openMessage(index).then(function(msg) {
        require('fs').writeFileSync('message.json', JSON.stringify(msg, null, 4));
        self.inbox.down('in', msg);
        self.render();
      });
    }
  }
}

UI.prototype.back = function() {
  if (this.inbox.up()) this.render();
}
