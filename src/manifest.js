const path = require('path'),
  common = require('./common');

module.exports = {
  connections: [{
    port: 9988,
    //tls: common.ssl,
    routes: {
      validate: {
        options: {
          language: {
            messages: {
              wrapArrays: false
            }
          },
          abortEarly: false
        }
      }
    }
  }],
  registrations: [
    {
      plugin: {
        register: './token'
      },
      options: {
        routes: {
          prefix: '/oauth2/token'
        }
      }
    }
  ]
};
