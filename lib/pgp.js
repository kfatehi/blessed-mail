var openpgp = require('openpgp');
var Promise = require('bluebird')
var logger = require('./logger');

module.exports.decrypt = decrypt;

console.error = function() {
  // openpgp likes to use this function. I won't allow it.
}

var key = process.env.KEY;
var privateKey = openpgp.key.readArmored(key).keys[0];
privateKey.decrypt(process.env.PASSPHRASE);

function decrypt(pgpMessage) {
  pgpMessage = openpgp.message.readArmored(pgpMessage);
  return openpgp.decryptMessage(privateKey, pgpMessage)
}
