var _ = require('lodash');
var logger = require('./logger');

module.exports.extractPGP = extractPGP;
module.exports.gmailToAscii = gmailToAscii;

function extractPGP(msg) {
  var ascii = gmailToAscii(msg)
  var lines = ascii.split('\n')
  var pgpMessages = [];

  var isPGP = false;
  var pgpMsg = []

  _.each(lines, function(line) {
    if (line.trim() === '-----BEGIN PGP MESSAGE-----') {
      isPGP = true;
      pgpMsg.push(line.trim());
    } else if (isPGP) {
      if (line.trim() === '-----END PGP MESSAGE-----') {
        pgpMsg.push(line.trim());
        pgpMessages.push(pgpMsg.join('\n'));
        isPGP = false;
        pgpMsg = [];
      } else {
        pgpMsg.push(line.trim());
      }
    }
  });

  return pgpMessages;
}

function gmailToAscii(msg) {
  if (msg.payload.parts) {
    var str = "";
    _.each(msg.payload.parts, function(part) {
      if (part.body && part.body.size > 0) {
        // could be message body or attachment
        if (part.body.attachmentId) {
          str += "SKIPPING ATTACHMENT\n"
        } else if (part.body.data) {
          str += new Buffer(part.body.data, 'base64').toString('ascii')
        }
      }
    });
    return str;
  } else if (msg.payload.body && msg.payload.body.size > 0) {
    return new Buffer(msg.payload.body.data, 'base64').toString('ascii')
  }
}
