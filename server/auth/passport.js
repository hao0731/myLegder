const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/userSchema');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    (!user)? console.log('user is false'): done(null, user);
  });
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
  passport.use(new LocalStrategy(function(username, password, done) {
    User.findOne({ username: username }, function(err, userData) {
      if(err) {
        return done(err);
      }
      if(userData == undefined || userData == null) {
        return done(null, false, { message: 'username or password is invalid.' });
      }
      if(!userData.validPassword(password)) {
        return done(null, false, { message: 'password is invalid.' });
      }
      return done(null, userData);
    });
  }));
}
