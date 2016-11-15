const config = require('../../common/config.json'),
  _ = require('lodash');

module.exports.supported = (grant) => {
  return _.includes(config.grants, grant);
};
