const _ = require('lodash'),
  Joi = require('joi'),
  userService = require('../user/service'),
  bearerTokenService = require('./bearer/service'),
  refreshTokenService = require('./refresh/service'),
  grant = require('./grant/service'),
  repo = require('./repository');

exports.register = function (server, options, next) {

  server.route({
      path: '/',
      method: 'POST',
      config: {
        validate: {
          payload: Joi.object({
            client_id: Joi.string(),
            grant_type: Joi.string(),
            scope: Joi.string().allow(''),
            refresh_token: Joi.string()
          }).required()
        }
      },
      handler: (request, reply) => {

        const clientId = request.payload.client_id,
          refreshToken = request.payload.refresh_token,
          requestedGrant = request.payload.grant_type,
          scopeString = request.payload.scope || "",
          user = userService.getUserByClientId(clientId),
          requestedScopes = scopeString.split(/\s+/g);

        if (!user) {
          return reply({error: 'unauthorized_client'}).code(401);
        }

        if (!grant.supported(requestedGrant)) {
          return reply({error: 'unsupported_grant_type'}).code(400);
        }

        if (requestedGrant === 'refresh_token') {
          return refreshTokenService.refreshWithToken(refreshToken)
          .then((result) => {
            return reply(result);
          })
          .catch((error) => {
            if (error.error === 'invalid_request') {
              return reply(error).code(400);
            } else {
              return reply({error: error}).code(500);
            }
          })
        } else {
          return bearerTokenService.generateAndSaveToken(
            clientId, user, requestedGrant, requestedScopes
          )
          .then((result) => {
            reply(result);
          })
          .catch((error) => {
            reply({error: error}).code(500);
          })
        }
      }
    }
  );

  server.route({
    path: '/introspect',
    method: 'POST',
    config: {
      validate: {
        payload: Joi.object({
          token: Joi.string().required()
        }).required()
      }
    },
    handler: (request, reply) => {

      const token = request.payload.token;

      repo.get(token)
      .then((response) => {
        if (response) {
          return reply(bearerTokenService.introspect(response));
        } else {
          // see https://tools.ietf.org/html/rfc7662 page 9
          return reply({active: false});
        }
      })
      .catch((error) => {
        console.log(error);
        return reply({error: error}).code(500);
      });

    }
  });

  server.route({
    path: '/revoke',
    method: 'POST',
    config: {
      validate: {
        payload: Joi.object({
          token: Joi.string().required(),
          client_id: Joi.string()
        }).required()
      }
    },
    handler: (request, reply) => {

      const token = request.payload.token,
        clientId = request.payload.client_id,
        user = userService.getUserByClientId(clientId);

      if (!user) {
        return reply({error: 'unauthorized_client'}).code(401);
      }

      repo.revoke(token)
      .then(() => {
        //https://tools.ietf.org/html/rfc7009
        return reply().code(200);
      })
      .catch((error) => {
        console.log(error);
        return reply({error: error}).code(500);
      });

    }
  });


  next();

};

exports.register.attributes = {
  pkg: require('./module.json')
};
