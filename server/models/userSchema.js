const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const userSchema = mongoose.Schema({
  username: String,
  hash: String,
  salt: String,
  profile: {
    email: String
  },
  ledgers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ledgerData'
  }]
});

userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha256').toString('hex');
};

userSchema.methods.validPassword = function(password) {
     let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha256').toString('hex');
     return  this.hash === hash;
};

userSchema.methods.generateJwt = function() {
  let expiry = new Date();
  expiry.setDate(expiry.getDate() + 7 );
  return jwt.sign({
    _id: this._id,
    email: this.profile.email,
    username: this.username,
    exp:parseInt(expiry.getTime() /1000)}, ' ReadingClubSecret ');
};

userSchema.statics = {
  findLedgers:function(query, condition, callback) {
    return this.findOne(query).populate(condition).exec(callback);
  }
} 

module.exports = mongoose.model('userData', userSchema);
