var Promise = require('bluebird')
var _ = require('lodash');

module.exports.parse = parse;

function parse(msg) {
  return new Promise(function(resolve, reject) {
    resolve(gmailToAscii(msg))
  });
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
