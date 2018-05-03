const sendJSONresponse = require('./response');
const User = require('../models/userSchema');

module.exports = function(req, res, callback) {
  if(req.payload && req.payload.username) {
    User.findOne({username: req.payload.username}, function(err, userData) {
      if(!userData) {
        sendJSONresponse(res, 404, { message: 'User not found' });
      }
      else if(err) {
        sendJSONresponse(res, 404, {message: err});
      }
      callback(req, res, userData);
    });
  }
  else {
    sendJSONresponse(res, 404, { message: 'User not found' });
    return ;
  }
}
