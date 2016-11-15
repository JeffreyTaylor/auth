const fs = require('fs'),
  path = require('path');

module.exports = {
  ssl: {
    key: fs.readFileSync(path.join(__dirname, 'ssl/rakida-auth.key')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl/rakida-auth.crt'))
  }
};
