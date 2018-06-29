var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Session = require('./session');

var userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  auth_provider: { type: String, require: true },
  created_at: Date,
  updated_at: Date
});

userSchema.pre('save', function(next) {
  var currentDate = new Date();
  
  this.updated_at = currentDate;

  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

userSchema.methods.authenticate = function authUser(email, password, callback) {
    // TODO: authenticate user based on auth method, and then create the session
    var session = new Session({ user: this });
    session.save();
    callback(null, session);
};

userSchema.methods.isLoggedIn = function checkLoggedIn(){
    // TODO: Check that the user is logged in
    return true;
}

var User = mongoose.model('User', userSchema);

module.exports = User;

