const express = require('express');
const router = express.Router();
const auth = require('../auth/auth');
const getAuthUser = require('../lib/getUser');
const User = require('../models/userSchema');
const Ledger = require('../models/ledgerSchema');
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
    let ledger = new Ledger({
      name: req.body.ledgername,
      authorId: user._id,
      authority: req.body.openAuth,
      type: req.body.formType
    });
    ledger.save((err, success) => {
      if(err) {
        sendJSONresponse(res, 404, {message: error});
        return ;
      }
      else {
        sendJSONresponse(res, 200, {data: ledger._id});
      }
    });
  });
});

module.exports = router;
