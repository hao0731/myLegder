const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../models/userSchema');
const sendJSONresponse = require('../lib/response');
const auth = require('../auth/auth');
const getAuthUser = require('../lib/getUser');
const regExp = require('../lib/regExpAuth');

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
    let optionKeys = Object.keys(req.body.editOptions);
    let inputKeys = Object.keys(req.body);
    inputKeys.pop();
    inputKeys = inputKeys.filter(elem => {
      return req.body[elem] !== '' && regExp[elem].test(req.body[elem]) === true
    });
    let updateKeys = optionKeys.filter(elem => {
      return req.body.editOptions[elem] === true
    });
    if(inputKeys.sort().toString() !== updateKeys.sort().toString() || inputKeys.length == 0) {
      sendJSONresponse(res, 401, {message: 'Oops! Please check your username, email or password is valid.'});
    }
    else {
      for(let i = 0;i < updateKeys.length;i++) {
        if(updateKeys[i] === 'email') {
          user['profile']['email'] = req.body['email'];
        }
        else if(updateKeys[i] === 'password') {
          user.setPassword(req.body['password']);
        }
        else {
          user[updateKeys[i]] = req.body[updateKeys[i]];
        }
      }
      user.save((error, success) => {
        let token;
        if(error) {
          sendJSONresponse(res, 404, {message: error});
          return ;
        }
        else {
          token = user.generateJwt();
          sendJSONresponse(res, 200, {token: token});
        }
      });
    }  
  });
});

router.post('/logout', (req, res, next) => {
  req.logOut();
  sendJSONresponse(res, 200 , {message: 'logout'});
});

module.exports = router;
