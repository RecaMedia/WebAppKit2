const jwt = require('jsonwebtoken');
const access = require('./access-keys');

module.exports = {
  encrypt: function(str) {
    let tokenStr = access.key+":"+str;
    return jwt.sign({token:tokenStr}, access.secret);
  },
  decrypt: function(token) {
    let decoded = jwt.verify(token, access.secret);
    let parts = decoded.token.split(":");
    if (parts[0] == access.key) {
      return true;
    } else {
      return false;
    }
  },
  basicEnc: function(str) {
    return Buffer.from(str).toString('base64');
  },
  basicDec: function(encrypted_str) {
    return Buffer.from(encrypted_str, 'base64').toString();
  }
}