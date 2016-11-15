const crypto = require('crypto-js'),
  uuid = require('node-uuid'),
  config = require('../../common/config.json'),
  date = require('../../common/date.service');

const header = {
  "alg": "HS256",
  "typ": "JWT"
};

module.exports.getPayload = (jwt) => {

  const parts = jwt.split('.');
  const payload = parts[1];

  var payloadWords = crypto.enc.Base64.parse(payload);
  return JSON.parse(crypto.enc.Utf8.stringify(payloadWords));

};

module.exports.generateForUser = (user, scopes) => {

  var now = new Date();
  var nowEpoch = date.toEpoch(now);
  var expireEpoch = date.toEpoch(date.addMinutes(now, config.token.bearer.lifespanInMinutes));

  const data = {
    iss: config.token.issuer,
    sub: user.name,
    nbf: nowEpoch,
    iat: nowEpoch,
    exp: expireEpoch,
    aud: [config.token.audience],
    jti: uuid.v1().toString(),
    scopes: scopes
  };

  const jwtHeader = base64urlEncode(toUtf8(header));
  const jwtPayload = base64urlEncode(toUtf8(data));
  const jwtSignature = base64urlEncode(
    crypto.HmacSHA256(
      jwtHeader + '.' + jwtPayload,
      config.token.bearer.symmetricKey)
  );

  return jwtHeader + "." + jwtPayload + "." + jwtSignature;

};

const toUtf8 = (input) => {
  return crypto.enc.Utf8.parse(JSON.stringify(input))
};

const base64urlEncode = (input) => {

  // Encode in classical base64
  var result = crypto.enc.Base64.stringify(input);

  // Remove padding equal characters
  result = result.replace(/=+$/, '');

  // Replace characters according to base64url specifications
  result = result.replace(/\+/g, '-');
  result = result.replace(/\//g, '_');

  return result;
};
