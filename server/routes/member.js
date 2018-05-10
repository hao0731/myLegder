const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../models/userSchema');
const sendJSONresponse = require('../lib/response');
const auth = require('../auth/auth');
const getAuthUser = require('../lib/getUser');

router.post('/signup', (req, res, next) => {
  User.count({$or:[{username: req.body.username},{email:req.body.email}]}, function(err, counter) {
    if(counter != 0) {
      sendJSONresponse(res, 401 , {message: 'username or email is used.'});
    }
    else {
      let user = new User();
      user.username = req.body.username;
      user.profile.email = req.body.email;
      user.setPassword(req.body.password);
      user.save(function(error, success) {
        let token;
        if(error) {
          sendJSONresponse(res, 404 , {message: error});
        }
        else {
          token = user.generateJwt();
          sendJSONresponse(res, 200, { token : token });
          console.log(user+"\n\n"+token);
        }
      });
    }
  });
});

router.post('/signin', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    console.log(user);
    let token;
    if(err) {
      sendJSONresponse(res, 404 , {message: err});
      return ;
    }
    if(user) {
      token = user.generateJwt();
      sendJSONresponse(res, 200 , { token: token })
    }
    else {
      sendJSONresponse(res, 401 , {message: 'username or password is not correct!'});
      return ;
    }
  })(req, res);
});

router.post('/update', auth, (req, res, next) => {
  getAuthUser(req, res, (req, res, user) => {
    //do something
    sendJSONresponse(res, 200, {message: 'ok'});
  });
});

router.post('/logout', (req, res, next) => {
  req.logOut();
  sendJSONresponse(res, 200 , {message: 'logout'});
});

module.exports = router;
