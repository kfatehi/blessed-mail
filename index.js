var args = require('minimist')(process.argv);

var Inbox = require('./lib/inbox');
var inbox = new Inbox(args);

var blessed = require('blessed')

// Create a screen object.
var screen = blessed.screen();

screen.title = 'blessed mail';

var list = blessed.list({
  parent: screen,
  keys: true,
  vi: true,
  mouse: true,
  style: {
    selected: {
      bg: "magenta"
    }
  }
});

var status = blessed.box({
  parent: screen,
  bottom: 0,
  right: 0,
  height: 1,
  width: 'shrink',
  style: {
    bg: 'blue'
  },
  content: 'Idle'
});

list.setItems(inbox.getSubjects());

list.on('select', function(el, index) {
  var email = inbox.getEmailAt(index);
  console.log(email.body);
})

list.focus();

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.render();
