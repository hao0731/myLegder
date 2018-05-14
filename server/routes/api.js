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
.post(auth, (req, res, next) => {
  getAuthUser(req, res, (req, res, user) => {
    let ledger = new Ledger({
      name: req.body.ledgername,
      authorId: user._id,
      authority: req.body.openAuth,
      type: req.body.formType,
      members:[user._id]
    });
    ledger.save((err, success) => {
      if(err) {
        sendJSONresponse(res, 404, {message: err});
        return ;
      }
      else {
        user.ledgers.push(ledger._id);
        user.save((error, success) => {
          if(error) {
            sendJSONresponse(res, 404, {message: error});
          }
          else {
            sendJSONresponse(res, 200, {data: ledger._id});
          }
        });
      }
    });
  });
});

router.route('/ledgers/organization')
.get(auth, (req, res, next) => {
  getAuthUser(req, res, (req, res, user) => {
    User.findLedgers({_id:user._id},(err, userData)=> {
      let ledgers = userData[0].ledgers;
      ledgers = ledgers.filter(elem => {
        return elem.type === 'organization'
      });
      sendJSONresponse(res, 200, {data: ledgers});
    }); 
  });
})

router.route('/ledgers/personal')
.get(auth, (req, res, next) => {
  getAuthUser(req, res, (req, res, user) => {
    User.findLedgers({_id:user._id},(err, userData)=> {
      let ledgers = userData[0].ledgers;
      ledgers = ledgers.filter(elem => {
        return elem.type === 'personal'
      });
      sendJSONresponse(res, 200, {data: ledgers});
    }); 
  });
})

module.exports = router;
