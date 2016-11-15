const scopeService = require('../scope/service'),
  jwt = require('../jwt/service'),
  refresh = require('../refresh/service'),
  config = require('../../common/config.json'),
  date = require('../../common/date.service'),
  repo = require('../repository');

module.exports.generate = (clientId, user, grant, scopes) => {

  const allowedScopes = scopeService.getValidScopesForUser(user, scopes);

  return {
    "access_token": jwt.generateForUser(user, allowedScopes),
    "token_type": "Bearer",
    "refresh_token": refresh.generate(),
    "expires_in": config.token.bearer.lifespanInMinutes,
    "scope": allowedScopes
  }
};

module.exports.generateAndSaveToken = (clientId, user, requestedGrant, requestedScopes) => {
  const result = module.exports.generate(clientId, user, requestedGrant, requestedScopes);
  return repo.insert(result, clientId)
  .then(() => {
    return result;
  });
};


module.exports.isActive = (token, payload) => {
  const now = date.toEpoch(new Date());
  return !(token.isRevoked || now > payload.exp);
};

module.exports.introspect = (token) => {

  const payload = jwt.getPayload(token.access_token);
  return {
    active: module.exports.isActive(token, payload),
    scope: payload.scopes.join(' '),
    client_id: token.client_id,
    username: payload.sub,
    token_type: token.token_type,
    exp: payload.exp,
    iat: payload.iat,
    nbf: payload.nbf,
    sub: payload.sub,
    aud: payload.aud,
    iss: payload.iss,
    jti: payload.jti
  }
};

