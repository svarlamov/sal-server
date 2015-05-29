var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = new Schema({
  number: Integer,
  file: String
});

questionSchema.pre('save', function(next) {
  var currentDate = new Date();
  
  this.updated_at = currentDate;

  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

var Question = mongoose.model('Question', questionSchema);

module.exports = Question;