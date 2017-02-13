module.exports = {
  connections: [{
    port: 9988,
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
