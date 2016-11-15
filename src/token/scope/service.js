const _ = require('lodash');

module.exports.getValidScopesForUser = function (user, requested) {
  return _.intersection(user.scopes, requested);
};
