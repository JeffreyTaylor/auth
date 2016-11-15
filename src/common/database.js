const Sequelize = require('sequelize'),
  config = require('./config.json').database,
  extend = require('lodash').extend;

const instance = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

module.exports = extend(
  instance,
  {
    trySync: (args) => instance
    .sync(args)
    .catch(raise)
  }
);

function raise(e) {
  throw e;
}
