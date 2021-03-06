const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
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
.get(auth, (req, res, next) => {
  getAuthUser(req, res, (req, res, user) => {
    Ledger.find({name: {$regex: '.*' + req.query.ledgerName + '.*'}, authority: 'open'}).populate({path: 'authhor', select: 'username'}).exec((err, ledgerData) => {
      if(err || !ledgerData.length) {
        sendJSONresponse(res, 404, {message: '查無相符項目'});
      }
      else {
        sendJSONresponse(res, 200, {data: ledgerData});
      }
    });
  });
})
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
.delete(auth, (req, res, next) => {
  getAuthUser(req, res, (req, res, user) => {
    Ledger.findOne({_id: req.params.id})
    .populate({path: 'author', select:'_id'})
    .exec((err, ledgerData) => {
      if(err || !ledgerData) {
        sendJSONresponse(res, 404, {message: 'not found'});
      }
      else if(ledgerData.author._id.toString() === user._id.toString()) {
        User.update({_id: {$in: ledgerData.members}}, {$pull: {ledgers: {_id: ledgerData._id}}}, {multi: true},(error, docs) => {
          console.log(docs);
          LedgerDetail.remove({ledger: ledgerData._id}, (err, docs) => {
            if(err) {
              sendJSONresponse(res, 404, {message: err});
            } 
            else {
              Ledger.remove({_id: ledgerData._id}, (err, docs) => {
                if(err) {
                  sendJSONresponse(res, 404, {message: err});
                }
                else {
                  sendJSONresponse(res, 200, {data: 'ok'});
                }
              });
            }
          });
        });
      }
      else {
        User.update({_id: user._id}, {$pull: {ledgers: {_id: ledgerData._id}}},(error, docs) => {
          if(error) {
            sendJSONresponse(res, 404, {message: error});
          }
          else {
            ledgerData.admins = ledgerData.admins.filter(elem => {return elem !== user._id});
            ledgerData.members = ledgerData.members.filter(elem => {return elem !== user._id});
            ledgerData.save((err, success) => {
              if(err) {
                sendJSONresponse(res, 404, {message: err});
              }
              else {
                sendJSONresponse(res, 200, {data: 'ok'});
              }
            });
          }
        });
      }
    });
  });
});

router.route('/ledgers/details/:id')
.get(auth, (req, res, next) => {
  getAuthUser(req, res, (req, res, user) => {
    LedgerDetail.find({ledger: req.params.id})
    .populate({path: 'recorder', select: 'username'})
    .populate({path: 'ledger', select: 'members'})
    .exec((err, detailData) => {
      if(err) {
        sendJSONresponse(res, 404, {message: 'not found'});
      }
      else if(!detailData.length) {
        sendJSONresponse(res, 200, {data: detailData});
      }
      else if(!detailData[0].ledger.authority === 'close' && !detailData[0].ledger.members.filter(elem => {return elem._id === user._id}).length) {
        sendJSONresponse(res, 403, {message: 'not Authorized'});
      }
      else {
        sendJSONresponse(res, 200, {data: detailData});
      }
    });
  });
})
.post(auth, (req, res, next) => {
  getAuthUser(req, res, (req, res, user) => {
    Ledger.findOne({_id: req.params.id}).populate({path: 'admins', match:{username: user.username}}).exec((error, ledgerData) => {
      if(!ledgerData || error) {
        sendJSONresponse(res, 404, {message: error});
      }
      else if(!ledgerData.admins.length) {
        sendJSONresponse(res, 403, {message: 'not Authorized'});
      }
      else {
        let detail = new LedgerDetail({
          name: req.body.accountName,
          class: req.body.accountClass,
          price: req.body.accountPrice,
          timeStamp: req.body.accountDate,
          recorder: user._id,
          ledger: req.params.id
        });
        detail.save((err, success) => {
          if(err) {
            sendJSONresponse(res, 404, {message: err});
          }
          else {
            sendJSONresponse(res, 200, {data: detail});
          }
        });
      }
    });
  });
})

router.route('/ledgers/:ledgerId/members/:memberId')
.post(auth, (req, res, next) => {
  getAuthUser(req, res, (req, res, user) => {
    Ledger.findOne({_id: req.params.ledgerId}).exec((error, ledgerData) => {
      if(!ledgerData || error) {
        sendJSONresponse(res, 404, {message: 'Oops! something is wrong.'});
      }
      else if(!ledgerData.admins.filter(elem => {return elem.toString() === user._id.toString()}).length) {
        sendJSONresponse(res, 403, {message: 'no Authorized.'});
      }
      else {
        User.findOne({username: req.params.memberId}).populate({path: 'ledgers', match:{_id: req.params.ledgerId}}).exec((err, userData) => {
          if(!userData) {
            sendJSONresponse(res, 404, {message: 'User is not found, please check the username correct!'});
          }
          else if(userData.ledgers.length) {
            sendJSONresponse(res, 404, {message: 'This user is member.'});
          }
          else {
            userData.ledgers.push(ledgerData._id);
            ledgerData.members.push(userData._id);
            ledgerData.save((error, success) => {
              userData.save((error, success) => {
                sendJSONresponse(res, 200, {data: { _id: userData._id, username: userData.username }});
              });
            });
          }
        });
      }
    });
  });
})
.put(auth, (req, res, next) => {
  getAuthUser(req, res, (req, res, user) => {
    Ledger.findOne({_id: req.params.ledgerId}).exec((error, ledgerData) => {
      if(!ledgerData || error) {
        sendJSONresponse(res, 404, {message: 'Oops! something is wrong.'});
      }
      else if(!ledgerData.admins.filter(elem => {return elem.toString() === user._id.toString()}).length || req.params.memberId === ledgerData.author.toString()) {
        sendJSONresponse(res, 403, {message: 'no Authorized.'});
      }
      else {
        User.findOne({_id: req.params.memberId}).populate({path: 'ledgers', match:{_id: req.params.ledgerId}}).exec((err, userData) => {
          if(!userData || err) {
            sendJSONresponse(res, 404, {message: 'User is not found, please check the username correct!'});
          }
          else if(!userData.ledgers.length) {
            sendJSONresponse(res, 404, {message: 'Oops!something is wrong.'});
          }
          else {
            switch(req.body.condition) {
              case 'levelUp':
                ledgerData.admins.push(userData._id);
                ledgerData.save((error, success) => {
                  sendJSONresponse(res, 200, {data: { _id: userData._id, username: userData.username }});
                });
                break;
              case 'levelDown':
                ledgerData.admins = ledgerData.admins.filter(elem => {return elem.toString() !== userData._id.toString()});
                ledgerData.save((error, success) => {
                  sendJSONresponse(res, 200, {data: { _id: userData._id, username: userData.username }});
                });
                break;
              case 'removeMember':
                ledgerData.admins = ledgerData.admins.filter(elem => {return elem.toString() !== userData._id.toString()});
                ledgerData.members = ledgerData.members.filter(elem => {return elem.toString() !== userData._id.toString()});
                userData.ledgers = userData.ledgers.filter(elem => {return elem._id.toString() !== ledgerData._id.toString()});
                ledgerData.save((error, success) => {
                  userData.save((error, success) => {
                    sendJSONresponse(res, 200, {data: { _id: userData._id, username: userData.username }});
                  });
                });
                break;
              default:
                sendJSONresponse(res, 404, {message: 'Oops!something is wrong.'});
            }
          }
        });
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
