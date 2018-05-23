const express = require('express');
const router = express.Router();
const auth = require('../auth/auth');
const getAuthUser = require('../lib/getUser');
const User = require('../models/userSchema');
const Ledger = require('../models/ledgerSchema');
const LedgerDetail = require('../models/ledgerDetailSchema');
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
      author: user._id,
      authority: req.body.openAuth,
      type: req.body.formType,
      members:[user._id],
      admins:[user._id]
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

router.route('/ledgers/:id')
.get(auth, (req, res, next) => {
  getAuthUser(req, res, (req, res, user) => {
    Ledger.findOne({_id: req.params.id})
    .populate({path:'author', select: 'username'})
    .populate({path: 'admins', select: 'username'})
    .populate({path: 'members', select: 'username'})
    .exec((err, ledgerData)=> {
      if(!ledgerData || err) {
        sendJSONresponse(res, 404, {message: 'not found'});
      }
      else if(ledgerData.type === 'personal' && ledgerData.author._id.toString() !== user._id.toString()) {
        sendJSONresponse(res, 403, {message: 'This request is not authorized.'});
      }
      else if(ledgerData.type === 'organization' && ledgerData.authority === 'close' && !ledgerData.members.filter(elem => {return elem._id.toString() === user._id.toString()}).length) {
        sendJSONresponse(res, 403, {message: 'This request is not authorized.'});
      }
      else {
        sendJSONresponse(res, 200, {data: ledgerData});
      }      
    });
  });
})

router.route('/ledgers/details/:id')
.get(auth, (req, res, next) => {
  getAuthUser(req, res, (req, res, user) => {
    LedgerDetail.find({}).exec((err, detailData) => {
      if(err) {
        sendJSONresponse(res, 404, {message: 'not found'});
      }
      else {
        sendJSONresponse(res, 200, {data: detailData});
      }
    });
  });
})
.post(auth, (req, res, next) => {
  getAuthUser(req, res, (req, res, user) => {
    let detail = new LedgerDetail({
      name: req.body.accountName,
      class: req.body.accountClass,
      price: req.body.accountPrice,
      timeStamp: req.body.accountDate,
      recorder: user._id,
      ledger: req.body.ledgerId
    });
    detail.save((err, success) => {
      if(err) {
        sendJSONresponse(res, 404, {message: err});
      }
      else {
        sendJSONresponse(res, 200, {data: 'ok'});
      }
    });
    
  });
})

router.route('/organization')
.get(auth, (req, res, next) => {
  getAuthUser(req, res, (req, res, user) => {
    User.findLedgers({_id:user._id}, {path: 'ledgers', match:{type: 'organization'}, populate: { path: 'author', select: 'username'}}, (err, userData)=> {
      let ledgers = userData.ledgers;
      sendJSONresponse(res, 200, {data: ledgers});
    }); 
  });
})

router.route('/personal')
.get(auth, (req, res, next) => {
  getAuthUser(req, res, (req, res, user) => {
    User.findLedgers({_id:user._id}, {path: 'ledgers', match:{type: 'personal'}, populate: { path: 'author', select: 'username'}}, (err, userData)=> {
      let ledgers = userData.ledgers;
      sendJSONresponse(res, 200, {data: ledgers});
    }); 
  });
})

module.exports = router;
