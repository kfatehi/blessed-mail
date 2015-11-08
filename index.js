var Inbox = require('./lib/inbox');
var UI = require('./lib/ui');

if (process.env.USE_CACHE) {
  var threads = require('./threads');
  var ui = new UI();
  var inbox = new Inbox();
  ui.setStatus("Fetching PGP threads...")
  ui.setStatus("Loading metadata...")
  inbox.setThreads(threads);
  ui.showInbox(inbox);
} else {
  var gmail = require('./lib/gmail');
  console.log('Talking to Google...');
  gmail.authorize(function(err) {
    if (err) throw err;
    var ui = new UI();
    var inbox = new Inbox();
    ui.setStatus("Fetching PGP threads...")
    gmail.getThreads().then(function(threads) {
      ui.setStatus("Loading metadata...")
      inbox.setThreads(threads);
      ui.showInbox(inbox);
    })
  })
}
