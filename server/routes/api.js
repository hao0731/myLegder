const express = require('express');
const router = express.Router();
const auth = require('../auth/auth');
const getAuthUser = require('../lib/getUser');
const User = require('../models/userSchema');
const sendJSONresponse = require('../lib/response');

router.route('/users')
  .get( auth,function(req, res, next) {
    getAuthUser(req, res, function(req, res, user) {
      console.log('Auth User:'+ user +'\n');
      User.find({}, function(err, usersData) {
        sendJSONresponse(res, 200, {data: usersData});
      });
    });
  });

router.route('/ledgers')
.post( auth,function(req, res, next) {
  getAuthUser(req, res, function(req, res, user) {
    console.log(req.body);
    sendJSONresponse(res, 200, {data: req.body});
  });
});

module.exports = router;
