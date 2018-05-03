const jwt = require('express-jwt');
const auth = jwt({
  secret: ' ReadingClubSecret ',
  userProperty: 'payload'
});

module.exports = auth;
