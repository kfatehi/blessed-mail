var fs = require('fs');
var logStream = fs.createWriteStream('/tmp/log.txt', {'flags': 'a'});
module.exports.log = function() {
  for (key in arguments) {
    logStream.write(arguments[key]);
    logStream.write(' ');
  }
  logStream.write('\n');
}
