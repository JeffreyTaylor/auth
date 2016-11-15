const uuid = require('node-uuid'),
  repo = require('../repository'),
  bearerTokenService = require('../bearer/service'),
  userService = require('../../user/service');

module.exports.generate = () => {
  return uuid.v1();
};

module.exports.refreshWithToken = (refreshToken) => {
  var dbToken;
  var newToken;
  return repo.getByRefreshToken(refreshToken)
  .then((response) => {
    dbToken = response;
    if (!response || dbToken.isRevoked === true) {
      throw {
        error: 'invalid_request',
        error_description: 'invalid refresh token'
      };
    } else {
      return repo.revoke(response.access_token);
    }
  })
  .then(() => {
    return bearerTokenService.generate(
      dbToken.client_id,
      userService.getUserByClientId(dbToken.client_id),
      dbToken.grant_type,
      dbToken.scope.split(' ')
    )
  })
  .then((result) => {
    newToken = result;
    return repo.insert(result, dbToken.client_id);
  })
  .then(() => {
    return newToken;
  });
};
