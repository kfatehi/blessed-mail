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

  var self = this;
  this.list.on('select', function(el, index) {
    var thread = self.inbox.getThreadAt(index);
    self.openThread(thread);
  })

  this.list.focus();

  // Quit on Control-C.
  this.screen.key(['C-c'], function(ch, key) {
    return process.exit(0);
  });
}

UI.prototype.setStatus = function(str) {
  this.status.setContent(str)
  this.screen.render();
}

UI.prototype.showInbox = function(inbox) {
  this.inbox = inbox;
  this.list.setItems(inbox.getSubjects());
  this.setStatus("Ready")
}

UI.prototype.openThread = function(thread) {
  this.list.hide();
}
