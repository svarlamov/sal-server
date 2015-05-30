var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// We use the Mongo _id as the token
var sessionSchema = new Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  expires_at: Date,
  created_at: Date,
  updated_at: Date
});

sessionSchema.pre('save', function(next) {
  var currentDate = new Date();
  
  this.updated_at = currentDate;

  if (!this.created_at) {
    var daysThatSessionWillLast = 3;
    var expirationDate = new Date();
    expirationDate.setDate(currentDate.getDate + daysThatSessionWillLast);
    this.expires_at = expirationDate;
    this.created_at = currentDate;
  }

  next();
});

sessionSchema.methods.isValid = function checkValidity(){
    if(this.expires_at < new Date()){
        return false;
    } else {
        return true;
    }
};

var Session = mongoose.model('Session', sessionSchema);

module.exports = Session;