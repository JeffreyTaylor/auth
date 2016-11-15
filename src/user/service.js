const users = require('./users.json'),
  _ = require('lodash');

module.exports.getUserByClientId = function (clientId) {
  return users[clientId];
};
