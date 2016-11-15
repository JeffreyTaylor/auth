const database = require('../common/database.js'),
  Type = require('sequelize');

var Tokens = database.define('tokens', {
  id: {type: Type.INTEGER, primaryKey: true, autoIncrement: true},
  access_token: {type: Type.TEXT('MEDIUM'), allowNull: false},
  token_type: {type: Type.STRING, allowNull: false},
  refresh_token: {type: Type.STRING, allowNull: false},
  expires_in: {type: Type.INTEGER, allowNull: false},
  scope: {type: Type.STRING, allowNull: false},
  client_id: {type: Type.STRING, allowNull: false},
  isRevoked: {type: Type.BOOLEAN, allowNull: false},
  state: {type: Type.STRING, allowNull: true}
});

database.trySync();

exports.insert = (token, clientId) => Tokens
.create({
  access_token: token.access_token,
  token_type: token.token_type,
  refresh_token: token.refresh_token,
  expires_in: token.expires_in,
  scope: token.scope.join(" "),
  client_id: clientId,
  isRevoked: false
});

exports.get = (token) => Tokens
.findOne({
  where: {
    access_token: token
  }
});

exports.getByRefreshToken = (refreshToken) => Tokens
.findOne({
  where: {
    refresh_token: refreshToken
  }
});

exports.revoke = (token) => Tokens
.findOne({
  where: {
    $or: [
      {refresh_token: token},
      {access_token: token}
    ]
  }
})
.then((result) => {
  if (result) {
    return result.update({
      isRevoked: true
    });
  }
});