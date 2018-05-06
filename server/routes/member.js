const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../models/userSchema');
const sendJSONresponse = require('../lib/response');

router.post('/signup', (req, res, next) => {
  User.count({$or:[{username: req.body.username},{email:req.body.email}]}, function(err, counter) {
    if(counter != 0) {
      sendJSONresponse(res, 200 , {message: 'username or email is used.'});
    }
    else {
      let user = new User();
      user.username = req.body.username;
      user.profile.email = req.body.email;
      user.setPassword(req.body.password);
      user.save(function(error, success) {
        let token;
        if(error) {
          sendJSONresponse(res, 200 , {message: error});
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
      sendJSONresponse(res, 200 , {message: err});
      return ;
    }
    if(!user) {
      sendJSONresponse(res, 200 , {message: 'error'});
      return ;
    }
    req.logIn(user, (error) => {
      if(error) {
        sendJSONresponse(res, 401 , info);
        return ;
      }
      token = user.generateJwt();
      sendJSONresponse(res, 200 , { token: token });
    });
  })(req, res);
});

router.post('/logout', (req, res, next) => {
  req.logOut();
  sendJSONresponse(res, 200 , {message: 'logout'});
});

router.get('/check', (req, res, next) => {
  if(req.isAuthenticated()) {
    res.json({
      username: req.user.username
    });
  }
  else {
    res.json({
      username: 'not member'
    });
  }
});

router.post('/posttest', (req, res, next) => {
  console.log(req.body);
  res.json({
    'data': req.body
  });
});

module.exports = router;